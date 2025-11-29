// hooks/useHlsSetup.ts
import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { SubtitleTrackTypes, AudioTrackTypes } from "./player-types";

export function useHlsSetup(
  video: HTMLVideoElement | null,
  sourceLink: string,
  options: {
    onQualityChange: (levels: Hls["levels"]) => void;
    onSubtitlesChange: (tracks: SubtitleTrackTypes[]) => void;
    onAudioTracksChange: (tracks: AudioTrackTypes[]) => void;
  }
) {
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    if (!video || !Hls.isSupported() || !sourceLink) return;

    const hls = new Hls({
      xhrSetup: (xhr) => {
        xhr.withCredentials = false;
      },
    });

    hls.loadSource(sourceLink);
    hls.attachMedia(video);
    hlsRef.current = hls;

    hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
      options.onQualityChange(data.levels);
    });

    hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, (_, data) => {
      options.onSubtitlesChange(data.subtitleTracks as SubtitleTrackTypes[]);
    });

    hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, (_, data) => {
      options.onAudioTracksChange(data.audioTracks as AudioTrackTypes[]);
    });

    hls.on(Hls.Events.ERROR, (event, data) => {
      console.error("HLS.js Error:", data);
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            hls.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            hls.recoverMediaError();
            break;
          default:
            hls.destroy();
        }
      }
    });

    return () => {
      hls.destroy();
      hlsRef.current = null;
    };
  }, [video, sourceLink, options]);

  return hlsRef;
}
