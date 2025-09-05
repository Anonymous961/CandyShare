import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "../../../../lib/prisma"
import { ExtendedUser } from "../../../../types/auth"

const handler = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        session: async ({ session, user }) => {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: user.id,
                    tier: (user as ExtendedUser).tier || "FREE", // Default tier for now
                },
            };
        },
        // redirect: async ({ url, baseUrl }) => {
        //     // Always redirect to home page after successful login
        //     console.log("redirect is working")
        //     if (url.startsWith("/")) return `${baseUrl}${url}`
        //     else if (new URL(url).origin === baseUrl) return url
        //     return baseUrl
        // },
    },
    pages: {
        signIn: "/auth/signin",
    },
})

export { handler as GET, handler as POST }