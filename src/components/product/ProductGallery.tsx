import type { ReactNode } from "react"

export type ProductGalleryImage = {
  src: string
  alt: string
  label?: string
  filtered?: boolean
}

const defaultImages: ProductGalleryImage[] = [
  {
    src: "/images/texture.png",
    alt: "Fabric texture detail",
    label: "High Density Faux-Fur",
  },
  {
    src: "/images/cloak.png",
    alt: "The Cloak silhouette",
    label: "Engineered Drape",
  },
]

interface ProductGalleryProps {
  images?: ProductGalleryImage[]
  primaryAction?: ReactNode
}

export function ProductGallery({
  images = defaultImages,
  primaryAction,
}: ProductGalleryProps) {
  return (
    <section className="w-full">
      <div className="md:hidden">
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-6 pb-8">
          {images.map((image, index) => {
            const isFiltered = image.filtered !== false
            const imageClassName = [
              "h-full w-full object-cover",
              isFiltered ? "grayscale contrast-125" : null,
            ]
              .filter(Boolean)
              .join(" ")

            return (
              <div
                key={`${image.alt}-${index}`}
                className="relative min-w-[80%] snap-center overflow-hidden border border-zinc-900 bg-black"
              >
                {primaryAction ? (
                  <div className="absolute right-4 top-4 z-10">
                    {primaryAction}
                  </div>
                ) : null}
                <div className="aspect-[4/5]">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className={imageClassName}
                  />
                </div>
                {image.label ? (
                  <div className="absolute bottom-4 left-4">
                    <span className="border border-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/80 backdrop-blur">
                      {image.label}
                    </span>
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>

      <div className="hidden md:grid md:grid-cols-2 gap-4 px-6">
        {images.map((image, index) => {
          const isFiltered = image.filtered !== false
          const imageClassName = [
            "h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105",
            isFiltered ? "grayscale contrast-125" : null,
          ]
            .filter(Boolean)
            .join(" ")

          return (
            <div
              key={`${image.alt}-${index}`}
              className="relative aspect-[4/5] overflow-hidden border border-zinc-900 bg-black"
            >
              {primaryAction ? (
                <div className="absolute right-4 top-4 z-10">
                  {primaryAction}
                </div>
              ) : null}
              <img
                src={image.src}
                alt={image.alt}
                className={imageClassName}
              />
              {image.label ? (
                <div className="absolute bottom-4 left-4">
                  <span className="border border-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/80 backdrop-blur">
                    {image.label}
                  </span>
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </section>
  )
}
