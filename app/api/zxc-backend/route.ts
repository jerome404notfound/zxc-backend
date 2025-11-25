// // app/api/tanime/route.ts
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//   const type = req.nextUrl.searchParams.get("type"); // movie or tv
//   const id = req.nextUrl.searchParams.get("id");
//   const season = req.nextUrl.searchParams.get("season");
//   const episode = req.nextUrl.searchParams.get("episode");

//   if (!type || !id) {
//     return NextResponse.json({ error: ":3" }, { status: 400 });
//   }

//   // Build dynamic TAnime URL
//   let url = "";

//   if (type === "movie") {
//     url = `https://tanime.tv/proxy?server=1&type=movie&tmdbid=${id}`;
//   } else if (type === "tv") {
//     if (!season || !episode) {
//       return NextResponse.json(
//         { error: "TV type requires season and episode" },
//         { status: 400 }
//       );
//     }
//     url = `https://tanime.tv/proxy?server=1&type=tv&id=${id}&season=${season}&episode=${episode}`;
//   } else {
//     return NextResponse.json(
//       { error: "Invalid type: must be movie or tv" },
//       { status: 400 }
//     );
//   }

//   // Fetch Tanime proxy
//   const res = await fetch(url, {
//     headers: {
//       "User-Agent":
//         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
//       Referer: "https://tanime.tv/",
//     },
//   });

//   const html = await res.text();

//   return new NextResponse(html, {
//     headers: {
//       "Content-Type": "text/html",
//     },
//   });
// }
// app/api/tanime/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // 🔐 API KEY CHECK
  const apiKey = req.headers.get("x-api-key");
  if (apiKey !== process.env.TANIME_API_KEY) {
    return NextResponse.json({ error: "dog" }, { status: 401 });
  }

  const type = req.nextUrl.searchParams.get("type"); // movie or tv
  const id = req.nextUrl.searchParams.get("id");
  const season = req.nextUrl.searchParams.get("season");
  const episode = req.nextUrl.searchParams.get("episode");

  if (!type || !id) {
    return NextResponse.json({ error: ":3" }, { status: 400 });
  }

  // Build dynamic TAnime URL
  let url = "";

  if (type === "movie") {
    url = `https://tanime.tv/proxy?server=1&type=movie&tmdbid=${id}`;
  } else if (type === "tv") {
    if (!season || !episode) {
      return NextResponse.json(
        { error: "TV type requires season and episode" },
        { status: 400 }
      );
    }
    url = `https://tanime.tv/proxy?server=1&type=tv&id=${id}&season=${season}&episode=${episode}`;
  } else {
    return NextResponse.json(
      { error: "Invalid type: must be movie or tv" },
      { status: 400 }
    );
  }

  // Fetch Tanime proxy
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Referer: "https://tanime.tv/",
    },
  });

  const html = await res.text();

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
