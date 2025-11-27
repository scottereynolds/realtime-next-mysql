"use client";

import { Paper, type PaperProps as MuiPaperProps } from "@mui/material";
import { clsx } from "clsx";

export type BasePaperProps = MuiPaperProps & {
  className?: string;
  sx?: MuiPaperProps["sx"];
};

export function BasePaper({ className, sx, ...rest }: BasePaperProps) {
  return (
    <Paper
      {...(rest as MuiPaperProps)}
      className={clsx(className)}
      sx={{
        backgroundColor: "rgb(var(--background))",
        color: "rgb(var(--foreground))",
        borderRadius: "var(--radius-lg)",
        borderWidth: "var(--border-width)",
        borderStyle: "solid",
        borderColor: "rgb(var(--border))",
        boxShadow: "var(--shadow-sm)",
        ...(sx as any),
      }}
    />
  );
}
