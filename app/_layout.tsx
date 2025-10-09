import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { ThemeProvider as AppThemeProvider } from "./ThemeContext";
import { WorkoutProvider } from "./WorkoutContext";

SplashScreen.preventAutoHideAsync();

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
    notification: "#0f63f9"
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
            <Stack.Screen
              name="accessories"
              options={{
                presentation: "card",
                headerShown: false
              }}
            />
          </Stack>
          <StatusBar style="light" backgroundColor="#0f63f9" />
        </ThemeProvider>
      </WorkoutProvider>
    </AppThemeProvider>
  );
}
