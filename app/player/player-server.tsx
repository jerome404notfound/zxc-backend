import { cn } from "@/lib/utils";
import {
  Languages,
  Check,
  Ban,
  ClosedCaption,
  SlidersHorizontal,
  Settings,
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
import { SourceResponse } from "@/hook/api-hook/source";

export default function PlayerServer({
  sourceData,
  isVisible,
  isPlaying,
  selectedServer,
  setSelectedServer,
}: {
  sourceData: SourceResponse;
  setQuality: (quality: Level[]) => void;
  isVisible: boolean;
  isPlaying: boolean;
  selectedServer: number;
  setSelectedServer: (selectedServer: number) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="cursor-pointer pointer-events-auto">
        <Settings className="lg:size-8 size-6" strokeWidth={1.5} />
      </PopoverTrigger>
      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className={`w-[150px] border-0 p-0 transition-opacity duration-300 ${
          isVisible || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        <Command className="bg-background">
          <CommandList>
            <CommandEmpty>No quality found.</CommandEmpty>
            <CommandGroup>
              {sourceData.sources.map((servers) => (
                <CommandItem
                  key={servers.id}
                  value={servers.label}
                  onSelect={() => {
                    setSelectedServer(servers.id);
                    setOpen(false);
                  }}
                >
                  <span className="line-clamp-1">{servers.label}</span>
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedServer === servers.id
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
