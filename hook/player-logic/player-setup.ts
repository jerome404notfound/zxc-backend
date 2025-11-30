import { useEffect, useRef, useState } from "react";
import Hls, { Level } from "hls.js";
import { encodeBase64Url } from "@/lib/base64";
import { MovieTypes } from "@/types/movie-by-id";
import { useVideoProgressStore, makeKey } from "@/app/store/videoProgressStore";
import { useParams } from "next/navigation";
import { useVolume } from "./player-volume";
import { useMediaTracks } from "./player-media-tracks";
import { useVideoElement } from "./player-element";
import { useServerSwitching } from "./player-server-switch";
import { selectAudioTrack } from "@/lib/selected-audio-track";
export interface SourceItem {
  id: number;
  file: string;
  label: string;
  type: "mp4" | "hls" | string;
}

export function useVideoSetup({
  sources,
  initialServerId = 1,
}: {
  sources: SourceItem[];
  initialServerId?: number;
}) {
  const { params } = useParams();
  const media_type = String(params?.[0]);
  const id = Number(params?.[1]);
  const season = Number(params?.[2]) || 1;
  const episode = Number(params?.[3]) || 1;
  const language = params?.[4] || "en";
  const hlsRef = useRef<Hls | null>(null);

  const {
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
    setProgress,
    jumpBack10,
    setIsLoading,
    addEventListeners,
    removeEventListeners,
  } = useVideoElement();
  const { volume, isMuted, handleVolumeChange, toggleMute, prevVolume } =
    useVolume(videoRef);
  const {
    subtitles,
    audioTracks,
    quality,
    selectedQuality,
    selectedSubtitle,
    selectedAudio,
    setSelectedAudio,
    setSelectedSubtitle,
    setSelectedQuality,
    setSubtitles,
    setAudioTracks,
    setQuality,
  } = useMediaTracks(hlsRef);
  const {
    currentServerIndex,
    activeServer,
    switchToNextServer,
    validateIndex,
    handleManualServerSwitch,
  } = useServerSwitching(sources, initialServerId);
  useEffect(() => {
    validateIndex();
  }, [sources, currentServerIndex]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activeServer?.file) return;

    try {
      if (activeServer?.type === "hls" && Hls.isSupported()) {
        const hls = new Hls();

        hls.on(Hls.Events.ERROR, (_, data) => {
          console.error("HLS Error:", data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.warn(
                  "Network error - automatically switching server..."
                );
                switchToNextServer();
                return;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.warn("Media error - trying recovery...");
                hls.recoverMediaError();
                return;
              default:
                console.warn("Unknown fatal error - switching server...");
                switchToNextServer();
                return;
            }
          }
        });

        hls.loadSource(activeServer?.file);
        hls.attachMedia(video);
        hlsRef.current = hls;

        hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
          setQuality(data.levels); // now populated
        });
        hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, (_, data) => {
          setSubtitles(data.subtitleTracks);
        });
        hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, (_, data) => {
          setAudioTracks(data.audioTracks);
          const selectedIndex = selectAudioTrack(data.audioTracks, language);
          if (selectedIndex !== null) {
            setSelectedAudio(selectedIndex);
            hls.audioTrack = selectedIndex;
          }
        });
      } else if (activeServer?.type === "mp4") {
        video.src = activeServer?.file;
        video.onerror = () => {
          console.error("MP4 failed → switching server...");
          switchToNextServer();
        };
      }
      addEventListeners(video);
    } catch (err) {
      console.error("Video setup error:", err);
      setIsLoading(false);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      removeEventListeners(video);
    };
  }, [activeServer?.file]);

  // NEW: Jump forward/back 10 seconds

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !id) return;

    const key =
      media_type === "movie"
        ? makeKey("movie", id)
        : makeKey("tv", id, season, episode);

    const lastProgress = useVideoProgressStore.getState().getProgress(key);
    if (!lastProgress) return;

    // Wait for video to be ready
    const handleCanPlay = () => {
      // Make sure currentTime is within duration
      if (lastProgress.currentTime < video.duration) {
        video.currentTime = lastProgress.currentTime;
      }
      video.removeEventListener("canplay", handleCanPlay);
    };

    video.addEventListener("canplay", handleCanPlay);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, [id, activeServer?.file]);

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
    isLoading,
    isPlaying,
    volume,
    isMuted,
    handleVolumeChange,
    toggleMute,

    //IF M3U8 A MASTER PLAYLIST
    subtitles,
    setSubtitles,
    audioTracks,
    setAudioTracks,
    quality,
    setQuality,
    //
    selectedQuality,
    setSelectedQuality,
    selectedSubtitle,
    setSelectedSubtitle,
    selectedAudio,
    setSelectedAudio,

    //
    currentServerIndex,
    handleManualServerSwitch,
    activeServer,
  };
}
