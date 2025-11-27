"use client";

import { Badge, type BadgeProps as MuiBadgeProps } from "@mui/material";

export type BaseBadgeProps = MuiBadgeProps & {
  sx?: MuiBadgeProps["sx"];
};

export function BaseBadge({ sx, ...rest }: BaseBadgeProps) {
  return (
    <Badge
      {...(rest as MuiBadgeProps)}
      sx={{
        "& .MuiBadge-badge": {
          backgroundColor: "rgb(var(--accent))",
          color: "rgb(var(--accent-foreground))",
        },
        ...(sx as any),
      }}
    />
  );
}
