// app/components/Providers.tsx
"use client";

import React, { ReactNode } from "react";
import { ConvexProvider } from "convex/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { convex } from "../../lib/convex-client";
import { AuthProvider } from "./AuthProvider";

/**
 * Wraps the application with all client‑side providers.
 *
 * - ConvexProvider supplies the Convex client for queries & mutations.
 * - GoogleOAuthProvider handles Google authentication.
 * - AuthProvider handles user session.
 *
 * This component is a client component (note the `"use client"` directive),
 * so it can safely use React context, hooks, and `useMutation`/`useQuery`.
 */
export default function Providers({ children }: { children: ReactNode }) {
    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
            <ConvexProvider client={convex}>
                <AuthProvider>{children}</AuthProvider>
            </ConvexProvider>
        </GoogleOAuthProvider>
    );
}
