import { Button } from "@/components/ui/button";
import { Level } from "hls.js";
import {
  IconCheck,
  IconChevronRight,
  IconLanguageKatakana,
  IconMinus,
  IconPlus,
  IconRefresh,
  IconSelector,
  IconSettings2,
} from "@tabler/icons-react";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Subtitle } from "@/hook/subtitle-hooks";

type Props = {
  data_sub: Subtitle[];
  selectedSub: string;
  setSelectedSub: (sub: string) => void;
  subtitleOffset: number;
  setSubtitleOffset: (offset: number | ((prev: number) => number)) => void;
  quality: Level[];
  selectedQualty: number;
  setSelectedQualty: (selectedQualty: number) => void;
  server: number;
  servers: { name: string; server: number }[];
  setServer: (server: number) => void;
};

export default function PlayerSettings({
  data_sub,
  selectedSub,
  setSelectedSub,
  subtitleOffset,
  setSubtitleOffset,
  quality,
  selectedQualty,
  setSelectedQualty,
  setServer,
  servers,
  server,
}: Props) {
  const [open, setOpen] = useState(false);
  const [openSub, setOpenSub] = useState(false);
  const [openTiming, setOpenTiming] = useState(false);
  const [openQuality, setOpenQuality] = useState(false);
  const [openServer, setOpenServer] = useState(false);
  useEffect(() => {
    if (!open) {
      setOpenSub(false);
      setOpenTiming(false);
    }
  }, [open]);

  useEffect(() => {
    if (selectedSub) setSubtitleOffset(0);
  }, [selectedSub, setSubtitleOffset]);

  const showBack = openSub || openTiming || openQuality || openServer;

  const handleButtonClick = () => {
    if (openSub) return setOpenSub(false);
    if (openTiming) return setOpenTiming(false);
    if (openQuality) return setOpenQuality(false);
    if (openServer) return setOpenServer(false);

    setOpen((prev) => !prev);
  };
  return (
    <div className="relative">
      {/* Trigger Button */}
      <Button
        variant="outline"
        onClick={handleButtonClick}
        className="lg:w-48 w-28 justify-between backdrop-blur-md bg-background/20! border-0"
      >
        {showBack ? <ArrowLeft /> : <IconSettings2 />}
        {showBack ? "Back" : "Settings"}
        <IconSelector />
      </Button>

      {/* Dropdown */}
      {open && (
        <div className="absolute bottom-full right-0 lg:left-1/2 lg:-translate-x-1/2 mb-3 z-50 min-w-48">
          {/* Subtitle List */}
          {openSub && (
            <div className="bg-background/60 backdrop-blur-2xl rounded-md overflow-hidden">
              <h1 className="px-3 py-2 text-sm font-medium bg-background">
                Select Subtitle
              </h1>

              <div className="custom-scrollbar h-100 overflow-auto">
                <SubtitleButton
                  label="Unselect"
                  onClick={() => {
                    setSelectedSub("");
                    setOpenSub(false);
                  }}
                  active={"" === selectedSub}
                />

                {data_sub.map((s) => (
                  <SubtitleButton
                    key={s.id}
                    active={s.url === selectedSub}
                    label={s.display}
                    flag={s.flagUrl}
                    onClick={() => {
                      setSelectedSub(s.url);
                      setOpenSub(false);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Timing */}
          {openTiming && selectedSub && (
            <div className="flex flex-col gap-2 p-2 backdrop-blur-2xl rounded-md justify-center items-center">
              {subtitleOffset !== 0 && (
                <Button
                  variant="secondary"
                  className="bg-red-500/30! hover:bg-red-500/40! w-full"
                  onClick={() => setSubtitleOffset(0)}
                >
                  Reset <IconRefresh />
                </Button>
              )}

              <div className="flex items-center justify-between gap-2 ">
                <AdjustButton
                  icon={<IconPlus />}
                  label="Too Early"
                  onClick={() => setSubtitleOffset((p) => p + 0.5)}
                />

                <span className="text-sm font-mono min-w-15 text-center">
                  {subtitleOffset >= 0 && "+"}
                  {subtitleOffset.toFixed(1)}s
                </span>

                <AdjustButton
                  icon={<IconMinus />}
                  label="Too Late"
                  onClick={() => setSubtitleOffset((p) => p - 0.5)}
                />
              </div>
            </div>
          )}

          {openQuality && (
            <div className="bg-background/60 backdrop-blur-2xl rounded-md overflow-hidden">
              <h1 className="px-3 py-2 text-sm font-medium bg-background">
                Select Quality
              </h1>

              <div className="custom-scrollbar  overflow-auto">
                <SubtitleButton
                  label="Auto"
                  onClick={() => {
                    setSelectedQualty(-1);
                    setOpenQuality(false);
                  }}
                  active={-1 === selectedQualty}
                />

                {quality
                  .filter((f) => f.height !== 0)
                  .map((s, idx) => (
                    <SubtitleButton
                      key={idx}
                      active={idx === selectedQualty}
                      label={`${s.height}p`}
                      onClick={() => {
                        setSelectedQualty(idx);
                        setOpenQuality(false);
                      }}
                    />
                  ))}
              </div>
            </div>
          )}
          {openServer && (
            <div className="bg-background/60 backdrop-blur-2xl rounded-md overflow-hidden">
              <h1 className="px-3 py-2 text-sm font-medium bg-background">
                Select Server
              </h1>

              <div className="custom-scrollbar  overflow-auto">
                {servers.map((s) => (
                  <SubtitleButton
                    key={s.server}
                    active={s.server === server}
                    label={s.name}
                    onClick={() => {
                      setServer(s.server);
                      setOpenServer(false);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          {/* Main Menu */}
          {!openSub && !openTiming && !openQuality && !openServer && (
            <div className="space-y-0.5">
              <MenuButton
                label={"Servers"}
                onClick={() => setOpenServer(true)}
              />
              <MenuButton
                label={
                  // data_sub.find((s) => s.url === selectedSub)?.display ||
                  "Subtitle"
                }
                onClick={() => setOpenSub(true)}
              />

              {selectedSub && (
                <MenuButton
                  label={`Timing (${
                    data_sub.find((s) => s.url === selectedSub)?.display
                  })`}
                  onClick={() => setOpenTiming(true)}
                />
              )}
              {quality && (
                <MenuButton
                  label="Quality"
                  onClick={() => setOpenQuality(true)}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Small Components ---------- */

function MenuButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      size="lg"
      onClick={onClick}
      className="w-full bg-background/70 hover:bg-background/80 backdrop-blur-2xl text-foreground justify-between border-0"
    >
      {label}
      <IconChevronRight />
    </Button>
  );
}

function SubtitleButton({
  label,
  active,
  flag,
  onClick,
}: {
  label: string;
  active?: boolean;
  flag?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-white/10"
    >
      <span className="flex items-center gap-2">
        {active && <IconCheck size={16} />}
        {label}
      </span>
      {flag && <img src={flag} alt="" />}
    </button>
  );
}

function AdjustButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      className="bg-background/70 hover:bg-background/80 backdrop-blur-2xl text-foreground"
    >
      {icon}
      {label}
    </Button>
  );
}
