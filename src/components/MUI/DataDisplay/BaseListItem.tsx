"use client";

import { ListItem, type ListItemProps as MuiListItemProps } from "@mui/material";
import { clsx } from "clsx";

export type BaseListItemProps = MuiListItemProps & {
  className?: string;
  sx?: MuiListItemProps["sx"];
};

export function BaseListItem({ className, sx, ...rest }: BaseListItemProps) {
  return (
    <ListItem
      {...(rest as MuiListItemProps)}
      className={clsx(className)}
      sx={{
        borderRadius: "var(--radius-md)",
        "&:hover": {
          backgroundColor: "rgb(var(--muted))",
        },
        ...(sx as any),
      }}
    />
  );
}
