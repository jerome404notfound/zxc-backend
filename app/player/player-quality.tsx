import { Streams } from "@/api/local-fetch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Clapperboard } from "lucide-react";
import { useId } from "react";

export default function QualitySelector({
  localData,
}: {
  localData: Streams | null;
}) {
  const id = useId();
  return (
    <Popover>
      <PopoverTrigger className="pointer-events-auto cursor-pointer">
        <Clapperboard />
      </PopoverTrigger>
      <PopoverContent className=" p-0 border-0">
        {Object.keys(localData?.stream?.qualities || {}).map((quality) => (
          <div key={quality} className="px-4 py-2">
            {quality}p
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
