"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import UploadSuccessAlert from "@/components/UploadSuccessAlert";
import FileUploadCard from "@/components/FileUploadCard";
import WelcomeCard from "@/components/WelcomeCard";
import TierInfoSection from "@/components/TierInfoSection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { uploadFile } from "@/lib/api";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [fileId, setFileId] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string>("");
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

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
    setFileSize((selectedFile.size / 1024).toFixed(2) + " KB");
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setProgress(0);
    setIsSuccess(false);
    setUploadSuccess(false);

    try {
      // 1. Request presigned URL from backend using the new API utility
      const { url, key, fileId, tier } = await uploadFile(
        file,
        session?.user?.tier?.toLowerCase() || "anonymous",
        ""
      );

      console.log(key, tier, fileSize);

      if (!url) {
        setIsUploading(false);
        console.error("No presigned URL returned");
        return;
      }

      // 2. Upload file to presigned URL
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setProgress(percent);
          }
        };
        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            setFileId(fileId);
            setIsSuccess(true);
            setUploadSuccess(true);

            // Store file data in localStorage for the results page
            const fileData = {
              id: fileId,
              originalName: file.name,
              size: file.size,
              tier: tier || "anonymous",
              hasPassword: false,
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              downloadCount: 0
            };

            try {
              localStorage.setItem(`file_${fileId}`, JSON.stringify(fileData));
              console.log("File data stored:", fileData); // Debug log
            } catch (err) {
              console.error("Failed to store file data:", err);
            }

            // Redirect to results page after a short delay
            // setTimeout(() => {
            router.push(`/results/${fileId}`);
            // }, 2000);

            resolve();
          } else {
            console.error("Upload failed with status:", xhr.status);
            reject(new Error("Upload failed"));
          }
        };
        xhr.onerror = () => {
          console.error("Upload failed");
          reject(new Error("Upload failed"));
        };
        xhr.open("PUT", url);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
    } catch (err) {
      console.error("Upload failed", err);
      setIsUploading(false);
    } finally {
      setIsUploading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {!fileId ? (
            // Upload Flow
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Upload */}
              <div className="space-y-6">
                <FileUploadCard
                  onFileSelect={handleFileSelect}
                  onUpload={handleUpload}
                  file={file}
                  isUploading={isUploading}
                  progress={progress}
                  uploadSuccess={uploadSuccess}
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
      <Footer />
    </div>
  );
}
