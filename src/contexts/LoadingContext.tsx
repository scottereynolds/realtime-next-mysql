"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  LoadingChannel,
  LoadingContextValue,
  LoadingMode,
  LoadingState,
} from "@/types/ui";

const LoadingContext = createContext<LoadingContextValue | undefined>(
  undefined,
);

interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [state, setState] = useState<LoadingState>({
    globalCount: 0,
    perChannel: {},
    mode: "rgb",
  });

  const startLoading = useCallback((channel?: LoadingChannel) => {
    const key: LoadingChannel = channel ?? "global";

    setState((prev) => {
      const perChannel = { ...(prev.perChannel ?? {}) };
      const prevChannelCount = perChannel[key] ?? 0;

      return {
        ...prev,
        globalCount: prev.globalCount + 1,
        perChannel: {
          ...perChannel,
          [key]: prevChannelCount + 1,
        },
      };
    });
  }, []);

  const stopLoading = useCallback((channel?: LoadingChannel) => {
    const key: LoadingChannel = channel ?? "global";

    setState((prev) => {
      const perChannel = { ...(prev.perChannel ?? {}) };
      const prevChannelCount = perChannel[key] ?? 0;
      const nextChannelCount = Math.max(prevChannelCount - 1, 0);

      if (nextChannelCount === 0) {
        delete perChannel[key];
      } else {
        perChannel[key] = nextChannelCount;
      }

      const nextGlobal = Math.max(prev.globalCount - 1, 0);

      return {
        ...prev,
        globalCount: nextGlobal,
        perChannel,
      };
    });
  }, []);

  const setMode = useCallback((mode: LoadingMode) => {
    setState((prev) => ({
      ...prev,
      mode,
    }));
  }, []);

  const value = useMemo<LoadingContextValue>(() => {
    const isLoading = state.globalCount > 0;

    return {
      state,
      isLoading,
      mode: state.mode,
      setMode,
      startLoading,
      stopLoading,
    };
  }, [state, setMode, startLoading, stopLoading]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading(): LoadingContextValue {
  const ctx = useContext(LoadingContext);
  if (!ctx) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return ctx;
}
