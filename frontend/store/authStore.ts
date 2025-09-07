import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
    id: string;
    email: string;
    name?: string;
    image?: string;
    tier: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    userTier: string;
    setUser: (user: User | null) => void;
    setLoading: (isLoading: boolean) => void;
    logout: () => void;
    updateTier: (tier: string) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: true,
            userTier: 'anonymous',

            setUser: (user) => set({
                user,
                isAuthenticated: !!user,
                isLoading: false,
                userTier: user?.tier?.toLowerCase() || 'anonymous',
            }),

            setLoading: (isLoading) => set({ isLoading }),

            logout: () => set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                userTier: 'anonymous',
            }),

            updateTier: (tier) => set({ userTier: tier.toLowerCase() }),
        }),
        {
            name: 'auth-storage',
        }
    )
);