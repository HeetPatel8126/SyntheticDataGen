"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi, type TokenResponse, type User } from "./api";

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: { email: string; password: string }) => Promise<TokenResponse>;
  register: (payload: { email: string; password: string; full_name?: string }) => Promise<TokenResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      const currentUser = await authApi.getMe();
      setUser(currentUser);
      return currentUser;
    } catch {
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    const hasToken = typeof window !== "undefined" && window.localStorage.getItem("access_token");
    if (!hasToken) {
      setIsLoading(false);
      return;
    }

    refreshUser().finally(() => setIsLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    async login(payload) {
      const token = await authApi.login(payload);
      setUser(token.user);
      return token;
    },
    async register(payload) {
      const token = await authApi.register(payload);
      setUser(token.user);
      return token;
    },
    async logout() {
      await authApi.logout();
      setUser(null);
      router.push("/login");
    },
    refreshUser
  }), [user, isLoading, router]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
