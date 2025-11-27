"use client";

import { ButtonGroup, type ButtonGroupProps } from "@mui/material";
import { clsx } from "clsx";

export interface BaseButtonGroupProps extends ButtonGroupProps {}

export function BaseButtonGroup({ className, sx, ...rest }: BaseButtonGroupProps) {
  return (
    <ButtonGroup
      {...rest}
      className={clsx(className)}
      sx={{
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-xs)",
        ...(sx as any),
      }}
    />
  );
}
