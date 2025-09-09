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
    const { filename, size, type, tier = "anonymous", password, customExpiryHours } = req.body; // Use string default
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
        const maxSizeMB = Math.round(tierConfig.maxSize / (1024 * 1024));
        const fileSizeMB = Math.round(size / (1024 * 1024));

        return res.status(400).json({
            error: "FILE_TOO_LARGE",
            message: `File too large. Your file is ${fileSizeMB}MB but the ${tier} tier limit is ${maxSizeMB}MB.`,
            details: {
                fileSize: size,
                maxSize: tierConfig.maxSize,
                tier: tier,
                fileSizeMB: fileSizeMB,
                maxSizeMB: maxSizeMB
            }
        })
    }

    if (password && !tierConfig.password) {
        return res.status(400).json({
            error: `Password protection not available for ${tier} tier`
        })
    }

    // Generate a unique S3 key using the actual user tier
    const key = `uploads/${userTier.toLowerCase()}/${Date.now()}_${filename}`;
    const url = await getSignedUrlFromBucket(key, type);

    // Set expiry based on tier and custom hours for Pro users
    let expiryHours = tierConfig.expiryHours;

    // For Pro users, validate and use custom expiry if provided
    if (tierKey === "pro" && customExpiryHours) {
        if (customExpiryHours < tierConfig.minExpiryHours || customExpiryHours > tierConfig.maxExpiryHours) {
            return res.status(400).json({
                error: "INVALID_EXPIRY_HOURS",
                message: `Custom expiry must be between ${tierConfig.minExpiryHours} and ${tierConfig.maxExpiryHours} hours for Pro tier.`,
                details: {
                    provided: customExpiryHours,
                    min: tierConfig.minExpiryHours,
                    max: tierConfig.maxExpiryHours
                }
            });
        }
        expiryHours = customExpiryHours;
    }

    const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000);



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

    res.json({ url, key, fileId: file.id, tier: userTier.toLowerCase() });
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

