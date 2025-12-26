// import { useCallback, useEffect, useRef, useState } from "react";

// export function useHiddenOverlay(delay = 3000) {
//   const [isVisible, setIsVisible] = useState(true);
//   const timeoutRef = useRef<NodeJS.Timeout | null>(null);

//   const resetTimer = useCallback(() => {
//     setIsVisible(true);
//     if (timeoutRef.current) {
//       clearTimeout(timeoutRef.current);
//     }
//     timeoutRef.current = setTimeout(() => {
//       setIsVisible(false);
//     }, delay);
//   }, [delay]);

//   const showOverlay = useCallback(() => {
//     setIsVisible(true);
//     resetTimer();
//   }, [resetTimer]);

//   const hideOverlay = useCallback(() => {
//     setIsVisible(false);
//     if (timeoutRef.current) {
//       clearTimeout(timeoutRef.current);
//     }
//   }, []);

//   useEffect(() => {
//     resetTimer();
//     return () => {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }
//     };
//   }, [resetTimer]);

//   return { isVisible, showOverlay, hideOverlay, resetTimer };
// }
import { useCallback, useEffect, useRef, useState } from "react";

export function useHiddenOverlay(delay = 3000) {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const startTimer = useCallback(() => {
    clearTimer();
    timeoutRef.current = setTimeout(() => {
      if (!isHovered) {
        setIsVisible(false);
      } else {
        // keep checking every 500ms until mouse leaves
        startTimer();
      }
    }, delay);
  }, [delay, isHovered]);

  const resetTimer = useCallback(() => {
    setIsVisible(true);
    startTimer();
  }, [startTimer]);

  const showOverlay = useCallback(() => {
    setIsVisible(true);
    resetTimer();
  }, [resetTimer]);

  const hideOverlay = useCallback(() => {
    setIsVisible(false);
    clearTimer();
  }, []);

  useEffect(() => {
    resetTimer();
    return () => clearTimer();
  }, [resetTimer]);

  return { isVisible, showOverlay, hideOverlay, resetTimer, setIsHovered };
}
