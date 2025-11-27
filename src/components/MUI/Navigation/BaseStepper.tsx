"use client";

import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  type StepperProps as MuiStepperProps,
  type StepProps as MuiStepProps,
  type StepLabelProps as MuiStepLabelProps,
  type StepContentProps as MuiStepContentProps,
} from "@mui/material";

export type BaseStepperProps = MuiStepperProps & {
  sx?: MuiStepperProps["sx"];
};

export type BaseStepProps = MuiStepProps & {
  sx?: MuiStepProps["sx"];
};

export type BaseStepLabelProps = MuiStepLabelProps & {
  sx?: MuiStepLabelProps["sx"];
};

export type BaseStepContentProps = MuiStepContentProps & {
  sx?: MuiStepContentProps["sx"];
};

export function BaseStepper({ sx, ...rest }: BaseStepperProps) {
  return (
    <Stepper
      {...(rest as MuiStepperProps)}
      sx={{
        ...(sx as any),
      }}
    />
  );
}

export function BaseStep({ sx, ...rest }: BaseStepProps) {
  return (
    <Step
      {...(rest as MuiStepProps)}
      sx={{
        ...(sx as any),
      }}
    />
  );
}

export function BaseStepLabel({ sx, ...rest }: BaseStepLabelProps) {
  return (
    <StepLabel
      {...(rest as MuiStepLabelProps)}
      sx={{
        "& .MuiStepLabel-label": {
          color: "rgb(var(--foreground))",
        },
        ...(sx as any),
      }}
    />
  );
}

export function BaseStepContent({ sx, ...rest }: BaseStepContentProps) {
  return (
    <StepContent
      {...(rest as MuiStepContentProps)}
      sx={{
        borderLeftColor: "rgb(var(--border))",
        ...(sx as any),
      }}
    />
  );
}
