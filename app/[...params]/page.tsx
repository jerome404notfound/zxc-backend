"use client";
import { useParams } from "next/navigation";

export default function ZXCPlayer() {
  const { params } = useParams() as { params?: string[] };

  const media_type = params?.[0]; // "movie" or "tv"
  const id = params?.[1]; // TMDB id
  const season = params?.[2]; // season number (for TV)
  const episode = params?.[3]; // episode number (for TV)

  // Build query string dynamically
  const query = new URLSearchParams({
    type: media_type || "",
    id: id || "",
    ...(media_type === "tv" && season && episode ? { season, episode } : {}),
  }).toString();

  return (
    <iframe
      src={`/api/zxc-backend?${query}`}
      className="w-full h-dvh"
      frameBorder={0}
      allowFullScreen
    />
  );
}
