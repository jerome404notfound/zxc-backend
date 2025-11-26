"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export default function useGetReusableData<T>({
  endpoint,
  params,
  isVisible,
}: {
  endpoint: string;
  params?: Record<string, any>;
  isVisible: boolean;
}) {
  return useQuery<T>({
    queryKey: ["reusable", endpoint, params],
    enabled: isVisible,
    queryFn: async () => {
      const res = await axios.get(`https://api.themoviedb.org/3/${endpoint}`, {
        params: {
          api_key: process.env.NEXT_PUBLIC_TMDB_KEY,
          ...params,
        },
      });

      return res.data;
    },
    retry: false,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // keep cache longer
  });
}
