"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle, Lock, Download as DownloadIcon, ArrowLeft, Shield } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Download() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(true);
  const [password, setPassword] = useState(""); // ADD: password state
  const [needsPassword, setNeedsPassword] = useState(false); // ADD: password check
  const [isPasswordChecking, setIsPasswordChecking] = useState(false); // ADD: password checking state
  const [passwordError, setPasswordError] = useState(""); // ADD: password error state
  const [countdown, setCountdown] = useState(5); // ADD: countdown timer
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
  
  // Initial check for password requirement
  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;
    
    const checkPasswordRequirement = async () => {
      setIsDownloading(true);
      try {
        const res = await fetch(`${BACKEND_URL}/api/file/file-url/${params.id}`);
        
        if(res.status === 401){
          setNeedsPassword(true);
          setIsDownloading(false);
          return;
        }

        if (!res.ok) throw new Error("Failed to get file URL");
        const { url: downloadUrl } = await res.json();
        if (!downloadUrl) throw new Error("No URL returned");
        
        // Start countdown timer
        countdownInterval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              window.location.href = downloadUrl;
              setIsDownloading(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } catch (err) {
        setIsDownloading(false);
        console.error(err);
      }
    };
    
    checkPasswordRequirement();
    
    // Cleanup function
    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, [params.id, BACKEND_URL]);

  // Handle password form submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    
    setIsPasswordChecking(true);
    setPasswordError("");
    
    try {
      const res = await fetch(`${BACKEND_URL}/api/file/file-url/${params.id}?password=${encodeURIComponent(password)}`);
      
      if (res.status === 401) {
        setPasswordError("Incorrect password. Please try again.");
        return;
      }

      if (!res.ok) throw new Error("Failed to get file URL");
      const { url: downloadUrl } = await res.json();
      if (!downloadUrl) throw new Error("No URL returned");
      
      // Trigger download
      window.location.href = downloadUrl;
    } catch (err) {
      setPasswordError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsPasswordChecking(false);
    }
  };

  if (needsPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <Lock className="w-8 h-8 text-red-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Password Required
                </CardTitle>
                <CardDescription className="text-gray-600">
                  This file is protected with a password. Please enter the password to download.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="Enter the file password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setPasswordError("");
                        }}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          passwordError 
                            ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                            : 'border-gray-300 focus:border-blue-500'
                        }`}
                        disabled={isPasswordChecking}
                        autoFocus
                      />
                      {isPasswordChecking && (
                        <div className="absolute right-3 top-3">
                          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    {passwordError && (
                      <p className="text-red-600 text-sm flex items-center gap-2">
                        <Shield />
                        {passwordError}
                      </p>
                    )}
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={!password.trim() || isPasswordChecking}
                    className="w-full h-12 text-base font-medium"
                    size="lg"
                  >
                    {isPasswordChecking ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <DownloadIcon className="w-5 h-5 mr-2" />
                        Download File
                      </>
                    )}
                  </Button>
                </form>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Shield />
                    <span>Your file is encrypted and secure</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="shadow-lg">
            <CardContent className="pt-8">
              {isDownloading ? (
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                      <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Preparing Your File
                    </h1>
                    <p className="text-gray-600">
                    We&apos;re getting your file ready for download...
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <span className="text-sm text-gray-500">Download starts in:</span>
                      <span className="text-2xl font-bold text-blue-600">{countdown}</span>
                      <span className="text-sm text-gray-500">seconds</span>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-800 text-sm">
                      <Shield />
                      <span>Verifying file security and generating secure download link</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Download Started!
                    </h1>
                    <p className="text-gray-600">
                      Your file download should begin automatically.
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-800 text-sm">
                      <DownloadIcon />
                      <span>If the download doesn&apos;t start, check your browser&apos;s download folder</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-4">
                      Thanks for using <span className="font-semibold text-gray-900">CandyShare</span>!
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button
                        onClick={() => router.push("/")}
                        className="flex items-center gap-2"
                      >
                        <DownloadIcon />
                        Share Another File
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => window.close()}
                        className="flex items-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
    </div>
  );
}
