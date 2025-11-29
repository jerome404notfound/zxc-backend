import { useEffect, useRef, useState } from "react";
import Hls, { Level } from "hls.js";
import { encodeBase64Url } from "@/lib/base64";
import { MovieTypes } from "@/types/movie-by-id";
import { useVideoProgressStore, makeKey } from "@/app/store/videoProgressStore";
import { useParams } from "next/navigation";
export interface SourceItem {
  id: number;
  file: string;
  label: string;
  type: "mp4" | "hls" | string;
}

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
  const language = params?.[4] || "en"; // keep as string
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
  const [isLoading, setIsLoading] = useState(true);
  //OPTIONAL
  const [subtitles, setSubtitles] = useState<SubtitleTrackTypes[]>([]);
  const [audioTracks, setAudioTracks] = useState<AudioTrackTypes[]>([]);
  const [quality, setQuality] = useState<Level[]>([]);

  //SELECTED OPTIONAL

  // console.log("hls.audioTracks →", audioTracks);
  const [selectedQualty, setSelectedQualty] = useState<number>(-1);
  const [selectedSubtitle, setSelectedSubtitle] = useState<number>(-1);
  const [selectedAudio, setSelectedAudio] = useState<number>(0);
  //MASTER PLAYLIST AFTER EFFECTS

  // console.log("hls.quality →", quality);

  // Current active source
  const [currentServerIndex, setCurrentServerIndex] = useState(
    sources.findIndex((s) => s.id === initialServerId) || 0
  );
  console.log("sources", sources);
  const activeServer =
    currentServerIndex >= 0 && currentServerIndex < sources.length
      ? sources[currentServerIndex]
      : { file: "", type: "" };

  console.log("currentServerIndex", currentServerIndex);
  console.log("activeServer", activeServer);
  useEffect(() => {
    if (sources.length > 0 && currentServerIndex === -1) {
      console.log("Fixing index from -1 to 0");
      setCurrentServerIndex(0);
    }
  }, [sources, currentServerIndex]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activeServer.file) return;

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
    const handleBufferingStart = () => setIsBuffering(true);
    const handleBufferingEnd = () => setIsBuffering(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    // NEW: Handle when video is ready to play
    const handleCanPlay = () => {
      setIsLoading(false);
    };

    // NEW: Handle when video starts loading
    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleFullscreenChange = () => {
      const fsElement = document.fullscreenElement;
      setIsFullscreen(fsElement === video.parentElement);
    };
    try {
      // Handle HLS sources
      if (activeServer.type === "hls" && Hls.isSupported()) {
        const hls = new Hls({
          // debug: true, // Enable for debugging
          xhrSetup: (xhr) => {
            xhr.withCredentials = false;
          },
        });

        // hls.on(Hls.Events.ERROR, (event, data) => {
        //   console.error("HLS Error:", data);
        //   setIsLoading(false);
        //   if (data.fatal) {
        //     switch (data.type) {
        //       case Hls.ErrorTypes.NETWORK_ERROR:
        //         console.error("Network error - URL might be invalid");
        //         hls.startLoad();
        //         break;
        //       case Hls.ErrorTypes.MEDIA_ERROR:
        //         console.error("Media error");
        //         hls.recoverMediaError();
        //         break;
        //       default:
        //         hls.destroy();
        //         break;
        //     }
        //   }
        // });
        hls.on(Hls.Events.ERROR, (event, data) => {
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
        hls.loadSource(activeServer.file);
        hls.attachMedia(video);
        hlsRef.current = hls;
        // hls.on(Hls.Events.MANIFEST_PARSED, () => {
        //   console.log("hls.audioTracks →", hls.audioTracks);

        //   video.muted = isMuted;
        //   video.play().catch((err) => console.warn("Autoplay failed:", err));
        // });

        hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
          setQuality(data.levels); // now populated
        });
        hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, (_, data) => {
          setSubtitles(data.subtitleTracks);
        });
        hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, (_, data) => {
          setAudioTracks(data.audioTracks);

          // Auto-select based on original language
          // Filter tracks by matching language first
          const languageMatchTracks = data.audioTracks
            .map((track, index) => ({ track, index }))
            .filter(({ track }) => track.lang === language);

          if (languageMatchTracks.length === 0) return;

          // Prioritize tracks with "[Original]" in the name and exclude "Audio Description"
          const originalTrack = languageMatchTracks.find(
            ({ track }) =>
              (track.name.toLowerCase().includes("[original]") ||
                track.name.toLowerCase().includes("original")) &&
              !track.name.toLowerCase().includes("audio description")
          );

          // If found, select it; otherwise select the first matching language track
          const selectedTrack = originalTrack || languageMatchTracks[0];

          setSelectedAudio(selectedTrack.index);
          hls.audioTrack = selectedTrack.index;
        });
        // NEW: Listen for when HLS is ready
        hls.on(Hls.Events.MANIFEST_LOADED, () => {
          setIsLoading(false);
        });
      } else if (activeServer.type === "mp4") {
        video.src = activeServer.file;
        video.onerror = () => {
          console.error("MP4 failed → switching server...");
          switchToNextServer();
        };
      }
      video.addEventListener("timeupdate", updateProgress);
      video.addEventListener("progress", updateProgress);
      video.addEventListener("waiting", handleBufferingStart); // video is buffering
      video.addEventListener("playing", handleBufferingEnd); // resumed
      video.addEventListener("play", handlePlay);
      video.addEventListener("pause", handlePause);
      video.addEventListener("canplay", handleCanPlay); // NEW
      video.addEventListener("loadstart", handleLoadStart); // NEW
      document.addEventListener("fullscreenchange", handleFullscreenChange);
    } catch (err) {
      console.error("Video setup error:", err);
      setIsLoading(false);
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
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("canplay", handleCanPlay); // NEW
      video.removeEventListener("loadstart", handleLoadStart); // NEW
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [activeServer.file]);

  useEffect(() => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = selectedQualty;
    }
  }, [selectedQualty]);

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
  const switchToNextServer = () => {
    if (currentServerIndex + 1 < sources.length) {
      console.warn("Switching to backup server...");
      setCurrentServerIndex((prev) => prev + 1); // trigger reload
    } else {
      console.error("All servers failed.");
    }
  };
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
  }, [id, activeServer.file]);

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
    handleVolumeChange,
    volume,
    isMuted,
    toggleMute,
    toggleFullscreen,
    isFullscreen,

    //IF M3U8 A MASTER PLAYLIST
    subtitles,
    setSubtitles,
    audioTracks,
    setAudioTracks,
    quality,
    setQuality,
    //
    selectedQualty,
    setSelectedQualty,
    selectedSubtitle,
    setSelectedSubtitle,
    selectedAudio,
    setSelectedAudio,

    //
    currentServerIndex,
    setCurrentServerIndex,
  };
}
