"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  type DialogProps as MuiDialogProps,
  type DialogTitleProps as MuiDialogTitleProps,
  type DialogContentProps as MuiDialogContentProps,
  type DialogActionsProps as MuiDialogActionsProps,
} from "@mui/material";

export type BaseDialogProps = MuiDialogProps & {
  sx?: MuiDialogProps["sx"];
};

export function BaseDialog({ sx, ...rest }: BaseDialogProps) {
  return (
    <Dialog
      {...(rest as MuiDialogProps)}
      sx={{
        "& .MuiPaper-root": {
          borderRadius: "var(--radius-xl)",
          backgroundColor: "rgb(var(--background))",
          color: "rgb(var(--foreground))",
          boxShadow: "var(--shadow-lg)",
        },
        ...(sx as any),
      }}
    />
  );
}

// Title

export type BaseDialogTitleProps = MuiDialogTitleProps & {
  sx?: MuiDialogTitleProps["sx"];
};

export function BaseDialogTitle({ sx, ...rest }: BaseDialogTitleProps) {
  return (
    <DialogTitle
      {...(rest as MuiDialogTitleProps)}
      sx={{
        fontWeight: 600,
        borderBottom: "1px solid rgb(var(--border))",
        ...(sx as any),
      }}
    />
  );
}

// Content

export type BaseDialogContentProps = MuiDialogContentProps & {
  sx?: MuiDialogContentProps["sx"];
};

export function BaseDialogContent({ sx, ...rest }: BaseDialogContentProps) {
  return (
    <DialogContent
      {...(rest as MuiDialogContentProps)}
      sx={{
        paddingTop: 2,
        paddingBottom: 2,
        ...(sx as any),
      }}
    />
  );
}

// Actions

export type BaseDialogActionsProps = MuiDialogActionsProps & {
  sx?: MuiDialogActionsProps["sx"];
};

export function BaseDialogActions({ sx, ...rest }: BaseDialogActionsProps) {
  return (
    <DialogActions
      {...(rest as MuiDialogActionsProps)}
      sx={{
        borderTop: "1px solid rgb(var(--border))",
        padding: 2,
        gap: 1,
        ...(sx as any),
      }}
    />
  );
}
