import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // 🔐 API KEY CHECK
  const apiKey = req.headers.get("x-api-key");
  if (apiKey !== process.env.TANIME_API_KEY) {
    return NextResponse.json({ error: "dog" }, { status: 500 });
  }

  const type = req.nextUrl.searchParams.get("type"); // movie or tv
  const id = req.nextUrl.searchParams.get("id");
  const season = req.nextUrl.searchParams.get("season");
  const episode = req.nextUrl.searchParams.get("episode");

  if (!type || !id) {
    return NextResponse.json({ error: ":3" }, { status: 400 });
  }

  // Build dynamic nhdapi URL
  let url = "";

  if (type === "movie") {
    url = `https://server.nhdapi.xyz/hollymoviehd/movie/${id}`;
  } else if (type === "tv") {
    if (!season || !episode) {
      return NextResponse.json(
        { error: "TV type requires season and episode" },
        { status: 400 }
      );
    }
    url = `https://server.nhdapi.xyz/hollymoviehd/tv/${id}/${season}/${episode}`;
  } else {
    return NextResponse.json(
      { error: "Invalid type: must be movie or tv" },
      { status: 400 }
    );
  }

  // Fetch nhdapi proxy
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Referer: "https://nhdapi.xyz/",
    },
  });

  const json = await res.json();
  return NextResponse.json(json);
}
