"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn, Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react"
import { useAuth } from "@/hooks/useAuth";

// Temporary mock functions until NextAuth is properly installed
// const useSession = () => ({ data: null, status: "unauthenticated" });
// const signIn = () => console.log("Sign in clicked");
// const signOut = () => console.log("Sign out clicked");

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  // const { data: session, status } = useSession() as { data: ExtendedSession | null; status: string };
  // const session = null;
  // const status = "unauthenticated";

  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    // Close mobile menu if open
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Clickable to home */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="group relative w-10 h-10">
              <Image
                alt="CandyShare Icon"
                src="/icon.png"
                width={40}
                height={40}
                className="rounded-lg border-2 border-gray-200 p-1 transform transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div>
              <h1 className="text-gray-900 text-xl font-bold font-sans tracking-wide">
                CandyShare
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Secure file sharing
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-6">
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                Features
              </a>
              <button
                onClick={scrollToPricing}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors cursor-pointer"
              >
                Pricing
              </button>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                Help
              </a>
            </nav>

            {/* Authentication Section */}
            {isLoading ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700">{user?.name}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {user?.tier || 'FREE'}
                  </span>
                </div>
                <Button
                  onClick={() => logout()}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => signIn()}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-gray-300 hover:border-gray-400"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col gap-4">
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                Features
              </a>
              <button
                onClick={scrollToPricing}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors cursor-pointer text-left"
              >
                Pricing
              </button>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                Help
              </a>

              {/* Mobile Authentication Section */}
              <div className="pt-2">
                {isLoading ? (
                  <div className="w-full h-8 bg-gray-200 rounded animate-pulse" />
                ) : isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <User className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-700">{user?.name || user?.email}</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {user?.tier?.toUpperCase() || 'FREE'}
                      </span>
                    </div>
                    <Button
                      onClick={() => logout()}
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => signIn()}
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center justify-center gap-2 border-gray-300 hover:border-gray-400"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
