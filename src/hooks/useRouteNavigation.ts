"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useLoading } from "@/contexts/LoadingContext";

/**
 * useRouteNavigation
 *
 * Wraps next/navigation's router to start route-level loading
 * when pushing/replacing routes.
 */
export function useRouteNavigation() {
  const router = useRouter();
  const { startLoading } = useLoading();

  const push = useCallback(
    (href: string) => {
      startLoading("route");
      router.push(href);
    },
    [router, startLoading],
  );

  const replace = useCallback(
    (href: string) => {
      startLoading("route");
      router.replace(href);
    },
    [router, startLoading],
  );

  return {
    ...router,
    push,
    replace,
  };
}
