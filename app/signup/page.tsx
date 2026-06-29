// app/signup/page.tsx
"use client";

import { useAuth } from "@/app/components/AuthProvider";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const { signInWithGoogle, loading, user } = useAuth();
  const router = useRouter();

  if (user) {
    router.replace("/");
    return null;
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-primary to-secondary">
      <div className="rounded-xl bg-white bg-opacity-90 p-10 shadow-lg backdrop-blur-sm">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Create your account
        </h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading…</p>
        ) : (
          <button
            onClick={async () => {
              await signInWithGoogle(); // same Google flow
              router.replace("/");
            }}
            className="w-full rounded bg-primary px-4 py-2 text-white hover:bg-primary/80 transition"
          >
            Sign up with Google
          </button>
        )}
      </div>
    </section>
  );
}
