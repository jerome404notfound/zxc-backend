import { Button } from "@/components/ui/button";
import { Subtitle } from "@/hook/subtitle-hooks";
import {
  IconCaretUpDownFilled,
  IconCheck,
  IconChevronCompactDown,
  IconLanguageKatakana,
  IconSelector,
  IconSquareRoundedChevronDown,
  IconSubtitles,
  IconTransferVertical,
} from "@tabler/icons-react";
import { useState } from "react";

export default function PlayerSubtitle({
  data_sub,
  selectedSub,
  setSelectedSub,
}: {
  data_sub: Subtitle[];
  selectedSub: string;
  setSelectedSub: (selectedSub: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        onClick={() => setOpen((p) => !p)}
        variant="outline"
        className="lg:w-48 w-28 justify-between backdrop-blur-md bg-background/20! border-0"
      >
        <IconLanguageKatakana />{" "}
        {data_sub.find((f) => f.url === selectedSub)?.display || "Subtitle"}{" "}
        <IconSelector />
      </Button>

      {open && (
        <div
          className="absolute bottom-full right-0 z-50
          bg-black/60 backdrop-blur-2xl rounded-md w-48
           border-white/10 max-h-150 overflow-auto custom-scrollbar mb-3"
        >
          <h1 className="px-3 py-2  font-medium text-sm sticky top-0 bg-background">
            Select Subtitle
          </h1>
          <button
            className="flex w-full items-center justify-between px-3 py-2
              text-sm hover:bg-white/10"
            onClick={() => {
              setSelectedSub("");
              setOpen(false);
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
                setOpen(false);
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
      )}
    </div>
  );
}
