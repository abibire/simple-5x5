import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { ThemeProvider as AppThemeProvider } from "@/src/contexts/ThemeContext";
import { WorkoutProvider, useWorkout } from "@/src/contexts/WorkoutContext";

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

function RootLayoutContent() {
  const { isLoading } = useWorkout();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        while (isLoading) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, [isLoading]);

  if (!appReady) {
    return null;
  }

  return (
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
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <WorkoutProvider>
        <RootLayoutContent />
      </WorkoutProvider>
    </AppThemeProvider>
  );
}
