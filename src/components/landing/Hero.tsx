import { Button } from "@/components/ui/button"

interface HeroProps {
  onBuyClick: () => void
}

export function Hero({ onBuyClick }: HeroProps) {
  return (
    <section className="relative h-screen w-full flex flex-col justify-center items-center text-center overflow-hidden bg-black text-white">

      {/* Background Visual Layer */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full opacity-60 grayscale scale-105"
        >
          <source src="/videos/202512301326.webm" type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20"></div>
        {/* Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      </div>

      {/* Content Layer */}
      <div className="z-10 max-w-4xl mx-auto px-6 space-y-8 mt-12">
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
          <h1 className="text-7xl md:text-9xl font-semibold tracking-tighter leading-none text-white drop-shadow-2xl">
            The Cloak.
          </h1>
          <p className="text-xl md:text-3xl font-light tracking-wide text-zinc-300 max-w-2xl mx-auto drop-shadow-lg">
            Heavy. Quiet. Yours.
          </p>
        </div>

        <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
          <p className="text-lg font-light leading-relaxed text-zinc-200/90 drop-shadow-md">
            A 2ks weighted sanctuary designed to disconnect you from the noise.
          </p>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both pt-4">
          <Button
            onClick={onBuyClick}
            className="h-14 px-12 text-lg font-normal tracking-wide bg-white text-black hover:bg-zinc-200 border-none rounded-full transition-all hover:scale-105 duration-300 shadow-xl"
          >
            Secure Early Access
          </Button>
          <p className="mt-4 text-xs uppercase tracking-widest text-zinc-500 font-medium">
            Limited First Drop
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50 z-10">
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white to-transparent"></div>
      </div>
    </section>
  )
}
