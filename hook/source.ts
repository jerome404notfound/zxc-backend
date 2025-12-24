"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export interface SourceTypes {
  success: boolean;
  link: string;
  type: string;
}

export default function useSource({
  media_type,
  id,
  season,
  episode,
  server = 1,
}: {
  media_type: string;
  id: number;
  season: number;
  episode: number;
  server: number;
}) {
  const query = useQuery<SourceTypes>({
    queryKey: ["get-source", id, media_type, season, episode, server],
    enabled: !!id,
    queryFn: async () => {
      const ts = Date.now();
      const res = await axios.get(
        `/api/${server}?a=${id}&b=${media_type}${
          media_type === "tv" ? `&c=${season}&d=${episode}` : ""
        }&t=${ts}`
      );

      return res.data;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return query;
}
