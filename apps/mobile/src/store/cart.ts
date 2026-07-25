import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { CartItem } from "@/types/cart";

interface CartStore {
  items: CartItem[];

  addItem: (item: CartItem) => void;
  buyNow: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  increaseQuantity: (variantId: string) => void;
  decreaseQuantity: (variantId: string) => void;
  getQuantity: (variantId: string) => number;
  subtotal: () => number;
  totalItems: () => number;
  clear: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.variantId === item.variantId
          );

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variantId === item.variantId
                  ? {
                      ...i,
                      quantity: Math.min(
                        i.quantity + 1,
                        i.stock
                      ),
                    }
                  : i
              ),
            };
          }

          return {
            items: [...state.items, item],
          };
        }),

      buyNow: (item) =>
        set({
          items: [item],
        }),

      increaseQuantity: (variantId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.variantId === variantId
              ? {
                  ...item,
                  quantity: Math.min(
                    item.quantity + 1,
                    item.stock
                  ),
                }
              : item
          ),
        })),

      decreaseQuantity: (variantId) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.variantId === variantId
                ? {
                    ...item,
                    quantity: item.quantity - 1,
                  }
                : item
            )
            .filter((item) => item.quantity > 0),
        })),

      removeItem: (variantId) =>
        set((state) => ({
          items: state.items.filter(
            (item) => item.variantId !== variantId
          ),
        })),

      getQuantity: (variantId) =>
        get().items.find(
          (item) => item.variantId === variantId
        )?.quantity ?? 0,

      subtotal: () =>
        get().items.reduce(
          (total, item) =>
            total + item.price * item.quantity,
          0
        ),

      totalItems: () =>
        get().items.reduce(
          (total, item) => total + item.quantity,
          0
        ),

      clear: () =>
        set({
          items: [],
        }),
    }),
    {
      name: "africasuk-cart",
      storage: createJSONStorage(() => AsyncStorage),

      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);