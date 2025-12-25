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
        ? `https://fmovies4u.com/api/scrape?type=tv&tmdbId=${id}&season=${season}&episode=${episode}`
        : `https://fmovies4u.com/api/scrape?type=movie&tmdbId=${id}`;

    const res = await fetch(sourceLink, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Referer: "https://fmovies4u.com/",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "Upstream request failed" },
        { status: res.status }
      );
    }

    const text = await res.text();
    const events = text.split("\n\n");
    const completedEvent = events
      .map((line) => line.trim())
      .filter((line) => line.startsWith("event: completed"))
      .pop();
    if (!completedEvent) {
      return NextResponse.json(
        { success: false, error: "No completed event found" },
        { status: 404 }
      );
    }
    const dataLine = completedEvent
      .split("\n")
      .find((line) => line.startsWith("data:"));
    if (!dataLine) {
      return NextResponse.json(
        { success: false, error: "No data found in completed event" },
        { status: 404 }
      );
    }
    const jsonText = dataLine.replace(/^data:\s*/, "").trim();
    const completedData = JSON.parse(jsonText);

    if (
      !Array.isArray(completedData.stream) ||
      completedData.stream.length === 0
    ) {
      return NextResponse.json(
        { success: false, error: "No sources found" },
        { status: 404 }
      );
    }

    const lastSource = completedData.stream.at(-1);

    const urlParams = new URL(lastSource.playlist).searchParams;
    const originalPlaylist = urlParams.get("url");

    if (!originalPlaylist) {
      return NextResponse.json(
        { success: false, error: "No sources found" },
        { status: 404 }
      );
    }
    const proxy = "https://long-frog-ec4e.coupdegrace21799.workers.dev/?u=";

    console.log("originalPlaylist", proxy + originalPlaylist);
    return NextResponse.json({
      success: true,
      link: proxy + encodeBase64Url(originalPlaylist),
      type: lastSource.type,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
