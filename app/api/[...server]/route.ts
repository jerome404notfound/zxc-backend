// //SECURED VERSION WITH CLOUDFLARE BACKUP

// import { NextRequest, NextResponse } from "next/server";
// import { decodeBase64Url, hmacSign } from "@/lib/hmac";
// import { encodeBase64Url } from "@/lib/base64";

// export interface SourceTypes {
//   file: string;
//   label: string;
//   type: "mp4" | "hls" | string;
//   origin: string;
//   id: number;
// }

// export interface Server1Types {
//   success: boolean;
//   sources: SourceTypes[];
// }

// export async function GET(req: NextRequest) {
//   // API key
//   const apiKey = req.headers.get("x-api-key");
//   if (apiKey !== process.env.TANIME_API_KEY)
//     return NextResponse.json({ error: "dog" }, { status: 401 });

//   // Signed params
//   const payload = req.nextUrl.searchParams.get("d");
//   const sig = req.nextUrl.searchParams.get("sig");

//   if (!payload || !sig)
//     return NextResponse.json({ error: "missing_params" }, { status: 400 });

//   // Verify signature
//   const expected = hmacSign(payload, process.env.HMAC_SECRET!);
//   if (sig !== expected)
//     return NextResponse.json({ error: "invalid_signature" }, { status: 401 });

//   // Decode payload
//   const decoded = JSON.parse(decodeBase64Url(payload));
//   const { type, id, season, episode, imdbId } = decoded;

//   if (!type || !id)
//     return NextResponse.json({ error: "bad_payload" }, { status: 400 });

//   // -------------------------
//   //  Build server URLs
//   // -------------------------
//   let server1 = "";
//   let server2 = "";
//   if (type === "movie") {
//     server1 = `https://scrennnifu.click/movie/${imdbId}/playlist.m3u8`;
//     server2 = `https://server.nhdapi.xyz/hollymoviehd/movie/${id}`;
//   } else {
//     if (!season || !episode)
//       return NextResponse.json(
//         { error: "TV requires season + episode" },
//         { status: 400 }
//       );
//     server1 = `https://scrennnifu.click/serial/${imdbId}/${season}/${episode}/playlist.m3u8`;
//     server2 = `https://server.nhdapi.xyz/hollymoviehd/tv/${id}/${season}/${episode}`;
//   }

//   // -------------------------
//   // Fetch Server2 JSON
//   // -------------------------
//   const res = await fetch(server2, {
//     headers: {
//       "User-Agent": "Mozilla/5.0",
//       Referer: "https://nhdapi.xyz/",
//     },
//   });

//   const server2Data: Server1Types = await res.json();

//   // -------------------------
//   // Proxies with Backups
//   // -------------------------
//   const proxy1 = "https://sweet-cell-11fc.vetenabejar.workers.dev/?u=";

//   // Primary proxy2 + backup proxies
//   const proxy2List = [
//     "https://billowing-king-b723.jerometecson33.workers.dev/?u=",
//     "https://dark-scene-567a.jinluxuz.workers.dev/?u=",
//   ];

//   // -------------------------
//   // Server1 as single option
//   // -------------------------
//   const server1Sources: SourceTypes = {
//     id: 1,
//     origin: "server1",
//     file: proxy1 + encodeBase64Url(server1),
//     label: "Server 1",
//     type: "hls",
//   };

//   // -------------------------
//   // Convert Server2 sources with backup logic
//   // -------------------------
//   const server2Sources = server2Data.sources.flatMap((src, index) => {
//     const encodedUrl = encodeBase64Url(src.file);

//     // Create multiple sources using different proxies
//     return proxy2List.map((proxy, proxyIndex) => ({
//       id: index * proxy2List.length + proxyIndex + 2,
//       origin: `server2_proxy${proxyIndex + 1}`,
//       file: proxy + encodedUrl,
//       label: `Server ${index + 2}${
//         proxyIndex > 0 ? ` (Backup ${proxyIndex})` : ""
//       }`,
//       type: src.type,
//     }));
//   });

//   // 🔥 Combine into single array
//   const combinedSources = [server1Sources, ...server2Sources];

//   return NextResponse.json({
//     secret: encodeBase64Url(
//       JSON.stringify({
//         success: true,
//         sources: combinedSources,
//       })
//     ),
//   });
// }
//SECURED VERSION WITH CLOUDFLARE BACKUP

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
  // Fetch Server2 JSON
  // -------------------------
  const res = await fetch(server2, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      Referer: "https://nhdapi.xyz/",
    },
  });

  const server2Data: Server1Types = await res.json();

  // -------------------------
  // Proxies with Backups
  // -------------------------
  // Primary proxy1 + backup proxies
  const proxy1List = [
    "https://sour-bobcat-11.vetenabejar.deno.net/?u=",
    "https://sweet-cell-11fc.vetenabejar.workers.dev/?u=",
    "https://damp-bonus-5625.mosangfour.workers.dev/?u=",
    "https://long-frog-ec4e.coupdegrace21799.workers.dev/?u=",
  ];

  // Primary proxy2 + backup proxies
  const proxy2List = [
    "https://dark-scene-567a.jinluxuz.workers.dev/?u=",
    "https://billowing-king-b723.jerometecson33.workers.dev/?u=",
    "https://damp-shadow-42f1.jinluxusz.workers.dev/?u=",
    "https://morning-unit-723b.jinluxus303.workers.dev/?u=",
  ];

  // -------------------------
  // Server1 with backup logic
  // -------------------------
  const encodedServer1 = encodeBase64Url(server1);
  const server1Sources = proxy1List.map((proxy, proxyIndex) => ({
    id: proxyIndex + 1,
    origin: `server1_proxy${proxyIndex + 1}`,
    file: proxy + encodedServer1,
    label: `Server 1${proxyIndex > 0 ? ` (Backup ${proxyIndex})` : ""}`,
    type: "hls" as const,
  }));

  // -------------------------
  // Convert Server2 sources with backup logic
  // -------------------------
  const server2Sources = server2Data.sources.flatMap((src, index) => {
    const encodedUrl = encodeBase64Url(src.file);

    // Create multiple sources using different proxies
    return proxy2List.map((proxy, proxyIndex) => ({
      id: proxy1List.length + index * proxy2List.length + proxyIndex + 1,
      origin: `server2_proxy${proxyIndex + 1}`,
      file: proxy + encodedUrl,
      label: `Server ${index + 2}${
        proxyIndex > 0 ? ` (Backup ${proxyIndex})` : ""
      }`,
      type: src.type,
    }));
  });

  // 🔥 Combine into single array
  const combinedSources = [...server1Sources, ...server2Sources];

  return NextResponse.json({
    secret: encodeBase64Url(
      JSON.stringify({
        success: true,
        sources: combinedSources,
      })
    ),
  });
}
