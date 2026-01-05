'use client'

import { useState, useActionState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { submitLead } from "@/actions/submit-lead"
import { Loader2 } from "lucide-react"

interface LeadCaptureModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  price: number
}

const stripeReservePath = "/reserve"

function createEventId() {
  try {
    return crypto.randomUUID()
  } catch {
    return `${Date.now()}_${Math.random().toString(16).slice(2)}`
  }
}

export function LeadCaptureModal({ isOpen, onOpenChange, price }: LeadCaptureModalProps) {
  const [state, formAction, isPending] = useActionState(submitLead, {})
  const [dismissedSuccessEventId, setDismissedSuccessEventId] = useState<string | undefined>(undefined)
  const lastTrackedEventIdRef = useRef<string | undefined>(undefined)

  const handleReserveClick = () => {
    const eventId = createEventId()

    const fbq = window.fbq
    const href = `${stripeReservePath}?event_id=${encodeURIComponent(eventId)}`

    if (typeof fbq === "function") {
      fbq("track", "InitiateCheckout", { value: 1, currency: "EUR" }, { eventID: eventId })
      setTimeout(() => {
        window.location.href = href
      }, 150)
      return
    }

    window.location.href = href
  }

  const successEventId = state.success ? state.eventId : undefined
  const successOpen = Boolean(successEventId && dismissedSuccessEventId !== successEventId)

  const handleSuccessOpenChange = (open: boolean) => {
    if (!open && successEventId) {
      setDismissedSuccessEventId(successEventId)
      onOpenChange(false)
    }
  }

  useEffect(() => {
    if (!state.success || !state.eventId) return
    if (lastTrackedEventIdRef.current === state.eventId) return

    lastTrackedEventIdRef.current = state.eventId

    const fbq = window.fbq
    if (typeof fbq === 'function') {
      fbq('track', 'CompleteRegistration', { value: price, currency: 'EUR' }, { eventID: state.eventId })
    }
  }, [state.success, state.eventId, price])

  return (
    <>
      <Dialog open={isOpen && !successOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-light tracking-tight text-center pb-2">
              Secure Early Access
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500 pb-4">
              The first drop of The Cloak is allocated. Join the priority list to be notified when the next batch is available for €{price}.
            </DialogDescription>
          </DialogHeader>
          
          <form action={formAction} className="space-y-6">
            <input type="hidden" name="price" value={price} />
            
            <div className="space-y-2">
              <Label htmlFor="email" className="sr-only">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="email@example.com"
                required
                className="h-12 border-zinc-200 dark:border-zinc-800 bg-transparent text-lg focus-visible:ring-1 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-50"
              />
            </div>

            {state.error && (
              <p className="text-sm text-red-500 text-center">{state.error}</p>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-normal bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 rounded-none transition-all"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                "Notify Me"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={successOpen} onOpenChange={handleSuccessOpenChange}>
        <DialogContent className="sm:max-w-[425px] border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black p-8 text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl font-light tracking-tight pb-2">
              You are on the waitlist.
            </DialogTitle>
            <DialogDescription className="text-zinc-500 text-lg">
              We will notify you when general public access opens.
            </DialogDescription>
          </DialogHeader>
          <div className="pt-6">
            <p className="text-sm font-light text-zinc-500 dark:text-zinc-400 leading-relaxed pb-4">
              Don't want to wait? Batch 1 is strictly limited. You can skip the line and secure your allocation today.
            </p>
            <ul className="text-sm font-light text-zinc-500 dark:text-zinc-400 leading-relaxed pb-6 text-left space-y-3">
              <li className="flex items-start">
                <span className="mr-2 text-zinc-950 dark:text-white">•</span>
                <span>
                  <strong className="font-medium text-zinc-950 dark:text-white">Guaranteed:</strong> Lock in your
                  allocation before it sells out.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-zinc-950 dark:text-white">•</span>
                <span>
                  <strong className="font-medium text-zinc-950 dark:text-white">Priority:</strong> Your order ships in
                  the first wave.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-zinc-950 dark:text-white">•</span>
                <span>
                  <strong className="font-medium text-zinc-950 dark:text-white">Deposit:</strong> The €1 is deducted from
                  your final price.
                </span>
              </li>
            </ul>
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleReserveClick}
                className="w-full h-12 text-lg font-normal bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 rounded-none"
              >
                Secure Allocation for €1
              </Button>
              <Button
                onClick={() => handleSuccessOpenChange(false)}
                className="w-full h-12 text-lg font-normal bg-transparent text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-900 border-0 rounded-none"
              >
                I'll wait for public release
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
