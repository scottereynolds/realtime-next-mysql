"use client";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  type AccordionProps as MuiAccordionProps,
  type AccordionSummaryProps as MuiAccordionSummaryProps,
  type AccordionDetailsProps as MuiAccordionDetailsProps,
} from "@mui/material";
import { clsx } from "clsx";

export type BaseAccordionProps = MuiAccordionProps & {
  className?: string;
  sx?: MuiAccordionProps["sx"];
};

export function BaseAccordion({ className, sx, ...rest }: BaseAccordionProps) {
  return (
    <Accordion
      {...(rest as MuiAccordionProps)}
      className={clsx(className)}
      sx={{
        backgroundColor: "rgb(var(--background))",
        color: "rgb(var(--foreground))",
        borderRadius: "var(--radius-md)",
        borderWidth: "var(--border-width)",
        borderStyle: "solid",
        borderColor: "rgb(var(--border))",
        boxShadow: "var(--shadow-sm)",
        "&:before": {
          display: "none",
        },
        ...(sx as any),
      }}
    />
  );
}

export type BaseAccordionSummaryProps = MuiAccordionSummaryProps & {
  sx?: MuiAccordionSummaryProps["sx"];
};

export function BaseAccordionSummary({
  sx,
  ...rest
}: BaseAccordionSummaryProps) {
  return (
    <AccordionSummary
      {...(rest as MuiAccordionSummaryProps)}
      sx={{
        "& .MuiAccordionSummary-content": {
          marginY: 0.5,
        },
        ...(sx as any),
      }}
    />
  );
}

export type BaseAccordionDetailsProps = MuiAccordionDetailsProps & {
  sx?: MuiAccordionDetailsProps["sx"];
};

export function BaseAccordionDetails({
  sx,
  ...rest
}: BaseAccordionDetailsProps) {
  return (
    <AccordionDetails
      {...(rest as MuiAccordionDetailsProps)}
      sx={{
        paddingTop: 0,
        paddingBottom: 1.5,
        ...(sx as any),
      }}
    />
  );
}
