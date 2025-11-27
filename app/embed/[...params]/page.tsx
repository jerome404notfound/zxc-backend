"use client";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useState } from "react";
const Ring = dynamic(() => import("ldrs/react").then((m) => m.Ring), {
  ssr: false,
});
import "ldrs/react/Ring.css";
import { LoaderCircle } from "lucide-react";
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
  const path = `/api/zxc-backend/1?${query}`;
  console.log(path);
  return (
    <div className="relative w-full h-dvh bg-black overflow-hidden">
      {/* Loading Screen */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
          <div className="flex flex-col items-center gap-6">
            <div className="lg:size-15 size-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {/* Iframe */}
      <iframe
        src={path}
        className="absolute inset-0 w-full h-screen"
        frameBorder={0}
        allowFullScreen
        // Hide iframe until it's fully loaded
        style={{ opacity: isLoading ? 0 : 1 }}
        onLoad={() => setIsLoading(false)}
        // Optional: handle errors
        onError={() => setIsLoading(false)}
        sandbox="allow-scripts allow-same-origin allow-presentation"
      />
    </div>
  );
}
