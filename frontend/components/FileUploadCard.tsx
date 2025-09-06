"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, File, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTierDisplayInfo } from "@/lib/api";

interface FileUploadCardProps {
  onFileSelect: (file: File) => void;
  onUpload: () => void;
  file: File | null;
  isUploading: boolean;
  progress: number;
  uploadSuccess: boolean;
  tier?: string;
}

export default function FileUploadCard({
  onFileSelect,
  onUpload,
  file,
  isUploading,
  progress,
  uploadSuccess,
  tier = "anonymous"
}: FileUploadCardProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      onFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const tierInfo = getTierDisplayInfo(tier);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload File
        </CardTitle>
        <CardDescription>
          Choose a file to share securely with your {tierInfo.name} tier
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* File Drop Zone */}
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer",
            isDragOver
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50",
            isUploading && "opacity-50 cursor-not-allowed",
            uploadSuccess && "border-green-500 bg-green-50"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />

          <div className="flex flex-col items-center gap-3">
            {uploadSuccess ? (
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            ) : isUploading ? (
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            ) : (
              <Upload className="w-12 h-12 text-gray-400" />
            )}

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-900">
                {uploadSuccess
                  ? "Upload Complete!"
                  : isUploading
                    ? "Uploading..."
                    : isDragOver
                      ? "Drop file here"
                      : "Click to upload or drag & drop"
                }
              </p>
              <p className="text-xs text-gray-500">
                {uploadSuccess
                  ? "Your file is ready to share"
                  : "Supports all file types"
                }
              </p>
            </div>
          </div>
        </div>

        {/* File Info */}
        {file && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <File className="w-5 h-5 text-gray-500" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(file.size)}
              </p>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Uploading...</span>
              <span className="text-gray-600">{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* Upload Button */}
        <Button
          onClick={onUpload}
          disabled={!file || isUploading || uploadSuccess}
          className="w-full"
          size="lg"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : uploadSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Upload Complete
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </>
          )}
        </Button>

        {/* Tier Info */}
        <div className="text-center space-y-2 pt-2 border-t">
          <div className="flex justify-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <div className={`w-2 h-2 ${tierInfo.color} rounded-full`}></div>
              {tierInfo.name}
            </span>
            <span className="flex items-center gap-1">
              <div className={`w-2 h-2 ${tierInfo.color} rounded-full`}></div>
              {tierInfo.expiry} Expiry
            </span>
            <span className="flex items-center gap-1">
              <div className={`w-2 h-2 ${tierInfo.color} rounded-full`}></div>
              Up to {tierInfo.maxSize}
            </span>
          </div>
          <p className="text-xs text-gray-400">
            {tierInfo.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
