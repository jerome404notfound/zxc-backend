import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { encodeBase64Url } from "@/lib/base64";

export function useVideoSetup({
  sourceLink,
  sourceType,
}: {
  sourceLink: string;
  sourceType: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0-100%
  const [bufferedProgress, setBufferedProgress] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isEnding, setIsEnding] = useState(false); // NEW: About to end state
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(100);
  const [volume, setVolume] = useState(isMuted ? 0 : prevVolume);
  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !sourceLink) return;

    video.muted = isMuted;
    video.volume = isMuted ? 0 : prevVolume / 100;

    //UPDATE PROGRESS
    const updateProgress = () => {
      if (!video.duration) return;

      // Played progress
      setProgress((video.currentTime / video.duration) * 100);

      // Buffered progress
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        setBufferedProgress(
          Math.min((bufferedEnd / video.duration) * 100, 100)
        );
      }

      // Ending state
      const threeMinutes = 3 * 60;
      setIsEnding(video.currentTime >= video.duration - threeMinutes);
    };
    const handleBufferingStart = () => setIsBuffering(true);
    const handleBufferingEnd = () => setIsBuffering(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleFullscreenChange = () => {
      const fsElement = document.fullscreenElement;
      setIsFullscreen(fsElement === video.parentElement);
    };
    try {
      const encoded = encodeBase64Url(sourceLink);
      const proxyUrl = `https://dark-scene-567a.jinluxuz.workers.dev/?u=${encoded}`;

      // Handle HLS sources
      if (sourceType === "hls" && Hls.isSupported()) {
        const hls = new Hls({
          // debug: true, // Enable for debugging
          xhrSetup: (xhr) => {
            xhr.withCredentials = false;
          },
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS Error:", data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error("Network error - URL might be invalid");
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error("Media error");
                hls.recoverMediaError();
                break;
              default:
                hls.destroy();
                break;
            }
          }
        });

        hls.loadSource(proxyUrl);
        hls.attachMedia(video);
        hlsRef.current = hls;
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.muted = isMuted; // optional, bypasses autoplay restrictions
          video.play().catch((err) => console.warn("Autoplay failed:", err));
        });
      } else if (sourceType === "mp4") {
        video.src = proxyUrl;
      }
      video.addEventListener("timeupdate", updateProgress);
      video.addEventListener("progress", updateProgress);
      video.addEventListener("waiting", handleBufferingStart); // video is buffering
      video.addEventListener("playing", handleBufferingEnd); // resumed
      video.addEventListener("play", handlePlay);
      video.addEventListener("pause", handlePause);
      document.addEventListener("fullscreenchange", handleFullscreenChange);
    } catch (err) {
      console.error("Video setup error:", err);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("progress", updateProgress);
      video.removeEventListener("waiting", handleBufferingStart);
      video.removeEventListener("playing", handleBufferingEnd);
      video.addEventListener("play", handlePlay);
      video.addEventListener("pause", handlePause);
      document.addEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [sourceLink]);

  const handleSliderChange = (value: number[]) => {
    setProgress(value[0]);
    const video = videoRef.current;
    if (video) {
      video.currentTime = (video.duration * value[0]) / 100;
    }
  };
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) video.pause();
    else video.play().catch((err) => console.warn("Play failed:", err));
  };
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
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = prevVolume / 100;
      setVolume(prevVolume);
      setIsMuted(false);
      video.muted = false;
    } else {
      setPrevVolume(volume);
      video.volume = 0;
      setVolume(0);
      setIsMuted(true);
      video.muted = true;
    }
  };
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
  // NEW: Jump forward/back 10 seconds
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
  return {
    jumpForward10,
    jumpBack10,
    progress,
    bufferedProgress,
    isEnding,
    videoRef,
    handleSliderChange,
    setProgress,
    isBuffering,
    togglePlay,
    isPlaying,
    handleVolumeChange,
    volume,
    isMuted,
    toggleMute,
    toggleFullscreen,
    isFullscreen,
  };
}
