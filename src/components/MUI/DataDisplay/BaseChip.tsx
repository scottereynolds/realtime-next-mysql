"use client";

import { Chip, type ChipProps as MuiChipProps } from "@mui/material";
import { clsx } from "clsx";

export type BaseChipProps = MuiChipProps & {
  className?: string;
  sx?: MuiChipProps["sx"];
};

export function BaseChip({ className, sx, ...rest }: BaseChipProps) {
  return (
    <Chip
      {...(rest as MuiChipProps)}
      className={clsx(className)}
      sx={{
        borderRadius: "var(--radius-full)",
        backgroundColor: "rgb(var(--muted))",
        color: "rgb(var(--muted-foreground))",
        ...(sx as any),
      }}
    />
  );
}
