import { encodeBase64Url } from "@/lib/base64";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("a");
    const media_type = req.nextUrl.searchParams.get("b");
    const season = req.nextUrl.searchParams.get("c");
    const episode = req.nextUrl.searchParams.get("d");
    const ts = req.nextUrl.searchParams.get("t");

    // basic validation
    if (!id || !media_type || !ts) {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }

    // ⏱ expire after 8 seconds
    if (Date.now() - Number(ts) > 8000) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 403 }
      );
    }

    // block direct /api access
    const referer = req.headers.get("referer") || "";
    if (
      !referer.includes("/api/") &&
      !referer.includes("localhost") &&
      !referer.includes("https://www.zxcstream.xyz/")
    ) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const sourceLink =
      media_type === "tv"
        ? `https://api.madplay.site/api/rogflix?id=${id}&season=${season}&episode=${episode}&type=series`
        : `https://cdn.madplay.site/api/hls/unknown/${id}/master.m3u8`;

    if (media_type === "tv") {
      const res = await fetch(sourceLink, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Referer: "https://uembed.xyz/",
        },
      });
      if (!res.ok) {
        return NextResponse.json(
          { success: false, error: "Upstream request failed" },
          { status: res.status }
        );
      }

      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        return NextResponse.json(
          { success: false, error: "No m3u8 stream found" },
          { status: 404 }
        );
      }
      const firstSource = data.find((f) => f.title === "English").file;
      if (!sourceLink)
        return NextResponse.json(
          { success: false, error: "No English stream found" },
          { status: 404 }
        );

      return NextResponse.json({
        success: true,
        link: firstSource,
        type: "hls",
      });
    } else {
      const proxy = "https://damp-bonus-5625.mosangfour.workers.dev/?url=";
      return NextResponse.json({
        success: true,
        link: proxy + encodeBase64Url(sourceLink),
        type: "hls",
      });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
