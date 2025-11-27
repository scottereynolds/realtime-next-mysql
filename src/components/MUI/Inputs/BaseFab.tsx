"use client";

import { Fab, type FabProps } from "@mui/material";
import { clsx } from "clsx";

export interface BaseFabProps extends FabProps {}

export function BaseFab({ className, sx, ...rest }: BaseFabProps) {
  return (
    <Fab
      {...rest}
      className={clsx(className)}
      sx={{
        boxShadow: "var(--shadow-lg)",
        backgroundColor: "rgb(var(--primary))",
        color: "rgb(var(--primary-foreground))",
        "&:hover": {
          boxShadow: "var(--shadow-md)",
        },
        ...(sx as any),
      }}
    />
  );
}
