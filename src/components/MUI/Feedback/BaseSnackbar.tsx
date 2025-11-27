"use client";

import { ReactNode } from "react";
import {
  Snackbar,
  Alert,
  type SnackbarProps,
  type AlertColor,
} from "@mui/material";

export interface BaseSnackbarProps extends Omit<SnackbarProps, "message"> {
  severity?: AlertColor;
  message?: ReactNode;
}

export default function BaseSnackbar({
  severity = "info",
  message,
  children,
  onClose,
  anchorOrigin,
  ...snackbarProps
}: BaseSnackbarProps) {
  return (
    <Snackbar
      {...snackbarProps}
      onClose={onClose}
      anchorOrigin={
        anchorOrigin ?? { vertical: "bottom", horizontal: "center" }
      }
      message={undefined}
    >
      <Alert
        // ❌ no onClose here → no close icon
        severity={severity}
        variant="outlined"
        sx={{
          width: "100%",
          borderRadius: 9999,
          bgcolor: "rgb(var(--card))",
          color: "rgb(var(--card-foreground))",
          borderColor: "rgb(var(--border))",
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
          display: "flex",
          alignItems: "center",
          "& .MuiAlert-icon": {
            color: "rgb(var(--primary))",
          },
        }}
        elevation={0}
      >
        {children ?? message}
      </Alert>
    </Snackbar>
  );
}
