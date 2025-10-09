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
  squat: "#0f63f9",
  bench: "#dc2626",
  row: "#16a34a",
  ohp: "#f59e0b",
  deadlift: "#9333ea",
  bodyweight: "#06b6d4"
};

const hashStringToColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash % 360);
  const saturation = 65 + (Math.abs(hash >> 8) % 20);
  const lightness = 45 + (Math.abs(hash >> 16) % 15);

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const ProgressScreen: React.FC = () => {
  const { workoutHistory, unitSystem } = useWorkout();
  const { theme, isDark } = useTheme();
  const styles = createThemedStyles(theme);
  const [selectedExercise, setSelectedExercise] = useState<string>("squat");
  const [refreshKey, setRefreshKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((prev) => prev + 1);
    }, [])
  );

  const accessoryExercisesInHistory = useMemo(() => {
    const accessorySet = new Set<string>();
    workoutHistory.forEach((workout) => {
      if (workout.accessories) {
        workout.accessories.forEach((acc) => {
          accessorySet.add(acc.id);
        });
      }
    });
    return Array.from(accessorySet);
  }, [workoutHistory]);

  const chartData = useMemo(() => {
    const exerciseData: Record<string, number[]> = {
      squat: [],
      bench: [],
      row: [],
      ohp: [],
      deadlift: [],
      bodyweight: []
    };

    accessoryExercisesInHistory.forEach((accId) => {
      exerciseData[accId] = [];
    });

    const labels: string[] = [];

    const reversedHistory = [...workoutHistory].reverse();

    reversedHistory.forEach((workout: WorkoutHistoryItem) => {
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

      const workoutAccessories = new Set<string>();
      if (workout.accessories) {
        workout.accessories.forEach((acc) => {
          const workoutUnit = workout.unit || "lbs";
          const weight = convertWeight(acc.weight, workoutUnit, unitSystem);
          exerciseData[acc.id].push(weight);
          workoutAccessories.add(acc.id);
        });
      }

      accessoryExercisesInHistory.forEach((accId) => {
        if (!workoutAccessories.has(accId)) {
          exerciseData[accId].push(0);
        }
      });
    });

    return { exerciseData, labels };
  }, [workoutHistory, unitSystem, refreshKey, accessoryExercisesInHistory]);

  const screenWidth = Dimensions.get("window").width;

  const selectedData = (chartData.exerciseData[selectedExercise] || []).filter(
    (val) => val > 0
  );
  const hasData = selectedData.length > 0;

  const getExerciseColor = (exerciseKey: string): string => {
    if (exerciseKey in EXERCISE_COLORS) {
      return EXERCISE_COLORS[exerciseKey as ExerciseKey | "bodyweight"];
    }
    return hashStringToColor(exerciseKey);
  };

  const getExerciseName = (exerciseKey: string): string => {
    if (exerciseKey === "bodyweight") return "Bodyweight";
    if (exerciseKey in exerciseNames) {
      return exerciseNames[exerciseKey as ExerciseKey];
    }
    const accessory = workoutHistory
      .flatMap((w) => w.accessories || [])
      .find((acc) => acc.id === exerciseKey);
    return accessory?.name || exerciseKey;
  };

  const mainExercises = (Object.keys(exerciseNames) as ExerciseKey[]).filter(
    (key) => (chartData.exerciseData[key] || []).some((val) => val > 0)
  );

  const accessoriesWithData = accessoryExercisesInHistory.filter((accId) =>
    (chartData.exerciseData[accId] || []).some((val) => val > 0)
  );

  const hasBodyweightData = (chartData.exerciseData.bodyweight || []).some(
    (val) => val > 0
  );

  const filteredLabels = chartData.labels.filter(
    (_, i) => (chartData.exerciseData[selectedExercise] || [])[i] > 0
  );

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
                    labels: filteredLabels,
                    datasets: [
                      {
                        data: selectedData,
                        color: () => getExerciseColor(selectedExercise),
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
                      stroke: getExerciseColor(selectedExercise)
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
                    No data for {getExerciseName(selectedExercise)}
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
                {mainExercises.map((key) => {
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
                            : theme.border
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
                        {exerciseNames[key]}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                {hasBodyweightData && (
                  <TouchableOpacity
                    onPress={() => setSelectedExercise("bodyweight")}
                    activeOpacity={0.6}
                    style={[
                      styles.progressExerciseButton,
                      selectedExercise === "bodyweight"
                        ? styles.progressExerciseButtonActive
                        : styles.progressExerciseButtonInactive,
                      {
                        borderColor:
                          selectedExercise === "bodyweight"
                            ? EXERCISE_COLORS.bodyweight
                            : theme.border
                      }
                    ]}
                  >
                    <View
                      style={[
                        styles.progressExerciseDot,
                        {
                          backgroundColor: EXERCISE_COLORS.bodyweight,
                          opacity: selectedExercise === "bodyweight" ? 1 : 0.3
                        }
                      ]}
                    />
                    <Text
                      style={[
                        styles.progressExerciseText,
                        selectedExercise === "bodyweight"
                          ? styles.progressExerciseTextActive
                          : styles.progressExerciseTextInactive
                      ]}
                    >
                      Bodyweight
                    </Text>
                  </TouchableOpacity>
                )}
                {accessoriesWithData.map((accId) => {
                  const isActive = selectedExercise === accId;
                  const color = hashStringToColor(accId);
                  const name = getExerciseName(accId);
                  return (
                    <TouchableOpacity
                      key={accId}
                      onPress={() => setSelectedExercise(accId)}
                      activeOpacity={0.6}
                      style={[
                        styles.progressExerciseButton,
                        isActive
                          ? styles.progressExerciseButtonActive
                          : styles.progressExerciseButtonInactive,
                        {
                          borderColor: isActive ? color : theme.border
                        }
                      ]}
                    >
                      <View
                        style={[
                          styles.progressExerciseDot,
                          {
                            backgroundColor: color,
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
                })}
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
