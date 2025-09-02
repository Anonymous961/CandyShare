"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Download() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(true);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    const fetchAndDownload = async () => {
      setIsDownloading(true);
      try {
        const res = await fetch(`${BACKEND_URL}/api/file/file-url/${params.id}`);
        if (!res.ok) throw new Error("Failed to get file URL");
        const { url } = await res.json();
        if (!url) throw new Error("No URL returned");
        // Trigger download
        window.location.href = url;
        setIsDownloading(false);
      } catch (err) {
        setIsDownloading(false);
        // Optionally show error to user
        console.error(err);
      }
    };
    fetchAndDownload();
  }, [params.id]);

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
