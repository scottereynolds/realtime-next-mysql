// src/features/layout/components/AppShell.tsx
"use client";

import { type ReactNode } from "react";
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
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { UserPreferencesMenu } from "@/features/layout/components/UserPreferencesMenu";

export function AppShell({ children }: { children: ReactNode }) {
  const { prefs, setPref } = useUserPreferences();

  // Persisted sidebar state: open = !collapsed
  const sidebarOpen = !prefs.sidebarCollapsed;

  const handleToggleSidebar = () => {
    setPref("sidebarCollapsed", !prefs.sidebarCollapsed);
  };

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
            onClick={handleToggleSidebar}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>

          <BaseTypography variant="h6" component="div">
            Realtime Next + MySQL Starter
          </BaseTypography>

          <BaseBox sx={{ flex: 1 }} />

          {/* Auth controls + user preferences live in the header */}
          <AuthBar />
          <UserPreferencesMenu />
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

      {/* Footer (no more theme selector – that moved to the avatar menu) */}
      <Footer />
    </BaseBox>
  );
}
