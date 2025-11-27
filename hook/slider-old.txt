import { useEffect, useState } from "react";

export function useVideoSlider(
  videoRef: React.RefObject<HTMLVideoElement | null>
) {
  const [progress, setProgress] = useState(0); // 0-100%
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100); // 0-100%
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(100);
  const [isBuffering, setIsBuffering] = useState(false); // buffering state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEnding, setIsEnding] = useState(false); // NEW: About to end state
  // Update slider as video plays
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Sync progress
    const updateProgress = () => {
      setProgress((video.currentTime / video.duration) * 100);

      const threeMinutes = 3 * 60;
      if (
        video.duration &&
        video.currentTime >= video.duration - threeMinutes
      ) {
        setIsEnding(true);
      } else {
        setIsEnding(false);
      }
    };
    // Buffering
    const handleBuffering = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);

    // Sync isPlaying state
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    // Fullscreen changes
    const handleFullscreenChange = () => {
      const fsElement = document.fullscreenElement;
      setIsFullscreen(fsElement === video.parentElement);
    };

    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("waiting", handleBuffering); // buffering starts
    video.addEventListener("playing", handlePlaying); // resumes playback
    video.addEventListener("canplay", handlePlaying); // ready to play
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    // Sync initial autoplay state
    setIsPlaying(!video.paused);
    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("waiting", handleBuffering);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("canplay", handlePlaying);
    };
  }, [videoRef]);

  // Slider drag handler
  const handleSliderChange = (value: number[]) => {
    setProgress(value[0]);
    const video = videoRef.current;
    if (video) {
      video.currentTime = (video.duration * value[0]) / 100;
    }
  };
  // Slider drag handler for volume
  // Volume slider
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);

    const video = videoRef.current;
    if (!video) return;

    // If muted, unmute when slider changes
    if (isMuted && newVolume > 0) {
      setIsMuted(false);
      video.volume = newVolume / 100;
      setPrevVolume(newVolume);
      return;
    }

    video.volume = newVolume / 100;
    setPrevVolume(newVolume);
    setIsMuted(newVolume === 0);
  };
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log(err));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };
  // Toggle mute/unmute
  // Toggle mute/unmute
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = prevVolume / 100; // restore previous volume
      setIsMuted(false);
      setVolume(prevVolume);
    } else {
      setPrevVolume(volume); // save current volume
      video.volume = 0;
      setIsMuted(true);
      setVolume(0);
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    const container = video.parentElement;

    if (!document.fullscreenElement) {
      container?.requestFullscreen().catch((err) => console.log(err));
    } else {
      document.exitFullscreen().catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    setIsEnding(false); // reset whenever a new video is loaded
  }, [videoRef.current?.src]);
  return {
    progress,
    handleSliderChange,
    isPlaying,
    togglePlay,
    volume,
    handleVolumeChange,
    isMuted,
    toggleMute,
    isBuffering,
    isFullscreen,
    toggleFullscreen,
    isEnding,
  };
}
