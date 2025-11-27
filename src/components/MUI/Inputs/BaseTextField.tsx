// src/components/MUI/BaseTextField.tsx
"use client";

import TextField, {
  type TextFieldProps as MuiTextFieldProps,
} from "@mui/material/TextField";
import { clsx } from "clsx";

// Use a type alias + intersection instead of `interface extends`
export type BaseTextFieldProps = MuiTextFieldProps & {
  className?: string;
  sx?: MuiTextFieldProps["sx"];
};

export function BaseTextField({ className, sx, ...rest }: BaseTextFieldProps) {
  return (
    <TextField
      {...(rest as MuiTextFieldProps)}
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
