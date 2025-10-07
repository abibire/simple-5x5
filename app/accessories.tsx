import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ACCESSORY_EXERCISES, CATEGORY_NAMES } from "./accessoryExercises";
import { useTheme } from "./ThemeContext";
import { createThemedStyles } from "./themedStyles";
import { AccessoryCategory, UserAccessoryExercise } from "./types";
import { useWorkout } from "./WorkoutContext";

const AccessoriesApp: React.FC = () => {
  const { theme, isDark } = useTheme();
  const styles = createThemedStyles(theme);
  const { accessories, setAccessories, unitSystem } = useWorkout();

  const [expandedCategory, setExpandedCategory] =
    useState<AccessoryCategory | null>(null);

  const toggleCategory = (category: AccessoryCategory) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const isExerciseEnabled = (exerciseId: string): boolean => {
    return accessories.some((acc) => acc.id === exerciseId && acc.enabled);
  };

  const getExerciseConfig = (
    exerciseId: string
  ): UserAccessoryExercise | undefined => {
    return accessories.find((acc) => acc.id === exerciseId);
  };

  const toggleExercise = (exerciseId: string) => {
    const exercise = ACCESSORY_EXERCISES.find((ex) => ex.id === exerciseId);
    if (!exercise) return;

    const existingIndex = accessories.findIndex((acc) => acc.id === exerciseId);

    if (existingIndex >= 0) {
      const newAccessories = [...accessories];
      newAccessories[existingIndex] = {
        ...newAccessories[existingIndex],
        enabled: !newAccessories[existingIndex].enabled
      };
      setAccessories(newAccessories);
    } else {
      const newAccessory: UserAccessoryExercise = {
        ...exercise,
        enabled: true,
        sets: exercise.defaultSets,
        reps: exercise.defaultReps,
        rest: exercise.defaultRest,
        weight: exercise.defaultWeight,
        workouts: ["A", "B"]
      };
      setAccessories([...accessories, newAccessory]);
    }
  };

  const updateExerciseConfig = (
    exerciseId: string,
    field: keyof UserAccessoryExercise,
    value: any
  ) => {
    const index = accessories.findIndex((acc) => acc.id === exerciseId);
    if (index < 0) return;

    const newAccessories = [...accessories];
    newAccessories[index] = {
      ...newAccessories[index],
      [field]: value
    };
    setAccessories(newAccessories);
  };

  const toggleWorkout = (exerciseId: string, workout: "A" | "B") => {
    const exercise = getExerciseConfig(exerciseId);
    if (!exercise) return;

    const workouts = exercise.workouts.includes(workout)
      ? exercise.workouts.filter((w) => w !== workout)
      : [...exercise.workouts, workout];

    updateExerciseConfig(exerciseId, "workouts", workouts);
  };

  const groupedExercises = ACCESSORY_EXERCISES.reduce((acc, exercise) => {
    if (!acc[exercise.category]) {
      acc[exercise.category] = [];
    }
    acc[exercise.category].push(exercise);
    return acc;
  }, {} as Record<AccessoryCategory, typeof ACCESSORY_EXERCISES>);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.header}>
        <View style={styles.progressHeaderContent}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.6}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Accessories</Text>
            <Text style={styles.headerSubtitle}>Customize your workout</Text>
          </View>
        </View>
      </View>
      <ScrollView style={styles.scrollView}>
        {(
          Object.entries(groupedExercises) as [
            AccessoryCategory,
            typeof ACCESSORY_EXERCISES
          ][]
        ).map(([category, exercises]) => (
          <View key={category} style={styles.weightsContainer}>
            <TouchableOpacity
              onPress={() => toggleCategory(category)}
              activeOpacity={0.6}
              style={styles.weightsHeader}
            >
              <Text style={styles.weightsTitle}>
                {CATEGORY_NAMES[category]}
              </Text>
              <Ionicons
                name={
                  expandedCategory === category ? "chevron-up" : "chevron-down"
                }
                size={24}
                color={theme.text}
              />
            </TouchableOpacity>

            {expandedCategory === category && (
              <View style={{ padding: 16, gap: 16 }}>
                {exercises.map((exercise) => {
                  const config = getExerciseConfig(exercise.id);
                  const enabled = isExerciseEnabled(exercise.id);

                  return (
                    <View key={exercise.id} style={styles.exerciseContainer}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 8
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "600",
                            color: theme.text
                          }}
                        >
                          {exercise.name}
                        </Text>
                        <TouchableOpacity
                          onPress={() => toggleExercise(exercise.id)}
                          style={{
                            width: 50,
                            height: 28,
                            borderRadius: 14,
                            backgroundColor: enabled
                              ? theme.primary
                              : theme.border,
                            justifyContent: "center",
                            padding: 2
                          }}
                        >
                          <View
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 12,
                              backgroundColor: "white",
                              alignSelf: enabled ? "flex-end" : "flex-start"
                            }}
                          />
                        </TouchableOpacity>
                      </View>

                      {enabled && config && (
                        <View style={{ gap: 12 }}>
                          <View
                            style={{
                              flexDirection: "row",
                              gap: 12,
                              alignItems: "center"
                            }}
                          >
                            <View style={{ flex: 1 }}>
                              <Text
                                style={{
                                  fontSize: 12,
                                  color: theme.textSecondary,
                                  marginBottom: 4
                                }}
                              >
                                Sets
                              </Text>
                              <TextInput
                                style={{
                                  backgroundColor: theme.surfaceSecondary,
                                  borderWidth: 1,
                                  borderColor: theme.border,
                                  borderRadius: 8,
                                  padding: 8,
                                  fontSize: 16,
                                  color: theme.text,
                                  textAlign: "center"
                                }}
                                value={config.sets.toString()}
                                onChangeText={(text) => {
                                  if (text === "") return;
                                  const num = parseInt(text);
                                  if (!isNaN(num) && num > 0) {
                                    updateExerciseConfig(
                                      exercise.id,
                                      "sets",
                                      num
                                    );
                                  }
                                }}
                                keyboardType="numeric"
                                placeholderTextColor={theme.textSecondary}
                              />
                            </View>

                            <View style={{ flex: 1 }}>
                              <Text
                                style={{
                                  fontSize: 12,
                                  color: theme.textSecondary,
                                  marginBottom: 4
                                }}
                              >
                                Reps
                              </Text>
                              <TextInput
                                style={{
                                  backgroundColor: theme.surfaceSecondary,
                                  borderWidth: 1,
                                  borderColor: theme.border,
                                  borderRadius: 8,
                                  padding: 8,
                                  fontSize: 16,
                                  color: theme.text,
                                  textAlign: "center"
                                }}
                                value={config.reps.toString()}
                                onChangeText={(text) => {
                                  if (text === "") return;
                                  const num = parseInt(text);
                                  if (!isNaN(num) && num > 0) {
                                    updateExerciseConfig(
                                      exercise.id,
                                      "reps",
                                      num
                                    );
                                  }
                                }}
                                keyboardType="numeric"
                                placeholderTextColor={theme.textSecondary}
                              />
                            </View>

                            <View style={{ flex: 1 }}>
                              <Text
                                style={{
                                  fontSize: 12,
                                  color: theme.textSecondary,
                                  marginBottom: 4
                                }}
                              >
                                Rest (s)
                              </Text>
                              <TextInput
                                style={{
                                  backgroundColor: theme.surfaceSecondary,
                                  borderWidth: 1,
                                  borderColor: theme.border,
                                  borderRadius: 8,
                                  padding: 8,
                                  fontSize: 16,
                                  color: theme.text,
                                  textAlign: "center"
                                }}
                                value={config.rest.toString()}
                                onChangeText={(text) => {
                                  if (text === "") {
                                    updateExerciseConfig(
                                      exercise.id,
                                      "rest",
                                      0
                                    );
                                    return;
                                  }
                                  const num = parseInt(text);
                                  if (!isNaN(num) && num >= 0) {
                                    updateExerciseConfig(
                                      exercise.id,
                                      "rest",
                                      num
                                    );
                                  }
                                }}
                                keyboardType="numeric"
                                placeholderTextColor={theme.textSecondary}
                              />
                            </View>
                          </View>

                          <View style={{ flexDirection: "row", gap: 12 }}>
                            <View style={{ flex: 1 }}>
                              <Text
                                style={{
                                  fontSize: 12,
                                  color: theme.textSecondary,
                                  marginBottom: 4
                                }}
                              >
                                Weight ({unitSystem})
                              </Text>
                              <TextInput
                                style={{
                                  backgroundColor: theme.surfaceSecondary,
                                  borderWidth: 1,
                                  borderColor: theme.border,
                                  borderRadius: 8,
                                  padding: 8,
                                  fontSize: 16,
                                  color: theme.text,
                                  textAlign: "center"
                                }}
                                value={config.weight.toString()}
                                onChangeText={(text) => {
                                  if (text === "") {
                                    updateExerciseConfig(
                                      exercise.id,
                                      "weight",
                                      0
                                    );
                                    return;
                                  }
                                  const num = parseFloat(text);
                                  if (!isNaN(num) && num >= 0) {
                                    updateExerciseConfig(
                                      exercise.id,
                                      "weight",
                                      num
                                    );
                                  }
                                }}
                                keyboardType="numeric"
                                placeholderTextColor={theme.textSecondary}
                              />
                            </View>
                          </View>

                          <View>
                            <Text
                              style={{
                                fontSize: 12,
                                color: theme.textSecondary,
                                marginBottom: 8
                              }}
                            >
                              Add to workouts:
                            </Text>
                            <View style={{ flexDirection: "row", gap: 8 }}>
                              <TouchableOpacity
                                onPress={() => toggleWorkout(exercise.id, "A")}
                                style={{
                                  flex: 1,
                                  backgroundColor: config.workouts.includes("A")
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
                                    color: config.workouts.includes("A")
                                      ? "white"
                                      : theme.text
                                  }}
                                >
                                  Workout A
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => toggleWorkout(exercise.id, "B")}
                                style={{
                                  flex: 1,
                                  backgroundColor: config.workouts.includes("B")
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
                                    color: config.workouts.includes("B")
                                      ? "white"
                                      : theme.text
                                  }}
                                >
                                  Workout B
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const AccessoriesScreen: React.FC = () => {
  const { theme, isDark } = useTheme();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.primary }}>
        <StatusBar
          barStyle={isDark ? "light-content" : "light-content"}
          backgroundColor={theme.primary}
          translucent={false}
        />
        <AccessoriesApp />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default AccessoriesScreen;
