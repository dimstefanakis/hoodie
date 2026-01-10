import Link from "next/link";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { ImageGrid } from "@/components/landing/ImageGrid";
import { Footer } from "@/components/landing/Footer";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-black font-sans selection:bg-white selection:text-black">
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 mix-blend-difference text-white">
        <span className="text-xl font-bold tracking-tighter">The Cloak.</span>
        <Link
          href="/shop"
          className="text-sm uppercase tracking-widest hover:underline underline-offset-4"
        >
          Shop now
        </Link>
      </header>

      <main>
        <Hero ctaHref="/shop" />
        <ImageGrid />
        <Features />
      </main>

      <Footer />
    </div>
  );
}
