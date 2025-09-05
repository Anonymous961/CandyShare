"use client"
import { SessionProvider } from "next-auth/react"

// Temporary mock until NextAuth is properly installed
export function AuthProvider({ children }: { children: React.ReactNode }) {
    return <SessionProvider>
        {children}
    </SessionProvider>
}