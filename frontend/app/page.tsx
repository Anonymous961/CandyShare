"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UploadSuccessAlert from "@/components/UploadSuccessAlert";
import FileUploadCard from "@/components/FileUploadCard";
import WelcomeCard from "@/components/WelcomeCard";
import TierInfoSection from "@/components/TierInfoSection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [fileId, setFileId] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string>("");
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

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

    // 1. Request presigned URL from backend
    let presignRes;
    try {
      presignRes = await fetch(`${BACKEND_URL}/api/file/upload-file`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: file.name,
          size: file.size,
          type: file.type,
          tier: "anonymous",
          password: ""
        }),
      });
    } catch (err) {
      setIsUploading(false);
      console.error("Failed to get presigned URL", err);
      return;
    }

    if (!presignRes.ok) {
      setIsUploading(false);
      console.error("Failed to get presigned URL", await presignRes.text());
      return;
    }

    const { url, key, fileId, tier } = await presignRes.json();
    
    if (!url) {
      setIsUploading(false);
      console.error("No presigned URL returned");
      return;
    }

    // 2. Upload file to presigned URL
    try {
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
              tier: "anonymous",
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
      console.error("Upload to presigned URL failed", err);
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
      <Footer/>
    </div>
  );
}
