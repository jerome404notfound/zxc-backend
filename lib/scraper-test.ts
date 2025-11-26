// // lib/scraper.ts
// "use client";

// import {
//   makeProviders,
//   makeStandardFetcher,
//   targets,
// } from "@p-stream/providers";

// export interface MovieMedia {
//   type: "movie";
//   tmdbId: string;
//   title: string;
//   releaseYear: number;
// }

// export interface ShowMedia {
//   type: "show";
//   tmdbId: string;
//   title: string;
//   releaseYear: number;
//   season: {
//     number: number;
//     tmdbId: string;
//     title: string;
//     episodeCount?: number;
//   };
//   episode: {
//     number: number;
//     tmdbId: string;
//   };
// }

// type Media = MovieMedia | ShowMedia;

// const providers = makeProviders({
//   fetcher: makeStandardFetcher(fetch),
//   target: targets.BROWSER, // Changed from NATIVE to BROWSER
// });

// export async function scrapeStreams(params: {
//   title: string;
//   releaseYear: number;
//   tmdbId: string;
//   media_type: "movie" | "show";
//   seasonTitle?: string;
//   season?: number;
//   episode?: number;
//   episodeCount?: number;
// }) {
//   const {
//     title,
//     releaseYear,
//     tmdbId,
//     media_type,
//     seasonTitle = "",
//     season = 1,
//     episode = 1,
//     episodeCount = 0,
//   } = params;

//   if (!tmdbId) {
//     return { success: false, error: "Missing TMDB ID", streams: null };
//   }

//   // MOVIE MEDIA
//   if (media_type === "movie") {
//     const media: MovieMedia = {
//       type: "movie",
//       tmdbId,
//       title,
//       releaseYear,
//     };

//     try {
//       const streams = await providers.runAll({ media });
//       return { success: true, streams };
//     } catch (error) {
//       console.error("MOVIE STREAM ERROR:", error);
//       return { success: false, streams: null, message: "404 not found." };
//     }
//   }

//   // SHOW MEDIA
//   const media: ShowMedia = {
//     type: "show",
//     tmdbId,
//     title,
//     releaseYear,
//     season: {
//       number: season,
//       tmdbId,
//       title: seasonTitle,
//       episodeCount,
//     },
//     episode: {
//       number: episode,
//       tmdbId,
//     },
//   };

//   try {
//     const streams = await providers.runAll({ media });
//     return { success: true, streams };
//   } catch (error) {
//     console.error("STREAM ERROR:", error);
//     return {
//       success: false,
//       streams: null,
//       message: "404 not found, Try switching server.",
//     };
//   }
// }

// // Optional: Get available sources
// export function getSources(mediaType?: "movie" | "show") {
//   const sources = providers.listSources();
//   if (mediaType) {
//     return sources.filter((s) => s.mediaTypes?.includes(mediaType));
//   }
//   return sources;
// }
// lib/scraper.ts
"use client";

import {
  makeProviders,
  makeStandardFetcher,
  targets,
} from "@p-stream/providers";

export interface MovieMedia {
  type: "movie";
  tmdbId: string;
  title: string;
  releaseYear: number;
}

export interface ShowMedia {
  type: "show";
  tmdbId: string;
  title: string;
  releaseYear: number;
  season: {
    number: number;
    tmdbId: string;
    title: string;
    episodeCount?: number;
  };
  episode: {
    number: number;
    tmdbId: string;
  };
}

// Domains that need CORS proxy
const CORS_DOMAINS = [
  "cuevana",
  "rgshows",
  "primewire",
  "movies4f",
  "wecima",
  "turbovid",
  "animetsu",
  "fsharetv",
  "ee3",
];

const needsCorsProxy = (url: string): boolean => {
  return CORS_DOMAINS.some((domain) => url.toLowerCase().includes(domain));
};

// Custom fetcher that routes blocked domains through CORS proxy
const createFetcher = () => {
  return async (url: string, opts?: RequestInit): Promise<Response> => {
    if (needsCorsProxy(url)) {
      const proxyUrl = `/api/cors?url=${encodeURIComponent(url)}`;
      console.log(`DEBUG: Using CORS proxy for: ${url.substring(0, 50)}...`);
      return fetch(proxyUrl, opts);
    }

    console.log(`DEBUG: Direct fetch: ${url.substring(0, 50)}...`);
    return fetch(url, opts);
  };
};

const providers = makeProviders({
  fetcher: makeStandardFetcher(createFetcher()),
  target: targets.BROWSER,
});

export async function scrapeStreams(params: {
  title: string;
  releaseYear: number;
  tmdbId: string;
  media_type: "movie" | "show";
  seasonTitle?: string;
  season?: number;
  episode?: number;
  episodeCount?: number;
}) {
  const {
    title,
    releaseYear,
    tmdbId,
    media_type,
    seasonTitle = "",
    season = 1,
    episode = 1,
    episodeCount = 0,
  } = params;

  if (!tmdbId) {
    return { success: false, error: "Missing TMDB ID", streams: null };
  }

  if (media_type === "movie") {
    const media: MovieMedia = {
      type: "movie",
      tmdbId,
      title,
      releaseYear,
    };

    try {
      const streams = await providers.runAll({ media });
      return { success: true, streams };
    } catch (error) {
      console.error("MOVIE STREAM ERROR:", error);
      return { success: false, streams: null, message: "404 not found." };
    }
  }

  const media: ShowMedia = {
    type: "show",
    tmdbId,
    title,
    releaseYear,
    season: {
      number: season,
      tmdbId,
      title: seasonTitle,
      episodeCount,
    },
    episode: {
      number: episode,
      tmdbId,
    },
  };

  try {
    const streams = await providers.runAll({ media });
    return { success: true, streams };
  } catch (error) {
    console.error("STREAM ERROR:", error);
    return { success: false, streams: null, message: "404 not found." };
  }
}
