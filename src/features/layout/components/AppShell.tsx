"use client";

import { useState, type ReactNode } from "react";
import BaseBox from "@/components/MUI/Layout/BaseBox";
import {
  BaseAppBar,
  BaseToolbar,
} from "@/components/MUI/Surface/BaseAppBar";
import { BaseTypography } from "@/components/MUI/DataDisplay/BaseTypography";
import Footer from "./Footer";
import { LayoutSidebar } from "./LayoutSidebar";
import { AuthBar } from "@/features/auth/components/AuthBar";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { GlobalLoadingDivider } from "@/features/layout/components/GlobalLoadingDivider";

export function AppShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <BaseBox
      className="min-h-screen"
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <BaseAppBar
        position="static"
        sx={{
          borderRadius: 0,
        }}
      >
        <BaseToolbar
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <IconButton
            size="small"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>

          <BaseTypography variant="h6" component="div">
            Realtime Next + MySQL Starter
          </BaseTypography>

          <BaseBox sx={{ flex: 1 }} />

          {/* Auth controls live in the header now */}
          <AuthBar />
        </BaseToolbar>
        <GlobalLoadingDivider />
      </BaseAppBar>

      {/* Body: sidebar + main content */}
      <BaseBox
        sx={{
          display: "flex",
          flex: 1,
          minHeight: 0,
        }}
      >
        <LayoutSidebar open={sidebarOpen} />

        <BaseBox
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            padding: 2,
            overflow: "auto",
          }}
        >
          {children}
        </BaseBox>
      </BaseBox>

      {/* Footer (theme selector) */}
      <Footer />
    </BaseBox>
  );
}
