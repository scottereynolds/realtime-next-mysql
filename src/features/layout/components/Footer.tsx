"use client";

import { useCallback } from "react";
import { ThemeId } from "@/types/ui";
import { FormControl, InputLabel, MenuItem } from "@mui/material";
import { useThemeMode } from "@/contexts/ThemeContext";
import BaseBox from "@/components/MUI/Layout/BaseBox";
import { BaseSelect } from "@/components/MUI/Inputs/BaseSelect";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import ForestIcon from "@mui/icons-material/Forest";
import WaterIcon from "@mui/icons-material/Water";
import MemoryIcon from "@mui/icons-material/Memory";
import SailingIcon from "@mui/icons-material/Sailing";
import SportsFootballIcon from "@mui/icons-material/SportsFootball";
import IcecreamIcon from "@mui/icons-material/Icecream";

export default function Footer() {
  const { mode, setMode } = useThemeMode();

  const handleChange = useCallback(
    (event: any) => {
      const value = event.target.value as ThemeId;
      setMode(value);
    },
    [setMode],
  );

  return (
    <BaseBox
      component="footer"
      sx={{
        borderTop: "1px solid rgb(var(--border))",
        paddingY: 1,
        paddingX: 2,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 1.5,
        backgroundColor: "rgb(var(--background))",
        color: "rgb(var(--foreground))",
      }}
    >
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel id="theme-select-label">Theme</InputLabel>
        <BaseSelect
          labelId="theme-select-label"
          id="theme-select"
          value={mode}
          label="Theme"
          onChange={handleChange}
        >
          <MenuItem value="light">
            <BaseBox sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <WbSunnyIcon fontSize="small" />
              <span>Light</span>
            </BaseBox>
          </MenuItem>

          <MenuItem value="dark">
            <BaseBox sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <DarkModeIcon fontSize="small" />
              <span>Dark (Mono)</span>
            </BaseBox>
          </MenuItem>

          <MenuItem value="arctic">
            <BaseBox sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AcUnitIcon fontSize="small" />
              <span>Arctic</span>
            </BaseBox>
          </MenuItem>

          <MenuItem value="forest">
            <BaseBox sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ForestIcon fontSize="small" />
              <span>Forest</span>
            </BaseBox>
          </MenuItem>

          <MenuItem value="ocean">
            <BaseBox sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <WaterIcon fontSize="small" />
              <span>Ocean</span>
            </BaseBox>
          </MenuItem>

          <MenuItem value="cyber">
            <BaseBox sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <MemoryIcon fontSize="small" />
              <span>Cyber</span>
            </BaseBox>
          </MenuItem>

          <MenuItem value="pirates">
            <BaseBox sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SailingIcon fontSize="small" />
              <span>Pirates</span>
            </BaseBox>
          </MenuItem>

          <MenuItem value="packers">
            <BaseBox sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SportsFootballIcon fontSize="small" />
              <span>Packers</span>
            </BaseBox>
          </MenuItem>

          <MenuItem value="barbie">
            <BaseBox sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IcecreamIcon fontSize="small" />
              <span>Barbie</span>
            </BaseBox>
          </MenuItem>
        </BaseSelect>
      </FormControl>
    </BaseBox>
  );
}
