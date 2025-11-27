"use client";

import {
  Breadcrumbs,
  type BreadcrumbsProps as MuiBreadcrumbsProps,
} from "@mui/material";

export type BaseBreadcrumbsProps = MuiBreadcrumbsProps & {
  sx?: MuiBreadcrumbsProps["sx"];
};

export function BaseBreadcrumbs({ sx, ...rest }: BaseBreadcrumbsProps) {
  return (
    <Breadcrumbs
      {...(rest as MuiBreadcrumbsProps)}
      sx={{
        color: "rgb(var(--muted-foreground))",
        "& a": {
          color: "rgb(var(--primary))",
        },
        ...(sx as any),
      }}
    />
  );
}
