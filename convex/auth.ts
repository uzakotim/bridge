// convex/auth.ts
import { Auth } from "convex/server";
import { GoogleAuthProvider } from "@auth/core/providers/google";
import { getUser } from "@convex-dev/auth/server";

// Placeholder function to verify Google ID token and return user email/name.
export async function verifyGoogleToken(token: string): Promise<{ email: string; name: string }> {
  // In a real implementation, verify token with Google APIs.
  // Here we simply decode the JWT payload (no verification) for demo purposes.
  const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());
  const email = payload?.email ?? "";
  const name = payload?.name ?? "";
  if (!email) throw new Error("Invalid Google token");
  return { email, name };
}

export async function getOrCreateUser(auth: Auth, email: string, name: string) {
  // Search for existing user
  const existing = await auth.query("users", "byEmail", { email });
  if (existing?.length) return existing[0];
  // Create new user document
  return await auth.mutation("users", "create", { email, name, createdAt: new Date().toISOString() });
}
