import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Candy Share",
  description:
    "Upload a file and share it instantly via a secure link or QR code",
  metadataBase: new URL("https://candyshare.anilpro.xyz"), // change to your domain
  openGraph: {
    title: "Candy Share",
    description:
      "Upload a file and share it instantly via a secure link or QR code",
    url: "https://candyshare.anilpro.xyz", // change to your domain
    siteName: "Candy Share",
    images: [
      {
        url: "/og-image.png", // Add a nice preview image here
        width: 1200,
        height: 630,
        alt: "Candy Share preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Candy Share",
    description:
      "Upload a file and share it instantly via a secure link or QR code",
    images: ["/og-image.png"],
    creator: "@anil.eth", // optional
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
