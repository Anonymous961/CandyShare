import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export const useAuth = () => {
    const { user, isAuthenticated, isLoading, userTier, setUser, setLoading, logout, updateTier } = useAuthStore();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'loading') {
            setLoading(true);
            return;
        }

        if (session?.user) {
            const userData = {
                id: session.user.id || '',
                email: session.user.email || '',
                name: session.user.name || undefined,
                image: session.user.image || undefined,
                tier: session.user.tier || 'free',
            };
            setUser(userData);
        } else {
            setUser(null);
        }
    }, [session, status, setUser, setLoading]);

    return {
        user,
        isAuthenticated,
        isLoading,
        userTier,
        logout,
        updateTier,
    };
};