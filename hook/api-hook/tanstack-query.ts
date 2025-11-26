// import { MovieTypes } from "@/types/movie-by-id";
// import { useQueries, UseQueryResult } from "@tanstack/react-query";
// import axios from "axios";

// interface CutomListTypes {
//   id: number;
//   media_type: string;
// }
// export function useReusableApi({
//   custom_list,
// }: {
//   custom_list: CutomListTypes[];
// }) {
//   return useQueries({
//     queries: custom_list.map((item) => ({
//       queryKey: ["get-by-id", item.media_type, item.id],
//       enabled: !!item.id,
//       queryFn: async () => {
//         const url = `https://api.themoviedb.org/3/${item.media_type}/${item.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=en-US`;
//         const res = await axios.get(url);
//         return { ...res.data, media_type: item.media_type };
//       },
//     })),
//   }) as UseQueryResult<MovieTypes>[];
// }
import { MovieTypes } from "@/types/movie-by-id";
import { useQueries, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";

interface CustomListTypes {
  id: number;
  media_type: string;
}

/**
 * Strategy 1: Lazy Loading - Only fetch visible slides
 * Fetch data only for the current slide and a few adjacent ones
 */
export function useReusableApi({
  custom_list,
  activeIndex = 0,
  prefetchRange = 2, // Fetch current + 2 ahead + 2 behind
}: {
  custom_list: CustomListTypes[];
  activeIndex?: number;
  prefetchRange?: number;
}) {
  return useQueries({
    queries: custom_list.map((item, index) => {
      // Only enable queries for slides near the active one
      const isInRange = Math.abs(index - activeIndex) <= prefetchRange;

      return {
        queryKey: ["get-by-id", item.media_type, item.id],
        enabled: !!item.id && isInRange,
        queryFn: async () => {
          const url = `https://api.themoviedb.org/3/${item.media_type}/${item.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=en-US`;
          const res = await axios.get(url);
          return { ...res.data, media_type: item.media_type };
        },
        staleTime: Infinity, // Data won't change often
        gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes (renamed from cacheTime)
        refetchOnWindowFocus: false, // Prevent unnecessary refetches
        refetchOnMount: false,
      };
    }),
  }) as UseQueryResult<MovieTypes>[];
}
