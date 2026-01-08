"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface LeadCaptureModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  price: number;
}

const stripeReservePath = "/reserve";

function createEventId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }
}

export function LeadCaptureModal({
  isOpen,
  onOpenChange,
  price,
}: LeadCaptureModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleReserveClick = () => {
    setIsLoading(true);
    const eventId = createEventId();
    const registrationEventId = `${eventId}-registration`;

    const fbq = window.fbq;
    const href = `${stripeReservePath}?event_id=${encodeURIComponent(eventId)}`;

    if (typeof fbq === "function") {
      fbq(
        "track",
        "CompleteRegistration",
        { content_name: "Email Waitlist" },
        { eventID: registrationEventId },
      );
      fbq(
        "track",
        "InitiateCheckout",
        { value: 1, currency: "EUR" },
        { eventID: eventId },
      );
    }

    window.location.href = href;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black p-8 text-center">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light tracking-tight pb-2">
            Secure Early Access
          </DialogTitle>
          <DialogDescription className="text-zinc-500 text-lg">
            Batch 1 is strictly limited.
          </DialogDescription>
        </DialogHeader>

        <div className="pt-6">
          {/* Price Context Paragraph */}
          <p className="text-sm font-light text-zinc-500 dark:text-zinc-400 leading-relaxed pb-8">
            The Cloak launches soon at{" "}
            <span className="text-zinc-950 dark:text-white font-medium">
              €{price}
            </span>
            . Avoid the public waitlist and secure your allocation now for just{" "}
            <span className="text-zinc-950 dark:text-white font-medium">
              €1 (refundable)
            </span>
            .
          </p>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleReserveClick}
              disabled={isLoading}
              className="w-full h-12 text-lg font-normal bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 rounded-none transition-all"
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
              onClick={() => onOpenChange(false)}
              className="w-full h-12 text-lg font-normal bg-transparent text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 dark:text-zinc-500 dark:hover:text-white dark:hover:bg-zinc-900 border-0 rounded-none"
            >
              I&apos;ll wait for public release
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
