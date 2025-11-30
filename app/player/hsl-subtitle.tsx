import { cn } from "@/lib/utils";
import {
  Languages,
  Check,
  Ban,
  ClosedCaption,
  SlidersHorizontal,
} from "lucide-react";
import Hls, { Level } from "hls.js";
import { useState } from "react";
import { getLanguageFullName } from "@/lib/full-languange-name";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { SubtitleTrackTypes } from "@/hook/player-logic/player-types";

export default function HslSubtitles({
  subtitles,
  selectedSubtitle,
  setSelectedSubtitle,
}: {
  subtitles: SubtitleTrackTypes[];
  selectedSubtitle: number;
  setSelectedSubtitle: (selectedSubtitle: number) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger className="cursor-pointer pointer-events-auto hover:scale-110 duration-200 transition active:scale-95">
        <ClosedCaption className="lg:size-8 size-6" strokeWidth={1.5} />
      </PopoverTrigger>
      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className={`w-[200px] border-0 p-0 transition-opacity duration-300`}
      >
        <Command className="bg-background">
          <CommandInput placeholder="Search subtitle..." className="h-9" />
          <CommandList>
            <CommandEmpty>No subtitle found.</CommandEmpty>
            <CommandGroup heading="Subtitle">
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                }}
                className="gap-4"
              >
                Auto
                <Check
                  className={cn(
                    "ml-auto",
                    selectedSubtitle === -1 ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
              {subtitles.map((option) => (
                <CommandItem
                  key={option.id}
                  value={String(option.id)} // use id for selection
                  onSelect={() => {
                    setSelectedSubtitle(option.id); // select by id
                    setOpen(false);
                  }}
                >
                  <span className="line-clamp-1">
                    {getLanguageFullName(option.name)}{" "}
                    {/* convert code to full name */}
                  </span>
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedSubtitle === option.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
