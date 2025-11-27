"use client";

import { Button, type ButtonProps } from "@mui/material";
import { clsx } from "clsx";

export interface BaseButtonProps extends ButtonProps {}

export function BaseButton({ className, sx, ...rest }: BaseButtonProps) {
  return (
    <Button
      {...rest}
      className={clsx("btn-primary", className)}
      sx={{
        borderRadius: "var(--radius-md)",
        textTransform: "none",
        boxShadow: "var(--shadow-sm)",
        ...(sx as any),
      }}
    />
  );
}
