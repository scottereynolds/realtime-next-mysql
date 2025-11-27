"use client";

import { List, type ListProps as MuiListProps } from "@mui/material";
import { clsx } from "clsx";

export type BaseListProps = MuiListProps & {
  className?: string;
  sx?: MuiListProps["sx"];
};

export function BaseList({ className, sx, ...rest }: BaseListProps) {
  return (
    <List
      {...(rest as MuiListProps)}
      className={clsx(className)}
      sx={{
        backgroundColor: "rgb(var(--background))",
        color: "rgb(var(--foreground))",
        ...(sx as any),
      }}
    />
  );
}
