import { useEffect } from "react";

interface UseVideoEventsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  updateProgress: () => void;
  handlePlay: () => void;
  handlePause: () => void;
  handleBufferingStart: () => void;
  handleBufferingEnd: () => void;
  handleCanPlay: () => void;
  handleLoadStart: () => void;
}

export function useVideoEvents({
  videoRef,
  updateProgress,
  handlePlay,
  handlePause,
  handleBufferingStart,
  handleBufferingEnd,
  handleCanPlay,
  handleLoadStart,
}: UseVideoEventsProps) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("progress", updateProgress);
    video.addEventListener("waiting", handleBufferingStart);
    video.addEventListener("playing", handleBufferingEnd);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("loadstart", handleLoadStart);

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("progress", updateProgress);
      video.removeEventListener("waiting", handleBufferingStart);
      video.removeEventListener("playing", handleBufferingEnd);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("loadstart", handleLoadStart);
    };
  }, [
    videoRef,
    updateProgress,
    handlePlay,
    handlePause,
    handleBufferingStart,
    handleBufferingEnd,
    handleCanPlay,
    handleLoadStart,
  ]);
}
