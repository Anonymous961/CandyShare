import { Router } from "express";
import { PrismaClient } from "../generated/prisma";
import { STATUS, TIER, type File } from "../type";
import { isValidUserId } from "../utils";
import { getObjectUrl, getSignedUrlFromBucket } from "../bucket";
import { TIERS } from "../config/tiers";
import bcrypt from "bcrypt";

const router = Router();
const prisma = new PrismaClient();

router.post("/upload-file", async (req, res) => {
    const { filename, size, type, tier = "anonymous", password } = req.body; // Use string default
    const userId = req.headers["x-user-id"] as string | undefined;

    if (!filename || !size || !type) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // If user is authenticated, get their tier from database
    let userTier = tier;
    if (userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { tier: true }
        });
        userTier = user?.tier || "FREE";
    }

    // Convert tier string to Prisma enum format
    const tierMapping = {
        "anonymous": "ANONYMOUS",
        "free": "FREE",
        "pro": "PRO"
    };

    const prismaTier = tierMapping[tier as keyof typeof tierMapping] || "ANONYMOUS";

    // Convert userTier to lowercase for TIERS lookup
    const tierKey = userTier.toLowerCase() as keyof typeof TIERS;
    const tierConfig = TIERS[tierKey];

    if (size > tierConfig.maxSize) {
        return res.status(400).json({
            error: `File too large. Max size for ${tier} tier: ${tierConfig.maxSize / (1024 * 1024)}MB`
        })
    }

    if (password && !tierConfig.password) {
        return res.status(400).json({
            error: `Password protection not available for ${tier} tier`
        })
    }

    // Generate a unique S3 key
    const key = `uploads/${tier}/${Date.now()}_${filename}`;
    const url = await getSignedUrlFromBucket(key, type);

    // Set expiry based on tier
    const expiresAt = new Date(Date.now() + tierConfig.expiryHours * 60 * 60 * 1000);



    const file = await prisma.file.create({
        data: {
            originalName: filename,
            uniqueName: key,
            url: key,
            mimetype: type,
            size,
            uploadedAt: new Date(),
            expiresAt,
            status: STATUS.ACTIVE,
            userId: userId && isValidUserId(userId) ? userId : null,
            tier: prismaTier as any, // Use the converted tier
            password: password ? await bcrypt.hash(password, 10) : null,
            downloadCount: 0,
            lastDownloadedAt: null
        }
    });

    res.json({ url, key, fileId: file.id, tier });
})

router.get("/file-url/:id", async (req, res) => {
    const { id } = req.params;
    const { password } = req.query;
    const file = await prisma.file.findUnique({ where: { id } });
    if (!file) {
        return res.status(404).json({ error: "File not found" });
    }

    if (file.status !== STATUS.ACTIVE) {
        return res.status(410).json({ error: "File is no longer active" });
    }

    if (file.expiresAt < new Date()) {
        return res.status(410).json({ error: "File has expired" });
    }

    if (file.password) {
        if (!password) {
            return res.status(401).json({ error: "Password required" })
        }
        const isValid = await bcrypt.compare(password as string, file.password);
        if (!isValid) {
            return res.status(401).json({ error: "Invalid password" })
        }

    }
    await prisma.file.update({
        where: { id },
        data: {
            downloadCount: { increment: 1 },
            lastDownloadedAt: new Date()
        }
    })
    // Generate a presigned GET URL for the file
    const url = await getObjectUrl(file.uniqueName);
    res.json({ url, tier: file.tier });
});

export default router;