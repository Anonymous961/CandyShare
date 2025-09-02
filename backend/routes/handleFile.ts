import { Router } from "express";
import { PrismaClient } from "../generated/prisma";
import { STATUS, type File } from "../type";
import { isValidUserId } from "../utils";
import { getObjectUrl, getSignedUrlFromBucket } from "../bucket";

const router = Router();

router.post("/upload-file", async (req, res) => {
    const { filename, size, type } = req.body;
    const userId = req.headers["x-user-id"] as string | undefined;
    if (!filename || !size || !type) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    // Generate a unique S3 key
    const key = `uploads/${userId ?? "anonymous"}/${Date.now()}_${filename}`;
    const url = await getSignedUrlFromBucket(key, type);

    // Set expiry (e.g., 24 hours from now)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create DB entry
    const prisma = new PrismaClient();

    const data: File = {
        originalName: filename,
        uniqueName: key,
        url: key, // or construct full S3 URL if you prefer
        mimetype: type,
        size,
        uploadedAt: new Date(),
        expiresAt,
        status: STATUS.ACTIVE,
        userId: userId && isValidUserId(userId) ? userId : null,
    }

    const file = await prisma.file.create({
        data
    });

    res.json({ url, key, fileId: file.id });
})

router.get("/file-url/:id", async (req, res) => {
    const { id } = req.params;
    const prisma = new PrismaClient();
    const file = await prisma.file.findUnique({ where: { id } });
    if (!file) {
        return res.status(404).json({ error: "File not found" });
    }
    // Generate a presigned GET URL for the file
    const url = await getObjectUrl(file.uniqueName);
    res.json({ url });
});

export default router;