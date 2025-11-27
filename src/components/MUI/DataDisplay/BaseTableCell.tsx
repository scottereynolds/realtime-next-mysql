"use client";

import { TableCell, type TableCellProps as MuiTableCellProps } from "@mui/material";

export type BaseTableCellProps = MuiTableCellProps & {
  sx?: MuiTableCellProps["sx"];
};

export function BaseTableCell({ sx, ...rest }: BaseTableCellProps) {
  return (
    <TableCell
      {...(rest as MuiTableCellProps)}
      sx={{
        borderBottomColor: "rgb(var(--border))",
        ...(sx as any),
      }}
    />
  );
}
