"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useMutation } from "convex/react";

declare const google: any;

// Assume we have a simple endpoint that returns a Google ID token after sign‑in.
// For demo purposes we just expose signIn/out functions that the UI can call.

interface User {
  _id: string;
  email: string;
  name: string;
  role?: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => void;
}

import { api } from "@/convex/_generated/api";
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Mutation to create or fetch a user in Convex


  const getOrCreateUser = useMutation(api.users.createOrFetch);

  // Load Google Identity Services script once on client mount
  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      console.log("Google Identity loaded");
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  // app/components/AuthProvider.tsx (excerpt)
  const signInWithGoogle = async () => {
    // 1️⃣ Open Google sign‑in popup (use Google Identity Services)
    const client = google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: async (response: any) => {
        const token = response.credential;
        if (!token) {
          console.error("No Google credential received");
          return;
        }
        const res = await fetch("/api/verify-google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const userInfo = await res.json();

        if (!userInfo.email || !userInfo.name) {
          console.error("Invalid Google user payload:", userInfo);
          throw new Error("Google authentication failed");
        }

        const { _id } = await getOrCreateUser({
          email: userInfo.email,
          name: userInfo.name,
        });

        setUser({
          _id,
          email: userInfo.email,
          name: userInfo.name,
        });
      }
    });

    google.accounts.id.prompt();
  };

  const signOut = () => {
    setUser(null);
    // Clear token cookie for demo
    document.cookie = "google_token=; Max-Age=0; path=/";
  };

  // On mount, check if a token already exists and try to load user.
  useEffect(() => {
    const init = async () => {
      const token = document.cookie.replace(/(?:(?:^|.*;)\s*google_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      if (token) {
        const userInfo = await fetch("/api/verify-google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        }).then((res) => res.json());
        const { _id } = await getOrCreateUser({ email: userInfo.email, name: userInfo.name });
        setUser({ _id, email: userInfo.email, name: userInfo.name });
      }
      setLoading(false);
    };
    init();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
