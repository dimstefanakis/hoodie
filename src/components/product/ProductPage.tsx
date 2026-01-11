"use client"

import { useEffect, useRef, useState } from "react"
import { ShoppingBag } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { trackMetaEvent } from "@/lib/analytics/meta-pixel"
import { useStore } from "@/store"

import { Footer } from "@/components/landing/Footer"
import { ProductGallery, type ProductGalleryImage } from "./ProductGallery"
import { ProductInfo } from "./ProductInfo"
import { CartDrawer } from "./CartDrawer"
import { ReservationModal } from "./ReservationModal"

const PRODUCT = {
  id: "cloak",
  name: "The Cloak",
  price: 149,
  image: "/images/cloak.png",
}

interface ProductPageProps {
  galleryImages?: ProductGalleryImage[]
}

export function ProductPage({ galleryImages }: ProductPageProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [showSizeError, setShowSizeError] = useState(false)
  const [shakeCta, setShakeCta] = useState(false)
  const shakeTimerRef = useRef<number | null>(null)

  const items = useStore((state) => state.items)
  const addItem = useStore((state) => state.addItem)
  const setCartOpen = useStore((state) => state.setCartOpen)
  const fetchShoppers = useStore((state) => state.fetchShoppers)
  const incrementShoppers = useStore((state) => state.incrementShoppers)
  const activeShoppers = useStore((state) => state.activeShoppers)

  useEffect(() => {
    fetchShoppers()
    trackMetaEvent("ViewContent", {
      content_name: PRODUCT.name,
      value: PRODUCT.price,
      currency: "EUR",
    })
  }, [fetchShoppers])

  useEffect(() => {
    return () => {
      if (shakeTimerRef.current) {
        window.clearTimeout(shakeTimerRef.current)
      }
    }
  }, [])

  const handleSizeChange = (value: string) => {
    setSelectedSize(value)
    setShowSizeError(false)
    trackMetaEvent("CustomizeProduct", { variant: value })
  }

  const triggerShake = () => {
    setShakeCta(true)
    if (shakeTimerRef.current) {
      window.clearTimeout(shakeTimerRef.current)
    }
    shakeTimerRef.current = window.setTimeout(() => {
      setShakeCta(false)
    }, 400)
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      setShowSizeError(true)
      triggerShake()
      return
    }

    trackMetaEvent("AddToCart", { value: PRODUCT.price, currency: "EUR" })
    incrementShoppers()
    addItem({
      id: PRODUCT.id,
      name: PRODUCT.name,
      size: selectedSize,
      price: PRODUCT.price,
      image: PRODUCT.image,
    })
  }

  const addToCartClassName = cn(
    "uppercase tracking-[0.3em] text-xs",
    !selectedSize && "opacity-60",
    shakeCta && "animate-[shake_0.3s_ease-in-out]",
  )

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-900 bg-black/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xs font-semibold uppercase tracking-[0.4em] text-zinc-300">
            The Cloak
          </span>
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-zinc-300 hover:text-white"
          >
            <ShoppingBag className="h-4 w-4" />
            Cart
            {items.length ? (
              <Badge className="ml-1 bg-white text-black">{items.length}</Badge>
            ) : null}
          </button>
        </div>
      </header>

      <div className="pb-24 md:pb-0">
        <main className="mx-auto max-w-6xl pt-24">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <ProductGallery images={galleryImages} />
            <div className="md:sticky md:top-28 self-start">
              <ProductInfo
                selectedSize={selectedSize}
                onSizeChange={handleSizeChange}
                onAddToCart={handleAddToCart}
                activeShoppers={activeShoppers}
                showSizeError={showSizeError}
                addToCartClassName={addToCartClassName}
                addToCartLabel="Add to Cart"
              />
            </div>
          </div>
        </main>
        <Footer />
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-900 bg-black/90 backdrop-blur md:hidden">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
              Total
            </p>
            <p className="text-lg font-light">€{PRODUCT.price}</p>
          </div>
          <Button
            onClick={handleAddToCart}
            className={cn(
              "h-12 bg-white text-black hover:bg-zinc-200",
              addToCartClassName,
            )}
          >
            Add to Cart
          </Button>
        </div>
      </div>

      <CartDrawer />
      <ReservationModal />
    </div>
  )
}
