"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getUserFiles } from "@/lib/api";

interface FileData {
    id: string;
    originalName: string;
    size: number;
    uploadedAt: string;
    expiresAt: string;
    status: string;
    tier: string;
    downloadCount: number;
    lastDownloadedAt: string | null;
    password?: string | null;
}

interface UserFilesData {
    files: FileData[];
    pagination: {
        page: number;
        pages: number;
        total: number;
    };
}

interface UseUserFilesReturn {
    data: UserFilesData | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    lastFetched: Date | null;
}

// Global cache for user files
let globalFilesCache: {
    data: UserFilesData | null;
    lastFetched: Date | null;
    isLoading: boolean;
    currentPage: number;
    currentLimit: number;
} = {
    data: null,
    lastFetched: null,
    isLoading: false,
    currentPage: 1,
    currentLimit: 5
};

const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes (shorter than analytics since files change more often)

export function useUserFiles(
    isAuthenticated: boolean,
    page: number = 1,
    limit: number = 5
): UseUserFilesReturn {
    const [data, setData] = useState<UserFilesData | null>(globalFilesCache.data);
    const [loading, setLoading] = useState(globalFilesCache.isLoading);
    const [error, setError] = useState<string | null>(null);
    const [lastFetched, setLastFetched] = useState<Date | null>(globalFilesCache.lastFetched);
    const hasInitialized = useRef(false);

    const fetchFiles = useCallback(async (forceRefresh = false) => {
        if (!isAuthenticated) {
            setData(null);
            setError(null);
            setLastFetched(null);
            return;
        }

        // Check if we have valid cached data for the same page and limit
        const now = new Date();
        const isCacheValid = globalFilesCache.data &&
            globalFilesCache.lastFetched &&
            globalFilesCache.currentPage === page &&
            globalFilesCache.currentLimit === limit &&
            (now.getTime() - globalFilesCache.lastFetched.getTime()) < CACHE_DURATION;

        if (isCacheValid && !forceRefresh) {
            setData(globalFilesCache.data);
            setLastFetched(globalFilesCache.lastFetched);
            setLoading(false);
            setError(null);
            return;
        }

        // Prevent duplicate calls
        if (globalFilesCache.isLoading) {
            setLoading(true);
            return;
        }

        globalFilesCache.isLoading = true;
        setLoading(true);
        setError(null);

        try {
            const filesData = await getUserFiles(page, limit);

            // Update global cache
            globalFilesCache.data = filesData;
            globalFilesCache.lastFetched = now;
            globalFilesCache.isLoading = false;
            globalFilesCache.currentPage = page;
            globalFilesCache.currentLimit = limit;

            setData(filesData);
            setLastFetched(now);
        } catch (err) {
            console.error("Error fetching user files:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch files");
        } finally {
            globalFilesCache.isLoading = false;
            setLoading(false);
        }
    }, [isAuthenticated, page, limit]);

    const refetch = useCallback(() => {
        return fetchFiles(true);
    }, [fetchFiles]);

    useEffect(() => {
        if (isAuthenticated && !hasInitialized.current) {
            hasInitialized.current = true;
            fetchFiles();
        } else if (!isAuthenticated) {
            hasInitialized.current = false;
            setData(null);
            setError(null);
            setLastFetched(null);
        }
    }, [isAuthenticated, fetchFiles]);

    return {
        data,
        loading,
        error,
        refetch,
        lastFetched
    };
}
