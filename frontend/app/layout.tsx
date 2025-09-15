import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/contexts/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Candy Share - Instant File Sharing with Secure Links",
    template: "%s | Candy Share"
  },
  description: "Share files instantly with secure, temporary links and QR codes. Fast, private file sharing with end-to-end encryption. No registration required.",
  keywords: ["file sharing", "secure file transfer", "temporary links", "QR code share", "instant upload", "cloud storage", "secure file sharing", "temporary file hosting"],
  metadataBase: new URL("https://www.candyshare.xyz"),
  authors: [{ name: "HackPack" }],
  creator: "Candy Share",
  publisher: "Candy Share",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // Favicon and icons
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#7c3aed" },
    ],
  },

  // Open Graph
  openGraph: {
    title: "Candy Share - Instant Secure File Sharing",
    description: "Upload and share files instantly via secure temporary links or QR codes. Fast, private, and no registration required.",
    url: "https://www.candyshare.xyz",
    siteName: "Candy Share",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Candy Share - Secure instant file sharing with QR codes and temporary links",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "Candy Share - Instant Secure File Sharing",
    description: "Share files instantly with secure temporary links and QR codes. Fast, private, and completely free.",
    images: ["https://www.candyshare.xyz/og-image.png"],
    creator: "@anil.eth",
    site: "@candyshare_xyz", // Consider creating a Twitter handle
  },

  // Additional SEO enhancements
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification (add these when you set up search console)
  verification: {
    google: "your-google-search-console-verification-code", // Add when available
    yandex: "your-yandex-verification-code", // Optional
  },

  // Additional meta tags
  alternates: {
    canonical: "https://www.candyshare.xyz",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Additional favicon meta tags for better browser support */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
