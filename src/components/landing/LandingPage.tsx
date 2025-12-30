'use client'

import { useState } from 'react'
import { Hero } from './Hero'
import { Features } from './Features'
import { ImageGrid } from './ImageGrid'
import { Footer } from './Footer'
import { LeadCaptureModal } from './LeadCaptureModal'

interface LandingPageProps {
  price: number
}

export function LandingPage({ price }: LandingPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black font-sans selection:bg-white selection:text-black">
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 mix-blend-difference text-white">
        <span className="text-xl font-bold tracking-tighter">The Cloak.</span>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="text-sm uppercase tracking-widest hover:underline underline-offset-4"
        >
          Reserve
        </button>
      </header>

      <main>
        <Hero onBuyClick={() => setIsModalOpen(true)} />
        <ImageGrid />
        <Features />
      </main>

      <Footer />

      <LeadCaptureModal 
        isOpen={isModalOpen} 
        onOpenChange={setIsModalOpen}
        price={price}
      />
    </div>
  )
}