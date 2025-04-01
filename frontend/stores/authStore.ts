import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authStorage } from '../storage/authStorage';
import { User, AuthResponse } from '../interfaces/Auth';

interface AuthState {
    accessToken: string | null;
    user: User | null;
    isAuthenticated: boolean;
    login: (response: AuthResponse) => void;
    logout: () => void;
    updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            accessToken: null,
            user: null,
            isAuthenticated: false,
            login: (response: AuthResponse) => set({
                accessToken: response.accessToken,
                user: response.user,
                isAuthenticated: true,
            }),
            logout: () => set({
                accessToken: null,
                user: null,
                isAuthenticated: false,
            }),
            updateUser: (user: User) => set((state) => ({
                ...state,
                user,
            })),
        }),
        {
            name: 'auth-store',
            storage: authStorage,
        }
    )
);