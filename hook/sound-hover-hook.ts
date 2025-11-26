// hooks/useHoverSound.ts
"use client";

import { useCallback, useRef } from "react";

export default function useHoverSound(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!audioRef.current && typeof window !== "undefined") {
    audioRef.current = new Audio(src);
    audioRef.current.volume = 0.3; // adjust volume
  }

  const play = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  }, []);
  return play;
}
