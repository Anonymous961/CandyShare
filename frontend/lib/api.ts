import { getSession } from "next-auth/react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

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
        throw new Error(`Upload failed: ${response.statusText}`);
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
