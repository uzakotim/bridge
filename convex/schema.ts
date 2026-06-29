// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";



export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    role: v.optional(v.string()),
    createdAt: v.string(), // ISO timestamp
  }),
  userSkills: defineTable({
    userId: v.id("users"),
    skillName: v.string(),
    level: v.number(), // 1‑10
  }),
  targetRoles: defineTable({
    name: v.string(),
  }),
  jobs: defineTable({
    title: v.string(),
    company: v.string(),
    description: v.string(),
  }),
  jobSkills: defineTable({
    jobId: v.id("jobs"),
    skillName: v.string(),
    importance: v.number(), // 1‑10
  }),
  skillGaps: defineTable({
    userId: v.id("users"),
    skill: v.string(),
    status: v.union(v.literal("missing"), v.literal("learning"), v.literal("completed")),
  }),
  projects: defineTable({
    userId: v.id("users"),
    projectIdea: v.string(),
    resources: v.string(),
    status: v.union(v.literal("planning"), v.literal("in_progress"), v.literal("completed")),
    explanation: v.string(),
  }),
});
