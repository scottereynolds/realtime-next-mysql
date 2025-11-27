"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLoading } from "@/contexts/LoadingContext";

/**
 * RouteLoadingWatcher
 *
 * Listens for route changes (pathname + search) and
 * stops route-level loading when the new route is active.
 */
export function RouteLoadingWatcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { stopLoading } = useLoading();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // On first render we don't want to stop anything;
    // this is just the initial page load.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    stopLoading("route");
  }, [pathname, searchParams, stopLoading]);

  return null;
}
