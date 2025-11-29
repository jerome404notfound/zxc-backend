// types/video.types.ts

export interface SubtitleTrackTypes {
  id: number;
  name: string;
  lang?: string;
  type: string;
  url: string;
  default?: boolean;
  forced?: boolean;
  autoselect?: boolean;
}

export interface AudioTrackTypes {
  id: number;
  name: string;
  lang?: string;
  groupId: string;
  default: boolean;
  autoselect: boolean;
  forced: boolean;
}

// export type VideoSourceType = "hls" | "mp4";

export interface UseVideoSetupProps {
  sourceLink: string;
  sourceType: string;
}
