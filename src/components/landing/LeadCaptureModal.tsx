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

export function LeadCaptureModal({ isOpen, onOpenChange, price }: LeadCaptureModalProps) {
  const [state, formAction, isPending] = useActionState(submitLead, {})
  const [dismissedSuccessEventId, setDismissedSuccessEventId] = useState<string | undefined>(undefined)
  const lastTrackedEventIdRef = useRef<string | undefined>(undefined)

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
              You are on the list.
            </DialogTitle>
            <DialogDescription className="text-zinc-500 text-lg">
              We will email you the moment orders open.
            </DialogDescription>
          </DialogHeader>
          <div className="pt-6">
            <Button 
              onClick={() => handleSuccessOpenChange(false)}
              className="w-full h-12 text-lg font-normal bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 rounded-none"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
