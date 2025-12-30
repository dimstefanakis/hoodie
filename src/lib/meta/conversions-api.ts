import crypto from "node:crypto"

type SendLeadConversionParams = {
  email: string
  eventId?: string
  eventSourceUrl?: string
  clientIpAddress?: string
  clientUserAgent?: string
  fbp?: string
  fbc?: string
  value?: number
  currency?: string
}

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex")
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function getGraphApiVersion() {
  const version = process.env.META_GRAPH_API_VERSION ?? process.env.FACEBOOK_API_VERSION ?? "20.0"
  return version.startsWith("v") ? version.slice(1) : version
}

export async function sendMetaCompleteRegistrationConversion({
  email,
  eventId,
  eventSourceUrl,
  clientIpAddress,
  clientUserAgent,
  fbp,
  fbc,
  value,
  currency,
}: SendLeadConversionParams) {
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN ?? process.env.FACEBOOK_ACCESS_TOKEN
  const pixelId =
    process.env.META_PIXEL_ID ??
    process.env.FACEBOOK_PIXEL_ID ??
    process.env.NEXT_PUBLIC_META_PIXEL_ID ??
    process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ??
    "1586140139068133"

  if (!accessToken || !pixelId) return

  const eventTime = Math.floor(Date.now() / 1000)
  const graphApiVersion = getGraphApiVersion()
  const endpoint = `https://graph.facebook.com/v${graphApiVersion}/${pixelId}/events?access_token=${encodeURIComponent(
    accessToken,
  )}`

  const body = {
    data: [
      {
        event_name: "CompleteRegistration",
        event_time: eventTime,
        event_id: eventId,
        action_source: "website",
        event_source_url: eventSourceUrl,
        user_data: {
          em: [sha256(normalizeEmail(email))],
          client_ip_address: clientIpAddress,
          client_user_agent: clientUserAgent,
          fbp,
          fbc,
        },
        custom_data:
          typeof value === "number"
            ? {
                content_name: "Email Waitlist",
                value,
                currency: currency ?? "EUR",
              }
            : undefined,
      },
    ],
    test_event_code: process.env.META_CAPI_TEST_EVENT_CODE ?? process.env.FACEBOOK_TEST_EVENT_CODE,
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const responseText = await response.text().catch(() => "")
    console.error(
      "Meta CAPI CompleteRegistration request failed:",
      response.status,
      responseText,
    )
  }
}
