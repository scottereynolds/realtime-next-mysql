"use client";

import {
  ListItemText,
  type ListItemTextProps as MuiListItemTextProps,
} from "@mui/material";

export type BaseListItemTextProps = MuiListItemTextProps & {
  sx?: MuiListItemTextProps["sx"];
};

export function BaseListItemText({ sx, ...rest }: BaseListItemTextProps) {
  return (
    <ListItemText
      {...(rest as MuiListItemTextProps)}
      sx={{
        "& .MuiListItemText-primary": {
          color: "rgb(var(--foreground))",
        },
        "& .MuiListItemText-secondary": {
          color: "rgb(var(--muted-foreground))",
        },
        ...(sx as any),
      }}
    />
  );
}
