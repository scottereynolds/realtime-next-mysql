"use client";

import {
  ListItemButton,
  type ListItemButtonProps as MuiListItemButtonProps,
} from "@mui/material";
import { clsx } from "clsx";

export type BaseListItemButtonProps = MuiListItemButtonProps & {
  className?: string;
  sx?: MuiListItemButtonProps["sx"];
};

export function BaseListItemButton({
  className,
  sx,
  ...rest
}: BaseListItemButtonProps) {
  return (
    <ListItemButton
      {...(rest as MuiListItemButtonProps)}
      className={clsx(className)}
      sx={{
        borderRadius: "var(--radius-md)",
        "&.Mui-selected": {
          backgroundColor: "rgb(var(--primary))",
          color: "rgb(var(--primary-foreground))",
          "&:hover": {
            backgroundColor: "rgb(var(--primary))",
          },
        },
        ...(sx as any),
      }}
    />
  );
}
