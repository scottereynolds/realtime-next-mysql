"use client";

import {
  Card,
  CardContent,
  CardActions,
  CardHeader,
  type CardProps as MuiCardProps,
  type CardContentProps as MuiCardContentProps,
  type CardActionsProps as MuiCardActionsProps,
  type CardHeaderProps as MuiCardHeaderProps,
} from "@mui/material";
import { clsx } from "clsx";

export type BaseCardProps = MuiCardProps & {
  className?: string;
  sx?: MuiCardProps["sx"];
};

export function BaseCard({ className, sx, ...rest }: BaseCardProps) {
  return (
    <Card
      {...(rest as MuiCardProps)}
      className={clsx(className)}
      sx={{
        backgroundColor: "rgb(var(--background))",
        color: "rgb(var(--foreground))",
        borderRadius: "var(--radius-lg)",
        borderWidth: "var(--border-width)",
        borderStyle: "solid",
        borderColor: "rgb(var(--border))",
        boxShadow: "var(--shadow-md)",
        ...(sx as any),
      }}
    />
  );
}

// CardContent

export type BaseCardContentProps = MuiCardContentProps & {
  sx?: MuiCardContentProps["sx"];
};

export function BaseCardContent({ sx, ...rest }: BaseCardContentProps) {
  return (
    <CardContent
      {...(rest as MuiCardContentProps)}
      sx={{
        padding: 2,
        ...(sx as any),
      }}
    />
  );
}

// CardActions

export type BaseCardActionsProps = MuiCardActionsProps & {
  sx?: MuiCardActionsProps["sx"];
};

export function BaseCardActions({ sx, ...rest }: BaseCardActionsProps) {
  return (
    <CardActions
      {...(rest as MuiCardActionsProps)}
      sx={{
        paddingX: 2,
        paddingBottom: 2,
        gap: 1,
        ...(sx as any),
      }}
    />
  );
}

// CardHeader

export type BaseCardHeaderProps = MuiCardHeaderProps & {
  sx?: MuiCardHeaderProps["sx"];
};

export function BaseCardHeader({ sx, ...rest }: BaseCardHeaderProps) {
  return (
    <CardHeader
      {...(rest as MuiCardHeaderProps)}
      sx={{
        paddingX: 2,
        paddingTop: 2,
        paddingBottom: 1,
        "& .MuiCardHeader-title": {
          fontWeight: 600,
        },
        ...(sx as any),
      }}
    />
  );
}
