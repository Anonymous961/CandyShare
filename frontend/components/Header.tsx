"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LogIn, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
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
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-6">
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                Pricing
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                Help
              </a>
            </nav>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2 border-gray-300 hover:border-gray-400"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Button>
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
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                Pricing
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                Help
              </a>
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full flex items-center justify-center gap-2 border-gray-300 hover:border-gray-400"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
