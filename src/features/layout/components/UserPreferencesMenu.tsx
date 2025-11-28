// src/features/layout/components/UserPreferencesMenu.tsx
"use client";

import { useState, type MouseEvent } from "react";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Switch,
} from "@mui/material";
import BaseBox from "@/components/MUI/Layout/BaseBox";
import PaletteIcon from "@mui/icons-material/Palette";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";
import ViewCompactIcon from "@mui/icons-material/ViewCompact";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import ForestIcon from "@mui/icons-material/Forest";
import WaterIcon from "@mui/icons-material/Water";
import MemoryIcon from "@mui/icons-material/Memory";
import SailingIcon from "@mui/icons-material/Sailing";
import SportsFootballIcon from "@mui/icons-material/SportsFootball";
import IcecreamIcon from "@mui/icons-material/Icecream";
import TranslateIcon from "@mui/icons-material/Translate";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventIcon from "@mui/icons-material/Event";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import { useThemeMode } from "@/contexts/ThemeContext";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { ThemeId } from "@/types/ui";

const THEME_OPTIONS: {
  id: ThemeId;
  label: string;
  icon: React.ComponentType<{
    fontSize?: "small" | "inherit" | "large" | "medium";
  }>;
}[] = [
  { id: "light", label: "Light", icon: WbSunnyIcon },
  { id: "dark", label: "Dark (Mono)", icon: DarkModeIcon },
  { id: "arctic", label: "Arctic", icon: AcUnitIcon },
  { id: "forest", label: "Forest", icon: ForestIcon },
  { id: "ocean", label: "Ocean", icon: WaterIcon },
  { id: "cyber", label: "Cyber", icon: MemoryIcon },
  { id: "pirates", label: "Pirates", icon: SailingIcon },
  { id: "packers", label: "Packers", icon: SportsFootballIcon },
  { id: "barbie", label: "Barbie", icon: IcecreamIcon },
];

const LANGUAGE_OPTIONS = [
  { id: "en", label: "English" },
  { id: "es", label: "Spanish" },
  { id: "zh", label: "Chinese" },
];

const TIME_FORMAT_OPTIONS = [
  { id: "12h" as const, label: "12-hour (AM/PM)" },
  { id: "24h" as const, label: "24-hour" },
];

