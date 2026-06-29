// app/api/verify-google/route.ts
export const runtime = "nodejs";

import { fetchAction } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (typeof token !== "string") {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }
    // verifyGoogleToken is a Convex action (uses "use node"), so use fetchAction
    const user = await fetchAction(api.auth.verifyGoogleToken, { token });
    return NextResponse.json(user);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("Google token verification failed:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
