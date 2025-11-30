import { useCallback, useState } from "react";
import { SourceItem } from "./player-setup";

export function useServerSwitching(sources: SourceItem[], initialServerId = 1) {
  const [currentServerIndex, setCurrentServerIndex] = useState(() => {
    const idx = sources.findIndex((s) => s.id === initialServerId);
    return idx >= 0 ? idx : 0;
  });

  const activeServer =
    currentServerIndex >= 0 && currentServerIndex < sources.length
      ? sources[currentServerIndex]
      : null; // ← IMPORTANT FIX

  const switchToNextServer = useCallback(() => {
    setCurrentServerIndex((prev) => {
      if (prev + 1 < sources.length) {
        console.warn("Switching to backup server...");
        return prev + 1;
      }
      console.error("All servers failed.");
      return prev;
    });
  }, [sources.length]);

  const validateIndex = useCallback(() => {
    if (sources.length === 0) return;

    if (currentServerIndex < 0 || currentServerIndex >= sources.length) {
      console.log("Fixing invalid index → 0");
      setCurrentServerIndex(0);
    }
  }, [currentServerIndex, sources]);

  const handleManualServerSwitch = (index: number) => {
    if (index >= 0 && index < sources.length) {
      setCurrentServerIndex(index);
    } else {
      console.warn("Invalid server index");
    }
  };

  return {
    currentServerIndex,
    setCurrentServerIndex,
    activeServer, // now null when invalid
    switchToNextServer,
    validateIndex,
    handleManualServerSwitch,
  };
}
