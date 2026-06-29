// app/api/verify-google/route.ts
export const runtime = "nodejs";

import type { NextApiRequest, NextApiResponse } from "next";
import { api } from "@convex-dev/convex/nextjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Missing token" });

    const result = await api.mutation("auth:verifyGoogleToken", { token });
    res.status(200).json(result);
}
