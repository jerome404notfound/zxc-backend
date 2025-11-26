// import { NextRequest } from "next/server";

// export const GET = async (req: NextRequest) => {
//   const { searchParams } = new URL(req.url);
//   const target = searchParams.get("url");

//   if (!target) {
//     return new Response("Missing ?url= parameter", { status: 400 });
//   }

//   try {
//     const response = await fetch(target, {
//       headers: {
//         // These are the headers the server checks
//         Referer: "https://flashstream.cc",
//         Origin: "https://flashstream.cc",
//         "User-Agent":
//           "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36",
//         // Some CDNs also check Accept
//         Accept: "*/*",
//       },
//     });

//     if (!response.ok) {
//       return new Response(`Upstream error ${response.status}`, {
//         status: response.status,
//       });
//     }

//     // Important: stream the response so large .m3u8/ts files don't blow memory
//     const contentType =
//       response.headers.get("content-type") || "application/vnd.apple.mpegurl";

//     return new Response(response.body, {
//       headers: {
//         "Content-Type": contentType,
//         "Access-Control-Allow-Origin": "*", // so your browser player can access it
//         "Cache-Control": "no-store",
//       },
//     });
//   } catch (err) {
//     return new Response("Proxy error", { status: 500 });
//   }
// };

// export const dynamic = "force-dynamic"; // disable caching if you want
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("url");

  if (!target) {
    return new Response("Missing url parameter", { status: 400 });
  }

  try {
    const res = await fetch(target, {
      headers: {
        Referer: "https://flashstream.cc",
        Origin: "https://flashstream.cc",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0",
        Accept: "*/*",
      },
    });

    let text = await res.text();

    // (OPTION C) KEEP the absolute CDN URLs (DO NOT proxy segments)
    // Make relative paths absolute if needed
    const originalURL = new URL(target);

    text = text.replace(/^([^#].+)$/gm, (line) => {
      if (line.startsWith("http")) return line; // already absolute
      return `${originalURL.origin}${line}`;
    });

    return new Response(text, {
      headers: {
        "Content-Type": "application/vnd.apple.mpegurl",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (e) {
    return new Response("Proxy error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
