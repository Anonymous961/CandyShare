"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Download() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(true);
  const [password, setPassword] = useState(""); // ADD: password state
  const [needsPassword, setNeedsPassword] = useState(false); // ADD: password check
  const [isPasswordChecking, setIsPasswordChecking] = useState(false); // ADD: password checking state
  const [passwordError, setPasswordError] = useState(""); // ADD: password error state
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
  
  // Initial check for password requirement
  useEffect(() => {
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
        // Trigger download
        window.location.href = downloadUrl;
        setIsDownloading(false);
      } catch (err) {
        setIsDownloading(false);
        console.error(err);
      }
    };
    checkPasswordRequirement();
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
      <div className="min-h-screen flex items-center justify-center text-white bg-gray-900 px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg text-black max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">Password Required</h2>
          <p className="text-sm text-gray-600 mb-6">This file is password protected.</p>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(""); // Clear error when user types
                }}
                className={`border p-3 rounded w-full ${
                  passwordError ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
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
              <p className="text-red-500 text-sm">{passwordError}</p>
            )}
            
            <Button
              type="submit"
              disabled={!password.trim() || isPasswordChecking}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPasswordChecking ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Checking...
                </>
              ) : (
                'Download File'
              )}
            </Button>
          </form>
          
          <p className="text-xs text-gray-500 mt-4 text-center">
            Press Enter or click the button to download
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white bg-gray-900 px-4 text-center space-y-4">
      {isDownloading ? (
        <>
          <Loader2 className="w-10 h-10 animate-spin text-gray-300 mb-4" />
          <h1 className="text-xl font-semibold">Your file is getting ready</h1>
          <p className="text-sm text-gray-400">
            Redirecting you to the download in a few seconds...
          </p>
        </>
      ) : (
        <>
          <CheckCircle className="w-10 h-10 text-green-400 mb-2" />
          <h1 className="text-xl font-semibold">Downloading...</h1>
          <p className="text-sm text-gray-400">
            Your download should begin shortly.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Thanks for using <span className="font-semibold">Candy Share</span>!
          </p>
          <Button
            onClick={() => router.push("/")}
            className="mt-2 bg-white text-black hover:bg-gray-200 transition"
          >
            Create another link
          </Button>
        </>
      )}
    </div>
  );
}
