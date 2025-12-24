import { useCallback, useEffect, useRef, useState } from "react";

export function useHiddenOverlay(delay = 3000) {
  const [isVisible, setIsVisible] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    setIsVisible(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, delay);
  }, [delay]);

  const showOverlay = useCallback(() => {
    setIsVisible(true);
    resetTimer();
  }, [resetTimer]);

  const hideOverlay = useCallback(() => {
    setIsVisible(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resetTimer]);

  return { isVisible, showOverlay, hideOverlay, resetTimer };
}
