"use client";

import { Stack, type StackProps as MuiStackProps } from "@mui/material";

export type BaseStackProps = MuiStackProps & {
  sx?: MuiStackProps["sx"];
};

export function BaseStack({ sx, ...rest }: BaseStackProps) {
  return (
    <Stack
      {...(rest as MuiStackProps)}
      sx={{
        ...(sx as any),
      }}
    />
  );
}
