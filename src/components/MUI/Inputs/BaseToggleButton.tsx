"use client";

import {
  ToggleButton,
  ToggleButtonGroup,
  type ToggleButtonProps,
  type ToggleButtonGroupProps,
} from "@mui/material";
import { clsx } from "clsx";

export interface BaseToggleButtonProps extends ToggleButtonProps {}
export interface BaseToggleButtonGroupProps extends ToggleButtonGroupProps {}

export function BaseToggleButton({
  className,
  sx,
  ...rest
}: BaseToggleButtonProps) {
  return (
    <ToggleButton
      {...rest}
      className={clsx(className)}
      sx={{
        textTransform: "none",
        borderRadius: "var(--radius-sm)",
        "&.Mui-selected": {
          backgroundColor: "rgb(var(--primary))",
          color: "rgb(var(--primary-foreground))",
        },
        ...(sx as any),
      }}
    />
  );
}

export function BaseToggleButtonGroup({
  className,
  sx,
  ...rest
}: BaseToggleButtonGroupProps) {
  return (
    <ToggleButtonGroup
      {...rest}
      className={clsx(className)}
      sx={{
        borderRadius: "var(--radius-md)",
        ...(sx as any),
      }}
    />
  );
}
