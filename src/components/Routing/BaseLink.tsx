"use client";

import NextLink, { type LinkProps } from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { useLoading } from "@/contexts/LoadingContext";

export interface BaseLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * BaseLink
 *
 * Wraps next/link and triggers route-level loading when clicked,
 * unless the click is prevented (e.g. modified click, onClick prevents default).
 */
export function BaseLink({
  children,
  onClick,
  className,
  ...linkProps
}: BaseLinkProps) {
  const { startLoading } = useLoading();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(event);
    }

    // If user prevented default or used modifier keys, don't start route loading.
    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    startLoading("route");
  };

  return (
    <NextLink
      {...linkProps}
      className={className}
      onClick={handleClick}
    >
      {children}
    </NextLink>
  );
}
