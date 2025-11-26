import { cn } from "@/lib/utils";
import { Languages, Check, Ban } from "lucide-react";
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
import { Subtitle } from "@/api/subtitle-hooks";

export default function PlayerSubtitle({
  subtitleQuery,
  selectedSub,
  setSelectedSub,
  isVisible,
}: {
  subtitleQuery: Subtitle[];
  selectedSub: string;
  setSelectedSub: (selectedSub: string) => void;
  isVisible: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="cursor-pointer pointer-events-auto">
        <Languages />
      </PopoverTrigger>
      <PopoverContent
        className={`w-[200px] border-0 p-0 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <Command className="bg-background">
          <CommandInput
            autoFocus={false}
            placeholder="Search subtitle..."
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No subtitle found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setSelectedSub("");
                  setOpen(false);
                }}
                className="gap-4"
              >
                <Ban /> No Subtitle
                <Check
                  className={cn(
                    "ml-auto",
                    selectedSub === "" ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
              {subtitleQuery.map((subtitle) => (
                <CommandItem
                  key={subtitle.id}
                  value={subtitle.name}
                  onSelect={() => {
                    setSelectedSub(subtitle.url);
                    setOpen(false);
                  }}
                >
                  <img
                    src={subtitle.flagUrl}
                    alt={subtitle.name}
                    className="w-4 h-4 mr-2 rounded-sm"
                  />
                  <span className="line-clamp-1">{subtitle.name}</span>
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedSub === subtitle.url ? "opacity-100" : "opacity-0"
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
