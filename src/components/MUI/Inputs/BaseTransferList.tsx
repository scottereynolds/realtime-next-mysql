"use client";

import { Box, type BoxProps } from "@mui/material";
import { clsx } from "clsx";

export interface BaseTransferListProps extends BoxProps {}

/**
 * BaseTransferList
 *
 * MUI's "Transfer List" is built from List, ListItem, Checkbox, etc.,
 * not a single component. This wrapper just gives you a themed container
 * for your composed transfer-list implementation.
 */
export function BaseTransferList({
  className,
  sx,
  ...rest
}: BaseTransferListProps) {
  return (
    <Box
      {...rest}
      className={clsx(className)}
      sx={{
        display: "flex",
        gap: 2,
        padding: 2,
        borderRadius: "var(--radius-lg)",
        borderWidth: "var(--border-width)",
        borderStyle: "solid",
        borderColor: "rgb(var(--border))",
        backgroundColor: "rgb(var(--background))",
        color: "rgb(var(--foreground))",
        boxShadow: "var(--shadow-sm)",
        ...(sx as any),
      }}
    />
  );
}
