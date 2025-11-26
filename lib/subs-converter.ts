// /utils/subtitleConverter.ts

export function srtToVtt(srt: string): string {
  const vtt = srt
    .replace(/\r\n/g, "\n")
    .replace(/(\d{2}):(\d{2}):(\d{2}),(\d{3})/g, "$1:$2:$3.$4");
  return "WEBVTT\n\n" + vtt;
}
