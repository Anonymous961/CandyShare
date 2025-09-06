import { getSession } from "next-auth/react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

// File size limits for each tier (in bytes)
export const TIER_LIMITS = {
    anonymous: 10 * 1024 * 1024, // 10MB
    free: 200 * 1024 * 1024,     // 200MB
    pro: 2 * 1024 * 1024 * 1024  // 2GB
} as const;

export function validateFileSize(file: File, tier: string = "anonymous"): { isValid: boolean; error?: string } {
    const tierKey = tier.toLowerCase() as keyof typeof TIER_LIMITS;
    const maxSize = TIER_LIMITS[tierKey] || TIER_LIMITS.anonymous;

    if (file.size > maxSize) {
        const fileSizeMB = Math.round(file.size / (1024 * 1024));
        const maxSizeMB = Math.round(maxSize / (1024 * 1024));

        return {
            isValid: false,
            error: `File too large! Your file is ${fileSizeMB}MB but the ${tier} tier limit is ${maxSizeMB}MB. Upgrade to Pro for larger files.`
        };
    }

    return { isValid: true };
}

// Tier expiry hours configuration (matching backend)
export const TIER_EXPIRY_HOURS = {
    anonymous: 24,
    free: 168, // 7 days
    pro: 720   // 30 days
} as const;

export function calculateExpiryTime(tier: string = "anonymous"): string {
    const tierKey = tier.toLowerCase() as keyof typeof TIER_EXPIRY_HOURS;
    const expiryHours = TIER_EXPIRY_HOURS[tierKey] || TIER_EXPIRY_HOURS.anonymous;
    return new Date(Date.now() + expiryHours * 60 * 60 * 1000).toISOString();
}

// Tier display information
export const TIER_DISPLAY_INFO = {
    anonymous: {
        name: "Anonymous",
        maxSize: "10MB",
        expiry: "24h",
        color: "bg-gray-400",
        description: "No registration required • Secure & private"
    },
    free: {
        name: "Free",
        maxSize: "200MB",
        expiry: "7 days",
        color: "bg-blue-400",
        description: "User account • Password protection • Better security"
    },
    pro: {
        name: "Pro",
        maxSize: "2GB",
        expiry: "30 days",
        color: "bg-purple-400",
        description: "Advanced features • Analytics • Priority support"
    }
} as const;

export function getTierDisplayInfo(tier: string = "anonymous") {
    const tierKey = tier.toLowerCase() as keyof typeof TIER_DISPLAY_INFO;
    return TIER_DISPLAY_INFO[tierKey] || TIER_DISPLAY_INFO.anonymous;
}

export async function authenticatedFetch(url: string, options: RequestInit = {}) {
    const session = await getSession();

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    };

    if (session?.user?.id) {
        headers["x-user-id"] = session.user.id;
    }

    return fetch(`${BACKEND_URL}${url}`, {
        ...options,
        headers,
    });
}

export async function uploadFile(file: File, tier: string = "anonymous", password: string = "") {
    const session = await getSession();

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (session?.user?.id) {
        headers["x-user-id"] = session.user.id;
    }

    const response = await fetch(`${BACKEND_URL}/api/file/upload-file`, {
        method: "POST",
        headers,
        body: JSON.stringify({
            filename: file.name,
            size: file.size,
            type: file.type,
            tier,
            password,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || `Upload failed: ${response.statusText}`) as Error & {
            status: number;
            error?: string;
            details?: any;
        };
        error.status = response.status;
        error.error = errorData.error;
        error.details = errorData.details;
        throw error;
    }

    return response.json();
}

export async function getFileUrl(fileId: string, password?: string) {
    const session = await getSession();

    const headers: Record<string, string> = {};
    if (session?.user?.id) {
        headers["x-user-id"] = session.user.id;
    }

    const url = new URL(`${BACKEND_URL}/api/file/file-url/${fileId}`);
    if (password) {
        url.searchParams.set("password", password);
    }

    const response = await fetch(url.toString(), {
        headers,
    });

    if (response.status === 401) {
        const error = new Error("Password required") as Error & { status: number };
        error.status = 401;
        throw error;
    }

    if (!response.ok) {
        throw new Error(`Failed to get file URL: ${response.statusText}`);
    }

    return response.json();
}

export async function getUserFiles(page: number = 1, limit: number = 10) {
    const session = await getSession();

    if (!session?.user?.id) {
        throw new Error("User not authenticated");
    }

    const response = await authenticatedFetch(`/api/auth/user/${session.user.id}/files?page=${page}&limit=${limit}`);

    if (!response.ok) {
        throw new Error(`Failed to get user files: ${response.statusText}`);
    }

    return response.json();
}
