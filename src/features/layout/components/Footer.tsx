// src/features/layout/components/Footer.tsx
"use client";

import { useEffect, useState } from "react";
import BaseBox from "@/components/MUI/Layout/BaseBox";
import { BaseTypography } from "@/components/MUI/DataDisplay/BaseTypography";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

function formatDateTime(
  date: Date,
  opts: { dateFormat: "mdy" | "dmy" | "ymd"; timeFormat: "12h" | "24h" },
) {
  const pad = (n: number) => n.toString().padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());

  let datePart: string;
  switch (opts.dateFormat) {
    case "dmy":
      datePart = `${day}/${month}/${year}`;
      break;
    case "ymd":
      datePart = `${year}-${month}-${day}`;
      break;
    case "mdy":
    default:
      datePart = `${month}/${day}/${year}`;
      break;
  }

  let hours = date.getHours();
  const minutes = pad(date.getMinutes());
  let suffix = "";

  if (opts.timeFormat === "12h") {
    suffix = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) hours = 12;
  }

  const hoursStr = pad(hours);

  const timePart =
    opts.timeFormat === "12h"
      ? `${hoursStr}:${minutes} ${suffix}`
      : `${hoursStr}:${minutes}`;

  return `${datePart} ${timePart}`;
}

export default function Footer() {
  const { prefs } = useUserPreferences();
  const [formatted, setFormatted] = useState<string>(""); // same on server + first client render

  useEffect(() => {
    function update() {
      const now = new Date();
      setFormatted(
        formatDateTime(now, {
          dateFormat: prefs.dateFormat,
          timeFormat: prefs.timeFormat,
        }),
      );
    }

    // initial run
    update();

    const id = setInterval(update, 1000);

    return () => clearInterval(id);
  }, [prefs.dateFormat, prefs.timeFormat]);

  return (
    <BaseBox
      component="footer"
      sx={{
        borderTop: "1px solid rgb(var(--border))",
        paddingY: 1,
        paddingX: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 1.5,
        backgroundColor: "rgb(var(--background))",
        color: "rgb(var(--foreground))",
      }}
    >
      <BaseTypography variant="body2">
        Realtime Next + MySQL Starter
      </BaseTypography>

      <BaseTypography variant="caption" sx={{ opacity: 0.8 }}>
        {formatted}
      </BaseTypography>
    </BaseBox>
  );
}
