import { useCallback, useState } from "react";
import { SourceItem } from "../player-setup";

export function useServerSwitching(sources: SourceItem[], initialServerId = 1) {
  const [currentServerIndex, setCurrentServerIndex] = useState(
    sources.findIndex((s) => s.id === initialServerId) || 0
  );

  const activeServer =
    currentServerIndex >= 0 && currentServerIndex < sources.length
      ? sources[currentServerIndex]
      : { file: "", type: "" };

  const switchToNextServer = useCallback(() => {
    if (currentServerIndex + 1 < sources.length) {
      console.warn("Switching to backup server...");
      setCurrentServerIndex((prev) => prev + 1);
    } else {
      console.error("All servers failed.");
    }
  }, [currentServerIndex, sources.length]);
  const validateIndex = useCallback(() => {
    if (
      sources.length > 0 &&
      (currentServerIndex < 0 || currentServerIndex >= sources.length)
    ) {
      setCurrentServerIndex(0);
      console.log("Fixing index from -1 to 0");
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
    activeServer,
    switchToNextServer,
    validateIndex,
    handleManualServerSwitch,
  };
}
