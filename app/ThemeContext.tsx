import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { useColorScheme } from "react-native";

export type ThemeMode = "light" | "dark" | "system";

export interface Theme {
  background: string;
  surface: string;
  surfaceSecondary: string;
  primary: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  tabIconDefault: string;
}

const lightTheme: Theme = {
  background: "#f9fafb",
  surface: "#ffffff",
  surfaceSecondary: "#f9fafb",
  primary: "#0f63f9",
  text: "#000000",
  textSecondary: "#6b7280",
  border: "#e5e7eb",
  error: "#ef4444",
  success: "#10b981",
  warning: "#f59e0b",
  tabIconDefault: "#9ca3af"
};

const darkTheme: Theme = {
  background: "#111827",
  surface: "#1f2937",
  surfaceSecondary: "#374151",
  primary: "#3b82f6",
  text: "#ffffff",
  textSecondary: "#9ca3af",
  border: "#374151",
  error: "#ef4444",
  success: "#10b981",
  warning: "#f59e0b",
  tabIconDefault: "#6b7280"
};

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "stronglifts_theme_mode";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadThemeMode();
  }, []);

  const loadThemeMode = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setThemeModeState(JSON.parse(saved) as ThemeMode);
      }
    } catch (error) {
      console.error("Failed to load theme mode:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mode));
      setThemeModeState(mode);
    } catch (error) {
      console.error("Failed to save theme mode:", error);
      setThemeModeState(mode);
    }
  };

  const isDark = useMemo(
    () =>
      themeMode === "dark" ||
      (themeMode === "system" && systemColorScheme === "dark"),
    [themeMode, systemColorScheme]
  );

  const theme = useMemo(() => (isDark ? darkTheme : lightTheme), [isDark]);

  return (
    <ThemeContext.Provider value={{ theme, themeMode, setThemeMode, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
