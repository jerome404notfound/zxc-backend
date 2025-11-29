// hooks/useVideoProgress.ts
import { useState, useEffect } from "react";

export function useVideoProgress(video: HTMLVideoElement | null) {
  const [progress, setProgress] = useState(0);
  const [bufferedProgress, setBufferedProgress] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  useEffect(() => {
    if (!video) return;

    const updateProgress = () => {
      if (!video.duration) return;

      setProgress((video.currentTime / video.duration) * 100);

      if (video.buffered.length > 0) {
        const end = video.buffered.end(video.buffered.length - 1);
        setBufferedProgress(Math.min((end / video.duration) * 100, 100));
      }

      const threeMinutes = 3 * 60;
      setIsEnding(video.currentTime >= video.duration - threeMinutes);
    };

    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => setIsBuffering(false);

    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("progress", updateProgress);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("playing", onPlaying);

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("progress", updateProgress);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("playing", onPlaying);
    };
  }, [video]);

  return { progress, bufferedProgress, isBuffering, isEnding };
}
