// hooks/useHlsSetup.ts
import Hls, { Level } from "hls.js";
import { useEffect, useState } from "react";
export interface SubtitleTrackTypes {
  id: number;
  name: string;
  lang?: string;
  type: string;
  url: string;
  default?: boolean;
  forced?: boolean;
  autoselect?: boolean;
}
export interface AudioTrackTypes {
  id: number;
  name: string;
  lang?: string;
  groupId: string;
  default: boolean;
  autoselect: boolean;
  forced: boolean;
}
export function useMediaTracks(hlsRef: React.RefObject<Hls | null>) {
  const [subtitles, setSubtitles] = useState<SubtitleTrackTypes[]>([]);
  const [audioTracks, setAudioTracks] = useState<AudioTrackTypes[]>([]);
  const [quality, setQuality] = useState<Level[]>([]);

  const [selectedQuality, setSelectedQuality] = useState<number>(-1);
  const [selectedSubtitle, setSelectedSubtitle] = useState<number>(-1);
  const [selectedAudio, setSelectedAudio] = useState<number>(0);

  useEffect(() => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = selectedQuality;
    }
  }, [selectedQuality]);

  useEffect(() => {
    if (hlsRef.current) {
      hlsRef.current.subtitleTrack = selectedSubtitle;
    }
  }, [selectedSubtitle]);

  useEffect(() => {
    if (hlsRef.current) {
      hlsRef.current.audioTrack = selectedAudio;
    }
  }, [selectedAudio]);

  return {
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
  };
}
