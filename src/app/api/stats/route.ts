import { NextResponse } from "next/server"
import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"

const DATA_PATH = path.join(process.cwd(), "src", "data", "cart-stats.json")
const MIN_COUNT = 12
const MAX_COUNT = 25

async function readCount() {
  try {
    const raw = await readFile(DATA_PATH, "utf8")
    const data = JSON.parse(raw) as { count?: number }
    if (typeof data.count === "number") return data.count
  } catch {
    // fall through to default
  }
  return MIN_COUNT
}

function normalizeCount(count: number) {
  if (count > MAX_COUNT) return MIN_COUNT
  if (count < MIN_COUNT) return MIN_COUNT
  return count
}

export async function GET() {
  const count = await readCount()
  return NextResponse.json({ count })
}

export async function POST() {
  const currentCount = await readCount()
  const nextCount = normalizeCount(currentCount + 1)

  await writeFile(DATA_PATH, JSON.stringify({ count: nextCount }, null, 2), "utf8")

  return NextResponse.json({ count: nextCount })
}
