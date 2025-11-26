// // utils/ultraStealthFetcher.ts

// const REFERERS = [
//   "https://www.google.com/",
//   "https://www.bing.com/",
//   "https://search.yahoo.com/",
//   "https://duckduckgo.com/",
//   "https://www.facebook.com/",
//   "https://www.reddit.com/",
// ];

// const LANGUAGES = [
//   "en-US,en;q=0.9",
//   "en-GB,en;q=0.9",
//   "en-US,en-GB;q=0.8",
//   "en-US,en;q=0.8,en-GB;q=0.7",
// ];

// const PLATFORMS = [`"Windows"`, `"macOS"`, `"Linux"`];

// const USER_AGENTS = [
//   () => {
//     const major = 120 + Math.floor(Math.random() * 10);
//     const minor = Math.floor(Math.random() * 4000);
//     const patch = Math.floor(Math.random() * 200);

//     return `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${major}.0.${minor}.${patch} Safari/537.36`;
//   },
//   () => {
//     // Mobile Chrome
//     const major = 120 + Math.floor(Math.random() * 10);
//     const minor = Math.floor(Math.random() * 4000);
//     const patch = Math.floor(Math.random() * 200);

//     return `Mozilla/5.0 (Linux; Android 14; SM-S908E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${major}.0.${minor}.${patch} Mobile Safari/537.36`;
//   },
// ];

// function wait(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// export async function ultraStealthFetcher(url: string, init: RequestInit = {}) {
//   // Random human-like delay: 50–180ms
//   await wait(50 + Math.random() * 130);

//   const referer = REFERERS[Math.floor(Math.random() * REFERERS.length)];
//   const lang = LANGUAGES[Math.floor(Math.random() * LANGUAGES.length)];
//   const platform = PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)];

//   // Random desktop/mobile UA
//   const ua = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]();

//   const secUa = `"Chromium";v="${
//     120 + Math.floor(Math.random() * 10)
//   }", "Google Chrome";v="${
//     120 + Math.floor(Math.random() * 10)
//   }", "Not.A/Brand";v="8"`;

//   const headers = {
//     "User-Agent": ua,
//     Accept:
//       "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
//     "Accept-Language": lang,
//     Referer: referer,

//     // Chrome fingerprint headers
//     "sec-ch-ua": secUa,
//     "sec-ch-ua-mobile": ua.includes("Mobile") ? "?1" : "?0",
//     "sec-ch-ua-platform": platform,

//     "Sec-Fetch-Site": "same-origin",
//     "Sec-Fetch-Mode": "navigate",
//     "Sec-Fetch-User": "?1",
//     "Sec-Fetch-Dest": "document",

//     "Upgrade-Insecure-Requests": "1",

//     // Avoid missing header patterns
//     "Cache-Control": "max-age=0",

//     // Merge custom headers
//     ...(init.headers || {}),
//   };

//   const finalInit = {
//     ...init,
//     headers,
//   };

//   let response = await fetch(url, finalInit);

//   // If blocked, retry intelligently
//   if (response.status === 403 || response.status === 429) {
//     // Wait 150–400ms like a human retrying
//     await wait(150 + Math.random() * 250);

//     const retryHeaders = {
//       ...headers,
//       Referer: "https://www.google.com/",
//       "User-Agent": USER_AGENTS[0](), // desktop UA for retry
//     };

//     response = await fetch(url, {
//       ...init,
//       headers: retryHeaders,
//     });
//   }

//   return response;
// }
// utils/stealthFetch.ts
const getRandomUA = () => {
  const version = 124 + Math.floor(Math.random() * 8); // 124–131
  return `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version}.0.0.0 Safari/537.36`;
};

export const stealthFetch: typeof fetch = (input, init) => {
  const headers = new Headers(init?.headers);

  // Only set these once per request — no randomness per sub-request
  if (!headers.has("User-Agent")) {
    headers.set("User-Agent", getRandomUA());
  }
  headers.set(
    "sec-ch-ua",
    `"Not/A)Brand";v="8", "Chromium";v="${
      124 + Math.floor(Math.random() * 8)
    }", "Google Chrome";v="${124 + Math.floor(Math.random() * 8)}"`
  );
  headers.set("sec-ch-ua-mobile", "?0");
  headers.set("sec-ch-ua-platform", `"Windows"`);
  headers.set(
    "Accept",
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
  );
  headers.set("Accept-Language", "en-US,en;q=0.9");
  headers.set("Accept-Encoding", "gzip, deflate, br, zstd");
  headers.set("Upgrade-Insecure-Requests", "1");

  // Optional: only helps on some sources
  // headers.set("Referer", "https://www.google.com/");

  return fetch(input, {
    ...init,
    headers,
    signal: init?.signal ?? AbortSignal.timeout(28_000), // 28s safety
  });
};
