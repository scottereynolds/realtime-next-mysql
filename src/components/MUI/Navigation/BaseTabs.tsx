"use client";

import {
  Tabs,
  Tab,
  type TabsProps as MuiTabsProps,
  type TabProps as MuiTabProps,
} from "@mui/material";
import { clsx } from "clsx";

export type BaseTabsProps = MuiTabsProps & {
  className?: string;
  sx?: MuiTabsProps["sx"];
};

export type BaseTabProps = MuiTabProps & {
  className?: string;
  sx?: MuiTabProps["sx"];
};

export function BaseTabs({ className, sx, ...rest }: BaseTabsProps) {
  return (
    <Tabs
      {...(rest as MuiTabsProps)}
      className={clsx(className)}
      sx={{
        minHeight: 40,
        "& .MuiTabs-indicator": {
          backgroundColor: "rgb(var(--primary))",
        },
        ...(sx as any),
      }}
    />
  );
}

export function BaseTab({ className, sx, ...rest }: BaseTabProps) {
  return (
    <Tab
      {...(rest as MuiTabProps)}
      className={clsx(className)}
      sx={{
        textTransform: "none",
        minHeight: 40,
        paddingX: 2,
        "&.Mui-selected": {
          color: "rgb(var(--primary))",
        },
        ...(sx as any),
      }}
    />
  );
}
