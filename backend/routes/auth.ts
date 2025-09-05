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
                    refresh_token: refreshToken || null,
                    access_token: accessToken || null,
                    expires_at: expiresAt || null,
                    token_type: tokenType || null,
                    scope: scope || null,
                    id_token: idToken || null,
                    session_state: sessionState || null,
                },
            });
        } else {
            // Update existing account
            account = await prisma.account.update({
                where: { id: account.id },
                data: {
                    refresh_token: refreshToken || account.refresh_token,
                    access_token: accessToken || account.access_token,
                    expires_at: expiresAt || account.expires_at,
                    token_type: tokenType || account.token_type,
                    scope: scope || account.scope,
                    id_token: idToken || account.id_token,
                    session_state: sessionState || account.session_state,
                },
            });
        }

        res.json({
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            tier: user.tier,
        });
    } catch (error) {
        console.error("Error in auth signin:", error);
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
                createdAt: true,
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

// Update user tier (for admin purposes)
router.patch("/user/:id/tier", async (req, res) => {
    try {
        const { id } = req.params;
        const { tier } = req.body;

        if (!tier || !["ANONYMOUS", "FREE", "PRO"].includes(tier)) {
            return res.status(400).json({ error: "Invalid tier" });
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

// Get user's files
router.get("/user/:id/files", async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const skip = (Number(page) - 1) * Number(limit);

        const files = await prisma.file.findMany({
            where: { userId: id },
            orderBy: { uploadedAt: "desc" },
            skip,
            take: Number(limit),
            select: {
                id: true,
                originalName: true,
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
            where: { userId: id },
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

// Delete user account
router.delete("/user/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Delete user and all related data (cascade)
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
