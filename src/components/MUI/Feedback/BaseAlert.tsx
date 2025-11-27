"use client";

import { Alert, type AlertProps as MuiAlertProps } from "@mui/material";
import { clsx } from "clsx";

export type BaseAlertProps = MuiAlertProps & {
  className?: string;
  sx?: MuiAlertProps["sx"];
};

export function BaseAlert({ className, sx, ...rest }: BaseAlertProps) {
  return (
    <Alert
      {...(rest as MuiAlertProps)}
      className={clsx(className)}
      sx={{
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-sm)",
        "&.MuiAlert-filledSuccess": {
          backgroundColor: "rgb(var(--success))",
          color: "rgb(var(--success-foreground))",
        },
        "&.MuiAlert-filledError": {
          backgroundColor: "rgb(var(--error))",
          color: "rgb(var(--error-foreground))",
        },
        "&.MuiAlert-filledWarning": {
          backgroundColor: "rgb(var(--warning))",
          color: "rgb(var(--warning-foreground))",
        },
        "&.MuiAlert-filledInfo": {
          backgroundColor: "rgb(var(--info))",
          color: "rgb(var(--info-foreground))",
        },
        ...(sx as any),
      }}
    />
  );
}
