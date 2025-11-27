"use client";

import { Slider, type SliderProps } from "@mui/material";

export interface BaseSliderProps extends SliderProps {}

export function BaseSlider({ sx, ...rest }: BaseSliderProps) {
  return (
    <Slider
      {...rest}
      sx={{
        color: "rgb(var(--primary))",
        "& .MuiSlider-track": {
          border: "none",
        },
        "& .MuiSlider-thumb": {
          boxShadow: "var(--shadow-sm)",
        },
        ...(sx as any),
      }}
    />
  );
}
