"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, Download, RefreshCw, EyeOff, Calendar, Settings, MoreVertical, Lock, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { unlistFile, extendFileExpiry, setFilePassword, removeFilePassword } from "@/lib/api";
import { ExtendExpiryModal, SetPasswordModal } from "./FileManagementModals";
import { useUserFiles } from "@/hooks/useUserFiles";

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

interface UserDashboardProps {
    userTier: string;
    isAuthenticated: boolean;
}

export default function UserDashboard({ isAuthenticated }: UserDashboardProps) {
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [showAllFiles, setShowAllFiles] = useState(false);
    const filesPerPage = 5;

    // Use the custom hook for data fetching
    const { data: filesData, loading, error, refetch } = useUserFiles(
        isAuthenticated,
        currentPage,
        showAllFiles ? 10 : filesPerPage
    );

    // Extract data from the hook
    const files = useMemo(() => filesData?.files || [], [filesData?.files]);
    const totalPages = filesData?.pagination?.pages || 1;
    const totalFiles = filesData?.pagination?.total || 0;

    // Modal states
    const [extendExpiryModal, setExtendExpiryModal] = useState<{ isOpen: boolean; file: FileData | null }>({
        isOpen: false,
        file: null
    });
    const [setPasswordModal, setSetPasswordModal] = useState<{ isOpen: boolean; file: FileData | null }>({
        isOpen: false,
        file: null
    });

    // Update local state when files change (for file management operations)
    const [localFiles, setLocalFiles] = useState<FileData[]>([]);

    useEffect(() => {
        setLocalFiles(files);
    }, [files]);

    // File management actions
    const handleUnlistFile = useCallback(async (fileId: string) => {
        if (!confirm("Are you sure you want to unlist this file? It will no longer be accessible via its share link.")) {
            return;
        }

        try {
            await unlistFile(fileId);
            // Remove file from local state
            setLocalFiles(prev => prev.filter(file => file.id !== fileId));
            alert("File unlisted successfully!");
        } catch (error) {
            console.error("Error unlisting file:", error);
            alert("Failed to unlist file. Please try again.");
        }
    }, []);

    const handleExtendExpiry = useCallback((file: FileData) => {
        setExtendExpiryModal({ isOpen: true, file });
    }, []);

    const handleSetPassword = useCallback((file: FileData) => {
        setSetPasswordModal({ isOpen: true, file });
    }, []);

    const handleExtendExpiryConfirm = useCallback(async (hours: number) => {
        if (!extendExpiryModal.file) return;

        try {
            await extendFileExpiry(extendExpiryModal.file.id, hours);
            // Update file in local state
            setLocalFiles(prev => prev.map(file =>
                file.id === extendExpiryModal.file!.id
                    ? {
                        ...file,
                        expiresAt: new Date(new Date(file.expiresAt).getTime() + hours * 60 * 60 * 1000).toISOString()
                    }
                    : file
            ));
            alert("File expiry extended successfully!");
        } catch (error) {
            console.error("Error extending file expiry:", error);
            alert("Failed to extend file expiry. Please try again.");
        }
    }, [extendExpiryModal.file]);

    const handleSetPasswordConfirm = useCallback(async (password: string) => {
        if (!setPasswordModal.file) return;

        try {
            if (password) {
                await setFilePassword(setPasswordModal.file.id, password);
                alert("Password set successfully!");
            } else {
                await removeFilePassword(setPasswordModal.file.id);
                alert("Password removed successfully!");
            }
            // Update file in local state
            setLocalFiles(prev => prev.map(file =>
                file.id === setPasswordModal.file!.id
                    ? { ...file, password: password || null }
                    : file
            ));
        } catch (error) {
            console.error("Error setting file password:", error);
            alert("Failed to set password. Please try again.");
        }
    }, [setPasswordModal.file]);

    // Pagination handlers
    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handleViewAllFiles = useCallback(() => {
        setShowAllFiles(true);
        setCurrentPage(1);
    }, []);

    const handleBackToRecent = useCallback(() => {
        setShowAllFiles(false);
        setCurrentPage(1);
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
                            {showAllFiles ? 'All Files' : 'Recent Files'}
                        </CardTitle>
                        <CardDescription>
                            {showAllFiles
                                ? `All your uploaded files (${totalFiles} total)`
                                : 'Your recently uploaded files and their status'
                            }
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        {showAllFiles && (
                            <Button
                                onClick={handleBackToRecent}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Recent
                            </Button>
                        )}
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
                            onClick={refetch}
                            variant="outline"
                            size="sm"
                            className="mt-2"
                        >
                            Try Again
                        </Button>
                    </div>
                ) : localFiles.length === 0 ? (
                    <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-2">No files uploaded yet</p>
                        <p className="text-sm text-gray-400">Upload your first file to get started</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {localFiles.map((file) => (
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
                                                {file.password && (
                                                    <Badge className="text-xs bg-yellow-100 text-yellow-800">
                                                        <Lock className="h-3 w-3 mr-1" />
                                                        Protected
                                                    </Badge>
                                                )}
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
                                                <DropdownMenuItem onClick={() => handleExtendExpiry(file)}>
                                                    <Calendar className="h-4 w-4 mr-2" />
                                                    Extend Expiry
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleSetPassword(file)}>
                                                    <Settings className="h-4 w-4 mr-2" />
                                                    {file.password ? "Update Password" : "Set Password"}
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
                                                {file.password && (
                                                    <Badge className="text-xs bg-yellow-100 text-yellow-800">
                                                        <Lock className="h-3 w-3 mr-1" />
                                                        Protected
                                                    </Badge>
                                                )}
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
                                                <DropdownMenuItem onClick={() => handleExtendExpiry(file)}>
                                                    <Calendar className="h-4 w-4 mr-2" />
                                                    Extend Expiry
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleSetPassword(file)}>
                                                    <Settings className="h-4 w-4 mr-2" />
                                                    {file.password ? "Update Password" : "Set Password"}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* View All Files Button - only show in recent files view */}
                        {!showAllFiles && totalFiles > filesPerPage && (
                            <div className="text-center pt-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleViewAllFiles}
                                >
                                    View All Files ({totalFiles})
                                </Button>
                            </div>
                        )}

                        {/* Pagination Controls - only show when there are multiple pages */}
                        {showAllFiles && totalPages > 1 && (
                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1 || loading}
                                        className="flex items-center gap-1"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Previous
                                    </Button>
                                    <span className="text-sm text-gray-600">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages || loading}
                                        className="flex items-center gap-1"
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="text-sm text-gray-500">
                                    Showing {files.length} of {totalFiles} files
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>

            {/* Modals */}
            <ExtendExpiryModal
                isOpen={extendExpiryModal.isOpen}
                onClose={() => setExtendExpiryModal({ isOpen: false, file: null })}
                onConfirm={handleExtendExpiryConfirm}
                fileName={extendExpiryModal.file?.originalName || ""}
                currentExpiry={extendExpiryModal.file?.expiresAt || ""}
            />

            <SetPasswordModal
                isOpen={setPasswordModal.isOpen}
                onClose={() => setSetPasswordModal({ isOpen: false, file: null })}
                onConfirm={handleSetPasswordConfirm}
                fileName={setPasswordModal.file?.originalName || ""}
                hasPassword={!!setPasswordModal.file?.password}
            />
        </Card>
    );
}
