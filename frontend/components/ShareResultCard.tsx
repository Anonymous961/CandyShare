"use client";

import { useState } from "react";
import QRCode from "react-qr-code";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy,  Share2, Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareResultCardProps {
  fileId: string;
  fileName: string;
  fileSize: string;
  tier: string;
  hasPassword: boolean;
  onCopy: (text: string) => void;
  copied: boolean;
}

export default function ShareResultCard({
  fileId,
  fileName,
  fileSize,
  tier,
  hasPassword,
  onCopy,
  copied
}: ShareResultCardProps) {
  const [showQR, setShowQR] = useState(true);
  const downloadUrl = `${window.location.origin}/download/${fileId}`;

  const handleCopy = () => {
    onCopy(downloadUrl);
  };

  const handleDownload = () => {
    window.open(downloadUrl, '_blank');
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'anonymous':
        return 'bg-gray-100 text-gray-800';
      case 'free':
        return 'bg-blue-100 text-blue-800';
      case 'pro':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          Share Your File
        </CardTitle>
        <CardDescription>
          Your file is ready to share securely
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* File Info */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{fileName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500">{fileSize}</span>
              <Badge className={cn("text-xs", getTierColor(tier))}>
                {tier.toUpperCase()}
              </Badge>
              {hasPassword && (
                <Badge variant="secondary" className="text-xs">
                  🔒 Password Protected
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* QR Code Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Share Options</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowQR(!showQR)}
          >
            {showQR ? 'Hide QR' : 'Show QR'}
          </Button>
        </div>

        {/* QR Code */}
        {showQR && (
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
              <QRCode
                size={200}
                value={downloadUrl}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              />
            </div>
            <p className="text-sm text-gray-500 text-center">
              Scan QR code to download
            </p>
          </div>
        )}

        {/* Download Link */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Download Link</Label>
          <div className="flex gap-2">
            <Input
              value={downloadUrl}
              readOnly
              className="font-mono text-sm"
            />
            <Button
              onClick={handleCopy}
              variant="outline"
              size="sm"
              className="px-3"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleDownload}
            className="flex-1"
            size="lg"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Test Download
          </Button>
          <Button
            onClick={handleCopy}
            variant="outline"
            size="lg"
            className="flex-1"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </>
            )}
          </Button>
        </div>

        {/* Share Instructions */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Share this link with anyone who needs the file</p>
          <p>• The link will expire based on your tier settings</p>
          {hasPassword && (
            <p>• Recipients will need the password to download</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
