"use client";

import IconButton, { type IconButtonProps } from "@mui/material/IconButton";
import type { ReactNode } from "react";

export interface BaseIconButtonProps extends IconButtonProps {
  children: ReactNode;
}

/**
 * BaseIconButton
 *
 * Thin wrapper around MUI IconButton so we can centralize
 * styling / behavior later if needed.
 */
export default function BaseIconButton(props: BaseIconButtonProps) {
  const { children, ...rest } = props;
  return <IconButton {...rest}>{children}</IconButton>;
}
