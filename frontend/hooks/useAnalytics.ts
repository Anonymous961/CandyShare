"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getUserAnalytics } from "@/lib/api";

interface AnalyticsData {
    overview: {
        totalFiles: number;
        activeFiles: number;
        totalDownloads: number;
        totalStorage: number;
        recentUploads: number;
    };
    distribution: {
        byTier: Array<{ tier: string; _count: { tier: number } }>;
        byStatus: Array<{ status: string; _count: { status: number } }>;
        byFileType: Record<string, number>;
    };
    charts: {
        dailyActivity: Array<{ date: string; uploads: number; downloads: number }>;
    };
    topFiles: Array<{
        originalName: string;
        downloadCount: number;
        size: number;
        uploadedAt: string;
    }>;
}

interface UseAnalyticsReturn {
    data: AnalyticsData | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    lastFetched: Date | null;
}

// Global cache to persist data across component unmounts
let globalAnalyticsCache: {
    data: AnalyticsData | null;
    lastFetched: Date | null;
    isLoading: boolean;
} = {
    data: null,
    lastFetched: null,
    isLoading: false
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useAnalytics(isAuthenticated: boolean): UseAnalyticsReturn {
    const [data, setData] = useState<AnalyticsData | null>(globalAnalyticsCache.data);
    const [loading, setLoading] = useState(globalAnalyticsCache.isLoading);
    const [error, setError] = useState<string | null>(null);
    const [lastFetched, setLastFetched] = useState<Date | null>(globalAnalyticsCache.lastFetched);
    const hasInitialized = useRef(false);

    const fetchAnalytics = useCallback(async (forceRefresh = false) => {
        if (!isAuthenticated) {
            setData(null);
            setError(null);
            setLastFetched(null);
            return;
        }

        // Check if we have valid cached data
        const now = new Date();
        const isCacheValid = globalAnalyticsCache.data &&
            globalAnalyticsCache.lastFetched &&
            (now.getTime() - globalAnalyticsCache.lastFetched.getTime()) < CACHE_DURATION;

        if (isCacheValid && !forceRefresh) {
            setData(globalAnalyticsCache.data);
            setLastFetched(globalAnalyticsCache.lastFetched);
            setLoading(false);
            setError(null);
            return;
        }

        // Prevent duplicate calls
        if (globalAnalyticsCache.isLoading) {
            setLoading(true);
            return;
        }

        globalAnalyticsCache.isLoading = true;
        setLoading(true);
        setError(null);

        try {
            const analyticsData = await getUserAnalytics();

            // Update global cache
            globalAnalyticsCache.data = analyticsData;
            globalAnalyticsCache.lastFetched = now;
            globalAnalyticsCache.isLoading = false;

            setData(analyticsData);
            setLastFetched(now);
        } catch (err) {
            console.error("Error fetching analytics:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch analytics");
        } finally {
            globalAnalyticsCache.isLoading = false;
            setLoading(false);
        }
    }, [isAuthenticated]);

    const refetch = useCallback(() => {
        return fetchAnalytics(true);
    }, [fetchAnalytics]);

    useEffect(() => {
        if (isAuthenticated && !hasInitialized.current) {
            hasInitialized.current = true;
            fetchAnalytics();
        } else if (!isAuthenticated) {
            hasInitialized.current = false;
            setData(null);
            setError(null);
            setLastFetched(null);
        }
    }, [isAuthenticated, fetchAnalytics]);

    return {
        data,
        loading,
        error,
        refetch,
        lastFetched
    };
}
