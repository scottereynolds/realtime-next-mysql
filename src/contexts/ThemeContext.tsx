"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ThemeId } from "@/types/ui";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

interface ThemeContextValue {
  mode: ThemeId;
  setMode: (mode: ThemeId) => void;
  toggleMode: () => void; // still just toggles light/dark
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
);

const STORAGE_KEY = "app-theme-mode";

function isValidThemeId(value: string | null): value is ThemeId {
  return (
    value === "light" ||
    value === "dark" ||
    value === "arctic" ||
    value === "forest" ||
    value === "ocean" ||
    value === "cyber" ||
    value === "pirates" ||
    value === "packers" ||
    value === "barbie"
  );
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeId>("light");

  // After mount, reconcile with localStorage / prefers-color-scheme
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isValidThemeId(stored)) {
        setModeState(stored);
        return;
      }

      if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
        setModeState("dark");
      }
    } catch {
      // ignore
    }
  }, []);

  // Keep <html data-theme="..."> and localStorage in sync with mode
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", mode);
    }

    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, mode);
      } catch {
        // ignore
      }
    }
  }, [mode]);

  const setMode = useCallback((next: ThemeId) => {
    setModeState(next);
  }, []);

  // Simple toggle between light/dark; other themes selected via dropdown
  const toggleMode = useCallback(() => {
    setModeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  // Map our theme ID to MUI's light/dark color scheme
  const DARK_THEMES: ThemeId[] = ["dark", "forest", "ocean", "cyber"];

  const muiColorScheme: "light" | "dark" =
    DARK_THEMES.includes(mode) ? "dark" : "light";

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: muiColorScheme,
          primary: {
            main: "rgb(var(--primary))",
            contrastText: "rgb(var(--primary-foreground))",
          },
          secondary: {
            main: "rgb(var(--secondary))",
            contrastText: "rgb(var(--secondary-foreground))",
          },
          error: {
            main: "rgb(var(--error))",
            contrastText: "rgb(var(--error-foreground))",
          },
          warning: {
            main: "rgb(var(--warning))",
            contrastText: "rgb(var(--warning-foreground))",
          },
          info: {
            main: "rgb(var(--info))",
            contrastText: "rgb(var(--info-foreground))",
          },
          success: {
            main: "rgb(var(--success))",
            contrastText: "rgb(var(--success-foreground))",
          },
          text: {
            primary: "rgb(var(--foreground))",
            secondary: "rgb(var(--muted-foreground))",
          },
          background: {
            default: "rgb(var(--background))",
            paper: "rgb(var(--background))",
          },
          divider: "rgb(var(--border))",
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: "var(--radius-md)",
                textTransform: "none",
                boxShadow: "var(--shadow-sm)",
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundColor: "rgb(var(--background))",
                color: "rgb(var(--foreground))",
                borderRadius: "var(--radius-lg)",
                borderWidth: "var(--border-width)",
                borderStyle: "solid",
                borderColor: "rgb(var(--border))",
                boxShadow: "var(--shadow-sm)",
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                "& .MuiOutlinedInput-root": {
                  borderRadius: "var(--radius-sm)",
                  "& fieldset": {
                    borderColor: "rgb(var(--border))",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgb(var(--ring))",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "rgb(var(--primary))",
                  },
                },
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: "rgb(var(--background))",
                color: "rgb(var(--foreground))",
                boxShadow: "var(--shadow-md)",
                zIndex: "var(--z-nav)",
              },
            },
          },
          MuiDialog: {
            styleOverrides: {
              paper: {
                backgroundColor: "rgb(var(--background))",
                color: "rgb(var(--foreground))",
                boxShadow: "var(--shadow-lg)",
                borderRadius: "var(--radius-xl)",
              },
            },
          },
        },
      }),
    [muiColorScheme],
  );

  const value = useMemo(
    () => ({
      mode,
      setMode,
      toggleMode,
    }),
    [mode, setMode, toggleMode],
  );

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeMode(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeMode must be used within ThemeProvider");
  }
  return ctx;
}
