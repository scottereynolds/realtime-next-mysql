"use client";

import { Backdrop, type BackdropProps as MuiBackdropProps } from "@mui/material";

export type BaseBackdropProps = MuiBackdropProps & {
  sx?: MuiBackdropProps["sx"];
};

export function BaseBackdrop({ sx, ...rest }: BaseBackdropProps) {
  return (
    <Backdrop
      {...(rest as MuiBackdropProps)}
      sx={{
        color: "rgb(var(--foreground))",
        zIndex: "var(--z-dialog)",
        backgroundColor: "rgba(15, 23, 42, 0.6)", // slate-900-ish overlay
        ...(sx as any),
      }}
    />
  );
}
