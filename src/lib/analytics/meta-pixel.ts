export type MetaEventName =
  | "ViewContent"
  | "CustomizeProduct"
  | "AddToCart"
  | "InitiateCheckout"
  | "Lead"

export type MetaEventOptions = {
  eventId?: string
}

export function createEventId() {
  try {
    return crypto.randomUUID()
  } catch {
    return `${Date.now()}_${Math.random().toString(16).slice(2)}`
  }
}

export function trackMetaEvent(
  eventName: MetaEventName,
  data?: Record<string, string | number | boolean>,
  options?: MetaEventOptions,
) {
  if (typeof window === "undefined") return

  const fbq = window.fbq
  if (typeof fbq !== "function") return

  if (options?.eventId) {
    fbq("track", eventName, data ?? {}, { eventID: options.eventId })
    return
  }

  fbq("track", eventName, data ?? {})
}
