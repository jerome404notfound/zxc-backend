"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export interface SourceItem {
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
}: {
  media_type: string;
  id: number;
  season: number;
  episode: number;
}) {
  const query = useQuery<SourceResponse>({
    queryKey: ["get-source", id, media_type],
    queryFn: async () => {
      const url = `/api/burat?id=${id}&type=${media_type}${
        media_type === "tv" ? `&season=${season}&episode=${episode}` : ""
      }`;

      try {
        const res = await axios.get(url);

        return res.data;
      } catch (error) {
        console.error(error);
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return query;
}
