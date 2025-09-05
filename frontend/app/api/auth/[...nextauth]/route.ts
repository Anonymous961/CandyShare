import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import { ExtendedUser } from "../../../../types/auth"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000"

const handler = NextAuth({
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
        async signIn({ user, account }) {
            // Send user data to backend for storage/update
            try {
                const response = await fetch(`${BACKEND_URL}/api/auth/signin`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: user.email,
                        name: user.name,
                        image: user.image,
                        provider: account?.provider,
                        providerAccountId: account?.providerAccountId,
                        accessToken: account?.access_token,
                        refreshToken: account?.refresh_token,
                        expiresAt: account?.expires_at,
                        tokenType: account?.token_type,
                        scope: account?.scope,
                        idToken: account?.id_token,
                        sessionState: account?.session_state,
                    }),
                });

                if (response.ok) {
                    const userData = await response.json();
                    user.id = userData.id;
                    user.tier = userData.tier;
                }
            } catch (error) {
                console.error('Error during sign in:', error);
            }

            return true;
        },
        async session({ session, token }) {
            // Get user data from backend
            try {
                if (token.sub) {
                    const response = await fetch(`${BACKEND_URL}/api/auth/user/${token.sub}`, {
                        headers: {
                            'Authorization': `Bearer ${token.accessToken}`,
                        },
                    });

                    if (response.ok) {
                        const userData = await response.json();
                        session.user.id = userData.id;
                        session.user.tier = userData.tier;
                    }
                }
            } catch (error) {
                console.error('Error fetching user session:', error);
            }

            return session;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.tier = (user as ExtendedUser).tier;
            }
            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
            }
            return token;
        },
        redirect: async ({ url, baseUrl }) => {
            // Handle redirects properly for production
            if (url.startsWith("/")) return `${baseUrl}${url}`
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        },
    },
    pages: {
        signIn: "/auth/signin",
    },
})

export { handler as GET, handler as POST }