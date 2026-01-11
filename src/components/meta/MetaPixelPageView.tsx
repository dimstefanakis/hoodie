"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function MetaPixelPageView() {
  const pathname = usePathname();
  const hasMountedRef = useRef(false);
  const lastLocationRef = useRef<string | null>(null);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      lastLocationRef.current =
        typeof window !== "undefined"
          ? `${window.location.pathname}${window.location.search}`
          : null;
      return;
    }

    if (typeof window === "undefined") return;

    const currentLocation = `${window.location.pathname}${window.location.search}`;
    if (currentLocation === lastLocationRef.current) return;

    lastLocationRef.current = currentLocation;

    if (typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  }, [pathname]);

  return null;
}
