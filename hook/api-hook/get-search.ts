"use client";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { MovieTypes } from "@/types/movie-by-id";


interface SearchTypes {
  page: number;
  results: MovieTypes[];
  total_pages: number;
  total_results: number;
}

export default function useSearch({
  media_type,
  search,
}: {
  media_type: string;
  search: string;
}) {
  const query = useInfiniteQuery<SearchTypes>({
    queryKey: ["search", search, media_type],

    enabled: !!search,
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const url = `https://api.themoviedb.org/3/search/${media_type}?query=${search}&page=${pageParam}&api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=en-US`;
      const res = await axios.get(url);
      return res.data;
    },

    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },

    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return query;
}
