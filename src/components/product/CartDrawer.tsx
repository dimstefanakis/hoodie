"use client"

import { useEffect, useRef } from "react"
import { Loader2, Trash2 } from "lucide-react"
import posthog from "posthog-js"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { trackMetaEvent } from "@/lib/analytics/meta-pixel"
import { useStore } from "@/store"

const CART_PRICE = 149

export function CartDrawer() {
  const items = useStore((state) => state.items)
  const cartTotal = useStore((state) => state.cartTotal)
  const isCartOpen = useStore((state) => state.isCartOpen)
  const isLoadingCheckout = useStore((state) => state.isLoadingCheckout)
  const setCartOpen = useStore((state) => state.setCartOpen)
  const setModalOpen = useStore((state) => state.setModalOpen)
  const setLoadingCheckout = useStore((state) => state.setLoadingCheckout)
  const removeItem = useStore((state) => state.removeItem)

  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isCartOpen && isLoadingCheckout) {
      setLoadingCheckout(false)
    }
  }, [isCartOpen, isLoadingCheckout, setLoadingCheckout])

  const handleCheckout = () => {
    if (!items.length) return

    trackMetaEvent("InitiateCheckout", { value: CART_PRICE, currency: "EUR" })
    posthog.capture('checkout_initiated', {
      cart_total: cartTotal,
      items_count: items.length,
      currency: 'EUR',
    })
    setLoadingCheckout(true)

    timeoutRef.current = window.setTimeout(() => {
      setCartOpen(false)
      setModalOpen(true)
      setLoadingCheckout(false)
    }, 800)
  }

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent
        side="right"
        className="flex h-full flex-col border-l border-zinc-900 bg-black text-white"
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-light tracking-tight">
            Shopping Cart
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-6 pt-6">
          {items.length === 0 ? (
            <p className="text-sm text-zinc-500">
              Your cart is empty. Select a size to begin.
            </p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="space-y-4">
                <div className="flex gap-4">
                  <div className="h-20 w-16 overflow-hidden border border-zinc-800 bg-zinc-950">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover grayscale"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
                      The Cloak
                    </p>
                    <p className="text-base font-light">{item.name}</p>
                    <p className="text-xs text-zinc-500">Size: {item.size}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm text-zinc-300">€{item.price}</span>
                    <button
                      onClick={() => {
                        posthog.capture('item_removed_from_cart', {
                          product_id: item.id,
                          product_name: item.name,
                          size: item.size,
                          price: item.price,
                        })
                        removeItem(item.id)
                      }}
                      className="text-zinc-500 hover:text-white transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <Separator className="bg-zinc-900" />
              </div>
            ))
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500">Subtotal</span>
            <span>€{items.length ? cartTotal : 0}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500">Shipping</span>
            <span className="text-zinc-400">Calculated at next step</span>
          </div>
        </div>

        <SheetFooter className="pt-6">
          <Button
            onClick={handleCheckout}
            disabled={!items.length || isLoadingCheckout}
            className="h-12 w-full bg-white text-black hover:bg-zinc-200"
          >
            {isLoadingCheckout ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Checkout"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
