"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { ShoppingBag, X } from "lucide-react"
import posthog from "posthog-js"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { trackMetaEvent } from "@/lib/analytics/meta-pixel"
import { useStore } from "@/store"

import { Footer } from "@/components/landing/Footer"
import { ProductGallery, type ProductGalleryImage } from "./ProductGallery"
import { ProductInfo } from "./ProductInfo"
import { CartDrawer } from "./CartDrawer"
import { ReservationModal } from "./ReservationModal"

const ViewerPlaceholder = () => (
  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
    <img
      src="/images/cloak.png"
      alt="The Cloak preview"
      className="absolute inset-0 h-full w-full object-cover blur-md opacity-70 scale-105"
    />
    <div className="absolute inset-0 bg-black/45" />
    <div className="relative z-10 flex flex-col items-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      <span className="text-[10px] uppercase tracking-[0.35em] text-white/70">
        Loading 3D view
      </span>
    </div>
  </div>
)

const WizardRobeViewer = dynamic(() => import("@/components/robe/WizardRobe"), {
  ssr: false,
  loading: () => <ViewerPlaceholder />,
})

const PRODUCT = {
  id: "cloak",
  name: "The Cloak",
  price: 149,
  image: "/images/cloak.png",
}

interface ProductPageProps {
  galleryImages?: ProductGalleryImage[]
  defaultSize?: string | null
}

export function ProductPage({ galleryImages, defaultSize }: ProductPageProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(
    defaultSize ?? null,
  )
  const [showSizeError, setShowSizeError] = useState(false)
  const [shakeCta, setShakeCta] = useState(false)
  const shakeTimerRef = useRef<number | null>(null)
  const [isViewerOpen, setViewerOpen] = useState(false)
  const [viewerReady, setViewerReady] = useState(false)

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
    posthog.capture('size_selected', {
      size: value,
      product_id: PRODUCT.id,
      product_name: PRODUCT.name,
    })
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
    posthog.capture('add_to_cart', {
      product_id: PRODUCT.id,
      product_name: PRODUCT.name,
      size: selectedSize,
      price: PRODUCT.price,
      currency: 'EUR',
    })
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

  const viewerButton = (
    <button
      type="button"
      onClick={() => setViewerOpen(true)}
      className="rounded-full border border-white/30 bg-black/60 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-white backdrop-blur transition hover:bg-white hover:text-black"
    >
      View in 3D 360°
    </button>
  )

  const handleViewerChange = (open: boolean) => {
    setViewerOpen(open)
    if (open) {
      setViewerReady(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-900 bg-black/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xs font-semibold uppercase tracking-[0.4em] text-zinc-300">
            The Cloak
          </span>
          <button
            onClick={() => {
              posthog.capture('cart_opened', { items_count: items.length })
              setCartOpen(true)
            }}
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
            <ProductGallery images={galleryImages} primaryAction={viewerButton} />
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
      <Dialog open={isViewerOpen} onOpenChange={handleViewerChange}>
        <DialogContent
          showCloseButton={false}
          className="fixed inset-0 left-0 top-0 h-[100dvh] w-screen max-w-none translate-x-0 translate-y-0 rounded-none border-0 bg-black p-0"
          style={{
            transform: "none",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <DialogClose className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur transition hover:bg-white hover:text-black">
            <X className="h-4 w-4" />
            <span className="sr-only">Close 3D viewer</span>
          </DialogClose>
          {isViewerOpen ? (
            <div className="relative h-full w-full">
              {!viewerReady ? <ViewerPlaceholder /> : null}
              <WizardRobeViewer
                className="h-full bg-black"
                onReady={() => setViewerReady(true)}
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
