"use client";

import { Switch, type SwitchProps } from "@mui/material";

export interface BaseSwitchProps extends SwitchProps {}

export function BaseSwitch({ sx, ...rest }: BaseSwitchProps) {
  return (
    <Switch
      {...rest}
      sx={{
        "& .MuiSwitch-switchBase.Mui-checked": {
          color: "rgb(var(--primary))",
        },
        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
          backgroundColor: "rgb(var(--primary))",
        },
        ...(sx as any),
      }}
    />
  );
}
