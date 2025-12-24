"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { MovieTypes } from "./movie-by-id";

export default function useMovieById({
  media_type,
  id,
}: {
  media_type: string;
  id: number;
}) {
  const query = useQuery<MovieTypes>({
    queryKey: ["get-by-id", id, media_type],
    queryFn: async () => {
      const url = `https://api.themoviedb.org/3/${media_type}/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=en-US&append_to_response=credits,images,videos,recommendations,reviews,translations,external_ids`;

      try {
        const res = await axios.get(url);

        return res.data;
      } catch (error) {
        console.error(error);
        throw error; // 🔥 Important: NEVER return undefined
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return query;
}
