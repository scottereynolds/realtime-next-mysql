"use client";

import {
  AppBar,
  Toolbar,
  type AppBarProps as MuiAppBarProps,
  type ToolbarProps as MuiToolbarProps,
} from "@mui/material";
import { clsx } from "clsx";

export type BaseAppBarProps = MuiAppBarProps & {
  className?: string;
  sx?: MuiAppBarProps["sx"];
};

export type BaseToolbarProps = MuiToolbarProps & {
  className?: string;
  sx?: MuiToolbarProps["sx"];
};

export function BaseAppBar({ className, sx, ...rest }: BaseAppBarProps) {
  return (
    <AppBar
      {...(rest as MuiAppBarProps)}
      className={clsx(className)}
      sx={{
        backgroundColor: "rgb(var(--background))",
        color: "rgb(var(--foreground))",
        boxShadow: "var(--shadow-md)",
        zIndex: "var(--z-nav)",
        ...(sx as any),
      }}
    />
  );
}

export function BaseToolbar({ className, sx, ...rest }: BaseToolbarProps) {
  return (
    <Toolbar
      {...(rest as MuiToolbarProps)}
      className={clsx(className)}
      sx={{
        minHeight: 56,
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        ...(sx as any),
      }}
    />
  );
}
