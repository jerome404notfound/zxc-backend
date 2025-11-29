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

export default function PlayerQualitySelector({
  quality,
  isVisible,
  isPlaying,
  selectedQualty,
  setSelectedQualty,
}: {
  quality: Level[];
  setQuality: (quality: Level[]) => void;
  isVisible: boolean;
  isPlaying: boolean;
  selectedQualty: number;
  setSelectedQualty: (selectedQualty: number) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="cursor-pointer pointer-events-auto hover:scale-110 duration-200 transition active:scale-95">
        <SlidersHorizontal className="lg:size-8 size-6" strokeWidth={1.5} />
      </PopoverTrigger>
      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className={`w-[200px] border-0 p-0 transition-opacity duration-300 ${
          isVisible || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        <Command className="bg-background">
          <CommandInput placeholder="Search quality..." className="h-9" />
          <CommandList>
            <CommandEmpty>No quality found.</CommandEmpty>
            <CommandGroup>
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
                    selectedQualty === -1 ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
              {quality.map((option, index) => (
                <CommandItem
                  key={index}
                  value={String(option.height)}
                  onSelect={() => {
                    setSelectedQualty(index);
                    setOpen(false);
                  }}
                >
                  <span className="line-clamp-1">{option.height}p</span>
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedQualty === index ? "opacity-100" : "opacity-0"
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
