import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Subtitle {
  id: string;
  language: string;
  name: string;
  format: "srt" | "vtt";
  url: string;
  isHearingImpaired?: boolean;
  flagUrl?: string;
  source?: string;
}

interface UseSubtitlesParams {
  imdbId: string;
  season?: number; // optional for movies
  episode?: number; // optional for movies
}

export function useLibreSubsTV({
  imdbId,
  season,
  episode,
}: UseSubtitlesParams) {
  return useQuery<Subtitle[], Error>({
    queryKey: ["libreSubs", imdbId, season, episode],
    queryFn: async () => {
      const { data } = await axios.get("/api/subtitles", {
        params: { imdbId, season, episode },
      });
      return data;
    },
    enabled: !!imdbId,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
