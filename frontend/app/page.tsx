"use client";

import { useState } from "react";
import UploadSuccessAlert from "@/components/UploadSuccessAlert";
import QRSection from "@/components/QRSection";
import UploadForm from "@/components/UploadForm";
import HeroSection from "@/components/HeroSection";
import Header from "@/components/Header";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [fileId, setFileId] = useState<string | null>(null);
  const [link, setLink] = useState<string>("");
  const [fileSize, setFileSize] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setIsSuccess(false);
      setProgress(0);
      setFileSize((file.size / 1024).toFixed(2) + " KB");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setIsSuccess(false);
    setProgress(0);

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
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

    const { url, key, fileId } = await presignRes.json();
    // needed to show the file name
    console.log(key)
    if (!url) {
      setIsUploading(false);
      console.error("No presigned URL returned");
      return;
    }

    // 2. Upload file to presigned URL
    try {
      console.log("hello")
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setProgress(percent);
          }
        };
        xhr.onload = () => {
          setIsUploading(false);
          if (xhr.status === 200 || xhr.status === 204) {
            setFileId(fileId);
            setIsSuccess(true);
            setLink(
              `${process.env.NEXT_PUBLIC_FRONTEND_URL}/download/${fileId}`
            );
            resolve();
          } else {
            console.error("Upload failed with status:", xhr.status);
            reject(new Error("Upload failed"));
          }
        };
        xhr.onerror = () => {
          setIsUploading(false);
          console.error("Upload failed");
          reject(new Error("Upload failed"));
        };
        xhr.open("PUT", url);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
    } catch (err) {
      setIsUploading(false);
      console.error("Upload to presigned URL failed", err);
      return;
    }
  };

  const handleCopy = async (txt: string) => {
    await navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className=" flex justify-center flex-col w-full max-w-5xl mx-auto  pb-2 md:px-0">
      <Header/>
      <main className="mt-10 text-gray-100 flex items-center justify-center px-4 ">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl  md:p-10 flex flex-col md:flex-row gap-10 md:gap-16 items-center justify-center">

          <UploadForm
            onFileChange={handleChange}
            onUpload={handleUpload}
            isUploading={isUploading}
            progress={progress}
            fileName={file?.name}
            fileSize={fileSize}
          />
          <div className="w-full md:w-1/2">
            {fileId ? (
              <QRSection link={link} handleCopy={handleCopy} />
            ) : (
              <HeroSection />
            )}
          </div>
        </div>
      </main>

      {isSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <UploadSuccessAlert />
        </div>
      )}
      {copied && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-gray-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity">
          🔗 Link copied to clipboard!
        </div>
      )}
    </div>
  );
}
