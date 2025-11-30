import { RefObject, useState } from "react";

export function useVolume(videoRef: RefObject<HTMLVideoElement | null>) {
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(100);
  const [volume, setVolume] = useState(isMuted ? 0 : prevVolume);

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);

    const video = videoRef.current;
    if (!video) return;

    // If muted, unmute when slider changes
    if (isMuted && newVolume > 0) {
      setIsMuted(false);
      video.volume = newVolume / 100;
      setPrevVolume(newVolume);
      return;
    }

    video.volume = newVolume / 100;
    setPrevVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = prevVolume / 100;
      setVolume(prevVolume);
      setIsMuted(false);
      video.muted = false;
    } else {
      setPrevVolume(volume);
      video.volume = 0;
      setVolume(0);
      setIsMuted(true);
      video.muted = true;
    }
  };
  return { volume, isMuted, handleVolumeChange, toggleMute, prevVolume };
}
