"use client"

import { signIn, getProviders } from "next-auth/react"
import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogIn } from "lucide-react"
import { AuthProvider } from "@/types/auth"

function SignInForm() {
    const [providers, setProviders] = useState<Record<string, AuthProvider> | null>(null)
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/"

    useEffect(() => {
        const fetchProviders = async () => {
            const res = await getProviders()
            setProviders(res)
        }
        fetchProviders()
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Welcome to CandyShare</CardTitle>
                    <CardDescription>
                        Sign in to access enhanced file sharing features
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {providers &&
                        Object.values(providers).map((provider: AuthProvider) => (
                            <Button
                                key={provider.name}
                                onClick={() => signIn(provider.id, { callbackUrl })}
                                className="w-full"
                                variant={provider.name === "Google" ? "default" : "outline"}
                            >
                                <LogIn className="w-4 h-4 mr-2" />
                                Continue with {provider.name}
                            </Button>
                        ))}

                    <div className="text-center text-sm text-gray-500">
                        By signing in, you agree to our Terms of Service
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default function SignIn() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">Loading...</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="w-full h-8 bg-gray-200 rounded animate-pulse" />
                    </CardContent>
                </Card>
            </div>
        }>
            <SignInForm />
        </Suspense>
    )
}