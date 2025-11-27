"use client";

import Autocomplete, {
  type AutocompleteProps,
} from "@mui/material/Autocomplete";

/**
 * Directly re-use MUI's generics so call sites stay fully typed.
 */
export type BaseAutocompleteProps<
  T,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
> = AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>;

export function BaseAutocomplete<
  T,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
>({
  sx,
  ...rest
}: BaseAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>) {
  return (
    <Autocomplete
      {...(rest as any)}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "var(--radius-sm)",
          backgroundColor: "rgb(var(--background))",
          color: "rgb(var(--foreground))",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgb(var(--border))",
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgb(var(--ring))",
        },
        ...(sx as any),
      }}
    />
  );
}
