import { Stream, Streams } from "@/hook/api-hook/local-fetch";
import { Subtitle } from "@/hook/api-hook/subtitle-hooks";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { useVideoSetup } from "@/hook/player-setup";
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
  GalleryVerticalEnd,
  Maximize,
  Minimize,
  Pause,
  Play,
  RedoDot,
  UndoDot,
  Volume2,
  VolumeX,
} from "lucide-react";
import PlayerSubtitle from "./player-subtitle";

import { SourceResponse } from "@/hook/api-hook/source";

import { useSubtitleUrl } from "@/hook/subtitle";
import { cn } from "@/lib/utils";
import Recommendations from "./recommendation";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [list, setList] = useState(false);
  //HIDDEN OVERLAY HOOK
  const { isVisible, showOverlay, resetTimer } = useHiddenOverlay(2000);
  const handleInteraction = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  const {
    videoRef,
    progress,
    handleSliderChange,
    bufferedProgress,
    isBuffering,
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
  } = useVideoSetup({
    sourceLink: sourceData?.sources[1].file ?? "",
    sourceType: sourceData?.sources[1].type ?? "",
  });
  const recommendations = metaData?.recommendations.results ?? [];
  const handleClick = useCallback(() => {
    togglePlay(); // Play/pause anywhere
    resetTimer(); // Keep your overlay behavior
  }, [togglePlay, resetTimer]);

  const [selectedSub, setSelectedSub] = useState<string>("");
  const englishSubLink = subtitleQuery.find((en) => en.language === "en")?.url;

  useEffect(() => {
    if (englishSubLink && selectedSub === "" && sourceData) {
      console.log("meow");
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
  console.log("isBuffering", isBuffering);
  const vttUrl = useSubtitleUrl(selectedSub);
  return (
    <div
      ref={containerRef}
      className="h-dvh w-full relative bg-black overflow-hidden"
      onMouseMove={handleInteraction}
      onMouseEnter={showOverlay}
      onTouchStart={handleInteraction}
      onClick={handleClick}
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
          {" "}
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
              animate={{ height: list ? "50px" : "600px" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {isBuffering ? (
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
                      className="lg:size-12 size-6 fill-current"
                      strokeWidth={1.5}
                    />
                  ) : (
                    <Play
                      className="lg:size-12 size-6 fill-current"
                      strokeWidth={1.5}
                    />
                  )}
                </span>
              )}
            </motion.div>
            <div className="absolute inset-x-0 bottom-0 lg:p-10 p-6  ">
              <div className="space-y-10">
                <PlayerMetaData metaData={metaData} />

                <div className="group h-6 flex justify-center items-center relative pointer-events-auto transition-all duration-200">
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
                      "group-hover:**:data-[slot=slider-track]:h-3"
                    )}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex lg:gap-8 gap-4">
                    <div className="flex gap-6 items-cente pointer-events-auto">
                      <UndoDot
                        onClick={jumpBack10}
                        strokeWidth={1.5}
                        className="lg:size-8 size-6"
                      />
                      <RedoDot
                        onClick={jumpForward10}
                        strokeWidth={1.5}
                        className="lg:size-8 size-6"
                      />
                    </div>
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
                            className="lg:size-8 size-6"
                          />
                        ) : (
                          <Volume2
                            strokeWidth={1.5}
                            className="lg:size-8 size-6"
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
                        />
                      </motion.div>
                    </motion.div>
                    <div className="flex items-center gap-3 ">
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
                      className="lg:size-8 size-6 pointer-events-auto"
                    />
                    <PlayerSubtitle
                      subtitleQuery={subtitleQuery}
                      selectedSub={selectedSub}
                      setSelectedSub={setSelectedSub}
                      isVisible={isVisible}
                    />
                    <span
                      onClick={toggleFullscreen}
                      className="pointer-events-auto cursor-pointer"
                    >
                      {isFullscreen ? (
                        <Minimize
                          strokeWidth={1.5}
                          className="lg:size-9 size-6"
                        />
                      ) : (
                        <Maximize
                          strokeWidth={1.5}
                          className="lg:size-9 size-6"
                        />
                      )}
                    </span>
                  </div>
                </div>
                <motion.div
                  animate={{ height: list ? "0" : "auto" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden pointer-events-auto"
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