const DATE_FORMAT_OPTIONS = [
  { id: "mdy" as const, label: "MM/DD/YYYY" },
  { id: "dmy" as const, label: "DD/MM/YYYY" },
  { id: "ymd" as const, label: "YYYY-MM-DD" },
];

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export function UserPreferencesMenu() {
  const { user, isAuthenticated } = useCurrentUser();
  const { mode, setMode } = useThemeMode();
  const { prefs, setPref } = useUserPreferences();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [themeAnchorEl, setThemeAnchorEl] = useState<null | HTMLElement>(null);
  const [languageAnchorEl, setLanguageAnchorEl] =
    useState<null | HTMLElement>(null);
  const [timeFormatAnchorEl, setTimeFormatAnchorEl] =
    useState<null | HTMLElement>(null);
  const [dateFormatAnchorEl, setDateFormatAnchorEl] =
    useState<null | HTMLElement>(null);
  const [pageSizeAnchorEl, setPageSizeAnchorEl] =
    useState<null | HTMLElement>(null);

  const menuOpen = Boolean(anchorEl);
  const themeMenuOpen = Boolean(themeAnchorEl);
  const languageMenuOpen = Boolean(languageAnchorEl);
  const timeFormatMenuOpen = Boolean(timeFormatAnchorEl);
  const dateFormatMenuOpen = Boolean(dateFormatAnchorEl);
  const pageSizeMenuOpen = Boolean(pageSizeAnchorEl);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAll = () => {
    setAnchorEl(null);
    setThemeAnchorEl(null);
    setLanguageAnchorEl(null);
    setTimeFormatAnchorEl(null);
    setDateFormatAnchorEl(null);
    setPageSizeAnchorEl(null);
  };

  const handleThemeParentClick = (event: MouseEvent<HTMLElement>) => {
    setThemeAnchorEl(event.currentTarget);
  };

  const handleLanguageParentClick = (event: MouseEvent<HTMLElement>) => {
    setLanguageAnchorEl(event.currentTarget);
  };

  const handleTimeFormatParentClick = (event: MouseEvent<HTMLElement>) => {
    setTimeFormatAnchorEl(event.currentTarget);
  };

  const handleDateFormatParentClick = (event: MouseEvent<HTMLElement>) => {
    setDateFormatAnchorEl(event.currentTarget);
  };

  const handlePageSizeParentClick = (event: MouseEvent<HTMLElement>) => {
    setPageSizeAnchorEl(event.currentTarget);
  };

  const handleThemeChange = (themeId: ThemeId) => {
    setMode(themeId);
  };

  const handleLanguageChange = (languageId: string) => {
    setPref("language", languageId);
  };

  const handleTimeFormatChange = (format: "12h" | "24h") => {
    setPref("timeFormat", format);
  };

  const handleDateFormatChange = (format: "mdy" | "dmy" | "ymd") => {
    setPref("dateFormat", format);
  };

  const handlePageSizeChange = (size: number) => {
    setPref("defaultPageSize", size);
  };

  const handleToggleTableDensity = () => {
    setPref(
      "tableDensity",
      prefs.tableDensity === "comfortable" ? "compact" : "comfortable",
    );
  };

  const handleToggleSidebarCollapsed = () => {
    setPref("sidebarCollapsed", !prefs.sidebarCollapsed);
  };

  const handleToggleConfirmBeforeDelete = () => {
    setPref("confirmBeforeDelete", !prefs.confirmBeforeDelete);
  };

  const initial =
    (user.name ?? user.email ?? "?").trim().charAt(0).toUpperCase() || "?";

  const currentThemeLabel =
    THEME_OPTIONS.find((opt) => opt.id === mode)?.label ?? "Custom";

  const currentLanguageLabel =
    LANGUAGE_OPTIONS.find((opt) => opt.id === prefs.language)?.label ??
    prefs.language;

  const currentTimeFormatLabel =
    TIME_FORMAT_OPTIONS.find((opt) => opt.id === prefs.timeFormat)?.label ??
    prefs.timeFormat;

  const currentDateFormatLabel =
    DATE_FORMAT_OPTIONS.find((opt) => opt.id === prefs.dateFormat)?.label ??
    prefs.dateFormat;

  return (
    <>
      <IconButton
        size="small"
        onClick={handleOpen}
        aria-label="User preferences"
      >
        <Avatar
          src={user.image ?? undefined}
          alt={user.name ?? user.email ?? "User"}
          sx={{
            width: 32,
            height: 32,
            fontSize: 14,
            bgcolor: "rgb(var(--muted))",
            color: "rgb(var(--foreground))",
          }}
        >
          {!user.image && initial}
        </Avatar>
      </IconButton>

      {/* Main menu */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleCloseAll}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
      >
        {/* User info header */}
        <BaseBox
          sx={{
            px: 2,
            pt: 1.5,
            pb: 1,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            maxWidth: 260,
          }}
        >
          <strong>{user.name ?? user.email ?? "User"}</strong>
          {user.email && (
            <span
              style={{
                fontSize: "0.75rem",
                opacity: 0.8,
                wordBreak: "break-all",
              }}
            >
              {user.email}
            </span>
          )}
        </BaseBox>

        <Divider sx={{ my: 0.5 }} />

        {/* Theme submenu trigger */}
        <MenuItem onClick={handleThemeParentClick}>
          <ListItemIcon>
            <PaletteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Theme" secondary={currentThemeLabel} />
          <ChevronRightIcon fontSize="small" />
        </MenuItem>

        {/* Language submenu trigger */}
        <MenuItem onClick={handleLanguageParentClick}>
          <ListItemIcon>
            <TranslateIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Language"
            secondary={currentLanguageLabel}
          />
          <ChevronRightIcon fontSize="small" />
        </MenuItem>

        {/* Time format submenu trigger */}
        <MenuItem onClick={handleTimeFormatParentClick}>
          <ListItemIcon>
            <AccessTimeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Time format"
            secondary={currentTimeFormatLabel}
          />
          <ChevronRightIcon fontSize="small" />
        </MenuItem>

        {/* Date format submenu trigger */}
        <MenuItem onClick={handleDateFormatParentClick}>
          <ListItemIcon>
            <EventIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Date format"
            secondary={currentDateFormatLabel}
          />
          <ChevronRightIcon fontSize="small" />
        </MenuItem>

        {/* Default page size submenu trigger */}
        <MenuItem onClick={handlePageSizeParentClick}>
          <ListItemIcon>
            <FormatListNumberedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Rows per page"
            secondary={`${prefs.defaultPageSize} rows`}
          />
          <ChevronRightIcon fontSize="small" />
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        {/* Table density */}
        <MenuItem onClick={handleToggleTableDensity}>
          <ListItemIcon>
            {prefs.tableDensity === "comfortable" ? (
              <ViewAgendaIcon fontSize="small" />
            ) : (
              <ViewCompactIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText
            primary="Compact tables"
            secondary={
              prefs.tableDensity === "comfortable"
                ? "Currently comfortable"
                : "Currently compact"
            }
          />
          <Switch
            edge="end"
            checked={prefs.tableDensity === "compact"}
            onChange={handleToggleTableDensity}
          />
        </MenuItem>

        {/* Sidebar collapsed by default */}
        <MenuItem onClick={handleToggleSidebarCollapsed}>
          <ListItemIcon>
            <DashboardCustomizeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Collapse sidebar by default"
            secondary={
              prefs.sidebarCollapsed
                ? "Sidebar starts collapsed"
                : "Sidebar starts expanded"
            }
          />
          <Switch
            edge="end"
            checked={prefs.sidebarCollapsed}
            onChange={handleToggleSidebarCollapsed}
          />
        </MenuItem>

        {/* Confirm before delete */}
        <MenuItem onClick={handleToggleConfirmBeforeDelete}>
          <ListItemIcon>
            <WarningAmberIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Confirm before delete"
            secondary={
              prefs.confirmBeforeDelete
                ? "Always show confirmation dialogs"
                : "Delete actions are immediate"
            }
          />
          <Switch
            edge="end"
            checked={prefs.confirmBeforeDelete}
            onChange={handleToggleConfirmBeforeDelete}
          />
        </MenuItem>
      </Menu>

      {/* Theme submenu */}
      <Menu
        anchorEl={themeAnchorEl}
        open={themeMenuOpen}
        onClose={() => setThemeAnchorEl(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        keepMounted
      >
        {THEME_OPTIONS.map(({ id, label, icon: Icon }) => (
          <MenuItem
            key={id}
            onClick={() => handleThemeChange(id)}
            selected={mode === id}
          >
            <ListItemIcon>
              <Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={label} />
          </MenuItem>
        ))}
      </Menu>

      {/* Language submenu */}
      <Menu
        anchorEl={languageAnchorEl}
        open={languageMenuOpen}
        onClose={() => setLanguageAnchorEl(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        keepMounted
      >
        {LANGUAGE_OPTIONS.map(({ id, label }) => (
          <MenuItem
            key={id}
            onClick={() => handleLanguageChange(id)}
            selected={prefs.language === id}
          >
            <ListItemText primary={label} />
          </MenuItem>
        ))}
      </Menu>

      {/* Time format submenu */}
      <Menu
        anchorEl={timeFormatAnchorEl}
        open={timeFormatMenuOpen}
        onClose={() => setTimeFormatAnchorEl(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        keepMounted
      >
        {TIME_FORMAT_OPTIONS.map(({ id, label }) => (
          <MenuItem
            key={id}
            onClick={() => handleTimeFormatChange(id)}
            selected={prefs.timeFormat === id}
          >
            <ListItemText primary={label} />
          </MenuItem>
        ))}
      </Menu>

      {/* Date format submenu */}
      <Menu
        anchorEl={dateFormatAnchorEl}
        open={dateFormatMenuOpen}
        onClose={() => setDateFormatAnchorEl(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        keepMounted
      >
        {DATE_FORMAT_OPTIONS.map(({ id, label }) => (
          <MenuItem
            key={id}
            onClick={() => handleDateFormatChange(id)}
            selected={prefs.dateFormat === id}
          >
            <ListItemText primary={label} />
          </MenuItem>
        ))}
      </Menu>

      {/* Page size submenu */}
      <Menu
        anchorEl={pageSizeAnchorEl}
        open={pageSizeMenuOpen}
        onClose={() => setPageSizeAnchorEl(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        keepMounted
      >
        {PAGE_SIZE_OPTIONS.map((size) => (
          <MenuItem
            key={size}
            onClick={() => handlePageSizeChange(size)}
            selected={prefs.defaultPageSize === size}
          >
            <ListItemText primary={`${size} rows`} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
