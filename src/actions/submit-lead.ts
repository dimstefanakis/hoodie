'use server'

import { z } from 'zod'
import { cookies, headers } from 'next/headers'
import { sendMetaCompleteRegistrationConversion } from '@/lib/meta/conversions-api'
import { randomUUID } from 'node:crypto'
import { createWaitlistRecord } from '@/lib/airtable/waitlist'

const schema = z.object({
  email: z.string().trim().email(),
  price: z.string(),
  variant: z.string().optional(),
  event_id: z.string().optional(),
})

export type SubmitState = {
  success?: boolean
  error?: string
  message?: string
  eventId?: string
  airtableRecordId?: string
}

export async function submitLead(prevState: SubmitState, formData: FormData): Promise<SubmitState> {
  const rawEmail = formData.get('email')
  const rawPrice = formData.get('price')
  const rawVariant = formData.get('variant')
  const rawEventId = formData.get('event_id')

  const validatedFields = schema.safeParse({
    email: typeof rawEmail === 'string' ? rawEmail : undefined,
    price: typeof rawPrice === 'string' ? rawPrice : undefined,
    variant: typeof rawVariant === 'string' && rawVariant.length > 0 ? rawVariant : undefined,
    event_id: typeof rawEventId === 'string' && rawEventId.length > 0 ? rawEventId : undefined,
  })

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid email address.',
    }
  }

  const eventId = validatedFields.data.event_id ?? randomUUID()

  let airtableRecordId: string
  try {
    airtableRecordId = await createWaitlistRecord(validatedFields.data.email)
  } catch (error) {
    console.error('Airtable waitlist error:', error)
    return {
      success: false,
      error: 'Failed to add you to the waitlist. Please try again.',
    }
  }

  try {
    const requestHeaders = await headers()
    const cookieStore = await cookies()

    const forwardedFor = requestHeaders.get('x-forwarded-for')
    const clientIpAddress = forwardedFor ? forwardedFor.split(',')[0]?.trim() : undefined

    const host = requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host')
    const protocol = requestHeaders.get('x-forwarded-proto') ?? 'https'
    const fallbackSourceUrl = host ? `${protocol}://${host}/` : undefined
    const eventSourceUrl = requestHeaders.get('referer') ?? fallbackSourceUrl

    await sendMetaCompleteRegistrationConversion({
      email: validatedFields.data.email,
      eventId,
      eventSourceUrl,
      clientIpAddress,
      clientUserAgent: requestHeaders.get('user-agent') ?? undefined,
      fbp: cookieStore.get('_fbp')?.value,
      fbc: cookieStore.get('_fbc')?.value,
      value: Number.isFinite(Number(validatedFields.data.price)) ? Number(validatedFields.data.price) : undefined,
      currency: 'EUR',
    })
  } catch (error) {
    console.error('Meta CAPI CompleteRegistration error:', error)
  }

  return {
    success: true,
    message: "You're on the list.",
    eventId,
    airtableRecordId,
  }
}
