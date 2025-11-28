"use client";

import * as React from "react";
import createCache, { type Options as EmotionCacheOptions } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { useServerInsertedHTML } from "next/navigation";

interface ThemeRegistryProps {
  children: React.ReactNode;
  options?: EmotionCacheOptions;
}

/**
 * ThemeRegistry
 *
 * Handles Emotion's SSR integration with the Next.js App Router:
 * - Collects styles on the server
 * - Injects them into <head> before the HTML that uses them
 * - Avoids hydration mismatches where <style> tags appear inside the app tree
 */
export default function ThemeRegistry({ children, options }: ThemeRegistryProps) {
  const [{ cache, flush }] = React.useState(() => {
    const cache = createCache({
      key: "mui",
      prepend: true,
      ...options,
    });

    cache.compat = true;

    const prevInsert = cache.insert.bind(cache);
    let inserted: string[] = [];

    cache.insert = (...args: Parameters<typeof prevInsert>) => {
      const serialized = args[1] as { name: string };

      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }

      return prevInsert(...args);
    };

    const flush = () => {
      const prev = inserted;
      inserted = [];
      return prev;
    };

    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) return null;

    const styles = names
      .map((name) => cache.inserted[name] as string)
      .join("");

    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
