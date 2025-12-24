import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Subtitle {
  id: string;
  url: string;
  language: string;
  display: string;
  format: "srt";
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
      const { data } = await axios.get(
        `https://sub.wyzie.ru/search?id=${imdbId}${
          season ? `&season=${season}&episode=${episode}` : ""
        }`,
        {
          params: { imdbId, season, episode },
        }
      );
      data.sort((a: Subtitle, b: Subtitle) =>
        a.language.localeCompare(b.language)
      );

      return data;
    },
    enabled: !!imdbId,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
