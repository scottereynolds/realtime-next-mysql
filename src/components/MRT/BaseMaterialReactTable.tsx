"use client";

import {
  MaterialReactTable,
  type MRT_RowData,
  type MaterialReactTableProps,
} from "material-react-table";
import { clsx } from "clsx";

export type BaseMaterialReactTableProps<TData extends MRT_RowData> =
  MaterialReactTableProps<TData> & {
    /**
     * Optional className for the outer container we wrap around MRT.
     */
    containerClassName?: string;
  };

/**
 * BaseMaterialReactTable
 *
 * Thin wrapper around MaterialReactTable that:
 * - Applies our Tailwind + CSS variable based theming
 * - Provides a consistent outer container style
 * - Still allows you to override all MRT props as usual
 */
export function BaseMaterialReactTable<TData extends MRT_RowData>(
  props: BaseMaterialReactTableProps<TData>,
) {
  const {
    containerClassName,
    muiTablePaperProps,
    muiTableContainerProps,
    muiTableHeadCellProps,
    muiTableBodyCellProps,
    ...rest
  } = props;

  // Default Paper props with theme variables
  const mergedPaperProps = {
    elevation: 0,
    ...muiTablePaperProps,
    sx: {
      backgroundColor: "rgb(var(--background))",
      color: "rgb(var(--foreground))",
      borderRadius: "var(--radius-lg)",
      borderWidth: "var(--border-width)",
      borderStyle: "solid",
      borderColor: "rgb(var(--border))",
      boxShadow: "var(--shadow-sm)",
      ...(muiTablePaperProps as any)?.sx,
    },
  };

  // Default Container props
  const mergedContainerProps = {
    ...muiTableContainerProps,
    sx: {
      backgroundColor: "rgb(var(--background))",
      color: "rgb(var(--foreground))",
      borderRadius: "var(--radius-lg)",
      borderWidth: "var(--border-width)",
      borderStyle: "solid",
      borderColor: "rgb(var(--border))",
      ...(muiTableContainerProps as any)?.sx,
    },
  };

  // Only provide defaults if user didn't pass anything
  const defaultHeadCellProps =
    muiTableHeadCellProps ??
    ({
      sx: {
        backgroundColor: "rgb(var(--muted))",
        color: "rgb(var(--muted-foreground))",
        fontWeight: 600,
        borderBottomColor: "rgb(var(--border))",
      },
    } as any);

  const defaultBodyCellProps =
    muiTableBodyCellProps ??
    ({
      sx: {
        backgroundColor: "rgb(var(--background))",
        color: "rgb(var(--foreground))",
        borderBottomColor: "rgb(var(--border))",
        fontSize: "0.875rem",
      },
    } as any);

  // Tell TS "trust me, this matches one of MRT's union branches"
  const mrtProps = rest as MaterialReactTableProps<TData>;

  return (
    <div
      className={clsx(
        "bg-app text-app border-app border rounded-lg shadow-sm",
        "overflow-hidden",
        containerClassName,
      )}
    >
      <MaterialReactTable
        {...mrtProps}
        muiTablePaperProps={mergedPaperProps as any}
        muiTableContainerProps={mergedContainerProps as any}
        muiTableHeadCellProps={defaultHeadCellProps}
        muiTableBodyCellProps={defaultBodyCellProps}
      />
    </div>
  );
}
