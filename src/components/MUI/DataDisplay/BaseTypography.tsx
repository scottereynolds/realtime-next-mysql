"use client";

import { Typography, type TypographyProps as MuiTypographyProps } from "@mui/material";
import { clsx } from "clsx";

export type BaseTypographyProps = MuiTypographyProps & {
  className?: string;
  sx?: MuiTypographyProps["sx"];
};

export function BaseTypography({ className, sx, ...rest }: BaseTypographyProps) {
  return (
    <Typography
      {...(rest as MuiTypographyProps)}
      className={clsx("text-app", className)}
      sx={{
        color: "rgb(var(--foreground))",
        ...(sx as any),
      }}
    />
  );
}
