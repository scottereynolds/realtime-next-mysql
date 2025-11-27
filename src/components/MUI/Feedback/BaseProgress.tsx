"use client";

import {
  LinearProgress,
  CircularProgress,
  type LinearProgressProps as MuiLinearProgressProps,
  type CircularProgressProps as MuiCircularProgressProps,
} from "@mui/material";

export type BaseLinearProgressProps = MuiLinearProgressProps & {
  sx?: MuiLinearProgressProps["sx"];
};

export type BaseCircularProgressProps = MuiCircularProgressProps & {
  sx?: MuiCircularProgressProps["sx"];
};

export function BaseLinearProgress({ sx, ...rest }: BaseLinearProgressProps) {
  return (
    <LinearProgress
      {...(rest as MuiLinearProgressProps)}
      sx={{
        backgroundColor: "rgb(var(--muted))",
        "& .MuiLinearProgress-bar": {
          backgroundColor: "rgb(var(--primary))",
        },
        ...(sx as any),
      }}
    />
  );
}

export function BaseCircularProgress({
  sx,
  ...rest
}: BaseCircularProgressProps) {
  return (
    <CircularProgress
      {...(rest as MuiCircularProgressProps)}
      sx={{
        color: "rgb(var(--primary))",
        ...(sx as any),
      }}
    />
  );
}
