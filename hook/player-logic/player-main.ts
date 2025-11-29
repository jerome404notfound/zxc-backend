// hooks/useVideoSetup.ts
import { useRef, useState } from "react";
import { useVideoProgress } from "./player-progress";
import { useVideoPlayer } from "./player-control";
import { useHlsSetup } from "./player-master";
import { Level } from "hls.js";
import { UseVideoSetupProps } from "./player-types";

export function useVideoSetup({ sourceLink, sourceType }: UseVideoSetupProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const video = videoRef.current;

  // Core player controls
  const player = useVideoPlayer(video);
  const { progress, bufferedProgress, isBuffering, isEnding } =
    useVideoProgress(video);

  // HLS features
  const [quality, setQuality] = useState<Level[]>([]);
  const [subtitles, setSubtitles] = useState<any[]>([]);
  const [audioTracks, setAudioTracks] = useState<any[]>([]);
  const [selectedQuality, setSelectedQuality] = useState(-1);
  const [selectedSubtitle, setSelectedSubtitle] = useState(-1);
  const [selectedAudio, setSelectedAudio] = useState(0);

  const hls = useHlsSetup(video, sourceLink, {
    onQualityChange: setQuality,
    onSubtitlesChange: setSubtitles,
    onAudioTracksChange: setAudioTracks,
  });

  // Apply quality/subtitle/audio changes
  if (hls.current) {
    hls.current.currentLevel = selectedQuality;
    hls.current.subtitleTrack = selectedSubtitle;
    hls.current.audioTrack = selectedAudio;
  }

  // Direct MP4 source
  if (sourceType === "mp4" && video) {
    video.src = sourceLink;
  }

  // Setup player events
  player.setupEventListeners?.();

  return {
    videoRef,
    progress,
    bufferedProgress,
    isBuffering,
    isEnding,
    isPlaying: player.isPlaying,
    volume: player.volume,
    isMuted: player.isMuted,
    isFullscreen: player.isFullscreen,

    // Controls
    togglePlay: player.togglePlay,
    seekTo: player.seekTo,
    handleVolumeChange: player.handleVolumeChange,
    toggleMute: player.toggleMute,
    toggleFullscreen: player.toggleFullscreen,
    jumpForward10: player.jumpForward10,
    jumpBack10: player.jumpBack10,

    // HLS Features
    quality,
    subtitles,
    audioTracks,
    selectedQuality,
    setSelectedQuality,
    selectedSubtitle,
    setSelectedSubtitle,
    selectedAudio,
    setSelectedAudio,
  };
}
