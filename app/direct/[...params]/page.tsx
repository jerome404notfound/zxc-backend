// src/app/player/page.tsx (or wherever your video is)
"use client";

import { encodeBase64Url } from "@/lib/base64";
import Hls from "hls.js";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function Player() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    const id = 1184918;
    const masterUrl = `https://damp-bonus-5625.mosangfour.workers.dev/?url=${encodeBase64Url(
      `https://cdn.madplay.site/api/hls/unknown/${id}/master.m3u8`
    )}`;

    if (Hls.isSupported()) {
      const hls = new Hls();

      hls.loadSource(masterUrl);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS Error:", data);
      });
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = masterUrl;
    }
  }, []);

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-3xl mb-6">Direct Stream - The Wild Robot (2024)</h1>
      <video ref={videoRef} controls className="w-full max-w-4xl" />

      <h1 className="mt-3">
        For more movies, visit{" "}
        <Link
          target="_blank"
          className="underline text-blue-500"
          href={`zxcprime.icu`}
        >
          zxcprime.icu
        </Link>
      </h1>
    </div>
  );
}
