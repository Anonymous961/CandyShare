import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import { ExtendedUser } from "../../../../types/auth"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"

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
                    const responseData = await response.json();
                    const userData = responseData.user; // Backend returns { user: { id, email, name, image, tier } }
                    user.id = userData.id;
                    user.tier = userData.tier;
                    console.log('SignIn callback - user data set:', { id: userData.id, tier: userData.tier });
                } else {
                    console.warn('SignIn callback - failed to get user data from backend');
                }
            } catch (error) {
                console.error('Error during sign in:', error);
            }

            return true;
        },
        async session({ session, token }) {
            console.log('Session callback - token:', { id: token.id, tier: token.tier });
            console.log('Session callback - session before:', { id: session.user.id, tier: session.user.tier });

            // Use the database ID from token.id (set during signIn)
            try {
                if (token.id) {
                    console.log('Fetching user data for ID:', token.id);
                    const response = await fetch(`${BACKEND_URL}/api/auth/user/${token.id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        const userData = await response.json();
                        session.user.id = userData.id;
                        session.user.tier = userData.tier;
                        console.log('Fresh user data fetched:', { id: userData.id, tier: userData.tier });
                    } else {
                        console.warn('Failed to fetch fresh user data, using cached data');
                        session.user.id = token.id;
                        session.user.tier = token.tier;
                    }
                } else {
                    console.warn('No token.id available, using session data');
                    session.user.id = token.id;
                    session.user.tier = token.tier;
                }
            } catch (error) {
                console.error('Error fetching user session:', error);
                session.user.id = token.id;
                session.user.tier = token.tier;
            }

            console.log('Session callback - session after:', { id: session.user.id, tier: session.user.tier });
            return session;
        },
        async jwt({ token, user, account }) {
            if (user) {
                console.log('JWT callback - user data:', { id: user.id, tier: (user as ExtendedUser).tier });
                token.id = user.id;
                token.tier = (user as ExtendedUser).tier;
            }
            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
            }
            console.log('JWT callback - final token:', { id: token.id, tier: token.tier });
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