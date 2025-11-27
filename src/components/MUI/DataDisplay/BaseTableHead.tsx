"use client";

import { TableHead, type TableHeadProps as MuiTableHeadProps } from "@mui/material";

export type BaseTableHeadProps = MuiTableHeadProps & {
  sx?: MuiTableHeadProps["sx"];
};

export function BaseTableHead({ sx, ...rest }: BaseTableHeadProps) {
  return (
    <TableHead
      {...(rest as MuiTableHeadProps)}
      sx={{
        ...(sx as any),
      }}
    />
  );
}
