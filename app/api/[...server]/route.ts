//SECURED VERSION

import { NextRequest, NextResponse } from "next/server";
import { decodeBase64Url, hmacSign } from "@/lib/hmac";
import { encodeBase64Url } from "@/lib/base64";
export interface SourceTypes {
  file: string;
  label: string;
  type: "mp4" | "hls" | string;
  origin: string;
  id: number;
}

export interface Server1Types {
  success: boolean;
  sources: SourceTypes[];
}

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
  const { type, id, season, episode, imdbId } = decoded;

  if (!type || !id)
    return NextResponse.json({ error: "bad_payload" }, { status: 400 });

  // -------------------------
  //  Build server URLs
  // -------------------------
  let server1 = "";
  let server2 = "";
  if (type === "movie") {
    server1 = `https://scrennnifu.click/movie/${imdbId}/playlist.m3u8`;
    server2 = `https://server.nhdapi.xyz/hollymoviehd/movie/${id}`;
  } else {
    if (!season || !episode)
      return NextResponse.json(
        { error: "TV requires season + episode" },
        { status: 400 }
      );
    server1 = `https://scrennnifu.click/serial/${imdbId}/${season}/${episode}/playlist.m3u8`;
    server2 = `https://server.nhdapi.xyz/hollymoviehd/tv/${id}/${season}/${episode}`;
  }

  // -------------------------
  // Fetch Server1 JSON
  // -------------------------
  const res = await fetch(server2, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      Referer: "https://nhdapi.xyz/",
    },
  });

  const server2Data: Server1Types = await res.json();

  // -------------------------
  // Proxies
  // -------------------------

  const proxy1 = "https://sweet-cell-11fc.vetenabejar.workers.dev/?u=";
  const proxy2 = "https://dark-scene-567a.jinluxuz.workers.dev/?u=";

  // -------------------------
  // Server1 as single option
  // -------------------------
  const server1Sources: SourceTypes = {
    id: 1,
    origin: "server1",
    file: proxy1 + encodeBase64Url(server1),
    label: "Server 1",
    type: "hls",
  };

  // -------------------------
  // Convert Server1 sources
  // -------------------------
  const server2Sources = server2Data.sources.map((src, index) => ({
    id: index + 2,
    origin: "server2",
    file: proxy2 + encodeBase64Url(src.file),
    label: `Server ${index + 2}`,
    type: src.type,
  }));

  // 🔥 Combine into single array
  const combinedSources = [server1Sources, ...server2Sources];

  return NextResponse.json({
    secret: encodeBase64Url(
      JSON.stringify({
        success: true,
        sources: combinedSources,
      })
    ),
  });
}
