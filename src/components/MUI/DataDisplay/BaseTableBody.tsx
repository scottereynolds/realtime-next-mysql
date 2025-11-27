"use client";

import { TableBody, type TableBodyProps as MuiTableBodyProps } from "@mui/material";

export type BaseTableBodyProps = MuiTableBodyProps & {
  sx?: MuiTableBodyProps["sx"];
};

export function BaseTableBody({ sx, ...rest }: BaseTableBodyProps) {
  return (
    <TableBody
      {...(rest as MuiTableBodyProps)}
      sx={{
        ...(sx as any),
      }}
    />
  );
}
