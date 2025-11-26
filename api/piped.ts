"use client";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export default function usePipedVideo(ytKey: string | null) {
  return useQuery({
    enabled: !!ytKey,
    queryKey: ["piped-video", ytKey],

    queryFn: async () => {
      if (!ytKey) return null;

      const res = await axios.get(`https://piped.video/streams/${ytKey}`);
      const data = res.data;

      // Best MP4 stream
      const mp4 = data.videoStreams?.find((v: any) =>
        v.mimeType?.includes("mp4")
      );

      // HLS stream (m3u8)
      const hls = data.hls ?? null;

      return {
        mp4Url: mp4?.url || null,
        hlsUrl: hls,
        info: data,
      };
    },

    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
