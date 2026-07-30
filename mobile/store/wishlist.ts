import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { WishlistItem } from "@africasuk/types";

export interface WishlistStore {
  items: WishlistItem[];
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  addItem: (item: WishlistItem) => void;
  removeItem: (variantId: string) => void;
  toggleItem: (item: WishlistItem) => void;
  isWishlisted: (variantId: string) => boolean;
  clear: () => void;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      addItem: (item) =>
        set((state) => {
          const exists = state.items.some(
            (wishlist) => wishlist.variantId === item.variantId
          );

          if (exists) return state;

          return {
            items: [...state.items, item],
          };
        }),

      removeItem: (variantId) =>
        set((state) => ({
          items: state.items.filter((item) => item.variantId !== variantId),
        })),

      toggleItem: (item) =>
        set((state) => {
          const exists = state.items.some(
            (wishlist) => wishlist.variantId === item.variantId
          );

          if (exists) {
            return {
              items: state.items.filter(
                (wishlist) => wishlist.variantId !== item.variantId
              ),
            };
          }

          return {
            items: [...state.items, item],
          };
        }),

      isWishlisted: (variantId) =>
        get().items.some((item) => item.variantId === variantId),

      clear: () =>
        set({
          items: [],
        }),
    }),
    {
      name: "africasuk-wishlist",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);