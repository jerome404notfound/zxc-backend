import { Button } from "@/components/ui/button";
import {
  IconCheck,
  IconChevronLeftPipe,
  IconChevronRight,
  IconLanguageKatakana,
  IconMinus,
  IconPlus,
  IconRefresh,
  IconSelector,
  IconSquareRoundedChevronLeft,
  IconSquareRoundedChevronRight,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import PlayerSubtitle from "./player-subtitle";
import { Subtitle } from "@/hook/subtitle-hooks";
import { ArrowLeft } from "lucide-react";

export default function PlayerSettings({
  data_sub,
  selectedSub,
  setSelectedSub,
  subtitleOffset,
  setSubtitleOffset,
}: {
  data_sub: Subtitle[];
  selectedSub: string;
  setSelectedSub: (selectedSub: string) => void;
  subtitleOffset: number; // offset in seconds
  setSubtitleOffset: (offset: number | ((prev: number) => number)) => void;
}) {
  const [open, setOpen] = useState(false);
  const [openSub, setOpenSub] = useState(false);
  const [openTiming, setOpenTiming] = useState(false);
  useEffect(() => {
    if (openSub) {
      setOpenSub(false);
    }
  }, [open]);

  useEffect(() => {
    if (selectedSub) {
      setSubtitleOffset(0);
    }
  }, [selectedSub]);
  return (
    <div className="relative">
      {openSub ? (
        <Button
          onClick={() => setOpenSub(false)}
          variant="outline"
          className="lg:w-48 w-28 justify-between backdrop-blur-md bg-background/20! border-0"
        >
          <ArrowLeft /> Back
          <IconSelector />
        </Button>
      ) : openTiming ? (
        <Button
          onClick={() => setOpenTiming(false)}
          variant="outline"
          className="lg:w-48 w-28 justify-between backdrop-blur-md bg-background/20! border-0"
        >
          <ArrowLeft /> Back
          <IconSelector />
        </Button>
      ) : (
        <Button
          onClick={() => setOpen((p) => !p)}
          variant="outline"
          className="lg:w-48 w-28 justify-between backdrop-blur-md bg-background/20! border-0"
        >
          <IconLanguageKatakana /> Settings
          <IconSelector />
        </Button>
      )}

      {open && (
        <div
          className="absolute bottom-full right-0 lg:right-[unset] rounded-md overflow-hidden lg:left-1/2 lg:-translate-x-1/2 z-50
           min-w-48
           border-white/10   mb-3 "
        >
          {openSub ? (
            <div className="bg-background/60 backdrop-blur-2xl  rounded-md overflow-hidden">
              <h1 className="px-3 py-2  font-medium text-sm bg-background">
                Select Subtitle
              </h1>
              <div className="custom-scrollbar h-100 overflow-auto ">
                <button
                  className="flex w-full items-center justify-between px-3 py-2
              text-sm hover:bg-white/10"
                  onClick={() => {
                    setSelectedSub("");
                    setOpenSub(false);
                  }}
                >
                  <span className="flex items-center gap-3">Unselect</span>
                </button>
                {data_sub.map((s) => (
                  <button
                    key={s.id}
                    className="flex w-full items-center justify-between px-3 py-2
              text-sm hover:bg-white/10"
                    onClick={() => {
                      setSelectedSub(s.url);
                      setOpenSub(false);
                    }}
                  >
                    <span className="flex items-center gap-3">
                      {s.url === selectedSub && <IconCheck size="16" />}
                      {s.display}
                    </span>
                    <img src={s.flagUrl} alt="" />
                  </button>
                ))}
              </div>
            </div>
          ) : openTiming ? (
            selectedSub && (
              <div className="flex flex-col items-center gap-1 p-1 bg-background/60 backdrop-blur-2xl">
                {subtitleOffset !== 0 && (
                  <Button
                    variant="secondary"
                    className=" bg-red-500/30! hover:bg-red-500/40! w-full backdrop-blur-2xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSubtitleOffset(0);
                    }}
                  >
                    Reset <IconRefresh />
                  </Button>
                )}
                <div className="flex items-center">
                  <Button
                    className="bg-background/30 hover:bg-background/40 backdrop-blur-2xl text-foreground "
                    onClick={(e) => {
                      e.stopPropagation();
                      setSubtitleOffset((prev) => prev + 0.5);
                    }}
                  >
                    <IconPlus />
                    Too Early
                  </Button>

                  <span className="text-sm font-mono min-w-17.5 text-center">
                    {subtitleOffset >= 0 ? "+" : ""}
                    {subtitleOffset.toFixed(1)}s
                  </span>

                  <Button
                    className="bg-background/30 hover:bg-background/40 backdrop-blur-2xl text-foreground "
                    onClick={(e) => {
                      e.stopPropagation();
                      setSubtitleOffset((prev) => prev - 0.5);
                    }}
                  >
                    Too Late <IconMinus />
                  </Button>
                </div>
              </div>
            )
          ) : (
            <div className="grid  space-y-1  ">
              <Button
                size="lg"
                className="hover:bg-background/90  bg-background/80 backdrop-blur-2xl text-foreground justify-between border-0"
                onClick={() => setOpenSub(true)}
              >
                {data_sub.find((f) => f.url === selectedSub)?.display ||
                  "Subtitle"}{" "}
                <IconChevronRight />
              </Button>
              {selectedSub && (
                <Button
                  size="lg"
                  className="hover:bg-background/90  bg-background/80 backdrop-blur-2xl text-foreground justify-between border-0"
                  onClick={() => setOpenTiming(true)}
                >
                  Timing <IconChevronRight />
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
