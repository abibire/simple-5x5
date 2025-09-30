import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import React from "react";
import { WorkoutProvider } from "../WorkoutContext";

export default function TabLayout() {
  return (
    <WorkoutProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#2563eb",
          tabBarInactiveTintColor: Colors.light.tabIconDefault,
          headerShown: false,
          tabBarButton: HapticTab
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            )
          }}
        />
        <Tabs.Screen
          name="workout"
          options={{
            title: "Lift",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="weight-lifter"
                size={size}
                color={color}
              />
            )
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-sharp" size={size} color={color} />
            )
          }}
        />
      </Tabs>
    </WorkoutProvider>
  );
}
