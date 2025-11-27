"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import type {
  DialogConfig,
  DialogContextValue,
} from "@/types/ui";

const DialogContext = createContext<DialogContextValue | undefined>(
  undefined,
);

interface DialogProviderProps {
  children: ReactNode;
}

export function DialogProvider({ children }: DialogProviderProps) {
  const [dialog, setDialog] = useState<DialogConfig | null>(null);

  const openDialog = useCallback((config: DialogConfig) => {
    setDialog((prev) => {
      const id = config.id ?? prev?.id ?? crypto.randomUUID();
      return { ...config, id };
    });
  }, []);

  const closeDialog = useCallback((id?: string) => {
    setDialog((current) => {
      if (!current) return null;
      if (!id || current.id === id) return null;
      return current;
    });
  }, []);

  const handleClose = useCallback<
    NonNullable<React.ComponentProps<typeof Dialog>["onClose"]>
  >(
    (_event, reason) => {
      if (dialog?.disableCloseOnBackdropClick && reason === "backdropClick") {
        return;
      }
      if (dialog?.id) {
        closeDialog(dialog.id);
      } else {
        closeDialog();
      }
    },
    [dialog, closeDialog],
  );

  const contextValue: DialogContextValue = {
    openDialog,
    closeDialog,
  };

  const isOpen = !!dialog;

  // Map DialogSize to MUI maxWidth
  const maxWidth: "xs" | "sm" | "md" | "lg" | "xl" | false =
    dialog?.size && dialog.size !== "full" ? dialog.size : "sm";

  const fullScreen = dialog?.size === "full" || dialog?.fullScreen === true;

  return (
    <DialogContext.Provider value={contextValue}>
      {children}

      <Dialog
        open={isOpen}
        onClose={handleClose}
        maxWidth={maxWidth}
        fullWidth
        fullScreen={fullScreen}
      >
        {dialog?.title && (
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              pr: 1,
            }}
          >
            {dialog.title}
            <IconButton
              aria-label="Close dialog"
              onClick={() =>
                dialog?.id ? closeDialog(dialog.id) : closeDialog()
              }
              size="small"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </DialogTitle>
        )}
        {dialog?.content && (
          <DialogContent dividers>{dialog.content}</DialogContent>
        )}
      </Dialog>
    </DialogContext.Provider>
  );
}

export function useDialog(): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return ctx;
}
