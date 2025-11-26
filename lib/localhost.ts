// // lib/localhost.ts  (or stealthFetch.ts – name doesn't matter)

// import { ProxyAgent } from "undici";

// const getRandomUA = () => {
//   const version = 124 + Math.floor(Math.random() * 8);
//   return `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version}.0.0.0 Safari/537.36`;
// };

// // === YOUR BRIGHT DATA PROXY (port 33335 = native residential) ===
// const USER =
//   process.env.BRIGHTDATA_USER ||
//   "brd-customer-hl_ad40ad66-zone-residential_proxy1";
// const PASS = process.env.BRIGHTDATA_PASS || "h6th01nm8syj";

// // Russian exit nodes = 99.9% success on rgshows.ru
// const PROXY_URL = `http://${USER}:${PASS}_country-ru@brd.superproxy.io:33335`;

// const proxyAgent = new ProxyAgent(PROXY_URL);

// console.log("Bright Data residential proxy ENABLED (RU + port 33335)");

// // Fully typed, no TS errors, works with Next.js fetch
// export const stealthFetch = async (
//   input: string | URL | Request,
//   init?: RequestInit
// ): Promise<Response> => {
//   const url =
//     typeof input === "string"
//       ? input
//       : input instanceof URL
//       ? input.toString()
//       : input.url;

//   const headers = new Headers(init?.headers ?? {});

//   if (!headers.has("User-Agent")) {
//     headers.set("User-Agent", getRandomUA());
//   }
//   headers.set(
//     "Accept",
//     "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
//   );
//   headers.set("Accept-Language", "en-US,en;q=0.9");
//   headers.set("Accept-Encoding", "gzip, deflate, br, zstd");

//   // Use undici directly with proper typing
//   const {
//     body,
//     statusCode,
//     headers: resHeaders,
//   } = await proxyAgent.request({
//     origin: new URL(url).origin,
//     url: new URL(url).pathname + new URL(url).search,
//     method: init?.method ?? "GET",
//     body: init?.body
//       ? init.body instanceof ReadableStream
//         ? new ReadableStream(init.body) // already good
//         : typeof init.body === "string"
//         ? init.body
//         : init.body // ArrayBuffer, Blob, etc. – undici accepts
//       : undefined,
//     headers: Object.fromEntries(headers.entries()),
//     signal: init?.signal ?? AbortSignal.timeout(30_000),
//   });

//   // Convert undici response → standard Web Response
//   return new Response(body, {
//     status: statusCode,
//     statusText:
//       statusCode === 200 ? "OK" : statusCode === 404 ? "Not Found" : "Error",
//     headers: new Headers(resHeaders as Record<string, string>),
//   });
// };
