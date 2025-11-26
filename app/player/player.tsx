import { Stream, Streams } from "@/api/local-fetch";
import { Subtitle } from "@/api/subtitle-hooks";

import { Slider } from "@/components/ui/slider";
import { useVideoSetup } from "@/hook/player-setup";
import { useVideoSlider } from "@/hook/player-slider";
import { useHiddenOverlay } from "@/lib/hide-overlay";
import { MovieTypes } from "@/types/movie-by-id";
import { Ring } from "ldrs/react";
import "ldrs/react/Ring.css";
import { useCallback, useEffect, useRef, useState } from "react";
import PlayerMetaData from "./player-metadata";
import {
  ArrowLeft,
  ArrowRight,
  GalleryVerticalEnd,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import PlayerSubtitle from "./player-subtitle";
import { Button } from "@/components/ui/button";
import QualitySelector from "./player-quality";
import { SourceResponse } from "@/api/source";
import { srtToVtt } from "@/lib/subs-converter";
import { useSubtitleUrl } from "@/hook/subtitle";

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

  //HIDDEN OVERLAY HOOK
  const { isVisible, showOverlay, resetTimer } = useHiddenOverlay(5000);
  const handleInteraction = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  const videoRef = useVideoSetup(sourceData);
  const {
    progress,
    handleSliderChange,
    togglePlay,
    isPlaying,
    volume,
    handleVolumeChange,
    isMuted,
    toggleMute,
    isBuffering,
    isFullscreen,
    toggleFullscreen,
    isEnding,
  } = useVideoSlider(videoRef);

  const handleClick = useCallback(() => {
    togglePlay(); // Play/pause anywhere
    resetTimer(); // Keep your overlay behavior
  }, [togglePlay, resetTimer]);

  const [selectedSub, setSelectedSub] = useState<string>("");
  const englishSubLink = subtitleQuery.find((en) => en.language === "en")?.url;
  const vttUrl = useSubtitleUrl(englishSubLink || selectedSub);
  useEffect(() => {
    if (englishSubLink && vttUrl === "" && sourceData) {
      setSelectedSub(englishSubLink);
    }
  }, [sourceData]);
  return (
    <div
      ref={containerRef}
      className="h-dvh w-full relative bg-black overflow-hidden"
      onMouseMove={handleInteraction}
      onMouseEnter={showOverlay}
      onTouchStart={handleInteraction}
      onClick={handleClick}
    >
      <video className="h-full w-full" autoPlay ref={videoRef}>
        {vttUrl && <track key={vttUrl} kind="subtitles" src={vttUrl} default />}
      </video>
      {(isBuffering || sourceLoading) && (
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-20">
          <Ring size="80" stroke="8" bgOpacity="0" speed="2" color="white" />
        </div>
      )}
      {/* Overlay with transition */}
      {!sourceLoading && (
        <div
          className={`absolute inset-0 bg-background/50 transition-opacity duration-300 pointer-events-none ${
            isVisible || !isPlaying || isEnding ? "opacity-100" : "opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute top-0 lg:p-10 p-4 flex justify-end inset-x-0">
            {isEnding && (
              <Button>
                Next Episode <ArrowRight />
              </Button>
            )}
          </div>

          <div className="absolute inset-x-0 bottom-0 lg:p-10 p-4 space-y-10">
            <PlayerMetaData metaData={metaData} />

            <div className="flex justify-between items-center">
              <div className="flex gap-6">
                <span onClick={togglePlay} className="pointer-events-auto">
                  {isPlaying ? <Pause /> : <Play />}
                </span>
                <div className="flex gap-3 lg:w-50 w-35">
                  <span
                    className="pointer-events-auto cursor-pointer"
                    onClick={toggleMute}
                  >
                    {isMuted || volume === 0 ? <VolumeX /> : <Volume2 />}
                  </span>
                  <Slider
                    max={100}
                    step={1}
                    className="flex-1 pointer-events-auto"
                    value={[volume]}
                    onValueChange={handleVolumeChange}
                  />
                </div>
              </div>
              <div className="flex gap-10">
                <GalleryVerticalEnd />
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
                  {isFullscreen ? <Minimize2 /> : <Maximize2 />}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4  ">
              <span>{formatTime(videoRef.current?.currentTime || 0)}</span>
              <Slider
                value={[progress]}
                onValueChange={handleSliderChange}
                max={100}
                step={1}
                className="**:data-[slot=slider-thumb]:shadow-none [&>:last-child>span]:h-6 [&>:last-child>span]:w-3 [&>:last-child>span]:border-[3px] [&>:last-child>span]:border-background [&>:last-child>span]:bg-primary [&>:last-child>span]:ring-offset-0 pointer-events-auto cursor-pointer"
              />
              <span>{formatTime(videoRef.current?.duration || 0)}</span>
            </div>
          </div>
          <div></div>
        </div>
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
