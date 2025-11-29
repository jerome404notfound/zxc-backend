"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { decodeBase64Url } from "@/lib/base64";

export interface SourceItem {
  id: number;
  file: string;
  label: string;
  type: "mp4" | "hls" | string;
}

export interface SourceResponse {
  success: boolean;
  sources: SourceItem[];
}

export default function useSource({
  media_type,
  id,
  season,
  episode,
  imdbId,
}: {
  media_type: string;
  id: number;
  season: number;
  episode: number;

  imdbId: string;
}) {
  const query = useQuery<SourceResponse>({
    queryKey: ["get-source", id, media_type, season, episode, imdbId],
    enabled: !!imdbId,
    queryFn: async () => {
      // 1️⃣ Request signature from server
      const signRes = await axios.get("/api/sign", {
        headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
        params: { type: media_type, id, season, episode, imdbId },
      });
      const { payload, sig, dynamic } = signRes.data;

      // 2️⃣ Call protected dynamic
      const res = await axios.get(dynamic, {
        headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
        params: { d: payload, sig },
      });

      const decoded = JSON.parse(decodeBase64Url(res.data.secret));
      console.log(decoded);
      return decoded;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return query;
}
