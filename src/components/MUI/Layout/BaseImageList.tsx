"use client";

import {
  ImageList,
  ImageListItem,
  type ImageListProps as MuiImageListProps,
  type ImageListItemProps as MuiImageListItemProps,
} from "@mui/material";

export type BaseImageListProps = MuiImageListProps & {
  sx?: MuiImageListProps["sx"];
};

export type BaseImageListItemProps = MuiImageListItemProps & {
  sx?: MuiImageListItemProps["sx"];
};

export function BaseImageList({ sx, ...rest }: BaseImageListProps) {
  return (
    <ImageList
      {...(rest as MuiImageListProps)}
      sx={{
        backgroundColor: "rgb(var(--background))",
        color: "rgb(var(--foreground))",
        ...(sx as any),
      }}
    />
  );
}

export function BaseImageListItem({ sx, ...rest }: BaseImageListItemProps) {
  return (
    <ImageListItem
      {...(rest as MuiImageListItemProps)}
      sx={{
        ...(sx as any),
      }}
    />
  );
}
