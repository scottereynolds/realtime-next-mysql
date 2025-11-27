"use client";

import { Skeleton, type SkeletonProps as MuiSkeletonProps } from "@mui/material";

export type BaseSkeletonProps = MuiSkeletonProps & {
  sx?: MuiSkeletonProps["sx"];
};

export function BaseSkeleton({ sx, ...rest }: BaseSkeletonProps) {
  return (
    <Skeleton
      {...(rest as MuiSkeletonProps)}
      sx={{
        backgroundColor: "rgba(148, 163, 184, 0.25)", // border-ish but faint
        ...(sx as any),
      }}
    />
  );
}
