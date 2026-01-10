const images = [
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

export function ProductGallery() {
  return (
    <section className="w-full">
      <div className="md:hidden">
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-6 pb-8">
          {images.map((image, index) => (
            <div
              key={`${image.alt}-${index}`}
              className="relative min-w-[80%] snap-center overflow-hidden border border-zinc-900 bg-black"
            >
              <div className="aspect-[4/5]">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover grayscale contrast-125"
                />
              </div>
              <div className="absolute bottom-4 left-4">
                <span className="border border-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/80 backdrop-blur">
                  {image.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden md:grid md:grid-cols-2 gap-4 px-6">
        {images.map((image, index) => (
          <div
            key={`${image.alt}-${index}`}
            className="relative aspect-[4/5] overflow-hidden border border-zinc-900 bg-black"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="h-full w-full object-cover grayscale contrast-125 transition-transform duration-700 ease-out hover:scale-105"
            />
            <div className="absolute bottom-4 left-4">
              <span className="border border-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/80 backdrop-blur">
                {image.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
