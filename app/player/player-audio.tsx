import { cn } from "@/lib/utils";
import { Languages, Check, Ban, ClosedCaption } from "lucide-react";
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
import { Subtitle } from "@/hook/api-hook/subtitle-hooks";
import { AudioTrackTypes } from "@/hook/player-setup";

export default function PlayerAudioTrack({
  audioTracks,
  isVisible,
  isPlaying,
  selectedAudio,
  setSelectedAudio,
}: {
  audioTracks: AudioTrackTypes[];
  setAudioTrack: (audioTracks: AudioTrackTypes[]) => void;
  isVisible: boolean;
  isPlaying: boolean;
  selectedAudio: number;
  setSelectedAudio: (selectedAudio: number) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="cursor-pointer pointer-events-auto">
        <Languages
          strokeWidth={1.5}
          className="lg:size-8 size-6 cursor-pointer"
        />
      </PopoverTrigger>
      <PopoverContent
        className={` border-0 p-0 transition-opacity duration-300 ${
          isVisible || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        <Command className="bg-background" autoFocus={false}>
          <CommandInput
            autoFocus={false}
            placeholder="Search audio..."
            className="h-9"
          />
          <CommandList autoFocus={false}>
            <CommandEmpty>No subtitle found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                }}
                className="gap-4"
              >
                <Ban /> Default Audio
                <Check
                  className={cn(
                    "ml-auto",
                    selectedAudio === -1 ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
              {audioTracks.map((audio) => (
                <CommandItem
                  key={audio.id}
                  value={audio.name}
                  onSelect={() => {
                    setSelectedAudio(audio.id);
                    setOpen(false);
                  }}
                >
                  {/* <img
                    src={audio.flagUrl}
                    alt={audio.display}
                    className="w-4 h-4 mr-2 rounded-sm"
                  /> */}
                  <span className="line-clamp-1">{audio.name}</span>
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedAudio === audio.id ? "opacity-100" : "opacity-0"
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
