// convex/auth.ts
"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";

// Simple JWT payload decoder (no verification). Replace with real verification in prod.
function decodeJwt(token: string) {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid JWT token");
  const payload = parts[1];
  const decoded = Buffer.from(payload, "base64").toString("utf-8");
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
    if (!email) throw new Error("Invalid token payload");

    // Upsert user in Convex DB (users:createOrFetch mutation)
    const userId = await ctx.runMutation("users:createOrFetch", {
      email,
      name: name ?? "",
    });
    return { _id: userId, email, name: name ?? "" };
  },
});
