"use client";

import { useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    BarChart3,
    Download,
    Upload,
    HardDrive,
    FileText,
    TrendingUp,
    RefreshCw,
    Calendar,
    Users,
    Shield
} from "lucide-react";
import DailyActivityChart from "./DailyActivityChart";
import FileTypeChart from "./FileTypeChart";
import { useAnalytics } from "@/hooks/useAnalytics";


interface AnalyticsTabProps {
    isAuthenticated: boolean;
}

export default function AnalyticsTab({ isAuthenticated }: AnalyticsTabProps) {
    const { data: analytics, loading, error, refetch } = useAnalytics(isAuthenticated);

    const formatFileSize = useCallback((bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }, []);

    const formatDate = useCallback((dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    }, []);

    const getTierColor = useCallback((tier: string) => {
        switch (tier.toLowerCase()) {
            case 'pro': return 'bg-purple-100 text-purple-800';
            case 'free': return 'bg-blue-100 text-blue-800';
            case 'anonymous': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }, []);

    const getStatusColor = useCallback((status: string) => {
        switch (status.toLowerCase()) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'expired': return 'bg-red-100 text-red-800';
            case 'deleted': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }, []);

    if (!isAuthenticated) {
        return null;
    }

    if (loading) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Analytics
                    </CardTitle>
                    <CardDescription>
                        Your file sharing statistics and insights
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                        <p className="text-sm text-gray-500 mt-2">Loading analytics...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Analytics
                    </CardTitle>
                    <CardDescription>
                        Your file sharing statistics and insights
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <p className="text-sm text-red-600 mb-4">{error}</p>
                        <Button onClick={refetch} variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Try Again
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!analytics) {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Analytics Dashboard
                            </CardTitle>
                            <CardDescription>
                                Your file sharing statistics and insights
                            </CardDescription>
                        </div>
                        <Button
                            onClick={refetch}
                            variant="outline"
                            size="sm"
                            disabled={loading}
                            className="flex items-center gap-2"
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    </div>
                </CardHeader>
            </Card>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <FileText className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Files</p>
                                <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalFiles}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Shield className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Active Files</p>
                                <p className="text-2xl font-bold text-gray-900">{analytics.overview.activeFiles}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Download className="h-8 w-8 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Downloads</p>
                                <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalDownloads}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <HardDrive className="h-8 w-8 text-orange-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Storage Used</p>
                                <p className="text-2xl font-bold text-gray-900">{formatFileSize(analytics.overview.totalStorage)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts and Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Activity Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Daily Activity (Last 7 Days)
                        </CardTitle>
                        <CardDescription>
                            Uploads and downloads over the past week
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DailyActivityChart data={analytics.charts.dailyActivity} />
                    </CardContent>
                </Card>

                {/* File Type Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            File Types
                        </CardTitle>
                        <CardDescription>
                            Distribution of your uploaded files by type
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FileTypeChart data={analytics.distribution.byFileType} />
                    </CardContent>
                </Card>
            </div>

            {/* Distribution Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Files by Tier */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Files by Tier
                        </CardTitle>
                        <CardDescription>
                            Distribution across different account tiers
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {analytics.distribution.byTier.map((item) => (
                                <div key={item.tier} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Badge className={`text-xs ${getTierColor(item.tier)}`}>
                                            {item.tier}
                                        </Badge>
                                        <span className="text-sm text-gray-600">{item._count.tier} files</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Files by Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Files by Status
                        </CardTitle>
                        <CardDescription>
                            Current status of your files
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {analytics.distribution.byStatus.map((item) => (
                                <div key={item.status} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </Badge>
                                        <span className="text-sm text-gray-600">{item._count.status} files</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Files */}
            {analytics.topFiles.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Most Downloaded Files
                        </CardTitle>
                        <CardDescription>
                            Your most popular files by download count
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {analytics.topFiles.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-bold text-purple-600">#{index + 1}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                                {file.originalName}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Download className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-900">
                                            {file.downloadCount}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Recent Activity
                    </CardTitle>
                    <CardDescription>
                        Your file sharing activity in the last 30 days
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <Upload className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-900 mb-2">
                            {analytics.overview.recentUploads} files uploaded
                        </p>
                        <p className="text-sm text-gray-500">
                            in the last 30 days
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
