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
      { success: false, error: "Invalid token" } ,
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
        ? `https://server.nhdapi.xyz/hollymoviehd/tv/${id}/${season}/${episode}`
        : `https://server.nhdapi.xyz/hollymoviehd/movie/${id}`;

    const res = await fetch(sourceLink, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Referer: "https://nhdapi.xyz/",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "Upstream request failed" },
        { status: res.status }
      );
    }

    const data = await res.json();

    if (!Array.isArray(data.sources) || data.sources.length === 0) {
      return NextResponse.json(
        { success: false, error: "No sources found" },
        { status: 404 }
      );
    }

    const lastSource = data.sources.at(-1);
    const proxy = "https://dark-scene-567a.jinluxuz.workers.dev/?u=";
    return NextResponse.json({
      success: true,
      link: proxy + encodeBase64Url(lastSource.file),
      type: lastSource.type,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
