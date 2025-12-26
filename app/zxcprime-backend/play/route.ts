// /api/play/route.ts
import { NextRequest, NextResponse } from "next/server";
import { decodeObfuscated } from "@/lib/obsfucate";
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("t");
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  try {
    const realUrl = decodeObfuscated(token);

    // Option A: redirect
    return NextResponse.redirect(realUrl);

    // Option B: proxy (better)
    // const res = await fetch(realUrl);
    // return new NextResponse(res.body, res);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }
}
