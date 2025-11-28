"use client";

import {
  MaterialReactTable,
  type MRT_RowData,
  type MaterialReactTableProps,
} from "material-react-table";
import { clsx } from "clsx";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

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
 * - Injects user preferences for density + default page size
 * - Still allows you to override all MRT props as usual
 */
export function BaseMaterialReactTable<TData extends MRT_RowData>(
  props: BaseMaterialReactTableProps<TData>,
) {
  const { prefs } = useUserPreferences();

  const {
    containerClassName,
    muiTablePaperProps,
    muiTableContainerProps,
    muiTableHeadCellProps,
    muiTableBodyCellProps,
    initialState,
    ...rest
  } = props;

  // Merge initialState with user preferences **without** upsetting TS.
  // We treat it as a plain object, then cast at the very end when we
  // pass everything into <MaterialReactTable />.
  const mergedInitialState = {
    ...(initialState ?? {}),
    density:
      initialState?.density ??
      (prefs.tableDensity === "compact" ? "compact" : "comfortable"),
    pagination: {
      // MRT/TanStack expect both pageIndex & pageSize to be present.
      pageIndex: initialState?.pagination?.pageIndex ?? 0,
      pageSize:
        initialState?.pagination?.pageSize ?? prefs.defaultPageSize ?? 25,
    },
  };

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

  // Build the props object we’ll spread into MRT.
  // We keep it strongly typed here, and then relax it at the call site
  // to avoid the union-type "initialState is not allowed with table" issue.
  const mrtProps: MaterialReactTableProps<TData> = {
    ...rest,
    initialState: mergedInitialState as any,
  };

  return (
    <div
      className={clsx(
        "bg-app text-app border-app border rounded-lg shadow-sm",
        "overflow-hidden",
        containerClassName,
      )}
    >
      <MaterialReactTable
        {...(mrtProps as any)}
        muiTablePaperProps={mergedPaperProps as any}
        muiTableContainerProps={mergedContainerProps as any}
        muiTableHeadCellProps={defaultHeadCellProps}
        muiTableBodyCellProps={defaultBodyCellProps}
      />
    </div>
  );
}
