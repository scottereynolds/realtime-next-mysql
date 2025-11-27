"use client";

import { Table, type TableProps as MuiTableProps } from "@mui/material";

export type BaseTableProps = MuiTableProps & {
  sx?: MuiTableProps["sx"];
};

export function BaseTable({ sx, ...rest }: BaseTableProps) {
  return (
    <Table
      {...(rest as MuiTableProps)}
      sx={{
        "& th": {
          backgroundColor: "rgb(var(--muted))",
          color: "rgb(var(--muted-foreground))",
          borderBottomColor: "rgb(var(--border))",
        },
        "& td": {
          borderBottomColor: "rgb(var(--border))",
        },
        ...(sx as any),
      }}
    />
  );
}
