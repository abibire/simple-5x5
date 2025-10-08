import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { exerciseNames } from "../constants";
import { useTheme } from "../ThemeContext";
import { createThemedStyles } from "../themedStyles";
import { ExerciseKey, RepScheme, UnitSystem } from "../types";
import { useWorkout } from "../WorkoutContext";

const lbsToKg = (lbs: number): number => {
  return Math.round((lbs * 0.453592) / 1.25) * 1.25;
};

const kgToLbs = (kg: number): number => {
  return Math.round(kg / 0.453592 / 5) * 5;
};

const SettingsApp: React.FC = () => {
  const {
    unitSystem,
    setUnitSystem,
    weights,
    setWeights,
    accessories,
    setAccessories,
    repSchemes,
    setRepSchemes
  } = useWorkout();
  const { theme, themeMode, setThemeMode, isDark } = useTheme();
  const styles = createThemedStyles(theme);

  const handleUnitChange = (newUnit: UnitSystem) => {
    if (newUnit === unitSystem) return;

    Alert.alert(
      "Convert Weights?",
      `Do you want to convert all your current weights from ${unitSystem} to ${newUnit}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Convert",
          onPress: () => {
            const newWeights = { ...weights };
            const exercises: ExerciseKey[] = [
              "squat",
              "bench",
              "row",
              "ohp",
              "deadlift"
            ];

            exercises.forEach((exercise) => {
              if (newUnit === "kg") {
                newWeights[exercise] = lbsToKg(weights[exercise]);
              } else {
                newWeights[exercise] = kgToLbs(weights[exercise]);
              }
            });

            setWeights(newWeights);
            setUnitSystem(newUnit);
          }
        }
      ]
    );
  };

  const handleRepSchemeChange = (exercise: ExerciseKey, scheme: RepScheme) => {
    const newSchemes = { ...repSchemes };
    newSchemes[exercise] = scheme;
    setRepSchemes(newSchemes);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Preferences</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.weightsContainer}>
          <View style={styles.weightsHeader}>
            <Text style={styles.weightsTitle}>Theme</Text>
          </View>
          <View style={{ padding: 16 }}>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={() => setThemeMode("light")}
                style={{
                  flex: 1,
                  backgroundColor:
                    themeMode === "light"
                      ? theme.primary
                      : theme.surfaceSecondary,
                  padding: 16,
                  borderRadius: 8,
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: themeMode === "light" ? "white" : theme.text
                  }}
                >
                  Light
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setThemeMode("dark")}
                style={{
                  flex: 1,
                  backgroundColor:
                    themeMode === "dark"
                      ? theme.primary
                      : theme.surfaceSecondary,
                  padding: 16,
                  borderRadius: 8,
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: themeMode === "dark" ? "white" : theme.text
                  }}
                >
                  Dark
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setThemeMode("system")}
                style={{
                  flex: 1,
                  backgroundColor:
                    themeMode === "system"
                      ? theme.primary
                      : theme.surfaceSecondary,
                  padding: 16,
                  borderRadius: 8,
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: themeMode === "system" ? "white" : theme.text
                  }}
                >
                  System
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.weightsContainer}>
          <View style={styles.weightsHeader}>
            <Text style={styles.weightsTitle}>Unit System</Text>
          </View>
          <View style={{ padding: 16 }}>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={() => handleUnitChange("lbs")}
                style={{
                  flex: 1,
                  backgroundColor:
                    unitSystem === "lbs"
                      ? theme.primary
                      : theme.surfaceSecondary,
                  padding: 16,
                  borderRadius: 8,
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: unitSystem === "lbs" ? "white" : theme.text
                  }}
                >
                  Pounds (lbs)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleUnitChange("kg")}
                style={{
                  flex: 1,
                  backgroundColor:
                    unitSystem === "kg"
                      ? theme.primary
                      : theme.surfaceSecondary,
                  padding: 16,
                  borderRadius: 8,
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: unitSystem === "kg" ? "white" : theme.text
                  }}
                >
                  Kilograms (kg)
                </Text>
              </TouchableOpacity>
            </View>
            <Text
              style={{
                marginTop: 12,
                fontSize: 12,
                color: theme.textSecondary,
                textAlign: "center"
              }}
            >
              Changing units will convert all your current weights
            </Text>
          </View>
        </View>

        <View style={styles.weightsContainer}>
          <View style={styles.weightsHeader}>
            <Text style={styles.weightsTitle}>Rep Schemes</Text>
          </View>
          <View style={{ padding: 16, gap: 16 }}>
            {(Object.entries(exerciseNames) as [ExerciseKey, string][]).map(
              ([key, name]) => (
                <View key={key}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: theme.text,
                      marginBottom: 8
                    }}
                  >
                    {name}
                  </Text>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    {(key === "deadlift"
                      ? (["1x5", "3x5", "5x5"] as RepScheme[])
                      : (["5x5", "3x5", "1x5"] as RepScheme[])
                    ).map((scheme) => (
                      <TouchableOpacity
                        key={scheme}
                        onPress={() => handleRepSchemeChange(key, scheme)}
                        style={{
                          flex: 1,
                          backgroundColor:
                            repSchemes[key] === scheme
                              ? theme.primary
                              : theme.surfaceSecondary,
                          padding: 12,
                          borderRadius: 8,
                          alignItems: "center"
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color:
                              repSchemes[key] === scheme ? "white" : theme.text
                          }}
                        >
                          {scheme}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )
            )}
          </View>
        </View>

        <View style={styles.weightsContainer}>
          <View style={styles.weightsHeader}>
            <Text style={styles.weightsTitle}>Accessory Exercises</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/accessories")}
            style={{
              padding: 16,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <Text style={{ fontSize: 16, color: theme.text }}>
              Manage Accessories
            </Text>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const SettingsScreen: React.FC = () => {
  const { theme, isDark } = useTheme();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.primary }}>
        <StatusBar
          barStyle={isDark ? "light-content" : "light-content"}
          backgroundColor={theme.primary}
          translucent={false}
        />
        <SettingsApp />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default SettingsScreen;
