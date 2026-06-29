// app/signin/page.tsx
"use client";

import { useAuth } from "@/app/components/AuthProvider";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const { signInWithGoogle, loading, user } = useAuth();
  const router = useRouter();

  // If the user is already signed in, bounce to the home page
  if (user) {
    router.replace("/");
    return null;
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary to-secondary">
      <div className="rounded-xl bg-white bg-opacity-90 p-10 shadow-lg backdrop-blur-sm">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Welcome back
        </h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading…</p>
        ) : (
          <button
            onClick={async () => {
              await signInWithGoogle(); // real Google flow via Convex
              router.replace("/");
            }}
            className="w-full rounded bg-primary px-4 py-2 text-white hover:bg-primary/80 transition"
          >
            Sign in with Google
          </button>
        )}
      </div>
    </section>
  );
}
