"use client";

import { TableRow, type TableRowProps as MuiTableRowProps } from "@mui/material";

export type BaseTableRowProps = MuiTableRowProps & {
  sx?: MuiTableRowProps["sx"];
};

export function BaseTableRow({ sx, ...rest }: BaseTableRowProps) {
  return (
    <TableRow
      {...(rest as MuiTableRowProps)}
      sx={{
        "&:hover": {
          backgroundColor: "rgb(var(--muted))",
        },
        ...(sx as any),
      }}
    />
  );
}
