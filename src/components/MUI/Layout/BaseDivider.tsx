"use client";

import { Divider, type DividerProps as MuiDividerProps } from "@mui/material";

export type BaseDividerProps = MuiDividerProps & {
  sx?: MuiDividerProps["sx"];
};

export function BaseDivider({ sx, ...rest }: BaseDividerProps) {
  return (
    <Divider
      {...(rest as MuiDividerProps)}
      sx={{
        borderColor: "rgb(var(--border))",
        ...(sx as any),
      }}
    />
  );
}
