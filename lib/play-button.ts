// utils/stealthFetcher.ts
export const stealthFetcher = async (url: string, init: RequestInit = {}) => {
  // Random Chrome versions
  const chromeMajor = 120 + Math.floor(Math.random() * 10);
  const chromeMinor = Math.floor(Math.random() * 4000);
  const chromeBuild = Math.floor(Math.random() * 200);

  const userAgent = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeMajor}.0.${chromeMinor}.${chromeBuild} Safari/537.36`;

  const headers = {
    // Full real browser UA
    "User-Agent": userAgent,

    // Important browser signals
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",

    // Pretend coming from Google or a similar site
    Referer: "https://www.google.com/",

    // SEC-CH-UA (very important – servers use this heavily)
    "sec-ch-ua": `"Chromium";v="${chromeMajor}", "Google Chrome";v="${chromeMajor}", "Not.A/Brand";v="8"`,
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": `"Windows"`,

    // Real browser fetch behavior
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-User": "?1",
    "Sec-Fetch-Dest": "document",

    // Avoid server rejecting missing cookies
    "Upgrade-Insecure-Requests": "1",

    // Include headers from request if user passed any
    ...init.headers,
  };

  const finalInit: RequestInit = {
    ...init,
    headers,
  };

  return fetch(url, finalInit);
};
