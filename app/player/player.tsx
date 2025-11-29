import { Stream, Streams } from "@/hook/api-hook/local-fetch";
import { Subtitle } from "@/hook/api-hook/subtitle-hooks";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { useVideoSetup } from "@/hook/player-setup";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useVideoSlider } from "@/hook/player-slider";
import { useHiddenOverlay } from "@/lib/hide-overlay";
import { MovieTypes } from "@/types/movie-by-id";
import { Ring } from "ldrs/react";
import "ldrs/react/Ring.css";
import { Bouncy } from "ldrs/react";
import "ldrs/react/Bouncy.css";
import { useCallback, useEffect, useRef, useState } from "react";
import PlayerMetaData from "./player-metadata";
import {
  ArrowLeft,
  ArrowRight,
  GalleryVerticalEnd,
  HardDrive,
  Maximize,
  Minimize,
  Pause,
  Play,
  RedoDot,
  Settings,
  UndoDot,
  Volume2,
  VolumeX,
} from "lucide-react";
import PlayerSubtitle from "./player-subtitle";

import { SourceResponse } from "@/hook/api-hook/source";

import { useSubtitleUrl } from "@/hook/subtitle";
import { cn } from "@/lib/utils";
import Recommendations from "./recommendation";
import PlayerAudioTrack from "./player-audio";
import PlayerQualitySelector from "./player-quality-selector";
import PlayerServer from "./player-server";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";

