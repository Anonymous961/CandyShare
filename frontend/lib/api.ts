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

export function calculateExpiryTime(tier: string = "anonymous", customHours?: number): string {
    const tierKey = tier.toLowerCase() as keyof typeof TIER_EXPIRY_HOURS;
    let expiryHours: number = TIER_EXPIRY_HOURS[tierKey] || TIER_EXPIRY_HOURS.anonymous;

    // For Pro users, use custom hours if provided
    if (tier.toLowerCase() === "pro" && customHours) {
        expiryHours = customHours;
    }

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

// Define the return type for uploadFile
export interface UploadFileResult {
    url: string;
    key: string;
    fileId: string;
    tier: string;
}

export async function uploadFile(
    file: File,
    tier: string = "anonymous",
    password: string = "",
    customExpiryHours?: number,
    onProgress?: (progress: number) => void
): Promise<UploadFileResult> {
    const session = await getSession();

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (session?.user?.id) {
        headers["x-user-id"] = session.user.id;
    }

    // Step 1: Get presigned URL from backend
    const response = await fetch(`${BACKEND_URL}/api/file/upload-file`, {
        method: "POST",
        headers,
        body: JSON.stringify({
            filename: file.name,
            size: file.size,
            type: file.type,
            tier,
            password,
            customExpiryHours: tier.toLowerCase() === "pro" ? customExpiryHours : undefined,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || `Upload failed: ${response.statusText}`) as Error & {
            status: number;
            error?: string;
            details?: unknown;
        };
        error.status = response.status;
        error.error = errorData.error;
        error.details = errorData.details;
        throw error;
    }

    const { url, key, fileId, tier: responseTier } = await response.json();
    console.log("Backend response:", { url, key, fileId, tier: responseTier });

    // Step 2: Upload file directly to S3 using presigned URL with progress tracking
    return new Promise<UploadFileResult>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable && onProgress) {
                const progress = Math.round((event.loaded / event.total) * 100);
                onProgress(progress);
            }
        });

        // Handle successful upload
        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log("S3 upload successful!");
                resolve({ url: key, key, fileId, tier: responseTier });
            } else {
                console.error("S3 upload failed:", xhr.status, xhr.statusText);
                reject(new Error(`S3 upload failed: ${xhr.status} ${xhr.statusText}`));
            }
        });

        // Handle upload errors
        xhr.addEventListener('error', () => {
            console.error("S3 upload error:", xhr.statusText);
            reject(new Error(`Failed to upload file to S3: ${xhr.statusText}`));
        });

        // Handle upload abort
        xhr.addEventListener('abort', () => {
            reject(new Error('Upload was aborted'));
        });

        // Start the upload
        xhr.open('PUT', url);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
    });
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

    // Use the new /my-files endpoint which is more convenient
    const response = await authenticatedFetch(`/api/auth/my-files?page=${page}&limit=${limit}`);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to get user files: ${response.statusText}`);
    }

    return response.json();
}

// File management functions for Pro users
export async function unlistFile(fileId: string) {
    const response = await authenticatedFetch(`/api/file/unlist/${fileId}`, {
        method: "PATCH",
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to unlist file: ${response.statusText}`);
    }

    return response.json();
}

export async function extendFileExpiry(fileId: string, additionalHours: number) {
    const response = await authenticatedFetch(`/api/file/extend-expiry/${fileId}`, {
        method: "PATCH",
        body: JSON.stringify({ additionalHours }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to extend file expiry: ${response.statusText}`);
    }

    return response.json();
}

export async function setFilePassword(fileId: string, password: string) {
    const response = await authenticatedFetch(`/api/file/set-password/${fileId}`, {
        method: "PATCH",
        body: JSON.stringify({ password }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to set file password: ${response.statusText}`);
    }

    return response.json();
}

export async function removeFilePassword(fileId: string) {
    const response = await authenticatedFetch(`/api/file/remove-password/${fileId}`, {
        method: "PATCH",
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to remove file password: ${response.statusText}`);
    }

    return response.json();
}

// Get user analytics
export async function getUserAnalytics() {
    const response = await authenticatedFetch(`/api/file/analytics`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch analytics: ${response.statusText}`);
    }

    return response.json();
}