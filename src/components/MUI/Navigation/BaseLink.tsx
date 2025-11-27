"use client";

import { Link, type LinkProps as MuiLinkProps } from "@mui/material";
import { clsx } from "clsx";

export type BaseLinkProps = MuiLinkProps & {
  className?: string;
  sx?: MuiLinkProps["sx"];
};

export function BaseLink({ className, sx, ...rest }: BaseLinkProps) {
  return (
    <Link
      {...(rest as MuiLinkProps)}
      className={clsx(className)}
      sx={{
        color: "rgb(var(--primary))",
        textDecorationColor: "rgb(var(--primary))",
        "&:hover": {
          textDecoration: "underline",
        },
        ...(sx as any),
      }}
    />
  );
}
