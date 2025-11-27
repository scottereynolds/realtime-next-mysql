"use client";

import { Grid, type GridProps as MuiGridProps } from "@mui/material";

export type BaseGridProps = MuiGridProps & {
  sx?: MuiGridProps["sx"];
};

export function BaseGrid({ sx, ...rest }: BaseGridProps) {
  return (
    <Grid
      {...(rest as MuiGridProps)}
      sx={{
        ...(sx as any),
      }}
    />
  );
}
