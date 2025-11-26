import { useEffect, useState } from "react";
import { srtToVtt } from "@/lib/subs-converter";

export function useSubtitleUrl(srtUrl?: string) {
  const [vttUrl, setVttUrl] = useState<string>("");

  useEffect(() => {
    if (!srtUrl) {
      setVttUrl("");
      return;
    }

    let blobUrl: string | null = null;

    async function fetchSubtitle() {
      try {
        // TypeScript now knows srtUrl is defined here
        const res = await fetch(srtUrl!);
        if (!res.ok) throw new Error("Failed to fetch subtitle");
        const srtText = await res.text();
        const vttText = srtToVtt(srtText);
        const blob = new Blob([vttText], { type: "text/vtt" });
        blobUrl = URL.createObjectURL(blob);
        setVttUrl(blobUrl);
      } catch (err) {
        console.error("Subtitle fetch error:", err);
        setVttUrl("");
      }
    }

    fetchSubtitle();

    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [srtUrl]);

  return vttUrl;
}
