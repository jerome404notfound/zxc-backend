import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { SourceResponse } from "@/hook/api-hook/source";

export function useVideoSetup(sourceData: SourceResponse | null) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !sourceData || !sourceData.success) return;

    // Select a source
    const hlsSource = sourceData.sources.find((s) => s.type === "hls");
    const mp4Source = sourceData.sources.find((s) => s.type === "mp4");
    const selectedSource = hlsSource || mp4Source || sourceData.sources[1];

    if (!selectedSource) return;

    try {
      const encoded = encodeBase64Url(selectedSource.file);
      const proxyUrl = `https://dark-scene-567a.jinluxuz.workers.dev/?u=${encoded}`;

      // console.log("Original URL:", selectedSource.file);
      // console.log("Encoded:", encoded);
      // console.log("Proxy URL:", proxyUrl);

      // Handle HLS sources
      if (selectedSource.type === "hls") {
        if (Hls.isSupported()) {
          const hls = new Hls({
            debug: true, // Enable for debugging
            xhrSetup: (xhr) => {
              xhr.withCredentials = false;
            },
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            console.error("HLS Error:", data);
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  console.error("Network error - URL might be invalid");
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  console.error("Media error");
                  hls.recoverMediaError();
                  break;
                default:
                  hls.destroy();
                  break;
              }
            }
          });

          hls.loadSource(proxyUrl);
          hls.attachMedia(video);
          hlsRef.current = hls;
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = proxyUrl;
        }
      } else if (selectedSource.type === "mp4") {
        video.src = proxyUrl;
      }
    } catch (err) {
      console.error("Video setup error:", err);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [sourceData]);

  return videoRef;
}

export function encodeBase64Url(str: string): string {
  const base64 = btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );

  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeBase64Url(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");

  while (base64.length % 4) {
    base64 += "=";
  }

  return decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
}
