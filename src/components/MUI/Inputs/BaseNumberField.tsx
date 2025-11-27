"use client";

import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { clsx } from "clsx";

export interface BaseNumberFieldProps extends Omit<TextFieldProps, "type"> {}

/**
 * BaseNumberField
 * Temporarily uses TextField with type="number".
 * If you later adopt Base UI's NumberField, you can swap the internals here.
 */
export function BaseNumberField({ className, sx, ...rest }: BaseNumberFieldProps) {
  return (
    <TextField
      {...rest}
      type="number"
      className={clsx("input-base", className)}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "var(--radius-sm)",
          backgroundColor: "rgb(var(--background))",
          color: "rgb(var(--foreground))",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgb(var(--border))",
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgb(var(--ring))",
        },
        ...(sx as any),
      }}
    />
  );
}
