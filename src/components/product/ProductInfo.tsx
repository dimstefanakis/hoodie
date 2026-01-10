"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { SizeSelector } from "./SizeSelector"

interface ProductInfoProps {
  selectedSize: string | null
  onSizeChange: (value: string) => void
  onAddToCart: () => void
  activeShoppers: number | null
  showSizeError: boolean
  addToCartClassName?: string
  addToCartLabel?: string
}

export function ProductInfo({
  selectedSize,
  onSizeChange,
  onAddToCart,
  activeShoppers,
  showSizeError,
  addToCartClassName,
  addToCartLabel = "Add to Cart",
}: ProductInfoProps) {
  const shoppers = activeShoppers ?? 12

  return (
    <section className="space-y-8 px-6 pb-24 md:pb-0">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
            The Cloak
          </p>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight">
            Not a blanket. A garment.
          </h1>
        </div>
        <p className="text-sm md:text-base text-zinc-400 leading-relaxed">
          Engineered from 2kgs high-density faux fur. The Cloak drapes with
          intention, providing the warmth of a duvet with a commanding, ritual
          silhouette. Deep pitch black. Anti-lint interior.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-3xl font-light">€149</span>
          <span className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            VAT included
          </span>
        </div>
        <p className="text-sm text-zinc-500">Ships in batches. Limited first drop.</p>
      </div>

      <div className="rounded-none border border-zinc-900 bg-zinc-950/40 px-4 py-3 text-sm text-zinc-300">
        🔥 {shoppers} people have this in their cart.
      </div>

      <Separator className="bg-zinc-900" />

      <SizeSelector
        value={selectedSize}
        onChange={onSizeChange}
        isInvalid={showSizeError}
      />

      <Button
        onClick={onAddToCart}
        className={cn(
          "hidden h-12 w-full md:flex items-center justify-center bg-white text-black hover:bg-zinc-200",
          addToCartClassName,
        )}
      >
        {addToCartLabel}
      </Button>
    </section>
  )
}
