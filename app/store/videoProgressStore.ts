import { create } from "zustand";
import { persist } from "zustand/middleware";

// --- Types ---
interface VideoProgress {
  currentTime: number;
  duration: number;
  lastUpdated: number; // new field
}

interface VideoProgressState {
  progress: Record<string, VideoProgress>;
  saveProgress: (key: string, currentTime: number, duration: number) => void;
  getProgress: (key: string) => VideoProgress | null;
  clearProgress: (key: string) => void;
  clearAll: () => void;
}

// --- Helper to generate a unique key ---
const makeKey = (
  media_type: "movie" | "tv",
  id: number,
  season?: number,
  episode?: number
) =>
  media_type === "movie" ? `movie-${id}` : `tv-${id}-S${season}-E${episode}`;

// --- Store ---
export const useVideoProgressStore = create<VideoProgressState>()(
  persist(
    (set, get) => ({
      progress: {},

      saveProgress: (key, currentTime, duration) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [key]: {
              currentTime,
              duration,
              lastUpdated: Date.now(), // save timestamp
            },
          },
        })),

      getProgress: (key) => get().progress[key] || null,

      clearProgress: (key) =>
        set((state) => {
          const newProgress = { ...state.progress };
          delete newProgress[key];
          return { progress: newProgress };
        }),

      clearAll: () => set({ progress: {} }),
    }),
    { name: "video-progress-storage" }
  )
);

export { makeKey };
