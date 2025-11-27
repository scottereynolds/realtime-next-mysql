"use client";

import { Box, type BoxProps as MuiBoxProps } from "@mui/material";
import { clsx } from "clsx";

export type BaseBoxProps = MuiBoxProps & {
  className?: string;
  sx?: MuiBoxProps["sx"];
};

export default function BaseBox({ className, sx, ...rest }: BaseBoxProps) {
  return (
    <Box
      {...(rest as MuiBoxProps)}
      className={clsx(className)}
      sx={{
        ...(sx as any),
      }}
    />
  );
}
