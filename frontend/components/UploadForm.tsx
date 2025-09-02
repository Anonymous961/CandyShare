import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

type Props = {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
  isUploading: boolean;
  progress: number;
  fileName?: string;
  fileSize?: string;
};

export default function UploadForm({
  onFileChange,
  onUpload,
  isUploading,
  progress,
  fileName,
  fileSize,
}: Props) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const changeEvent = {
        target: { files },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onFileChange(changeEvent);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <div className="flex flex-col justify-center max-w-md w-full space-y-4 min-h-80">
      <Label>Upload File</Label>
      <div
        onClick={() => !isUploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition",
          isUploading && "opacity-50 cursor-not-allowed",
          isDragOver
            ? "bg-gray-100 border-blue-500"
            : "border-gray-300 hover:bg-gray-50"
        )}
      >
        <Plus className="w-8 h-8 text-gray-400" />
        <span className="text-sm text-gray-500 mt-2">
          {isDragOver ? "Drop file here" : "Click or drag file to upload"}
        </span>
        {fileName && (
          <div className="mt-3 text-center text-sm text-gray-600">
            <div className="font-medium">{fileName}</div>
            <div className="text-xs text-gray-500">{fileSize}</div>
          </div>
        )}
      </div>

      <Input
        ref={inputRef}
        type="file"
        onChange={onFileChange}
        className="hidden"
      />

      {isUploading && (
        <Progress value={progress} className="w-full transition-all" />
      )}

      <Button
        variant="outline"
        className="w-full bg-gray-800 flex items-center justify-center gap-2"
        disabled={isUploading || !fileName}
        onClick={onUpload}
      >
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Uploading...
          </>
        ) : (
          "Upload File"
        )}
      </Button>
    </div>
  );
}
