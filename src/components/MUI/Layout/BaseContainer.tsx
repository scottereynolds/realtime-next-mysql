"use client";

import {
  Container,
  type ContainerProps as MuiContainerProps,
} from "@mui/material";
import { clsx } from "clsx";

export type BaseContainerProps = MuiContainerProps & {
  className?: string;
  sx?: MuiContainerProps["sx"];
};

export function BaseContainer({ className, sx, ...rest }: BaseContainerProps) {
  return (
    <Container
      {...(rest as MuiContainerProps)}
      className={clsx(className)}
      sx={{
        ...(sx as any),
      }}
    />
  );
}
