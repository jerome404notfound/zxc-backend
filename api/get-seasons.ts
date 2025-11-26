import { SeasonTypes } from "@/types/movie-by-id";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useTvSeason({
  id,
  season_number,
  media_type,
}: {
  id: number;
  season_number?: number;
  media_type: string;
}) {
  const seasonQuery = useQuery<SeasonTypes>({
    queryKey: ["tv-season", id, season_number],
    enabled: !!season_number && media_type === "tv",
    queryFn: async () => {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_KEY;
      const url = `https://api.themoviedb.org/3/tv/${id}/season/${season_number}?api_key=${apiKey}`;
      const res = await axios.get(url);
      return res.data;
    },
    retry: false,
  });
  return seasonQuery;
}
