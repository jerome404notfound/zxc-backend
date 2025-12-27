"use client";
import useSource from "@/hook/source";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Tailspin } from "ldrs/react";
import "ldrs/react/Tailspin.css";
import Hls, { Level } from "hls.js";
import { AnimatePresence, motion } from "framer-motion";
import {
  IconArrowBackUp,
  IconArrowLeft,
  IconCheck,
  IconChevronLeft,
  IconCloud,
  IconCloudFilled,
  IconGhost2Filled,
  IconMaximize,
  IconMinimize,
  IconPictureInPictureOff,
  IconPictureInPictureOn,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconRewindBackward10,
  IconRewindForward10,
  IconSubtitles,
} from "@tabler/icons-react";
import useMovieById from "@/hook/get-movie-by-id";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, Volume2, VolumeX } from "lucide-react";
import { useHiddenOverlay } from "@/lib/hide-overlay";
import { useFullscreen } from "@/lib/player-fullscreen";
import { useSubtitleUrl } from "@/hook/subtitle";
import { useLibreSubsTV } from "@/hook/subtitle-hooks";
import PlayerSubtitle from "../player-subtitle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PlayerSettings from "../settings";
export default function WatchMode() {
  const searchParams = useSearchParams();
  const backButton = searchParams.get("back");
  const { params } = useParams();
  const media_type = String(params?.[0]);
  const id = Number(params?.[1]);
  const season = Number(params?.[2]) || 1;
  const episode = Number(params?.[3]) || 1;
  const [server, setServer] = useState(1);
  const [serversFailed, setServersFailed] = useState(false);

  const servers = [
    { name: "Server 1", server: 1 },
    { name: "Server 2", server: 2 },
    { name: "Server 3", server: 3 },
    { name: "Server 4", server: 4 },
  ];

  const { data, isLoading } = useSource({
    media_type,
    id,
    season,
    episode,
    server,
  });

  useEffect(() => {
    if (isLoading) return;

    if (data?.success) return;

    if (server < servers.length) {
      setServer((prev) => prev + 1);
    } else {
      setServersFailed(true);
    }
  }, [isLoading, server, data]);
  const { data: metadata, isLoading: metaLoading } = useMovieById({
    media_type,
    id,
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);
  const [buffered, setBuffered] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const isSeekingRef = useRef(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(100);
  const [volume, setVolume] = useState(isMuted ? 0 : prevVolume);
  const [isPiP, setIsPiP] = useState(false);
  const [subtitleOffset, setSubtitleOffset] = useState(0); // in seconds
  const [quality, setQuality] = useState<Level[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<number>(-1);
  const hlsRef = useRef<Hls | null>(null);
  const [qualityLoading, setQualityLoading] = useState(false);
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !data?.link) return;

    // Destroy previous HLS instance if exists
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (data.type === "hls") {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(data.link);
        hls.attachMedia(video);
        hlsRef.current = hls;
        hls.on(Hls.Events.LEVEL_SWITCHING, () => setQualityLoading(true));
        hls.on(Hls.Events.LEVEL_SWITCHED, () => setQualityLoading(false));
        hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
          video.play().catch(() => {});
          setQuality(data.levels);
        });

        return () => {
          hls.destroy();
          hlsRef.current = null;
        };
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = data.link;
        video.play().catch(() => {});
      }
    } else {
      video.src = data.link;
      video.play().catch(() => {});
    }
  }, [data]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !data?.link) return;

    const onTimeUpdate = () => {
      if (!isSeekingRef.current) {
        setCurrentTime(video.currentTime);
      }
    };
    const updateBuffered = () => {
      let end = 0;
      for (let i = 0; i < video.buffered.length; i++) {
        end = Math.max(end, video.buffered.end(i));
      }
      setBuffered(end / video.duration);
    };

    const onLoadedMetadata = () => {
      if (!isFinite(video.duration)) return;

      setDuration(video.duration);
      updateBuffered(); // initialize buffered bar
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    const handleCanPlay = () => setIsInitializing(false);
    const handleLoadStart = () => setIsInitializing(true);

    const handleBufferingStart = () => setIsBuffering(true);
    const handleBufferingEnd = () => setIsBuffering(false);

    const onEnterPiP = () => setIsPiP(true);
    const onLeavePiP = () => setIsPiP(false);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("progress", updateBuffered);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("canplay", handleCanPlay); // NEW
    video.addEventListener("loadstart", handleLoadStart); // NEW

    video.addEventListener("waiting", handleBufferingStart); // video is buffering
    video.addEventListener("playing", handleBufferingEnd); // resumed
    video.addEventListener("enterpictureinpicture", onEnterPiP);
    video.addEventListener("leavepictureinpicture", onLeavePiP);
    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("progress", updateBuffered);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("canplay", handleCanPlay); // NEW
      video.removeEventListener("loadstart", handleLoadStart); // NEW

      video.removeEventListener("waiting", handleBufferingStart);
      video.removeEventListener("playing", handleBufferingEnd);

      video.removeEventListener("enterpictureinpicture", onEnterPiP);
      video.removeEventListener("leavepictureinpicture", onLeavePiP);
    };
  }, [data]);
  useEffect(() => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = selectedQuality;
    }
  }, [selectedQuality]);
  console.log("qaaa", quality);
  const timeString = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const { isVisible, showOverlay, resetTimer, setIsHovered } =
    useHiddenOverlay(3000);
  const handleInteraction = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  const handleSeekChange = (value: number[]) => {
    isSeekingRef.current = true;
    setCurrentTime(value[0]); // preview thumb position
  };
  const handleSeekCommit = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = value[0];
    isSeekingRef.current = false;
  };
  const handleSliderHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current || !duration) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;

    const percent = Math.min(Math.max(x / rect.width, 0), 1);
    const time = percent * duration;

    setHoverX(x);
    setHoverTime(time);
  };

  const clearHover = () => {
    setHoverTime(null);
  };
  // play video
  const playVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});
    setIsPlaying(true);
  };

  // pause video
  const pauseVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    setIsPlaying(false);
  };

  // toggle
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) playVideo();
    else pauseVideo();
  };
  const jumpForward10 = () => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = Math.min(video.currentTime + 10, duration);
    video.currentTime = newTime;
    setCurrentTime(newTime); // update slider
  };

  const jumpBackward10 = () => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = Math.max(video.currentTime - 10, 0);
    video.currentTime = newTime;
    setCurrentTime(newTime); // update slider
  };
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        togglePlay();
      }

      if (e.code === "ArrowLeft") {
        jumpBackward10();
      }

      if (e.code === "ArrowRight") {
        jumpForward10();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, jumpBackward10, jumpForward10]);
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
  const [selectedSub, setSelectedSub] = useState<string>("");

  const { isLoading: isLoading_sub, data: data_sub } = useLibreSubsTV({
    imdbId: metadata?.external_ids?.imdb_id ?? "",
    season: media_type === "tv" ? season : undefined,
    episode: media_type === "tv" ? episode : undefined,
  });

  const vttUrl = useSubtitleUrl(selectedSub);

  const handleClick = useCallback(() => {
    togglePlay(); // Play/pause anywhere
    resetTimer(); // Keep your overlay behavior
  }, [togglePlay, resetTimer]);

  const parentVariants = {
    hover: { width: 160 },
    initial: { width: 40 },
  };

  const childVariants = {
    hover: { opacity: 1 },
    initial: { opacity: 0 },
  };
  const togglePiP = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (document.pictureInPictureElement) {
        // Exit PiP
        await document.exitPictureInPicture();
        setIsPiP(false);
      } else {
        // Enter PiP
        await video.requestPictureInPicture();
        setIsPiP(true);
      }
    } catch (err) {
      console.error("PiP failed:", err);
    }
  };
  const router = useRouter();

  // Apply subtitle offset to native text tracks
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tracks = video.textTracks;
    if (tracks.length === 0) return;

    const track = tracks[0];
    if (!track.cues) return;

    // Store original times on first load
    for (let i = 0; i < track.cues.length; i++) {
      const cue = track.cues[i] as any;
      if (cue.originalStartTime === undefined) {
        cue.originalStartTime = cue.startTime;
        cue.originalEndTime = cue.endTime;
      }
    }

    // Apply offset to all cues
    for (let i = 0; i < track.cues.length; i++) {
      const cue = track.cues[i] as any;
      cue.startTime = cue.originalStartTime + subtitleOffset;
      cue.endTime = cue.originalEndTime + subtitleOffset;
    }
  }, [subtitleOffset, vttUrl, selectedSub]);
  return (
    <div
      ref={containerRef}
      onMouseMove={handleInteraction}
      onMouseEnter={showOverlay}
      onTouchStart={handleInteraction}
      onClick={handleClick}
      className="h-dvh overflow-hidden bg-black text-gray-300"
    >
      {backButton && isVisible && (
        <div
          className="absolute top-0 left-0 z-10 py-6 px-3"
          onClick={(e) => {
            e.stopPropagation();
            router.back();
          }}
        >
          <IconArrowLeft className="lg:size-10 size-8" />
        </div>
      )}

      <div className="absolute top-0 right-0 z-10 lg:p-6 p-4 flex items-center gap-4">
        {selectedSub && (
          <Button
            variant="outline"
            className=" justify-between backdrop-blur-md bg-background/20! border-0"
          >
            {data_sub?.find((f) => f.url === selectedSub)?.display}
          </Button>
        )}
        {quality && (
          <Button
            variant="outline"
            className=" justify-between backdrop-blur-md bg-background/20! border-0"
          >
            {quality.find((_, idx) => idx === selectedQuality)?.height ||
              "Auto"}
            {selectedQuality !== -1 && "p"}
          </Button>
        )}
        {server && (
          <Button
            variant="outline"
            className=" justify-between backdrop-blur-md bg-background/20! border-0"
          >
            Server {server}
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="relative h-full w-full">
          {metadata && (
            <img
              className="h-full w-full object-cover brightness-50"
              src={`https://image.tmdb.org/t/p/w1280/${metadata.backdrop_path}`}
              alt=""
            />
          )}

          <div className="absolute z-10 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
            <Tailspin size="80" stroke="7" speed="0.9" color="white" />
          </div>
        </div>
      ) : (
        <>
          <div className="relative h-full w-full">
            <AnimatePresence>
              {(isInitializing || isBuffering || qualityLoading) && (
                <motion.div
                  key="loader"
                  className="absolute z-10 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
                  initial={{ opacity: 0, scale: 1.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.5 }}
                  transition={{ duration: 0.05 }}
                >
                  {serversFailed ? (
                    <div className="flex justify-center items-center flex-col gap-3">
                      <IconGhost2Filled className="size-12 animate-bounce" />
                      <p className="font-medium">All servers failed.</p>
                      <Button variant="secondary" asChild>
                        <Link
                          href={`/embed/${media_type}/${id}${
                            media_type === "tv" ? `/${season}/${episode}` : ""
                          }`}
                        >
                          Use Backup Player <ArrowRight />
                        </Link>
                      </Button>
                      <Link
                        target="_blank"
                        className="underline text-sm text-blue-400"
                        href={`https://t.me/+AZZmZ7-_SFsxM2M9`}
                      >
                        or contact us
                      </Link>
                    </div>
                  ) : (
                    <Tailspin size="80" stroke="7" speed="0.9" color="white" />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            <video autoPlay className="h-full w-full bg-black" ref={videoRef}>
              {vttUrl && !isInitializing && (
                <track
                  key={`${vttUrl}-${server}`}
                  kind="subtitles"
                  src={vttUrl}
                  default
                />
              )}
            </video>
          </div>
          {!serversFailed && (
            <div
              className={`absolute bottom-0 inset-x-0 lg:p-6 p-4  duration-500 transition-all  ${
                isVisible
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }`}
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="flex justify-between items-end gap-6">
                <div className=" max-w-3xs lg:max-w-2xl">
                  <p className="text-muted-foreground lg:text-lg">
                    You're watching
                  </p>
                  <h1 className="scroll-m-20 lg:text-4xl text-3xl font-extrabold tracking-tight text-balance pb-2 text-foreground ">
                    {metadata?.title || metadata?.name} (
                    {(
                      metadata?.release_date || metadata?.first_air_date
                    )?.slice(0, 4)}
                    )
                  </h1>
                </div>

                <div className="flex gap-6 items-end lg:flex-row flex-col-reverse">
                  {data_sub && (
                    <PlayerSettings
                      data_sub={data_sub}
                      selectedSub={selectedSub}
                      setSelectedSub={setSelectedSub}
                      subtitleOffset={subtitleOffset}
                      setSubtitleOffset={setSubtitleOffset}
                      quality={quality}
                      selectedQualty={selectedQuality}
                      setSelectedQualty={setSelectedQuality}
                      servers={servers}
                      server={server}
                      setServer={setServer}
                    />
                  )}
                  {!isInitializing && (
                    <span onClick={togglePiP}>
                      {isPiP ? (
                        <IconPictureInPictureOn className="lg:size-10 size-8 " />
                      ) : (
                        <IconPictureInPictureOff className="lg:size-10 size-8 " />
                      )}
                    </span>
                  )}
                  <span
                    onClick={toggleFullscreen}
                    className="pointer-events-auto cursor-pointer"
                  >
                    {isFullscreen ? (
                      <IconMinimize className="lg:size-10 size-8 " />
                    ) : (
                      <IconMaximize className="lg:size-10 size-8" />
                    )}
                  </span>
                </div>
              </div>
              <div
                ref={sliderRef}
                className="relative mt-5"
                onMouseMove={handleSliderHover}
                onMouseLeave={clearHover}
              >
                <div className="absolute inset-0 rounded ">
                  <div
                    className="h-full bg-muted-foreground rounded"
                    style={{ width: `${buffered * 100}%` }}
                  />
                </div>
                {/* Tooltip */}
                {hoverTime !== null && (
                  <div
                    className="absolute -top-8 px-2 py-1 text-xs rounded bg-black text-white pointer-events-none"
                    style={{ left: hoverX, transform: "translateX(-50%)" }}
                  >
                    {formatTime(hoverTime)}
                  </div>
                )}

                <Slider
                  value={[currentTime]}
                  max={duration}
                  step={0.1}
                  onValueChange={handleSeekChange}
                  onValueCommit={handleSeekCommit}
                  className="relative z-10"
                />
              </div>

              <div className="flex justify-between w-full items-center mt-3">
                <span>{formatTime(currentTime)}</span>
                <span>
                  - {formatTime(duration - currentTime)} / {timeString}
                </span>
              </div>
              <div className="mt-3 flex gap-6 items-center w-full  ">
                <IconRewindBackward10
                  onClick={jumpBackward10}
                  className="lg:size-9 size-7 text-foreground/60 active:text-foreground transition duration-100"
                />
                <div onClick={togglePlay}>
                  <AnimatePresence mode="wait">
                    {isPlaying ? (
                      <motion.div
                        key="pause"
                        initial={{ opacity: 0, scale: 1.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.5 }}
                        transition={{ duration: 0.05 }}
                      >
                        <IconPlayerPauseFilled className=" lg:size-12 size-9" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="play"
                        initial={{ opacity: 0, scale: 1.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.5 }}
                        transition={{ duration: 0.05 }}
                      >
                        <IconPlayerPlayFilled className="fill-current lg:size-12 size-9" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <IconRewindForward10
                  onClick={jumpForward10}
                  className="lg:size-9 size-7 text-foreground/60 active:text-foreground transition duration-100"
                />

                <motion.div
                  variants={parentVariants}
                  initial="initial"
                  whileHover="hover"
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-3 pointer-events-auto"
                >
                  <span className="cursor-pointer" onClick={toggleMute}>
                    {isMuted || volume === 0 ? (
                      <VolumeX className="lg:size-9 size-8 text-foreground/80" />
                    ) : (
                      <Volume2 className="lg:size-9 size-8 text-foreground/80" />
                    )}
                  </span>

                  <motion.div
                    variants={childVariants}
                    transition={{ duration: 0.1 }}
                    className="flex-1"
                  >
                    <Slider
                      max={100}
                      step={1}
                      value={[volume]}
                      onValueChange={handleVolumeChange}
                    />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(1, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}
