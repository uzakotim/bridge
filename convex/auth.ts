// convex/auth.ts
"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

// Simple JWT payload decoder (no signature verification). Replace with real lib in prod.
function decodeJwt(token: string) {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid JWT token");
  const payload = parts[1];
  // base64url → base64
  const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
  const decoded = Buffer.from(base64, "base64").toString("utf-8");
  return JSON.parse(decoded);
}

export const verifyGoogleToken = action({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const payload = decodeJwt(token) as {
      sub?: string;
      email?: string;
      name?: string;
    };
    const { email, name } = payload;
    if (!email) throw new Error("Invalid token payload: missing email");

    // Upsert user via typed mutation reference
    const userId: string = await ctx.runMutation(api.users.createOrFetch, {
      email: email,
      name: name ?? "",
    });

    return { _id: userId, email: email, name: name ?? "" };
  },
});
