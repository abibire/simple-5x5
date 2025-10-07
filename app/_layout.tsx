import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { ThemeProvider as AppThemeProvider } from "./ThemeContext";
import { WorkoutProvider } from "./WorkoutContext";

export const unstable_settings = {
  anchor: "(tabs)"
};

const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#f9fafb",
    card: "#ffffff",
    text: "#000000",
    border: "#e5e7eb",
    notification: "#2563eb"
  }
};

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <WorkoutProvider>
        <ThemeProvider value={lightTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="progress"
              options={{
                presentation: "card",
                headerShown: false
              }}
            />
          </Stack>
          <StatusBar style="light" backgroundColor="#2563eb" />
        </ThemeProvider>
      </WorkoutProvider>
    </AppThemeProvider>
  );
}
