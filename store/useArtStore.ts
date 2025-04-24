import { ArtworkType } from "@/types/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
interface ArtState {
  seletedArtWork: ArtworkType | null;
  setSelectedArtWork: (artwork: ArtworkType | null) => void;
}

export const useArtStore = create<ArtState>()(
  persist(
    (set) => ({
      seletedArtWork: null,
      setSelectedArtWork: (artwork: ArtworkType | null) =>
        set({ seletedArtWork: artwork }),
    }),
    {
      name: "art-storage", // name of the item in storage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
