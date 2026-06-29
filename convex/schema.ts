// convex/schema.ts
import { v } from "convex/values";

export default defineSchema({
  users: v.object({
    email: v.string(),
    name: v.string(),
    role: v.optional(v.string()),
    createdAt: v.string(), // ISO timestamp
  }),
  userSkills: v.object({
    userId: v.id("users"),
    skillName: v.string(),
    level: v.int(), // 1‑10
  }),
  targetRoles: v.object({
    name: v.string(),
  }),
  jobs: v.object({
    title: v.string(),
    company: v.string(),
    description: v.string(),
  }),
  jobSkills: v.object({
    jobId: v.id("jobs"),
    skillName: v.string(),
    importance: v.int(), // 1‑10
  }),
  skillGaps: v.object({
    userId: v.id("users"),
    skill: v.string(),
    status: v.union(v.literal("missing"), v.literal("learning"), v.literal("completed")),
  }),
  projects: v.object({
    userId: v.id("users"),
    projectIdea: v.string(),
    resources: v.string(),
    status: v.union(v.literal("planning"), v.literal("in_progress"), v.literal("completed")),
    explanation: v.string(),
  }),
});
