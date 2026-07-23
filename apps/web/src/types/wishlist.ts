"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CartItem } from "./cart";

export type WishlistItem = CartItem;


interface WishlistStore {
  items: CartItem[];

  addItem: (
    item: CartItem
  ) => void;

  removeItem: (
    variantId: string
  ) => void;

  toggleItem: (
    item: CartItem
  ) => void;

  isWishlisted: (
    variantId: string
  ) => boolean;

  clear: () => void;
}


export const useWishlist =
  create<WishlistStore>()(
    persist(
      (set, get) => ({
        items: [],

        addItem: (item) =>
          set((state) => {
            const exists =
              state.items.some(
                (i) =>
                  i.variantId === item.variantId
              );

            if (exists) return state;

            return {
              items: [
                ...state.items,
                item,
              ],
            };
          }),


        removeItem: (variantId) =>
          set((state) => ({
            items:
              state.items.filter(
                (item) =>
                  item.variantId !== variantId
              ),
          })),


        toggleItem: (item) =>
          set((state) => {
            const exists =
              state.items.some(
                (i) =>
                  i.variantId === item.variantId
              );

            return {
              items: exists
                ? state.items.filter(
                    (i) =>
                      i.variantId !== item.variantId
                  )
                : [
                    ...state.items,
                    item,
                  ],
            };
          }),


        isWishlisted: (variantId) =>
          get().items.some(
            (item) =>
              item.variantId === variantId
          ),


        clear: () =>
          set({
            items: [],
          }),
      }),

      {
        name: "africasuk-wishlist",

        partialize: (state) => ({
          items: state.items,
        }),
      }
    )
  );