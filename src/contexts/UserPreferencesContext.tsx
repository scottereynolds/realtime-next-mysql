"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  defaultUserPreferences,
  type UserPreferences,
} from "@/types/ui";

const PREFERENCES_STORAGE_KEY = "vr_user_preferences_v1";

type UserPreferencesContextValue = {
  prefs: UserPreferences;
  setPref: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => void;
  setPrefs: (updater: (prev: UserPreferences) => UserPreferences) => void;
  resetPrefs: () => void;
};

const UserPreferencesContext = createContext<UserPreferencesContextValue | null>(
  null
);

function loadPrefsFromStorage(): UserPreferences {
  if (typeof window === "undefined") {
    // SSR / initial render – use defaults
    return defaultUserPreferences;
  }

  try {
    const raw = window.localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (!raw) return defaultUserPreferences;

    const parsed = JSON.parse(raw) as Partial<UserPreferences>;

    return {
      ...defaultUserPreferences,
      ...parsed,
    };
  } catch {
    return defaultUserPreferences;
  }
}

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefsState] = useState<UserPreferences>(() =>
    // lazy initializer to avoid touching window during render
    loadPrefsFromStorage()
  );

  // Sync *from* localStorage once on mount (in case defaults changed
  // between builds or user cleared storage, etc.)
  useEffect(() => {
    const stored = loadPrefsFromStorage();
    setPrefsState(stored);
  }, []);

  // Persist changes to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        PREFERENCES_STORAGE_KEY,
        JSON.stringify(prefs)
      );
    } catch {
      // Ignore write errors (e.g. private mode, quota)
    }
  }, [prefs]);

  const setPref = useCallback(
    <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
      setPrefsState((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const setPrefs = useCallback(
    (updater: (prev: UserPreferences) => UserPreferences) => {
      setPrefsState((prev) => updater(prev));
    },
    []
  );

  const resetPrefs = useCallback(() => {
    setPrefsState(defaultUserPreferences);
  }, []);

  return (
    <UserPreferencesContext.Provider
      value={{ prefs, setPref, setPrefs, resetPrefs }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences(): UserPreferencesContextValue {
  const ctx = useContext(UserPreferencesContext);
  if (!ctx) {
    throw new Error(
      "useUserPreferences must be used within a UserPreferencesProvider"
    );
  }
  return ctx;
}