export default function ZXCPlayer({
  subtitleQuery,
  metaData,
  sourceData,
  sourceLoading,
}: {
  subtitleQuery: Subtitle[];
  metaData: MovieTypes | null;
  sourceData: SourceResponse | null;
  sourceLoading: boolean;
}) {
  const router = useRouter();
  const { params } = useParams();
  const media_type = String(params?.[0]);
  const id = Number(params?.[1]);
  const season = Number(params?.[2]) || 1;
  const episode = Number(params?.[3]) || 1;
  const language = params?.[4] || "en"; // keep as string
  const [selectedServer, setSelectedServer] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [list, setList] = useState(true);
  //HIDDEN OVERLAY HOOK
  const { isVisible, showOverlay, resetTimer } = useHiddenOverlay(3000);
  const handleInteraction = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  const {
    videoRef,
    progress,
    handleSliderChange,
    bufferedProgress,
    isBuffering,
    isLoading,
    togglePlay,
    isPlaying,
    isEnding,
    handleVolumeChange,
    toggleMute,
    volume,
    isMuted,
    toggleFullscreen,
    isFullscreen,
    jumpForward10,
    jumpBack10,

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
  } = useVideoSetup({ sources: sourceData?.sources ?? [] });
  const recommendations = metaData?.recommendations.results ?? [];
  const handleClick = useCallback(() => {
    togglePlay(); // Play/pause anywhere
    resetTimer(); // Keep your overlay behavior
  }, [togglePlay, resetTimer]);

  const [selectedSub, setSelectedSub] = useState<string>("");
  const englishSubLink = subtitleQuery.find((en) => en.language === "en")?.url;

  useEffect(() => {
    if (englishSubLink && selectedSub === "" && sourceData) {
      setSelectedSub(englishSubLink);
    }
  }, [sourceData]);

  const parentVariants = {
    hover: { width: 160 },
    initial: { width: 40 },
  };

  const childVariants = {
    hover: { opacity: 1 },
    initial: { opacity: 0 },
  };

  const vttUrl = useSubtitleUrl(selectedSub);
  return (
    <div
      ref={containerRef}
      className="h-dvh w-full relative bg-black overflow-hidden"
      onMouseMove={handleInteraction}
      onMouseEnter={showOverlay}
      onTouchStart={handleInteraction}
      // onClick={handleClick}
    >
      {sourceLoading ? (
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-20">
          {/* <Ring size="80" stroke="8" bgOpacity="0" speed="2" color="white" /> */}

          <div className="flex justify-center items-center flex-col gap-6">
            <Bouncy size="45" speed="1.75" color="white" />
            <p className="animate-pulse">Gathering resources ...</p>
          </div>
        </div>
      ) : !sourceData?.sources ? (
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-20">
          {/* <Ring size="80" stroke="8" bgOpacity="0" speed="2" color="white" /> */}

          <div className="flex justify-center items-end  gap-3">
            <h1 className="text-4xl tracking-widest font-bold">404.</h1>
            <p className="text-muted-foreground">No resources found</p>
          </div>
        </div>
      ) : (
        <>
          <video className="h-full w-full" autoPlay ref={videoRef}>
            {vttUrl && (
              <track key={vttUrl} kind="subtitles" src={vttUrl} default />
            )}
          </video>

          <div
            className={`absolute inset-0 bg-/50 transition-opacity duration-300 pointer-events-none ${
              isVisible || !isPlaying || isEnding ? "opacity-100" : "opacity-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-20 "
              animate={{ y: list ? 0 : -180 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {isBuffering || isLoading ? (
                <Ring
                  size="80"
                  stroke="8"
                  bgOpacity="0"
                  speed="2"
                  color="white"
                />
              ) : (
                <span
                  onClick={togglePlay}
                  className="pointer-events-auto cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause
                      className="lg:size-12 size-8 fill-current hover:scale-110 duration-200 transition active:scale-95"
                      strokeWidth={1.5}
                    />
                  ) : (
                    <Play
                      className="lg:size-12 size-8 fill-current hover:scale-110 duration-200 transition active:scale-95"
                      strokeWidth={1.5}
                    />
                  )}
                </span>
              )}
            </motion.div>

            <div className="absolute inset-x-0 lg:top-8 top-4 lg:px-10 p-4 flex justify-end items-center ">
              {/* <ArrowLeft
                strokeWidth={1.5}
                className="lg:size-8 size-6 cursor-pointer"
              /> */}
              <div className="flex lg:gap-8 gap-4 items-center">
                {audioTracks.length > 0 && (
                  <PlayerAudioTrack
                    isVisible={isVisible}
                    isPlaying={isPlaying}
                    audioTracks={audioTracks}
                    setAudioTrack={setAudioTracks}
                    selectedAudio={selectedAudio}
                    setSelectedAudio={setSelectedAudio}
                  />
                )}
                {quality.length > 0 && (
                  <PlayerQualitySelector
                    isVisible={isVisible}
                    isPlaying={isPlaying}
                    quality={quality}
                    setQuality={setQuality}
                    selectedQualty={selectedQualty}
                    setSelectedQualty={setSelectedQualty}
                  />
                )}
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 lg:px-10 p-4  ">
              <div className="">
                <div className="flex items-end justify-between">
                  <PlayerMetaData metaData={metaData} />
                  {isEnding && (
                    <Button
                      className="pointer-events-auto hover:scale-110 duration-200 transition active:scale-95"
                      onClick={() =>
                        router.push(
                          media_type === "tv"
                            ? `/player/tv/${id}/${season}/${episode + 1}`
                            : `/player/movie/${id}`
                        )
                      }
                    >
                      Next Episode <ArrowRight />
                    </Button>
                  )}
                </div>
                <div className="flex w-full gap-3 mt-10">
                  <span className="lg:hidden block">
                    {formatTime(videoRef.current?.currentTime || 0)}
                  </span>
                  <div className="group h-6 flex flex-1 justify-center items-center relative pointer-events-auto transition-all duration-200">
                    <Slider
                      value={[bufferedProgress]}
                      max={100}
                      step={1}
                      className={cn(
                        "absolute opacity-50",
                        "group-hover:**:data-[slot=slider-track]:h-3 [&>:last-child>span]:hidden"
                      )}
                    />
                    <Slider
                      value={[progress]}
                      onValueChange={handleSliderChange}
                      max={100}
                      step={1}
                      className={cn(
                        "**:data-[slot=slider-thumb]:shadow-none [&>:last-child>span]:h-4.5 [&>:last-child>span]:w-2 [&>:last-child>span]:border-[3px] [&>:last-child>span]:border-primary [&>:last-child>span]:bg-primary [&>:last-child>span]:ring-offset-0  cursor-pointer group-hover:[&>:last-child>span]:h-6",
                        "group-hover:**:data-[slot=slider-track]:h-3 cursor-grab active:cursor-grabbing"
                      )}
                    />
                  </div>
                  <span className="lg:hidden block">
                    {formatTime(videoRef.current?.duration || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-8">
                  <div className="flex lg:gap-8 gap-4 pointer-events-auto">
                    <UndoDot
                      onClick={jumpBack10}
                      strokeWidth={1.5}
                      className="lg:size-8 size-6 cursor-pointer hover:scale-110 duration-200 transition active:scale-95"
                    />
                    <RedoDot
                      onClick={jumpForward10}
                      strokeWidth={1.5}
                      className="lg:size-8 size-6 cursor-pointer hover:scale-110 duration-200 transition active:scale-95"
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
                          <VolumeX
                            strokeWidth={1.5}
                            className="lg:size-8 size-6 hover:scale-110 duration-200 transition active:scale-95"
                          />
                        ) : (
                          <Volume2
                            strokeWidth={1.5}
                            className="lg:size-8 hover:scale-110 duration-200 transition active:scale-95 size-6"
                          />
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
                          className="cursor-grab active:cursor-grabbing"
                        />
                      </motion.div>
                    </motion.div>
                    <div className="lg:flex hidden items-center gap-3 ">
                      <span>
                        {formatTime(videoRef.current?.currentTime || 0)}
                      </span>{" "}
                      /
                      <span>{formatTime(videoRef.current?.duration || 0)}</span>
                    </div>
                  </div>
                  <div className="flex lg:gap-10 gap-4">
                    <GalleryVerticalEnd
                      onClick={() => setList((prev) => !prev)}
                      strokeWidth={1.5}
                      className={`lg:size-8 size-6 pointer-events-auto hover:scale-110 duration-200 transition active:scale-95  ${
                        list ? "" : "text-red-600 scale-120"
                      }`}
                    />
                    <PlayerSubtitle
                      subtitleQuery={subtitleQuery}
                      selectedSub={selectedSub}
                      setSelectedSub={setSelectedSub}
                      isVisible={isVisible}
                      isPlaying={isPlaying}
                    />

                    <PlayerServer
                      isVisible={isVisible}
                      isPlaying={isPlaying}
                      sourceData={sourceData}
                      setQuality={setQuality}
                      selectedServer={selectedServer}
                      setSelectedServer={setSelectedServer}
                    />
                    <span
                      onClick={toggleFullscreen}
                      className="pointer-events-auto cursor-pointer"
                    >
                      {isFullscreen ? (
                        <Minimize
                          strokeWidth={1.5}
                          className="lg:size-9 size-6 hover:scale-110 duration-200 transition active:scale-95"
                        />
                      ) : (
                        <Maximize
                          strokeWidth={1.5}
                          className="lg:size-9 size-6 hover:scale-110 duration-200 transition active:scale-95"
                        />
                      )}
                    </span>
                  </div>
                </div>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{
                    height: list ? "0" : "auto",
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden pointer-events-auto lg:mt-8 mt-6"
                >
                  {recommendations.length !== 0 && (
                    <Recommendations recommendations={recommendations} />
                  )}
                </motion.div>
              </div>
            </div>
            <div></div>
          </div>
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
