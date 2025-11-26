"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function useYouTubePlayer(videoId: string | null) {
  const playerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const player = playerRef.current;

  // ---- MUTE / UNMUTE ----
  const handleUnmute = () => {
    if (!player) return;

    if (isMuted) {
      player.unMute();
      player.setVolume(100);
      setIsMuted(false);
    } else {
      player.mute();
      player.setVolume(0);
      setIsMuted(true);
    }
  };

  const handlePlay = () => {
    if (!player) return;

    const state = player.getPlayerState();

    if (state === window.YT.PlayerState.PLAYING) {
      player.pauseVideo();
      setIsPlaying(false);
    } else {
      player.playVideo();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    // If YT API already loaded
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    }

    function initPlayer() {
      playerRef.current = new window.YT.Player(`yt-player-${videoId}`, {
        videoId,
        playerVars: {
          autoplay: 0,
          showinfo: 0,
          controls: 0,
          rel: 0,
          //   mute: 0,
        },
        events: {
          onReady: () => {
            setTimeout(() => {
              if (playerRef.current) {
                playerRef.current.unMute();
                playerRef.current.playVideo();
                setIsReady(true);
              }
            }, 5000);
          },
          onStateChange: (event: any) => {
            // 0 = ENDED
            if (event.data === window.YT.PlayerState.ENDED) {
              console.log("Trailer ended");
              setIsReady(false);
            }
          },
        },
      });
    }
  }, [videoId]);

  return {
    isReady,
    isMuted,
    isPlaying,
    player,
    handleUnmute,
    handlePlay,
  };
}
