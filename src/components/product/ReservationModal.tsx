"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { createEventId, trackMetaEvent } from "@/lib/analytics/meta-pixel"
import { useStore } from "@/store"

const stripeReservePath = "/reserve"

export function ReservationModal() {
  const isModalOpen = useStore((state) => state.isModalOpen)
  const setModalOpen = useStore((state) => state.setModalOpen)
  const [isLoading, setIsLoading] = useState(false)

  const handleReserveClick = () => {
    setIsLoading(true)

    const eventId = createEventId()

    trackMetaEvent(
      "Lead",
      { value: 1, currency: "EUR" },
      { eventId },
    )

    const href = `${stripeReservePath}?event_id=${encodeURIComponent(eventId)}`
    window.location.href = href
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
      <DialogContent className="border-zinc-900 bg-black p-8 text-center text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light tracking-tight">
            Secure Early Access
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Batch allocated.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <p className="text-sm text-zinc-400 leading-relaxed">
            The Cloak launches soon at <span className="text-white">€149</span>.
            Avoid the public waitlist and secure your allocation now for just{" "}
            <span className="text-white">€1 (refundable)</span>.
          </p>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleReserveClick}
              disabled={isLoading}
              className="h-12 w-full bg-white text-black hover:bg-zinc-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirecting...
                </>
              ) : (
                "Reserve Spot for €1"
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setModalOpen(false)}
              className="h-12 w-full text-zinc-400 hover:bg-zinc-900 hover:text-white"
            >
              I&apos;ll wait for public release
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
