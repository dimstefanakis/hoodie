type AirtableCreateRecordResponse = {
  records?: Array<{ id: string }>
}

export async function createWaitlistRecord(email: string) {
  if (process.env.TESTING === "true") return "test-id"

  const apiKey = process.env.AIRTABLE_API_KEY
  const baseId = process.env.AIRTABLE_BASE_ID
  const tableName = process.env.AIRTABLE_TABLE_NAME ?? "Waitlist"
  const emailField = process.env.AIRTABLE_EMAIL_FIELD ?? "Email"

  if (!apiKey || !baseId) {
    throw new Error("Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID")
  }

  const url = `https://api.airtable.com/v0/${encodeURIComponent(baseId)}/${encodeURIComponent(tableName)}`

  const response = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      records: [{ fields: { [emailField]: email } }],
    }),
  })

  if (!response.ok) {
    const responseText = await response.text().catch(() => "")
    throw new Error(`Airtable create failed (${response.status}): ${responseText}`)
  }

  const json = (await response.json()) as AirtableCreateRecordResponse
  const recordId = json.records?.[0]?.id
  if (!recordId) throw new Error("Airtable create succeeded but returned no record id")

  return recordId
}
