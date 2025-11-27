"use client";

import { Checkbox, type CheckboxProps } from "@mui/material";

export interface BaseCheckboxProps extends CheckboxProps {}

export function BaseCheckbox({ sx, ...rest }: BaseCheckboxProps) {
  return (
    <Checkbox
      {...rest}
      sx={{
        color: "rgb(var(--border))",
        "&.Mui-checked": {
          color: "rgb(var(--primary))",
        },
        ...(sx as any),
      }}
    />
  );
}
