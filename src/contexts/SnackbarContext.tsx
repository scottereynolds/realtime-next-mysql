"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type {
  SnackbarOptions,
  SnackbarContextValue,
} from "@/types/ui";
import BaseSnackbar from "@/components/MUI/Feedback/BaseSnackbar";

const SnackbarContext = createContext<SnackbarContextValue | undefined>(
  undefined,
);

interface SnackbarProviderProps {
  children: ReactNode;
}

export function SnackbarProvider({ children }: SnackbarProviderProps) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<SnackbarOptions | null>(null);

  const showSnackbar = useCallback((opts: SnackbarOptions) => {
    setOptions(opts);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const contextValue: SnackbarContextValue = {
    showSnackbar,
  };

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}

      {options && (
        <BaseSnackbar
          open={open}
          onClose={handleClose}
          message={options.message}
          severity={options.variant}
          autoHideDuration={options.autoHideDuration}
        />
      )}
    </SnackbarContext.Provider>
  );
}

export function useSnackbar(): SnackbarContextValue {
  const ctx = useContext(SnackbarContext);
  if (!ctx) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return ctx;
}
