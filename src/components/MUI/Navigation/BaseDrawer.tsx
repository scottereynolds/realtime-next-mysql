"use client";

import { Drawer, type DrawerProps as MuiDrawerProps } from "@mui/material";

export type BaseDrawerProps = MuiDrawerProps & {
  sx?: MuiDrawerProps["sx"];
};

export function BaseDrawer({ sx, ...rest }: BaseDrawerProps) {
  return (
    <Drawer
      {...(rest as MuiDrawerProps)}
      sx={{
        "& .MuiDrawer-paper": {
          backgroundColor: "rgb(var(--background))",
          color: "rgb(var(--foreground))",
          borderRight: "1px solid rgb(var(--border))",
          boxShadow: "var(--shadow-lg)",
        },
        ...(sx as any),
      }}
    />
  );
}
