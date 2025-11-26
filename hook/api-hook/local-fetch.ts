import { useQuery } from "@tanstack/react-query";
import axios from "axios";
export interface Stream {
  id: string;
  type?: string;
  playlist: string;
  headers?: HeaderTypes;
  flags?: string[];
  captions?: any[];
  qualities: Record<string, FileQuality>;
}
export interface FileQuality {
  type: string; // "mp4"
  url: string;
}
interface HeaderTypes {
  Origin: string;
  Referer: string;
}
export interface Streams {
  sourceId: string;
  stream: Stream;
}
export default function useLocalFetch({
  id,
  media_type,
  season,
  title,
  releaseYear,
  episode,
  seasonTitle,
  episodeCount,
}: {
  id: number;
  media_type: string;
  season: number;
  title: string;
  releaseYear: number;
  episode: number;
  seasonTitle: string;
  episodeCount: number;
}) {
  const query = useQuery<Streams | null>({
    enabled:
      (!!id && media_type === "movie") ||
      (!!id && media_type === "tv" && episodeCount !== 0),
    queryKey: [
      "stream",
      id,
      media_type,
      season,
      episode,
      title,
      releaseYear,
      seasonTitle,
      episodeCount,
    ],
    queryFn: async () => {
      const params: Record<string, string> = {
        title,
        releaseYear: releaseYear.toString(),
        tmdbId: id.toString(),
        media_type: media_type === "tv" ? "show" : "movie",
      };

      if (media_type === "tv") {
        params.seasonTitle = seasonTitle;
        params.season = season.toString();
        params.episode = episode.toString();
        params.episodeCount = episodeCount.toString();
      }

      try {
        const { data } = await axios.get(
          "https://warm-singers-arrive.loca.lt/api/scrape",
          { params }
        );

        if (!data.success) return null;
        return data.streams as Streams | null;
      } catch (error) {
        console.error("Error fetching stream:", error);
        return null;
      }
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return query;
}
