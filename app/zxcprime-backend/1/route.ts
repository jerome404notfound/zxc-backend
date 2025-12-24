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
    if (!referer.includes("/api/") && !referer.includes("localhost")) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const sourceLink =
      media_type === "tv"
        ? `https://abhishek1996-streambuddy.hf.space/api/extract?tmdbId=${id}&type=tv&season=${season}&episode=${episode}`
        : `https://abhishek1996-streambuddy.hf.space/api/extract?tmdbId=${id}&type=movie`;

    const res = await fetch(sourceLink, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Referer: "https://abhishek1996-streambuddy.hf.space/",
      },
    });
    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "Upstream request failed" },
        { status: res.status }
      );
    }

    const data = await res.json();

    if (!data?.m3u8Url) {
      return NextResponse.json(
        { success: false, error: "No m3u8 stream found" },
        { status: 404 }
      );
    }

    console.log(data);
    return NextResponse.json({
      success: true,
      link: data.m3u8Url,
      type: "hls",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
