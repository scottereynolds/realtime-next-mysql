"use client";

import {
  ListItemIcon,
  type ListItemIconProps as MuiListItemIconProps,
} from "@mui/material";

export type BaseListItemIconProps = MuiListItemIconProps & {
  sx?: MuiListItemIconProps["sx"];
};

export function BaseListItemIcon({ sx, ...rest }: BaseListItemIconProps) {
  return (
    <ListItemIcon
      {...(rest as MuiListItemIconProps)}
      sx={{
        color: "rgb(var(--muted-foreground))",
        minWidth: 40,
        ...(sx as any),
      }}
    />
  );
}
