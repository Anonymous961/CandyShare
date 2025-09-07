import { Router } from "express";
import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcrypt";

const router = Router();
const prisma = new PrismaClient();

// Handle OAuth sign in (Google, GitHub, etc.)
router.post("/signin", async (req, res) => {
    try {
        const {
            email,
            name,
            image,
            provider,
            providerAccountId,
            accessToken,
            refreshToken,
            expiresAt,
            tokenType,
            scope,
            idToken,
            sessionState,
        } = req.body;

        if (!email || !provider || !providerAccountId) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Check if user exists
        let user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Create new user
            user = await prisma.user.create({
                data: {
                    email,
                    name: name || null,
                    image: image || null,
                    tier: "FREE", // Default tier
                },
            });
        }

        // Check if account exists
        let account = await prisma.account.findUnique({
            where: {
                provider_providerAccountId: {
                    provider,
                    providerAccountId,
                },
            },
        });

        if (!account) {
            // Create new account
            account = await prisma.account.create({
                data: {
                    userId: user.id,
                    type: "oauth",
                    provider,
                    providerAccountId,
                    access_token: accessToken || null,
                    refresh_token: refreshToken || null,
                    expires_at: expiresAt ? Math.floor(expiresAt) : null,
                    token_type: tokenType || null,
                    scope: scope || null,
                    id_token: idToken || null,
                    session_state: sessionState || null,
                },
            });
        } else {
            // Update existing account
            account = await prisma.account.update({
                where: {
                    provider_providerAccountId: {
                        provider,
                        providerAccountId,
                    },
                },
                data: {
                    access_token: accessToken || null,
                    refresh_token: refreshToken || null,
                    expires_at: expiresAt ? Math.floor(expiresAt) : null,
                    token_type: tokenType || null,
                    scope: scope || null,
                    id_token: idToken || null,
                    session_state: sessionState || null,
                },
            });
        }

        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
                tier: user.tier,
            },
        });
    } catch (error) {
        console.error("Error in signin:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get user by ID
router.get("/user/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                image: true,
                tier: true,
            },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get authenticated user's files (NEW - more convenient endpoint)
router.get("/my-files", async (req, res) => {
    try {
        const userId = req.headers["x-user-id"] as string;
        const { page = 1, limit = 10 } = req.query;

        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const skip = (Number(page) - 1) * Number(limit);

        const files = await prisma.file.findMany({
            where: { userId },
            orderBy: { uploadedAt: "desc" },
            skip,
            take: Number(limit),
            select: {
                id: true,
                originalName: true,
                uniqueName: true, // Added for completeness, though not used in frontend snippet
                url: true, // Added for completeness
                mimetype: true, // Added for completeness
                size: true,
                uploadedAt: true,
                expiresAt: true,
                status: true,
                tier: true,
                downloadCount: true,
                lastDownloadedAt: true,
            },
        });

        const total = await prisma.file.count({
            where: { userId },
        });

        res.json({
            files,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error) {
        console.error("Error fetching user files:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update user tier - SECURED with development mode support
router.patch("/user/:id/tier", async (req, res) => {
    try {
        const { id } = req.params;
        const { tier } = req.body;
        const isDevelopment = process.env.NODE_ENV === "development";

        if (!tier || !["ANONYMOUS", "FREE", "PRO"].includes(tier)) {
            return res.status(400).json({ error: "Invalid tier" });
        }

        // SECURITY: In production, require authentication and authorization
        if (!isDevelopment) {
            const userId = req.headers["x-user-id"] as string;
            if (!userId) {
                return res.status(401).json({ error: "Authentication required" });
            }

            // Check if user exists and is authenticated
            const authenticatedUser = await prisma.user.findUnique({
                where: { id: userId },
                select: { id: true, tier: true }
            });

            if (!authenticatedUser) {
                return res.status(401).json({ error: "Invalid user" });
            }

            // Only allow users to update their own tier
            if (id !== userId) {
                return res.status(403).json({ error: "Can only update your own tier" });
            }

            // Only allow tier upgrades, not downgrades
            const tierHierarchy = { "ANONYMOUS": 0, "FREE": 1, "PRO": 2 };
            const currentTierLevel = tierHierarchy[authenticatedUser.tier as keyof typeof tierHierarchy];
            const newTierLevel = tierHierarchy[tier as keyof typeof tierHierarchy];

            if (newTierLevel < currentTierLevel) {
                return res.status(400).json({ error: "Cannot downgrade tier" });
            }

            // For Pro upgrades, require additional validation (payment, admin approval, etc.)
            if (tier === "PRO" && authenticatedUser.tier !== "PRO") {
                // TODO: Add payment verification or admin approval logic here
                console.log(`User ${userId} attempting to upgrade to Pro tier in production`);
                return res.status(402).json({ error: "Payment required for Pro upgrade" });
            }
        } else {
            // DEVELOPMENT MODE: Allow any tier updates for testing
            console.log(`[DEV] Updating user ${id} to tier ${tier}`);
        }

        const user = await prisma.user.update({
            where: { id },
            data: { tier: tier as any },
            select: {
                id: true,
                email: true,
                name: true,
                image: true,
                tier: true,
            },
        });

        res.json(user);
    } catch (error) {
        console.error("Error updating user tier:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Delete user account
router.delete("/user/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Delete user and all related data
        await prisma.user.delete({
            where: { id },
        });

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;