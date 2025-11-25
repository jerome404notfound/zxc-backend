"use client";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ZXCPlayer() {
  const { params } = useParams() as { params?: string[] };
  const [isLoading, setIsLoading] = useState(true);

  const media_type = params?.[0];
  const id = params?.[1];
  const season = params?.[2];
  const episode = params?.[3];

  const query = new URLSearchParams({
    type: media_type || "",
    id: id || "",
    ...(media_type === "tv" && season && episode ? { season, episode } : {}),
  }).toString();

  return (
    <div className="relative w-full h-dvh bg-black overflow-hidden">
      {/* Loading Screen */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
          <div className="flex flex-col items-center gap-6">
            {/* Spinner */}
            <div className="w-16 h-16 border-4 border-gray-700 border-t-white rounded-full animate-spin" />
            {/* Optional text */}
            <p className="text-white text-lg font-medium animate-pulse">
              Loading player...
            </p>
          </div>
        </div>
      )}

      {/* Iframe */}
      <iframe
        src={`/api/zxc-backend/1?${query}`}
        className="absolute inset-0 w-full h-full"
        frameBorder={0}
        allowFullScreen
        // Hide iframe until it's fully loaded
        style={{ opacity: isLoading ? 0 : 1 }}
        onLoad={() => setIsLoading(false)}
        // Optional: handle errors
        onError={() => setIsLoading(false)}
      />
    </div>
  );
}
