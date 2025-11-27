"use client";

import { Avatar, type AvatarProps as MuiAvatarProps } from "@mui/material";
import { clsx } from "clsx";

export type BaseAvatarProps = MuiAvatarProps & {
  className?: string;
  sx?: MuiAvatarProps["sx"];
};

export function BaseAvatar({ className, sx, ...rest }: BaseAvatarProps) {
  return (
    <Avatar
      {...(rest as MuiAvatarProps)}
      className={clsx(className)}
      sx={{
        backgroundColor: "rgb(var(--primary))",
        color: "rgb(var(--primary-foreground))",
        ...(sx as any),
      }}
    />
  );
}
