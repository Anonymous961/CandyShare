"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FileUploadCard from "@/components/FileUploadCard";
import ExpiryTimeSelector from "@/components/ExpiryTimeSelector";
import PasswordProtection from "@/components/PasswordProtection";
import UserDashboard from "@/components/UserDashboard";
import UpgradePrompt from "@/components/UpgradePrompt";
import AnalyticsTab from "@/components/AnalyticsTab";
import { uploadFile, validateFileSize, calculateExpiryTime } from "@/lib/api";
import { useState } from "react";
import { File, Upload, FolderOpen, BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading, userTier } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
    const [fileSizeError, setFileSizeError] = useState<string | null>(null);
    const [customExpiryHours, setCustomExpiryHours] = useState<number>(720); // Default 30 days
    const [filePassword, setFilePassword] = useState<string>("");

    // Redirect non-authenticated users to home
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, isLoading, router]);

    // All authenticated users can access dashboard

    const handleFileSelect = (selectedFile: File) => {
        setFile(selectedFile);
        setFileSizeError(null);

        // Validate file size
        const validation = validateFileSize(selectedFile, userTier || "pro");
        if (!validation.isValid) {
            setFileSizeError(validation.error || "Invalid file");
            return;
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        setProgress(0);
        setFileSizeError(null);

        try {
            const result = await uploadFile(
                file,
                userTier || "pro",
                filePassword,
                customExpiryHours,
                setProgress
            );

            if (result.fileId) {
                setUploadSuccess(true);

                // Store file data for results page
                const fileData = {
                    id: result.fileId,
                    originalName: file.name,
                    size: file.size,
                    tier: result.tier || "pro",
                    hasPassword: !!filePassword,
                    expiresAt: calculateExpiryTime(result.tier || "pro", customExpiryHours),
                    downloadCount: 0
                };
                localStorage.setItem(`file_${result.fileId}`, JSON.stringify(fileData));
                console.log("File data stored in dashboard:", fileData);

                // Redirect to results page
                router.push(`/results/${result.fileId}`);
            }
        } catch (error) {
            console.error("Upload error:", error);
            setFileSizeError("Upload failed. Please try again.");
        } finally {
            setIsUploading(false);
            setProgress(0);
        }
    };

    // Show loading while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    // Don't render anything if not authenticated (will redirect)
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Header />

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Welcome Section */}
                    <div className="text-center py-8 mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Welcome to your Dashboard
                        </h1>
                        <p className="text-xl text-gray-600 mb-2">
                            Hello, {user?.name || user?.email}!
                        </p>
                        <p className="text-gray-500 mb-4">
                            {userTier?.toLowerCase() === "pro"
                                ? "Manage your files with advanced Pro features"
                                : "Upload and manage your files. Upgrade to Pro for advanced features!"
                            }
                        </p>
                    </div>

                    {/* Tabbed Dashboard */}
                    <Tabs defaultValue="upload" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-6 sm:mb-8">
                            <TabsTrigger value="upload" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                                <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Upload</span>
                                <span className="sm:hidden">Up</span>
                            </TabsTrigger>
                            <TabsTrigger value="files" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                                <FolderOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">My Files</span>
                                <span className="sm:hidden">Files</span>
                            </TabsTrigger>
                            <TabsTrigger value="analytics" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Analytics</span>
                                <span className="sm:hidden">Stats</span>
                            </TabsTrigger>
                        </TabsList>

                        {/* Upload Tab */}
                        <TabsContent value="upload" className="space-y-6">
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <Upload className="w-6 h-6 text-purple-600" />
                                    Upload New File
                                </h2>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                                    <div className="lg:col-span-1">
                                        <FileUploadCard
                                            onFileSelect={handleFileSelect}
                                            onUpload={handleUpload}
                                            file={file}
                                            isUploading={isUploading}
                                            progress={progress}
                                            uploadSuccess={uploadSuccess}
                                            tier={userTier || "pro"}
                                        />
                                        {fileSizeError && (
                                            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                                <p className="text-red-600 text-sm">{fileSizeError}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Pro Settings - Takes 1/4 width */}
                                    <div className="lg:col-span-1">
                                        <div className="rounded-lg space-y-4">
                                            {userTier?.toLowerCase() === "pro" ? (
                                                <>
                                                    <ExpiryTimeSelector
                                                        selectedHours={customExpiryHours}
                                                        onExpiryChange={setCustomExpiryHours}
                                                        tier={userTier || "pro"}
                                                        disabled={isUploading}
                                                    />
                                                    <PasswordProtection
                                                        password={filePassword}
                                                        onPasswordChange={setFilePassword}
                                                        tier={userTier || "pro"}
                                                        disabled={isUploading}
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <UpgradePrompt
                                                        feature="Custom Expiry Time"
                                                        description="Set custom file expiration times up to 30 days"
                                                    />
                                                    <UpgradePrompt
                                                        feature="Password Protection"
                                                        description="Add password protection to your files"
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* My Files Tab */}
                        <TabsContent value="files" className="space-y-6">
                            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                                    <FolderOpen className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                                    My Files
                                </h2>
                                {userTier?.toLowerCase() === "pro" ? (
                                    <UserDashboard
                                        userTier={userTier || "pro"}
                                        isAuthenticated={isAuthenticated}
                                    />
                                ) : (
                                    <div className="space-y-4">
                                        <UpgradePrompt
                                            feature="File Management"
                                            description="View, manage, and track all your uploaded files with advanced features"
                                        />
                                        <div className="text-center py-8">
                                            <p className="text-gray-500 mb-4">
                                                Upgrade to Pro to access your file management dashboard
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        {/* Analytics Tab */}
                        <TabsContent value="analytics" className="space-y-6">
                            {userTier?.toLowerCase() === "pro" ? (
                                <AnalyticsTab isAuthenticated={isAuthenticated} />
                            ) : (
                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                        <BarChart3 className="w-6 h-6 text-purple-600" />
                                        Analytics
                                    </h2>
                                    <div className="space-y-4">
                                        <UpgradePrompt
                                            feature="Advanced Analytics"
                                            description="Track downloads, bandwidth usage, and file performance with detailed insights"
                                        />
                                        <div className="text-center py-8">
                                            <p className="text-gray-500 mb-4">
                                                Upgrade to Pro to access detailed analytics and insights
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </main>

            <Footer />
        </div>
    );
}