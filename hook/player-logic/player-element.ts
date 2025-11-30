// hooks/useVideoProgress.ts
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useVideoProgressStore, makeKey } from "@/app/store/videoProgressStore";
export function useVideoElement() {
  const { params } = useParams();
  const media_type = String(params?.[0]);
  const id = Number(params?.[1]);
  const season = Number(params?.[2]) || 1;
  const episode = Number(params?.[3]) || 1;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bufferedProgress, setBufferedProgress] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) video.pause();
    else video.play().catch((err) => console.warn("Play failed:", err));
  };

  const jumpForward10 = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(video.currentTime + 10, video.duration);
  };
  const jumpBack10 = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(video.currentTime - 10, 0);
  };
  const handleSliderChange = (value: number[]) => {
    setProgress(value[0]);
    const video = videoRef.current;
    if (video) {
      video.currentTime = (video.duration * value[0]) / 100;
    }
  };

  const updateProgress = () => {
    const video = videoRef.current;
    if (!video?.duration) return;

    // Played progress
    setProgress((video.currentTime / video.duration) * 100);

    // Buffered progress
    if (video.buffered.length > 0) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      setBufferedProgress(Math.min((bufferedEnd / video.duration) * 100, 100));
    }

    // Ending state
    const threeMinutes = 3 * 60;
    setIsEnding(video.currentTime >= video.duration - threeMinutes);

    // --- SAVE TO STORE ---
    if (id && media_type) {
      const key =
        media_type === "movie"
          ? makeKey("movie", id)
          : makeKey(
              "tv",
              id,
              season,
              episode
              // metaData.season_number,
              // metaData.episode_number
            );

      useVideoProgressStore
        .getState()
        .saveProgress(key, video.currentTime, video.duration);
    }
  };
  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleBufferingStart = () => setIsBuffering(true);
  const handleBufferingEnd = () => setIsBuffering(false);
  const handleCanPlay = () => setIsLoading(false);
  const handleLoadStart = () => setIsLoading(true);

  const addEventListeners = (video: HTMLVideoElement) => {
    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("progress", updateProgress);
    video.addEventListener("waiting", handleBufferingStart); // video is buffering
    video.addEventListener("playing", handleBufferingEnd); // resumed
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("canplay", handleCanPlay); // NEW
    video.addEventListener("loadstart", handleLoadStart); // NEW
  };

  const removeEventListeners = (video: HTMLVideoElement) => {
    video.removeEventListener("timeupdate", updateProgress);
    video.removeEventListener("progress", updateProgress);
    video.removeEventListener("waiting", handleBufferingStart);
    video.removeEventListener("playing", handleBufferingEnd);
    video.removeEventListener("play", handlePlay);
    video.removeEventListener("pause", handlePause);
    video.removeEventListener("canplay", handleCanPlay); // NEW
    video.removeEventListener("loadstart", handleLoadStart); // NEW
  };
  return {
    isPlaying,
    progress,
    bufferedProgress,
    isBuffering,
    isEnding,
    isLoading,
    togglePlay,
    jumpForward10,
    handleSliderChange,
    videoRef,
    jumpBack10,
    setProgress,
    setBufferedProgress,
    setIsEnding,
    setIsLoading,
    updateProgress,

    //
    addEventListeners,
    removeEventListeners,
    handleCanPlay,
  };
}