// Unlist file (set status to DELETED without actually deleting)
router.patch("/unlist/:id", async (req, res) => {
    const { id } = req.params;
    const userId = req.headers["x-user-id"] as string | undefined;

    if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
    }

    try {
        // Check if file exists and belongs to user
        const file = await prisma.file.findFirst({
            where: {
                id,
                userId: userId
            }
        });

        if (!file) {
            return res.status(404).json({ error: "File not found or access denied" });
        }

        // Update file status to DELETED
        await prisma.file.update({
            where: { id },
            data: { status: STATUS.DELETED }
        });

        res.json({ message: "File unlisted successfully" });
    } catch (error) {
        console.error("Error unlisting file:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Extend file expiry
router.patch("/extend-expiry/:id", async (req, res) => {
    const { id } = req.params;
    const { additionalHours } = req.body;
    const userId = req.headers["x-user-id"] as string | undefined;

    if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
    }

    if (!additionalHours || additionalHours <= 0) {
        return res.status(400).json({ error: "Valid additional hours required" });
    }

    try {
        // Check if file exists and belongs to user
        const file = await prisma.file.findFirst({
            where: {
                id,
                userId: userId
            }
        });

        if (!file) {
            return res.status(404).json({ error: "File not found or access denied" });
        }

        // Calculate new expiry time
        const currentExpiry = new Date(file.expiresAt);
        const newExpiry = new Date(currentExpiry.getTime() + (additionalHours * 60 * 60 * 1000));

        // Update file expiry
        await prisma.file.update({
            where: { id },
            data: { expiresAt: newExpiry }
        });

        res.json({
            message: "File expiry extended successfully",
            newExpiry: newExpiry.toISOString()
        });
    } catch (error) {
        console.error("Error extending file expiry:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Set password for file
router.patch("/set-password/:id", async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    const userId = req.headers["x-user-id"] as string | undefined;

    if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
    }

    if (!password || password.length < 4) {
        return res.status(400).json({ error: "Password must be at least 4 characters" });
    }

    try {
        // Check if file exists and belongs to user
        const file = await prisma.file.findFirst({
            where: {
                id,
                userId: userId
            }
        });

        if (!file) {
            return res.status(404).json({ error: "File not found or access denied" });
        }

        // Hash password and update file
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.file.update({
            where: { id },
            data: { password: hashedPassword }
        });

        res.json({ message: "Password set successfully" });
    } catch (error) {
        console.error("Error setting file password:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Remove password from file
router.patch("/remove-password/:id", async (req, res) => {
    const { id } = req.params;
    const userId = req.headers["x-user-id"] as string | undefined;

    if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
    }

    try {
        // Check if file exists and belongs to user
        const file = await prisma.file.findFirst({
            where: {
                id,
                userId: userId
            }
        });

        if (!file) {
            return res.status(404).json({ error: "File not found or access denied" });
        }

        // Remove password from file
        await prisma.file.update({
            where: { id },
            data: { password: null }
        });

        res.json({ message: "Password removed successfully" });
    } catch (error) {
        console.error("Error removing file password:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get user analytics
router.get("/analytics", async (req, res) => {
    const userId = req.headers["x-user-id"] as string | undefined;

    if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
    }

    try {
        // Get total files count
        const totalFiles = await prisma.file.count({
            where: { userId }
        });

        // Get active files count
        const activeFiles = await prisma.file.count({
            where: {
                userId,
                status: "ACTIVE"
            }
        });

        // Get total downloads
        const totalDownloads = await prisma.file.aggregate({
            where: { userId },
            _sum: { downloadCount: true }
        });

        // Get total storage used
        const totalStorage = await prisma.file.aggregate({
            where: { userId },
            _sum: { size: true }
        });

        // Get files by tier
        const filesByTier = await prisma.file.groupBy({
            by: ['tier'],
            where: { userId },
            _count: { tier: true }
        });

        // Get files by status
        const filesByStatus = await prisma.file.groupBy({
            by: ['status'],
            where: { userId },
            _count: { status: true }
        });

        // Get recent uploads (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentUploads = await prisma.file.count({
            where: {
                userId,
                uploadedAt: {
                    gte: thirtyDaysAgo
                }
            }
        });

        // Get files uploaded in the last 7 days for chart data
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const uploadsByDay = await prisma.file.groupBy({
            by: ['uploadedAt'],
            where: {
                userId,
                uploadedAt: {
                    gte: sevenDaysAgo
                }
            },
            _count: { uploadedAt: true }
        });

        // Get downloads by day for the last 7 days
        const downloadsByDay = await prisma.file.findMany({
            where: {
                userId,
                lastDownloadedAt: {
                    gte: sevenDaysAgo
                }
            },
            select: {
                lastDownloadedAt: true,
                downloadCount: true
            }
        });

        // Process chart data
        const chartData = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const uploads = uploadsByDay.filter(item =>
                item.uploadedAt.toISOString().split('T')[0] === dateStr
            ).length;

            const downloads = downloadsByDay
                .filter(item =>
                    item.lastDownloadedAt &&
                    item.lastDownloadedAt.toISOString().split('T')[0] === dateStr
                )
                .reduce((sum, item) => sum + item.downloadCount, 0);

            chartData.push({
                date: dateStr,
                uploads,
                downloads
            });
        }

        // Get file type distribution
        const fileTypes = await prisma.file.findMany({
            where: { userId },
            select: { originalName: true }
        });

        const fileTypeDistribution = fileTypes.reduce((acc, file) => {
            const extension = file.originalName.split('.').pop()?.toLowerCase() || 'unknown';
            acc[extension] = (acc[extension] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Get top files by downloads
        const topFiles = await prisma.file.findMany({
            where: { userId },
            orderBy: { downloadCount: 'desc' },
            take: 5,
            select: {
                originalName: true,
                downloadCount: true,
                size: true,
                uploadedAt: true
            }
        });

        res.json({
            overview: {
                totalFiles,
                activeFiles,
                totalDownloads: totalDownloads._sum.downloadCount || 0,
                totalStorage: totalStorage._sum.size || 0,
                recentUploads
            },
            distribution: {
                byTier: filesByTier,
                byStatus: filesByStatus,
                byFileType: fileTypeDistribution
            },
            charts: {
                dailyActivity: chartData
            },
            topFiles
        });
    } catch (error) {
        console.error("Error fetching analytics:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;