"use client";

import {
  TableContainer,
  type TableContainerProps as MuiTableContainerProps,
} from "@mui/material";
import { clsx } from "clsx";

export type BaseTableContainerProps = MuiTableContainerProps & {
  className?: string;
  sx?: MuiTableContainerProps["sx"];
};

export function BaseTableContainer({
  className,
  sx,
  ...rest
}: BaseTableContainerProps) {
  return (
    <TableContainer
      {...(rest as MuiTableContainerProps)}
      className={clsx(className)}
      sx={{
        backgroundColor: "rgb(var(--background))",
        color: "rgb(var(--foreground))",
        borderRadius: "var(--radius-lg)",
        borderWidth: "var(--border-width)",
        borderStyle: "solid",
        borderColor: "rgb(var(--border))",
        boxShadow: "var(--shadow-sm)",
        ...(sx as any),
      }}
    />
  );
}
