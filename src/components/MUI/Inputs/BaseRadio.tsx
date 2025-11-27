"use client";

import { Radio, RadioGroup, type RadioProps, type RadioGroupProps } from "@mui/material";

export interface BaseRadioProps extends RadioProps {}
export interface BaseRadioGroupProps extends RadioGroupProps {}

export function BaseRadio({ sx, ...rest }: BaseRadioProps) {
  return (
    <Radio
      {...rest}
      sx={{
        color: "rgb(var(--border))",
        "&.Mui-checked": {
          color: "rgb(var(--primary))",
        },
        ...(sx as any),
      }}
    />
  );
}

export function BaseRadioGroup(props: BaseRadioGroupProps) {
  return <RadioGroup {...props} />;
}
