"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, Download, RefreshCw, EyeOff, Calendar, Settings, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
}

interface UserDashboardProps {
    userTier: string;
    isAuthenticated: boolean;
}

export default function UserDashboard({ isAuthenticated }: UserDashboardProps) {
    const [files, setFiles] = useState<FileData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const hasFetched = useRef(false);

    const loadUserFiles = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            console.log("Loading user files...");
            const data = await getUserFiles(1, 5); // Load first 5 files
            console.log("User files data:", data);
            setFiles(data.files || []);
        } catch (err) {
            console.error("Error loading user files:", err);
            // For development/testing, show some mock data
            if (process.env.NODE_ENV === 'development') {
                console.log("Using mock data for development");
                setFiles([
                    {
                        id: 'mock-1',
                        originalName: 'sample-document.pdf',
                        size: 1024000,
                        uploadedAt: new Date().toISOString(),
                        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                        status: 'active',
                        tier: 'pro',
                        downloadCount: 5,
                        lastDownloadedAt: new Date().toISOString(),
                    },
                    {
                        id: 'mock-2',
                        originalName: 'presentation.pptx',
                        size: 2048000,
                        uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                        status: 'active',
                        tier: 'pro',
                        downloadCount: 12,
                        lastDownloadedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                    }
                ]);
                setError(null);
            } else {
                setError(err instanceof Error ? err.message : "Failed to load files");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated && !hasFetched.current) {
            hasFetched.current = true;
            loadUserFiles();
        } else if (!isAuthenticated) {
            hasFetched.current = false;
            setFiles([]);
        }
    }, [isAuthenticated, loadUserFiles]);

    // File management actions
    const handleUnlistFile = useCallback((fileId: string) => {
        console.log("Unlist file:", fileId);
        // TODO: Implement unlist functionality
        alert("Unlist functionality coming soon!");
    }, []);

    const handleExtendExpiry = useCallback((fileId: string) => {
        console.log("Extend expiry for file:", fileId);
        // TODO: Implement extend expiry functionality
        alert("Extend expiry functionality coming soon!");
    }, []);

    const handleSetPassword = useCallback((fileId: string) => {
        console.log("Set password for file:", fileId);
        // TODO: Implement set password functionality
        alert("Set password functionality coming soon!");
    }, []);

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
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }, []);

    const getTierColor = useCallback((tier: string) => {
        switch (tier.toLowerCase()) {
            case 'pro': return 'bg-purple-100 text-purple-800';
            case 'free': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }, []);

    const getStatusColor = useCallback((status: string) => {
        switch (status.toLowerCase()) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'expired': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }, []);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Recent Files
                        </CardTitle>
                        <CardDescription>
                            Your recently uploaded files and their status
                        </CardDescription>
                    </div>
                    <Button
                        onClick={loadUserFiles}
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
            <CardContent>
                {loading ? (
                    <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                        <p className="text-sm text-gray-500 mt-2">Loading files...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-4">
                        <p className="text-sm text-red-600">{error}</p>
                        <Button
                            onClick={loadUserFiles}
                            variant="outline"
                            size="sm"
                            className="mt-2"
                        >
                            Try Again
                        </Button>
                    </div>
                ) : files.length === 0 ? (
                    <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-2">No files uploaded yet</p>
                        <p className="text-sm text-gray-400">Upload your first file to get started</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {files.map((file) => (
                            <div key={file.id} className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                {/* Desktop Layout */}
                                <div className="hidden sm:flex items-center justify-between p-4">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <FileText className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {file.originalName}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-gray-500">
                                                    {formatFileSize(file.size)}
                                                </span>
                                                <Badge className={`text-xs ${getTierColor(file.tier)}`}>
                                                    {file.tier}
                                                </Badge>
                                                <Badge className={`text-xs ${getStatusColor(file.status)}`}>
                                                    {file.status}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Download className="h-3 w-3" />
                                                    {file.downloadCount} downloads
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    Expires {formatDate(file.expiresAt)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                            className="text-xs"
                                        >
                                            <a href={`/results/${file.id}`} target="_blank" rel="noopener noreferrer">
                                                View
                                            </a>
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleUnlistFile(file.id)}>
                                                    <EyeOff className="h-4 w-4 mr-2" />
                                                    Unlist File
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleExtendExpiry(file.id)}>
                                                    <Calendar className="h-4 w-4 mr-2" />
                                                    Extend Expiry
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleSetPassword(file.id)}>
                                                    <Settings className="h-4 w-4 mr-2" />
                                                    Set Password
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>

                                {/* Mobile Layout */}
                                <div className="sm:hidden p-4">
                                    <div className="flex items-start gap-3 mb-3">
                                        <FileText className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate mb-2">
                                                {file.originalName}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <span className="text-xs text-gray-500">
                                                    {formatFileSize(file.size)}
                                                </span>
                                                <Badge className={`text-xs ${getTierColor(file.tier)}`}>
                                                    {file.tier}
                                                </Badge>
                                                <Badge className={`text-xs ${getStatusColor(file.status)}`}>
                                                    {file.status}
                                                </Badge>
                                            </div>
                                            <div className="space-y-1 text-xs text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Download className="h-3 w-3" />
                                                    {file.downloadCount} downloads
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    Expires {formatDate(file.expiresAt)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                            className="text-xs flex-1"
                                        >
                                            <a href={`/results/${file.id}`} target="_blank" rel="noopener noreferrer">
                                                View File
                                            </a>
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleUnlistFile(file.id)}>
                                                    <EyeOff className="h-4 w-4 mr-2" />
                                                    Unlist File
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleExtendExpiry(file.id)}>
                                                    <Calendar className="h-4 w-4 mr-2" />
                                                    Extend Expiry
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleSetPassword(file.id)}>
                                                    <Settings className="h-4 w-4 mr-2" />
                                                    Set Password
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {files.length >= 5 && (
                            <div className="text-center pt-2">
                                <Button variant="outline" size="sm">
                                    View All Files
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
