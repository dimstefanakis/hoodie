import { create } from "zustand"

const CART_PRICE = 149

export type CartItem = {
  id: string
  name: string
  size: string
  price: number
  image: string
}

type StoreState = {
  items: CartItem[]
  cartTotal: number
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  isCartOpen: boolean
  isModalOpen: boolean
  isLoadingCheckout: boolean
  setCartOpen: (open: boolean) => void
  setModalOpen: (open: boolean) => void
  setLoadingCheckout: (loading: boolean) => void
  activeShoppers: number | null
  fetchShoppers: () => Promise<void>
  incrementShoppers: () => Promise<void>
}

export const useStore = create<StoreState>((set, get) => ({
  items: [],
  cartTotal: 0,
  addItem: (item) =>
    set((state) => {
      const existingIndex = state.items.findIndex(
        (existingItem) => existingItem.id === item.id,
      )
      const nextItems = [...state.items]

      if (existingIndex >= 0) {
        nextItems[existingIndex] = item
      } else {
        nextItems.push(item)
      }

      return {
        items: nextItems,
        cartTotal: nextItems.length ? CART_PRICE : 0,
        isCartOpen: true,
      }
    }),
  removeItem: (id) =>
    set((state) => {
      const nextItems = state.items.filter((item) => item.id !== id)
      return {
        items: nextItems,
        cartTotal: nextItems.length ? CART_PRICE : 0,
      }
    }),
  isCartOpen: false,
  isModalOpen: false,
  isLoadingCheckout: false,
  setCartOpen: (open) => set({ isCartOpen: open }),
  setModalOpen: (open) => set({ isModalOpen: open }),
  setLoadingCheckout: (loading) => set({ isLoadingCheckout: loading }),
  activeShoppers: null,
  fetchShoppers: async () => {
    try {
      const response = await fetch("/api/stats", { cache: "no-store" })
      if (!response.ok) return
      const data = (await response.json()) as { count?: number }
      if (typeof data.count === "number") {
        set({ activeShoppers: data.count })
      }
    } catch {
      // Ignore network errors for social proof.
    }
  },
  incrementShoppers: async () => {
    try {
      const response = await fetch("/api/stats", { method: "POST" })
      if (!response.ok) return
      const data = (await response.json()) as { count?: number }
      if (typeof data.count === "number") {
        set({ activeShoppers: data.count })
      }
    } catch {
      // Ignore network errors for social proof.
    }
  },
}))
