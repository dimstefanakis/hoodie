"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function MetaPixelPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const hasMountedRef = useRef(false)

  const queryString = searchParams?.toString() ?? ""

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }

    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "PageView")
    }
  }, [pathname, queryString])

  return null
}
