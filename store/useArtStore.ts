import { ArtworkType } from "@/types/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
interface ArtState {
  seletedArtWork: ArtworkType | null;
  setSelectedArtWork: (artwork: ArtworkType | null) => void;
  changeLikeCount: (change: number) => void;
  changeCommentCount: (change: number) => void;
  increaseViewCount: () => void;
}

export const useArtStore = create<ArtState>()(
  persist(
    (set) => ({
      seletedArtWork: null,
      setSelectedArtWork: (artwork: ArtworkType | null) =>
        set({ seletedArtWork: artwork }),
      changeLikeCount: (change: number) =>
        set((state) => {
          if (state.seletedArtWork) {
            const newLikeCount = Math.max(
              0,
              state.seletedArtWork.likeCount + change
            );
            return {
              seletedArtWork: {
                ...state.seletedArtWork,
                likeCount: newLikeCount,
              },
            };
          }
          return state;
        }),
      changeCommentCount: (change: number) =>
        set((state) => {
          if (state.seletedArtWork) {
            const newCommentCount = Math.max(
              0,
              state.seletedArtWork.commentCount + change
            );
            return {
              seletedArtWork: {
                ...state.seletedArtWork,
                commentCount: newCommentCount,
              },
            };
          }
          return state;
        }),
      increaseViewCount: () => {
        set((state) => {
          if (state.seletedArtWork) {
            return {
              seletedArtWork: {
                ...state.seletedArtWork,
                viewCount: state.seletedArtWork.viewCount + 1,
              },
            };
          }
          return state;
        });
      },
    }),
    {
      name: "art-storage", // name of the item in storage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
