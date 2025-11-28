// src/types/ui.ts

// ---- Theme ----

/**
 * All supported theme IDs for the app.
 * Keep in sync with your data-theme values and theme selector.
 */
export type ThemeId =
  | "light"
  | "dark"
  | "arctic"
  | "forest"
  | "ocean"
  | "cyber"
  | "pirates"
  | "packers"
  | "barbie";

/**
 * Basic shape of user UI preferences.
 * (You’ll store this in UserPreferencesContext / localStorage.)
 */
export interface UserPreferences {
  theme: ThemeId;
  language: string; // e.g. "en", "es", "zh-CN"
  /**
   * Whether the user prefers reduced motion / subtle animations.
   */
  reducedMotion?: boolean;
  /**
   * Optional preference for compact vs. cozy layouts.
   */
  density?: "compact" | "comfortable";
}

// ---- Snackbar / Toast ----

export type SnackbarVariant = "success" | "error" | "info" | "warning";

export interface SnackbarOptions {
  message: string;
  variant?: SnackbarVariant;
  /**
   * If omitted, use your global default (e.g. 4000–6000 ms).
   */
  autoHideDuration?: number;
}

/**
 * What your SnackbarContext exposes.
 */
export interface SnackbarContextValue {
  showSnackbar: (options: SnackbarOptions) => void;
}

// ---- Dialogs ----

export type DialogSize = "xs" | "sm" | "md" | "lg" | "xl" | "full";

export interface DialogConfig {
  id?: string;
  title?: string;
  content: React.ReactNode;
  size?: DialogSize;
  /**
   * Override to force fullscreen (for “apps in a window”).
   */
  fullScreen?: boolean;
  /**
   * Extra props like `maxWidth`, `disableBackdropClick`, etc.
   */
  disableCloseOnBackdropClick?: boolean;
}

/**
 * What your DialogContext exposes.
 */
export interface DialogContextValue {
  openDialog: (config: DialogConfig) => void;
  closeDialog: (id?: string) => void;
}

// ---- Pagination & sorting helpers ----

export interface PaginationState {
  page: number;      // zero- or one-based; pick one convention and stick to it
  pageSize: number;
  totalItems?: number;
}

export type SortDirection = "asc" | "desc";

export interface SortState {
  sortBy: string | null;         // e.g. "createdAt"
  direction: SortDirection | null;
}

// ---- Global Loading ----

/**
 * Optional channels if you want to differentiate loading sources.
 */
export type LoadingChannel = "global" | "route" | "api" | "socket";

/** Visual style for the loading divider */
export type LoadingMode = "rgb" | "red" | "blue" | "green" | "orange";

export interface LoadingState {
  /**
   * Simple global counter: > 0 means something is loading.
   */
  globalCount: number;
  /**
   * Optional per-channel counts if you want more granularity.
   */
  perChannel?: Partial<Record<LoadingChannel, number>>;
  /**
   * Current visual mode for the loading divider.
   */
  mode: LoadingMode;
}

export interface LoadingContextValue {
  state: LoadingState;
  /** Convenience flag: true when any channel is loading */
  isLoading: boolean;
  mode: LoadingMode;
  setMode: (mode: LoadingMode) => void;
  startLoading: (channel?: LoadingChannel) => void;
  stopLoading: (channel?: LoadingChannel) => void;
}

export type TableDensity = "comfortable" | "compact";

export type TimeFormat = "12h" | "24h";
export type DateFormat = "mdy" | "dmy" | "ymd";

export interface UserPreferences {
  theme: ThemeId;
  language: string;
  sidebarCollapsed: boolean;
  defaultPageSize: number;
  tableDensity: TableDensity;
  preferredLanguage: string; // seed for future i18n, e.g. "en"
  timeFormat: TimeFormat;
  dateFormat: DateFormat;
  confirmBeforeDelete: boolean;
  startPage: string; // e.g. "/", "/messages", "/admin"
}

export const defaultUserPreferences: UserPreferences = {
  theme: "dark",
  language: "en",
  sidebarCollapsed: false,
  defaultPageSize: 25,
  tableDensity: "comfortable",
  preferredLanguage: "en",
  timeFormat: "12h",
  dateFormat: "mdy",
  confirmBeforeDelete: true,
  startPage: "/",
};
