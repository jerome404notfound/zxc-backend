import { NextRequest, NextResponse } from "next/server";
import { hmacSign, encodeBase64Url } from "@/lib/hmac";

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (apiKey !== process.env.TANIME_API_KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const type = req.nextUrl.searchParams.get("type");
  const id = req.nextUrl.searchParams.get("id");
  const season = req.nextUrl.searchParams.get("season") || null;
  const episode = req.nextUrl.searchParams.get("episode") || null;

  const raw = JSON.stringify({ type, id, season, episode });

  const payload = encodeBase64Url(raw);
  const sig = hmacSign(payload, process.env.HMAC_SECRET!);

  return NextResponse.json({
    payload,
    sig,
    dynamic: process.env.SECRET_ENDPOINT,
  });
}
