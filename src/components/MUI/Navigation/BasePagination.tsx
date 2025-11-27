"use client";

import {
  Pagination,
  PaginationItem,
  type PaginationProps as MuiPaginationProps,
  type PaginationItemProps as MuiPaginationItemProps,
} from "@mui/material";

export type BasePaginationProps = MuiPaginationProps & {
  sx?: MuiPaginationProps["sx"];
};

export type BasePaginationItemProps = MuiPaginationItemProps & {
  sx?: MuiPaginationItemProps["sx"];
};

export function BasePagination({ sx, ...rest }: BasePaginationProps) {
  return (
    <Pagination
      {...(rest as MuiPaginationProps)}
      sx={{
        "& .MuiPagination-ul": {
          gap: 0.25,
        },
        ...(sx as any),
      }}
    />
  );
}

export function BasePaginationItem({ sx, ...rest }: BasePaginationItemProps) {
  return (
    <PaginationItem
      {...(rest as MuiPaginationItemProps)}
      sx={{
        borderRadius: "var(--radius-full)",
        "&.Mui-selected": {
          backgroundColor: "rgb(var(--primary))",
          color: "rgb(var(--primary-foreground))",
        },
        ...(sx as any),
      }}
    />
  );
}
