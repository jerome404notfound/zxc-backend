import { cn } from "@/lib/utils";
import { Check, HardDrive, Router, Server, Settings } from "lucide-react";
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
import { SourceItem } from "@/hook/player-setup";
import { useState } from "react";

interface PlayerServerProps {
  sources: SourceItem[];
  currentServerIndex: number;
  setCurrentServerIndex: (index: number) => void;
  isVisible: boolean;
  isPlaying: boolean;
}

export default function PlayerServer({
  sources,
  currentServerIndex,
  setCurrentServerIndex,
  isVisible,
  isPlaying,
}: PlayerServerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger className="cursor-pointer pointer-events-auto hover:scale-110 duration-200 transition active:scale-95">
        <Router className="lg:size-8 size-6" strokeWidth={1.5} />
      </PopoverTrigger>

      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className={`w-[180px] border-0 p-0 transition-opacity duration-300 ${
          isVisible || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        <Command className="bg-background">
          <CommandInput placeholder="Search server..." className="h-9" />
          <CommandList>
            <CommandEmpty>No server found.</CommandEmpty>
            <CommandGroup heading="Servers">
              {sources.map((server, index) => (
                <CommandItem
                  key={server.id}
                  value={server.label || `Server ${index + 1}`}
                  onSelect={() => {
                    setCurrentServerIndex(index); // ← Use index!
                    setOpen(false);
                  }}
                >
                  <span className="line-clamp-1 text-sm flex items-center gap-3">
                    <HardDrive className="size-5" />{" "}
                    {server.label || `Server ${index + 1}`}
                  </span>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentServerIndex === index ? "opacity-100" : "opacity-0"
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
