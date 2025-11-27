"use client";

import {
  BottomNavigation,
  BottomNavigationAction,
  type BottomNavigationProps as MuiBottomNavigationProps,
  type BottomNavigationActionProps as MuiBottomNavigationActionProps,
} from "@mui/material";
import { clsx } from "clsx";

export type BaseBottomNavigationProps = MuiBottomNavigationProps & {
  className?: string;
  sx?: MuiBottomNavigationProps["sx"];
};

export type BaseBottomNavigationActionProps = MuiBottomNavigationActionProps & {
  sx?: MuiBottomNavigationActionProps["sx"];
};

export function BaseBottomNavigation({
  className,
  sx,
  ...rest
}: BaseBottomNavigationProps) {
  return (
    <BottomNavigation
      {...(rest as MuiBottomNavigationProps)}
      className={clsx(className)}
      sx={{
        backgroundColor: "rgb(var(--background))",
        color: "rgb(var(--foreground))",
        borderTop: "1px solid rgb(var(--border))",
        ...(sx as any),
      }}
    />
  );
}

export function BaseBottomNavigationAction({
  sx,
  ...rest
}: BaseBottomNavigationActionProps) {
  return (
    <BottomNavigationAction
      {...(rest as MuiBottomNavigationActionProps)}
      sx={{
        color: "rgb(var(--muted-foreground))",
        "&.Mui-selected": {
          color: "rgb(var(--primary))",
        },
        ...(sx as any),
      }}
    />
  );
}
