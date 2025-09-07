"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UploadSuccessAlert from "@/components/UploadSuccessAlert";
import FileSizeErrorAlert from "@/components/FileSizeErrorAlert";
import FileUploadCard from "@/components/FileUploadCard";
import WelcomeCard from "@/components/WelcomeCard";
import TierInfoSection from "@/components/TierInfoSection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { uploadFile, validateFileSize, calculateExpiryTime } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

type UploadError = Error & {
  status?: number;
  error?: string;
  details?: unknown;
}

export default function Home() {
  const router = useRouter();
  // const { data: session } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [fileId, setFileId] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string>("");
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [fileSizeError, setFileSizeError] = useState<string | null>(null);
  const { userTier, isAuthenticated, isLoading } = useAuth();

  // Redirect all authenticated users to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  // Auto-close success alert after 3 seconds
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setIsSuccess(false);
    setUploadSuccess(false);
    setProgress(0);
    setFileSizeError(null);

    // Convert to appropriate unit
    const sizeInMB = selectedFile.size / (1024 * 1024);
    if (sizeInMB >= 1) {
      setFileSize(sizeInMB.toFixed(2) + " MB");
    } else {
      setFileSize((selectedFile.size / 1024).toFixed(2) + " KB");
    }
  };


  const handleUpload = async () => {
    if (!file) return;

    // Clear any previous errors
    setFileSizeError(null);

    // Client-side validation first
    // const currentTier = session?.user?.tier?.toLowerCase() || "anonymous";
    const currentTier = userTier || "anonymous";
    const validation = validateFileSize(file, currentTier);

    if (!validation.isValid) {
      setFileSizeError(validation.error || "File size validation failed");
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setIsSuccess(false);
    setUploadSuccess(false);

    try {
      // Upload file using the updated API utility (handles both presigned URL and S3 upload)
      const { key, fileId, tier } = await uploadFile(
        file,
        currentTier,
        "", // No password for anonymous/free users
        24, // Default 24 hours for anonymous/free users
        setProgress
      );

      console.log(key, tier, fileSize);

      if (!fileId) {
        setIsUploading(false);
        console.error("No file ID returned");
        return;
      }

      // Upload is complete, set success state
      setFileId(fileId);
      setIsSuccess(true);
      setUploadSuccess(true);

      // Store file data in localStorage for the results page
      const fileData = {
        id: fileId,
        originalName: file.name,
        size: file.size,
        tier: tier || "anonymous",
        hasPassword: false, // No password for anonymous/free users
        expiresAt: calculateExpiryTime(tier || "anonymous", 24), // Default 24 hours
        downloadCount: 0
      };

      try {
        localStorage.setItem(`file_${fileId}`, JSON.stringify(fileData));
        console.log("File data stored in main page:", fileData); // Debug log
      } catch (err) {
        console.error("Failed to store file data:", err);
      }

      // Redirect to results page
      router.push(`/results/${fileId}`);
    } catch (err: unknown) {
      console.error("Upload failed", err);
      setIsUploading(false);

      if (err instanceof Error) {
        const uploadErr = err as UploadError;

        // handle file size errors specifically
        if (uploadErr.error === "FILE_TOO_LARGE" || uploadErr.message?.includes("File too large")) {
          setFileSizeError(uploadErr.message || "File is too large for your current tier");
        } else {

          setFileSizeError(uploadErr.message || "Upload failed. Please try again.");
        }
      } else {
        setFileSizeError("Upload failed. Please try again.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Show loading while checking authentication and redirecting
  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isLoading ? "Loading..." : "Redirecting to dashboard..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {!fileId ? (
            // Simple Layout for Anonymous and Free Users
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Upload */}
              <div>
                <FileUploadCard
                  onFileSelect={handleFileSelect}
                  onUpload={handleUpload}
                  file={file}
                  isUploading={isUploading}
                  progress={progress}
                  uploadSuccess={uploadSuccess}
                  tier={userTier || "anonymous"}
                />
              </div>

              {/* Right Column - Welcome */}
              <div className="flex items-center">
                <WelcomeCard />
              </div>
            </div>
          ) : null}
        </div>
      </main>

      {/* Tier Information Section */}
      {!fileId && <TierInfoSection />}

      {/* Success Notification */}
      {isSuccess && (
        <UploadSuccessAlert onClose={() => setIsSuccess(false)} />
      )}

      {/* File Size Error Alert */}
      {fileSizeError && (
        <FileSizeErrorAlert
          error={fileSizeError}
          onClose={() => setFileSizeError(null)}
        />
      )}

      <Footer />
    </div>
  );
}
