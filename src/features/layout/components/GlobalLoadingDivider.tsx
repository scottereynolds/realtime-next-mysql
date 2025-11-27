"use client";

import { keyframes } from "@mui/material/styles";
import { useLoading } from "@/contexts/LoadingContext";
import type { LoadingMode } from "@/types/ui";
import { BaseDivider } from "@/components/MUI/Layout/BaseDivider"; 

// RGB gradient animation
const rgbPulse = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Single-color pulse (fade in/out)
const singlePulse = keyframes`
  0% {
    opacity: 0.25;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.25;
  }
`;

const MODE_COLOR_MAP: Record<Exclude<LoadingMode, "rgb">, string> = {
  red: "rgb(239, 68, 68)",     // red-500-ish
  blue: "rgb(59, 130, 246)",   // blue-500-ish
  green: "rgb(34, 197, 94)",   // green-500-ish
  orange: "rgb(249, 115, 22)", // orange-500-ish
};

export function GlobalLoadingDivider() {
  const { isLoading, mode } = useLoading();

  if (!isLoading) {
    return null;
  }

  const isRgb = mode === "rgb";

  return (
    <BaseDivider
      // stretch full width; assume header places it across the bottom
      sx={{
        border: "none",
        height: 3,
        mt: 0,
        px: 0,
        // Remove default Divider line styling if any
        "&::before, &::after": {
          border: "none",
        },
        ...(isRgb
          ? {
              backgroundImage:
                "linear-gradient(90deg, #ff0000, #ff9800, #ffff00, #00ff00, #00bcd4, #3f51b5, #9c27b0)",
              backgroundSize: "400% 100%",
              animation: `${rgbPulse} 2.5s linear infinite`,
            }
          : {
              backgroundColor: MODE_COLOR_MAP[mode as Exclude<LoadingMode, "rgb">],
              animation: `${singlePulse} 1.2s ease-in-out infinite`,
            }),
      }}
    />
  );
}
