"use client";

import { Tooltip, type TooltipProps as MuiTooltipProps } from "@mui/material";

export type BaseTooltipProps = MuiTooltipProps & {
  sx?: MuiTooltipProps["sx"];
};

export function BaseTooltip(props: BaseTooltipProps) {
  const { sx, ...rest } = props;

  return (
    <Tooltip
      {...(rest as MuiTooltipProps)}
      slotProps={{
        tooltip: {
          sx: {
            backgroundColor: "rgb(var(--foreground))",
            color: "rgb(var(--background))",
            borderRadius: "var(--radius-sm)",
            boxShadow: "var(--shadow-sm)",
            ...(sx as any),
          },
        },
      }}
    />
  );
}
