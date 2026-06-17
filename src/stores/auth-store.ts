import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { UserRightsOut } from '@/modules/user-right/types';

// Cookie utility functions
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax`;
};

export interface User {
  id: string;
  username: string;
  email: string;
  role?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  userRights: UserRightsOut | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string, userRights?: UserRightsOut | null) => void;
  setUserRights: (userRights: UserRightsOut | null) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      userRights: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user, token, userRights = null) => {
        set({
          user,
          token,
          userRights,
          isAuthenticated: true,
          isLoading: false,
        });
        setCookie('access_token', token);
      },

      setUserRights: (userRights) => {
        set({ userRights });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          userRights: null,
          isAuthenticated: false,
          isLoading: false,
        });
        deleteCookie('access_token');
        localStorage.removeItem('selected_book');
        localStorage.removeItem('refresh_token');
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      // Initialize auth state from cookies
      initialize: () => {
        const token = getCookie('access_token');
        if (token && !get().isAuthenticated) {
          // If token exists in cookie but not in state, restore it
          set({
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else if (!token && get().isAuthenticated) {
          // If token doesn't exist in cookie but state says authenticated, logout
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        userRights: state.userRights,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
