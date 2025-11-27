"use client";

import { Rating, type RatingProps } from "@mui/material";

export interface BaseRatingProps extends RatingProps {}

export function BaseRating({ sx, ...rest }: BaseRatingProps) {
  return (
    <Rating
      {...rest}
      sx={{
        color: "rgb(var(--accent))",
        ...(sx as any),
      }}
    />
  );
}
