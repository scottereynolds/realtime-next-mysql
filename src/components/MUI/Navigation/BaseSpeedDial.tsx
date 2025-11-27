"use client";

import {
  SpeedDial,
  SpeedDialAction,
  type SpeedDialProps as MuiSpeedDialProps,
  type SpeedDialActionProps as MuiSpeedDialActionProps,
} from "@mui/material";

export type BaseSpeedDialProps = MuiSpeedDialProps & {
  sx?: MuiSpeedDialProps["sx"];
};

export type BaseSpeedDialActionProps = MuiSpeedDialActionProps & {
  sx?: MuiSpeedDialActionProps["sx"];
};

export function BaseSpeedDial({ sx, ...rest }: BaseSpeedDialProps) {
  return (
    <SpeedDial
      {...(rest as MuiSpeedDialProps)}
      sx={{
        "& .MuiFab-root": {
          backgroundColor: "rgb(var(--primary))",
          color: "rgb(var(--primary-foreground))",
          boxShadow: "var(--shadow-lg)",
        },
        ...(sx as any),
      }}
    />
  );
}

export function BaseSpeedDialAction({ sx, ...rest }: BaseSpeedDialActionProps) {
  return (
    <SpeedDialAction
      {...(rest as MuiSpeedDialActionProps)}
      sx={{
        "& .MuiFab-root": {
          backgroundColor: "rgb(var(--background))",
          color: "rgb(var(--foreground))",
          boxShadow: "var(--shadow-sm)",
        },
        ...(sx as any),
      }}
    />
  );
}
