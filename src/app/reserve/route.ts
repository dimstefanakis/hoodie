import { randomUUID } from "node:crypto"
import { NextRequest, NextResponse } from "next/server"
import { sendMetaInitiateCheckoutConversion } from "@/lib/meta/conversions-api"

const stripePaymentLinkUrl = "https://buy.stripe.com/4gMdR99xF8zx86LgJG2Ji00"

export async function GET(request: NextRequest) {
  const eventId = request.nextUrl.searchParams.get("event_id") ?? randomUUID()

  const forwardedFor = request.headers.get("x-forwarded-for")
  const clientIpAddress = forwardedFor ? forwardedFor.split(",")[0]?.trim() : undefined

  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host")
  const protocol = request.headers.get("x-forwarded-proto") ?? "https"
  const fallbackSourceUrl = host ? `${protocol}://${host}${request.nextUrl.pathname}` : undefined
  const eventSourceUrl = request.headers.get("referer") ?? fallbackSourceUrl

  try {
    await sendMetaInitiateCheckoutConversion({
      eventId,
      eventSourceUrl,
      clientIpAddress,
      clientUserAgent: request.headers.get("user-agent") ?? undefined,
      fbp: request.cookies.get("_fbp")?.value,
      fbc: request.cookies.get("_fbc")?.value,
      value: 1,
      currency: "EUR",
    })
  } catch (error) {
    console.error("Meta CAPI InitiateCheckout error:", error)
  }

  const response = NextResponse.redirect(stripePaymentLinkUrl, { status: 302 })
  response.headers.set("cache-control", "no-store")
  return response
}
