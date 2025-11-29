//SECURED VERSION

import { NextRequest, NextResponse } from "next/server";
import { decodeBase64Url, hmacSign } from "@/lib/hmac";
import { encodeBase64Url } from "@/lib/base64";

export async function GET(req: NextRequest) {
  // API key
  const apiKey = req.headers.get("x-api-key");
  if (apiKey !== process.env.TANIME_API_KEY)
    return NextResponse.json({ error: "dog" }, { status: 401 });

  // Signed params
  const payload = req.nextUrl.searchParams.get("d");
  const sig = req.nextUrl.searchParams.get("sig");

  if (!payload || !sig)
    return NextResponse.json({ error: "missing_params" }, { status: 400 });

  // Verify signature
  const expected = hmacSign(payload, process.env.HMAC_SECRET!);
  if (sig !== expected)
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });

  // Decode payload
  const decoded = JSON.parse(decodeBase64Url(payload));
  const { type, id, season, episode, server, imdbId } = decoded;

  if (!type || !imdbId)
    return NextResponse.json({ error: "bad_payload" }, { status: 400 });

  // Build NHDAPI URL
  let url = "";

  if (type === "movie") {
    url = `https://scrennnifu.click/movie/${imdbId}/playlist.m3u8`;
  } else {
    if (!season || !episode)
      return NextResponse.json(
        { error: "TV requires season + episode" },
        { status: 400 }
      );
    url = `https://scrennnifu.click/serial/${imdbId}/${season}/${episode}/playlist.m3u8`;
  }

  const output = {
    success: true,
    sources: [
      {
        file: `https://sweet-cell-11fc.vetenabejar.workers.dev/?u=${encodeBase64Url(
          url
        )}`,
        label: "HLS",
        type: "hls",
      },
    ],
  };
  const secret = encodeBase64Url(JSON.stringify(output));
  return NextResponse.json({ secret });
}
