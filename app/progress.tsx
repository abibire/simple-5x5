import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { exerciseNames } from "./constants";
import { useTheme } from "./ThemeContext";
import { createThemedStyles } from "./themedStyles";
import { ExerciseKey, WorkoutHistoryItem } from "./types";
import { convertWeight } from "./utils";
import { useWorkout } from "./WorkoutContext";

const EXERCISE_COLORS: Record<ExerciseKey | "bodyweight", string> = {
  squat: "#2563eb",
  bench: "#dc2626",
  row: "#16a34a",
  ohp: "#f59e0b",
  deadlift: "#9333ea",
  bodyweight: "#06b6d4"
};

const ProgressScreen: React.FC = () => {
  const { workoutHistory, unitSystem } = useWorkout();
  const { theme, isDark } = useTheme();
  const styles = createThemedStyles(theme);
  const [selectedExercise, setSelectedExercise] = useState<
    ExerciseKey | "bodyweight"
  >("squat");
  const [refreshKey, setRefreshKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((prev) => prev + 1);
    }, [])
  );

  const chartData = useMemo(() => {
    const exerciseData: Record<ExerciseKey | "bodyweight", number[]> = {
      squat: [],
      bench: [],
      row: [],
      ohp: [],
      deadlift: [],
      bodyweight: []
    };

    const labels: string[] = [];

    const reversedHistory = [...workoutHistory].reverse();

    reversedHistory.forEach((workout: WorkoutHistoryItem, index: number) => {
      const dateParts = workout.date.split("/");
      const shortDate =
        dateParts.length >= 2
          ? `${dateParts[0]}/${dateParts[1]}`
          : workout.date;
      labels.push(shortDate);

      if (workout.bodyweight) {
        const workoutUnit = workout.unit || "lbs";
        exerciseData.bodyweight.push(
          convertWeight(workout.bodyweight, workoutUnit, unitSystem)
        );
      } else {
        exerciseData.bodyweight.push(0);
      }

      const workoutExercises = new Set<ExerciseKey>();

      workout.exercises.forEach((exercise) => {
        const exerciseKey = Object.entries(exerciseNames).find(
          ([_, name]) => name === exercise.name
        )?.[0] as ExerciseKey | undefined;

        if (exerciseKey) {
          const workoutUnit = workout.unit || "lbs";
          const weight = convertWeight(
            exercise.weight,
            workoutUnit,
            unitSystem
          );
          exerciseData[exerciseKey].push(weight);
          workoutExercises.add(exerciseKey);
        }
      });

      (Object.keys(exerciseNames) as ExerciseKey[]).forEach((key) => {
        if (!workoutExercises.has(key)) {
          exerciseData[key].push(0);
        }
      });
    });

    return { exerciseData, labels };
  }, [workoutHistory, unitSystem, refreshKey]);

  const screenWidth = Dimensions.get("window").width;

  const selectedData = chartData.exerciseData[selectedExercise].filter(
    (val) => val > 0
  );
  const hasData = selectedData.length > 0;

  return (
    <View style={styles.progressContainer}>
      <View style={styles.header}>
        <View style={styles.progressHeaderContent}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.6}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Progress</Text>
            <Text style={styles.headerSubtitle}>
              Weight progression over time
            </Text>
          </View>
        </View>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {workoutHistory.length > 0 ? (
          <>
            <View style={styles.progressChartContainer}>
              {hasData ? (
                <LineChart
                  data={{
                    labels: chartData.labels.filter(
                      (_, i) => chartData.exerciseData[selectedExercise][i] > 0
                    ),
                    datasets: [
                      {
                        data: selectedData,
                        color: () => EXERCISE_COLORS[selectedExercise],
                        strokeWidth: 3
                      }
                    ]
                  }}
                  width={screenWidth}
                  height={280}
                  chartConfig={{
                    backgroundColor: theme.surface,
                    backgroundGradientFrom: theme.surface,
                    backgroundGradientTo: theme.surface,
                    decimalPlaces: 1,
                    color: (opacity = 1) =>
                      isDark
                        ? `rgba(255, 255, 255, ${opacity})`
                        : `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) =>
                      isDark
                        ? `rgba(156, 163, 175, ${opacity})`
                        : `rgba(107, 114, 128, ${opacity})`,
                    style: {
                      borderRadius: 16
                    },
                    propsForDots: {
                      r: "4",
                      strokeWidth: "2",
                      stroke: EXERCISE_COLORS[selectedExercise]
                    },
                    propsForBackgroundLines: {
                      strokeDasharray: "",
                      stroke: theme.border,
                      strokeWidth: 1
                    }
                  }}
                  bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 16
                  }}
                  withInnerLines={true}
                  withOuterLines={true}
                  withVerticalLines={false}
                  withHorizontalLines={true}
                  fromZero={false}
                />
              ) : (
                <View style={styles.progressNoDataContainer}>
                  <Text style={styles.progressNoDataText}>
                    No data for{" "}
                    {selectedExercise === "bodyweight"
                      ? "Bodyweight"
                      : exerciseNames[selectedExercise as ExerciseKey]}
                  </Text>
                </View>
              )}
              <Text style={styles.progressChartLabel}>
                {selectedExercise === "bodyweight"
                  ? `Bodyweight (${unitSystem})`
                  : `Weight (${unitSystem})`}
              </Text>
            </View>

            <View style={styles.progressSelectContainer}>
              <Text style={styles.progressSelectTitle}>Select Exercise</Text>
              <View style={styles.progressSelectList}>
                {(Object.entries(exerciseNames) as [ExerciseKey, string][]).map(
                  ([key, name]) => {
                    const exerciseHasData = chartData.exerciseData[key].some(
                      (val) => val > 0
                    );
                    const isActive = selectedExercise === key;
                    return (
                      <TouchableOpacity
                        key={key}
                        onPress={() => setSelectedExercise(key)}
                        activeOpacity={0.6}
                        style={[
                          styles.progressExerciseButton,
                          isActive
                            ? styles.progressExerciseButtonActive
                            : styles.progressExerciseButtonInactive,
                          {
                            borderColor: isActive
                              ? EXERCISE_COLORS[key]
                              : theme.border,
                            opacity: exerciseHasData ? 1 : 0.5
                          }
                        ]}
                      >
                        <View
                          style={[
                            styles.progressExerciseDot,
                            {
                              backgroundColor: EXERCISE_COLORS[key],
                              opacity: isActive ? 1 : 0.3
                            }
                          ]}
                        />
                        <Text
                          style={[
                            styles.progressExerciseText,
                            isActive
                              ? styles.progressExerciseTextActive
                              : styles.progressExerciseTextInactive
                          ]}
                        >
                          {name}
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                )}
                {(() => {
                  const bodyweightHasData =
                    chartData.exerciseData.bodyweight.some((val) => val > 0);
                  const isActive = selectedExercise === "bodyweight";
                  return (
                    <TouchableOpacity
                      onPress={() => setSelectedExercise("bodyweight")}
                      activeOpacity={0.6}
                      style={[
                        styles.progressExerciseButton,
                        isActive
                          ? styles.progressExerciseButtonActive
                          : styles.progressExerciseButtonInactive,
                        {
                          borderColor: isActive
                            ? EXERCISE_COLORS.bodyweight
                            : theme.border,
                          opacity: bodyweightHasData ? 1 : 0.5
                        }
                      ]}
                    >
                      <View
                        style={[
                          styles.progressExerciseDot,
                          {
                            backgroundColor: EXERCISE_COLORS.bodyweight,
                            opacity: isActive ? 1 : 0.3
                          }
                        ]}
                      />
                      <Text
                        style={[
                          styles.progressExerciseText,
                          isActive
                            ? styles.progressExerciseTextActive
                            : styles.progressExerciseTextInactive
                        ]}
                      >
                        Bodyweight
                      </Text>
                    </TouchableOpacity>
                  );
                })()}
              </View>
            </View>
          </>
        ) : (
          <View style={styles.progressEmptyState}>
            <Text style={styles.progressEmptyStateText}>
              No workout history yet.{"\n"}Complete some workouts to see your
              progress!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const Progress: React.FC = () => {
  const { theme, isDark } = useTheme();
  const styles = createThemedStyles(theme);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar
          barStyle={isDark ? "light-content" : "light-content"}
          backgroundColor={theme.primary}
          translucent={false}
        />
        <ProgressScreen />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Progress;
