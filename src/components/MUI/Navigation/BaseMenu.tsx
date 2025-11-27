"use client";

import {
  Menu,
  MenuItem,
  type MenuProps as MuiMenuProps,
  type MenuItemProps as MuiMenuItemProps,
} from "@mui/material";

export type BaseMenuProps = MuiMenuProps & {
  sx?: MuiMenuProps["sx"];
};

export type BaseMenuItemProps = MuiMenuItemProps & {
  sx?: MuiMenuItemProps["sx"];
};

export function BaseMenu({ sx, ...rest }: BaseMenuProps) {
  return (
    <Menu
      {...(rest as MuiMenuProps)}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "rgb(var(--background))",
            color: "rgb(var(--foreground))",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-lg)",
          },
        },
      }}
      sx={{
        ...(sx as any),
      }}
    />
  );
}

export function BaseMenuItem({ sx, ...rest }: BaseMenuItemProps) {
  return (
    <MenuItem
      {...(rest as MuiMenuItemProps)}
      sx={{
        "&.Mui-selected": {
          backgroundColor: "rgb(var(--muted))",
        },
        "&.Mui-selected:hover": {
          backgroundColor: "rgb(var(--muted))",
        },
        ...(sx as any),
      }}
    />
  );
}
