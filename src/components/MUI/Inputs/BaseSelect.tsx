"use client";

import { Select, type SelectProps as MuiSelectProps } from "@mui/material";
import { clsx } from "clsx";

export type BaseSelectProps<T = unknown> = MuiSelectProps<T> & {
  className?: string;
  sx?: MuiSelectProps<T>["sx"];
};

export function BaseSelect<T = unknown>({
  className,
  sx,
  ...rest
}: BaseSelectProps<T>) {
  return (
    <Select
      {...(rest as MuiSelectProps<T>)}
      className={clsx("input-base", className)}
      sx={{
        borderRadius: "var(--radius-sm)",
        backgroundColor: "rgb(var(--background))",
        color: "rgb(var(--foreground))",
        "& fieldset": {
          borderColor: "rgb(var(--border))",
        },
        "&.Mui-focused fieldset": {
          borderColor: "rgb(var(--ring))",
        },
        ...(sx as any),
      }}
    />
  );
}