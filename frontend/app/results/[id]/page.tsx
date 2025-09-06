"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Download,
  QrCode,
  Share2,
  CheckCircle2,
  ArrowLeft,
  Clock,
  Shield,
  FileText,
  ExternalLink
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QRCode from "qrcode";
import Image from "next/image";
import { calculateExpiryTime } from "@/lib/api";

interface FileData {
  id: string;
  originalName: string;
  size: number;
  tier: string;
  hasPassword: boolean;
  expiresAt: string;
  downloadCount: number;
}

export default function ResultsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/download/${params.id}` : "";

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const qrCodeDataURL = await QRCode.toDataURL(shareUrl, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeUrl(qrCodeDataURL);
      } catch (err) {
        console.error("Failed to generate QR code:", err);
      }
    };

    if (shareUrl) {
      generateQRCode();
    }
  }, [shareUrl]);

  useEffect(() => {
    // Simulate fetching file data (in a real app, this would come from an API)
    const fetchFileData = async () => {
      setIsLoading(true);
      setError("");

      try {
        // Wait a bit to ensure localStorage is available
        await new Promise(resolve => setTimeout(resolve, 100));

        // Try to get data from localStorage
        const storedData = localStorage.getItem(`file_${params.id}`);
        console.log("Stored data:", storedData); // Debug log

        if (storedData) {
          const data = JSON.parse(storedData);
          console.log("Parsed data:", data); // Debug log
          setFileData(data);
        } else {
          // Fallback data if not found in localStorage
          console.log("No stored data found, using fallback"); // Debug log
          setFileData({
            id: params.id,
            originalName: "Uploaded File",
            size: 1024000, // 1MB default
            tier: "anonymous",
            hasPassword: false,
            expiresAt: calculateExpiryTime("anonymous"),
            downloadCount: 0
          });
        }
      } catch (err) {
        console.error("Error loading file data:", err);
        setError("Failed to load file data");
        // Set fallback data even on error
        setFileData({
          id: params.id,
          originalName: "Uploaded File",
          size: 1024000,
          tier: "anonymous",
          hasPassword: false,
          expiresAt: calculateExpiryTime("anonymous"),
          downloadCount: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchFileData();
    }
  }, [params.id]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.download = `qrcode-${params.id}.png`;
      link.href = qrCodeUrl;
      link.click();
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatExpiry = (expiresAt: string) => {
    const expiry = new Date(expiresAt);
    const now = new Date();
    const diffHours = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60));

    if (diffHours < 1) {
      const diffMinutes = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60));
      return `${diffMinutes} minutes`;
    } else if (diffHours < 24) {
      return `${diffHours} hours`;
    } else {
      const diffDays = Math.ceil(diffHours / 24);
      return `${diffDays} days`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
              <CardContent className="pt-8">
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Loading Your File
                    </h1>
                    <p className="text-gray-600">
                      Preparing your sharing options...
                    </p>
                    <p className="text-sm text-gray-500">
                      File ID: {params.id}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
              <CardContent className="pt-8">
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                      <Shield className="w-10 h-10 text-red-600" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      File Not Found
                    </h1>
                    <p className="text-gray-600">
                      {error}
                    </p>
                  </div>
                  <Button onClick={() => router.push("/")} className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Success Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              File Uploaded Successfully!
            </h1>
            <p className="text-lg text-gray-600">
              Your file is ready to share. Use the options below to distribute it.
            </p>
          </div>

          {/* Share Link */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Share Link
              </CardTitle>
              <CardDescription>
                Copy this link to share your file with others
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm break-all">
                  {shareUrl}
                </div>
                <Button
                  onClick={() => handleCopy(shareUrl)}
                  className="px-4"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => window.open(shareUrl, '_blank')}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Test Download
                </Button>
                <Button
                  onClick={() => router.push("/")}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Upload Another
                </Button>
              </div>
            </CardContent>
          </Card>


          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* File Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  File Details
                </CardTitle>
                <CardDescription>
                  Information about your uploaded file
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">File Name:</span>
                    <span className="text-sm text-gray-900 font-mono truncate max-w-48">
                      {fileData?.originalName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Size:</span>
                    <span className="text-sm text-gray-900">{formatBytes(fileData?.size || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Tier:</span>
                    <Badge variant="secondary" className="capitalize">
                      {fileData?.tier}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Password:</span>
                    <span className="text-sm text-gray-900">
                      {fileData?.hasPassword ? "Protected" : "None"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Expires in:</span>
                    <span className="text-sm text-gray-900 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {fileData?.expiresAt ? formatExpiry(fileData.expiresAt) : "Unknown"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Downloads:</span>
                    <span className="text-sm text-gray-900">{fileData?.downloadCount || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* QR Code */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  QR Code
                </CardTitle>
                <CardDescription>
                  Scan to download the file instantly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  {qrCodeUrl ? (
                    <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
                      <Image
                        src={qrCodeUrl}
                        alt="QR Code"
                        className="w-48 h-48"
                        width={48}
                        height={48}
                      />
                    </div>
                  ) : (
                    <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleDownloadQR}
                    disabled={!qrCodeUrl}
                    variant="outline"
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download QR
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>


          {/* Copy Notification */}
          {copied && (
            <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-in slide-in-from-right-5">
              🔗 Link copied to clipboard!
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
