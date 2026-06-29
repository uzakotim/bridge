// convex/users.ts
import { v } from "convex/values";
import { mutation } from "./_generated/server";

/** Upsert a user by email. Returns the user's _id. */
export const createOrFetch = mutation({
  args: {
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, { email, name }) => {
    const existing = await ctx
      .db.query("users")
      .filter((q) => q.eq(q.field("email"), email))
      .unique();

    if (existing) return existing._id;

    const userId = await ctx.db.insert("users", {
      email,
      name,
      createdAt: new Date().toISOString(),
    });
    return userId;
  },
});
