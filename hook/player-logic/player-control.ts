// hooks/useVideoPlayer.ts
import { useState, useCallback } from "react";

export function useVideoPlayer(video: HTMLVideoElement | null) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [prevVolume, setPrevVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Play/Pause
  const togglePlay = useCallback(() => {
    if (!video) return;
    if (isPlaying) video.pause();
    else video.play().catch(console.warn);
  }, [video, isPlaying]);

  // Seek
  const seekTo = useCallback(
    (percentage: number) => {
      if (!video || !video.duration) return;
      video.currentTime = (video.duration * percentage) / 100;
    },
    [video]
  );

  // Volume
  const handleVolumeChange = useCallback(
    (value: number) => {
      if (!video) return;
      setVolume(value);
      video.volume = value / 100;
      setIsMuted(value === 0);
      if (value > 0) setPrevVolume(value);
    },
    [video]
  );

  const toggleMute = useCallback(() => {
    if (!video) return;
    if (isMuted) {
      video.volume = prevVolume / 100;
      setVolume(prevVolume);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      video.volume = 0;
      setVolume(0);
      setIsMuted(true);
    }
  }, [video, isMuted, volume, prevVolume]);

  // Jump
  const jumpForward10 = () =>
    video &&
    (video.currentTime = Math.min(video.currentTime + 10, video.duration));
  const jumpBack10 = () =>
    video && (video.currentTime = Math.max(video.currentTime - 10, 0));

  // Fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!video) return;
    const container = video.parentElement;
    if (!document.fullscreenElement) {
      container?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, [video]);

  // Listen to native events
  const setupEventListeners = useCallback(() => {
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, [video]);

  return {
    isPlaying,
    setIsPlaying,
    volume,
    isMuted,
    isFullscreen,
    togglePlay,
    seekTo,
    handleVolumeChange,
    toggleMute,
    toggleFullscreen,
    jumpForward10,
    jumpBack10,
    setupEventListeners,
  };
}
