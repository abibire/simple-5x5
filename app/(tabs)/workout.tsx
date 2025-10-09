import PlateCalculator from "@/components/PlateCalculator";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  AppState,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  createDefaultSession,
  DELOAD_PERCENTAGE,
  exerciseNames,
  getTargetRepsForScheme,
  MAX_FAILURES_BEFORE_DELOAD,
  MINIMUM_INCREMENT,
  PROGRESSION_INCREMENTS
} from "@/src/constants/constants";
import { handleWorkoutCompletion } from "@/src/utils/reviewPrompt";
import { useTheme } from "@/src/contexts/ThemeContext";
import { createThemedStyles } from "@/src/styles/themedStyles";
import {
  CurrentSession,
  ExerciseKey,
  UserAccessoryExercise,
  WorkoutType
} from "@/src/types/types";
import {
  formatTime,
  formatWeight,
  getRepButtonStyle,
  getRepButtonTextStyle
} from "@/src/utils/utils";
import { useWorkout } from "@/src/contexts/WorkoutContext";

interface AccessorySessionData {
  [key: string]: number[];
}

interface AccessoryWeightEditing {
  [key: string]: boolean;
}

interface AccessoryWeightInput {
  [key: string]: string;
}

const Simple5x5App: React.FC = () => {
  const {
    weights,
    setWeights,
    setWorkoutHistory,
    exerciseFailures,
    setExerciseFailures,
    exerciseDeloads,
    setExerciseDeloads,
    unitSystem,
    accessories,
    setAccessories,
    repSchemes
  } = useWorkout();

  const { theme, isDark } = useTheme();
  const styles = createThemedStyles(theme);

  const [currentWorkout, setCurrentWorkout] = useState<WorkoutType>("A");
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const TEST_MODE = true;
  const [timeLeft, setTimeLeft] = useState<number>(TEST_MODE ? 2 : 180);
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [scheduledId, setScheduledId] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState<CurrentSession>(
    createDefaultSession(repSchemes)
  );
  const [accessorySession, setAccessorySession] =
    useState<AccessorySessionData>({});
  const [editingAccessoryWeight, setEditingAccessoryWeight] =
    useState<AccessoryWeightEditing>({});
  const [accessoryWeightInput, setAccessoryWeightInput] =
    useState<AccessoryWeightInput>({});
  const [hasShownDeloadAlert, setHasShownDeloadAlert] =
    useState<boolean>(false);
  const [editingWeight, setEditingWeight] = useState<ExerciseKey | null>(null);
  const [weightInputValue, setWeightInputValue] = useState<string>("");
  const [bodyweight, setBodyweight] = useState<string>("");
  const [showBodyweightInput, setShowBodyweightInput] =
    useState<boolean>(false);
  const [showWeightModal, setShowWeightModal] = useState<boolean>(false);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseKey | null>(
    null
  );

  const appState = useRef(AppState.currentState);
  const isNative = Platform.OS !== "web";

  const activeAccessories = accessories.filter(
    (acc) => acc.enabled && acc.workouts.includes(currentWorkout)
  );

  useEffect(() => {
    setupNotifications();
    setHasShownDeloadAlert(false);
    checkForDeloads();
  }, [currentWorkout]);

  useEffect(() => {
    initializeAccessorySession();
    setCurrentSession(createDefaultSession(repSchemes));
  }, [currentWorkout, accessories, repSchemes]);

  const initializeAccessorySession = () => {
    const newAccessorySession: AccessorySessionData = {};
    activeAccessories.forEach((acc) => {
      newAccessorySession[acc.id] = Array(acc.sets).fill(-1);
    });
    setAccessorySession(newAccessorySession);
  };

  useEffect(() => {
    if (!isNative) return;
    const last = Notifications.getLastNotificationResponse();
    if (last?.actionIdentifier === "complete-set") {
      Notifications.dismissAllNotificationsAsync();
      router.push("/(tabs)/workout");
      completeNextSetAndRestart();
    }
  }, [isNative]);

  useEffect(() => {
    if (!isNative) return;
    const sub = Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );
    return () => sub.remove();
  }, [isNative]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      const prev = appState.current;
      appState.current = next;
      if (prev?.match(/inactive|background/) && next === "active") {
        if (endsAt) {
          const diff = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
          setTimeLeft(diff);
          setIsTimerRunning(diff > 0);
        }
      }
    });
    return () => sub.remove();
  }, [endsAt]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning && endsAt) {
      interval = setInterval(() => {
        const diff = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
        setTimeLeft(diff);
        if (diff === 0) {
          setIsTimerRunning(false);
          clearInterval(interval!);
        }
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, endsAt]);

  const setupNotifications = async () => {
    if (!isNative) return;
    await Notifications.requestPermissionsAsync();
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false
      })
    });
    await Notifications.setNotificationCategoryAsync("timer-complete", [
      {
        identifier: "reopen-app",
        buttonTitle: "Open App",
        options: { opensAppToForeground: true }
      },
      {
        identifier: "complete-set",
        buttonTitle: "Complete next set",
        options: { opensAppToForeground: true }
      }
    ]);
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("rest-timer", {
        name: "Rest Timer",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lockscreenVisibility:
          Notifications.AndroidNotificationVisibility.PUBLIC,
        bypassDnd: false,
        sound: "set_bell.wav"
      });
    }
  };

  const handleNotificationResponse = async (
    response: Notifications.NotificationResponse
  ) => {
    await Notifications.dismissAllNotificationsAsync();
    router.push("/(tabs)/workout");
    const actionIdentifier = response.actionIdentifier;
    if (actionIdentifier === "complete-set") {
      completeNextSetAndRestart();
    }
  };

  const scheduleRestNotification = async (seconds: number) => {
    if (!isNative) return;
    if (scheduledId) {
      try {
        await Notifications.cancelScheduledNotificationAsync(scheduledId);
      } catch {}
    }
    const trigger: Notifications.NotificationTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
      repeats: false,
      ...(Platform.OS === "android" ? { channelId: "rest-timer" } : {})
    };
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Rest Timer Complete!",
        body: "Time to get back to your workout",
        categoryIdentifier: "timer-complete",
        sound: Platform.OS === "ios" ? "set_bell.wav" : true,
        data: { type: "timer-complete" },
        autoDismiss: true
      },
      trigger
    });
    setScheduledId(id);
  };

  const startTimer = async (duration: number = 180) => {
    const secs = Math.max(1, Math.floor(duration));
    setEndsAt(Date.now() + secs * 1000);
    setTimeLeft(secs);
    setIsTimerRunning(true);
    await scheduleRestNotification(secs);
  };

  const completeNextSetAndRestart = () => {
    setCurrentSession((prevSession) => {
      const exercises = getCurrentExercises();
      let foundEmptySet = false;
      let updatedSession = { ...prevSession };
      for (const ex of exercises) {
        const currentSets = prevSession[ex].sets;
        const scheme = repSchemes[ex];
        if (scheme === "1x5") {
          if (currentSets[0] === -1) {
            updatedSession = {
              ...updatedSession,
              [ex]: {
                ...updatedSession[ex],
                sets: [5]
              }
            };
            foundEmptySet = true;
            break;
          }
        } else {
          const emptyIndex = currentSets.findIndex((r) => r === -1);
          if (emptyIndex !== -1) {
            const newSets = [...currentSets];
            newSets[emptyIndex] = 5;
            updatedSession = {
              ...updatedSession,
              [ex]: {
                ...updatedSession[ex],
                sets: newSets
              }
            };
            foundEmptySet = true;
            break;
          }
        }
      }
      if (foundEmptySet) {
        setIsTimerRunning(false);
        setEndsAt(null);
        setTimeout(() => {
          startTimer(TEST_MODE ? 2 : 180);
        }, 100);
      }
      return updatedSession;
    });
  };

  const roundWeight = (weight: number): number => {
    const increment = MINIMUM_INCREMENT[unitSystem];
    return Math.round(weight / increment) * increment;
  };

  const checkForDeloads = (): void => {
    if (hasShownDeloadAlert) return;
    const exercises = getCurrentExercises();
    const exercisesToDeload: Array<{
      exercise: ExerciseKey;
      oldWeight: number;
      newWeight: number;
    }> = [];
    exercises.forEach((exercise: ExerciseKey) => {
      if (exerciseFailures[exercise] >= MAX_FAILURES_BEFORE_DELOAD) {
        const oldWeight = weights[exercise];
        const deloadAmount = oldWeight * DELOAD_PERCENTAGE;
        const rawNewWeight = oldWeight - deloadAmount;
        const newWeight = Math.max(
          PROGRESSION_INCREMENTS[unitSystem][exercise],
          roundWeight(rawNewWeight)
        );
        exercisesToDeload.push({
          exercise,
          oldWeight,
          newWeight
        });
      }
    });
    if (exercisesToDeload.length > 0) {
      setHasShownDeloadAlert(true);
      const deloadText = exercisesToDeload
        .map(
          ({ exercise, oldWeight, newWeight }) =>
            `${exerciseNames[exercise]}: ${formatWeight(
              oldWeight,
              unitSystem
            )} → ${formatWeight(newWeight, unitSystem)}`
        )
        .join("\n");
      Alert.alert(
        "Deload Recommended",
        `After 3 failed sessions, these exercises should be deloaded by 10%:\n\n${deloadText}`,
        [
          { text: "yolo", style: "cancel" },
          { text: "Accept", onPress: () => applyDeloads(exercisesToDeload) }
        ]
      );
    }
  };

  const applyDeloads = (
    exercisesToDeload: Array<{
      exercise: ExerciseKey;
      oldWeight: number;
      newWeight: number;
    }>
  ): void => {
    const newWeights = { ...weights };
    const newFailures = { ...exerciseFailures };
    const newDeloads = { ...exerciseDeloads };
    exercisesToDeload.forEach(({ exercise, newWeight }) => {
      newWeights[exercise] = newWeight;
      newFailures[exercise] = 0;
      newDeloads[exercise] += 1;
    });
    setWeights(newWeights);
    setExerciseFailures(newFailures);
    setExerciseDeloads(newDeloads);
  };

  const updateSet = (exercise: ExerciseKey, setIndex: number): void => {
    Notifications.dismissAllNotificationsAsync();
    setCurrentSession((prev) => {
      const currentReps = prev[exercise].sets[setIndex];
      let nextReps: number;
      if (currentReps === -1) nextReps = 5;
      else if (currentReps === 0) nextReps = -1;
      else nextReps = currentReps - 1;
      if (nextReps > 0) {
        const restTime =
          nextReps === 5 ? (TEST_MODE ? 2 : 180) : TEST_MODE ? 3 : 300;
        startTimer(restTime);
      }
      return {
        ...prev,
        [exercise]: {
          ...prev[exercise],
          sets: prev[exercise].sets.map((set, index) =>
            index === setIndex ? nextReps : set
          )
        }
      };
    });
  };

  const toggleAccessorySet = (
    accessoryId: string,
    setIndex: number,
    targetReps: number,
    restTime: number
  ): void => {
    Notifications.dismissAllNotificationsAsync();
    setAccessorySession((prev) => {
      const newSession = { ...prev };
      if (!newSession[accessoryId]) {
        return prev;
      }
      newSession[accessoryId] = [...newSession[accessoryId]];

      const currentReps = newSession[accessoryId][setIndex];
      let nextReps: number;

      if (currentReps === -1) {
        nextReps = targetReps;
      } else if (currentReps === 0) {
        nextReps = -1;
      } else {
        nextReps = currentReps - 1;
      }

      newSession[accessoryId][setIndex] = nextReps;

      if (nextReps > 0) {
        startTimer(restTime);
      }

      return newSession;
    });
  };

  const isExerciseCompleted = (exercise: ExerciseKey): boolean => {
    const sets = currentSession[exercise].sets;
    const totalReps = sets.reduce((sum, reps) => sum + Math.max(0, reps), 0);
    const targetReps = getTargetRepsForScheme(repSchemes[exercise]);
    return totalReps >= targetReps;
  };

  const hasIncompleteSets = (): boolean => {
    const exercises = getCurrentExercises();
    return exercises.some((exercise: ExerciseKey) => {
      const sets = currentSession[exercise].sets;
      return sets.some((reps) => reps === -1);
    });
  };

  const finishWorkout = (): void => {
    const exercises = getCurrentExercises();
    const newWeights = { ...weights };
    const newFailures = { ...exerciseFailures };
    const newDeloads = { ...exerciseDeloads };
    exercises.forEach((exercise: ExerciseKey) => {
      const completed = isExerciseCompleted(exercise);
      if (completed) {
        newFailures[exercise] = 0;
        newWeights[exercise] = roundWeight(
          newWeights[exercise] + PROGRESSION_INCREMENTS[unitSystem][exercise]
        );
      } else {
        newFailures[exercise] += 1;
      }
    });

    const accessoriesData = activeAccessories.map((acc) => ({
      id: acc.id,
      name: acc.name,
      weight: acc.weight ?? 0,
      sets: accessorySession[acc.id]?.map((reps) => Math.max(0, reps)) || [],
      targetReps: acc.reps
    }));

    const workout = {
      date: new Date().toLocaleDateString(),
      type: currentWorkout,
      exercises: exercises.map((ex: ExerciseKey) => ({
        name: exerciseNames[ex],
        weight: weights[ex],
        sets: currentSession[ex].sets.map((reps) => Math.max(0, reps)),
        completed: isExerciseCompleted(ex),
        repScheme: repSchemes[ex]
      })),
      accessories: accessoriesData.length > 0 ? accessoriesData : undefined,
      bodyweight: bodyweight ? parseFloat(bodyweight) : undefined,
      unit: unitSystem
    };
    setWorkoutHistory((prev) => [workout, ...prev]);
    setWeights(newWeights);
    setExerciseFailures(newFailures);
    setExerciseDeloads(newDeloads);
    setCurrentSession(createDefaultSession(repSchemes));
    setCurrentWorkout(currentWorkout === "A" ? "B" : "A");
    setBodyweight("");
    setShowBodyweightInput(false);
    initializeAccessorySession();

    handleWorkoutCompletion(TEST_MODE);

    router.push("/");
  };

  const completeWorkout = (): void => {
    if (hasIncompleteSets()) {
      Alert.alert(
        "Incomplete Workout",
        "You haven't completed all sets. Do you still want to finish this workout?",
        [{ text: "Cancel" }, { text: "Finish", onPress: finishWorkout }]
      );
    } else {
      finishWorkout();
    }
  };

  const getCurrentExercises = (): ExerciseKey[] => {
    const exercises =
      currentWorkout === "A"
        ? (["squat", "bench", "row"] as ExerciseKey[])
        : (["squat", "ohp", "deadlift"] as ExerciseKey[]);
    return exercises;
  };

  const startEditingWeight = (exercise: ExerciseKey): void => {
    setEditingWeight(exercise);
    setWeightInputValue(weights[exercise].toString());
  };

  const confirmWeightEdit = (): void => {
    if (editingWeight) {
      const newWeight = parseFloat(weightInputValue);
      if (!isNaN(newWeight) && newWeight > 0) {
        const newWeights = { ...weights };
        newWeights[editingWeight] = roundWeight(newWeight);
        setWeights(newWeights);
      }
      setEditingWeight(null);
      setWeightInputValue("");
    }
  };

  const cancelWeightEdit = (): void => {
    setEditingWeight(null);
    setWeightInputValue("");
  };

  const startEditingAccessoryWeight = (
    accessoryId: string,
    currentWeight: number
  ): void => {
    setEditingAccessoryWeight({
      ...editingAccessoryWeight,
      [accessoryId]: true
    });
    setAccessoryWeightInput({
      ...accessoryWeightInput,
      [accessoryId]: currentWeight.toString()
    });
  };

  const confirmAccessoryWeightEdit = (accessoryId: string): void => {
    const newWeight = parseFloat(accessoryWeightInput[accessoryId] || "0");
    if (!isNaN(newWeight) && newWeight >= 0) {
      const index = accessories.findIndex((acc) => acc.id === accessoryId);
      if (index >= 0) {
        const newAccessories = [...accessories];
        newAccessories[index] = {
          ...newAccessories[index],
          weight: newWeight
        };
        setAccessories(newAccessories);
      }
    }
    setEditingAccessoryWeight({
      ...editingAccessoryWeight,
      [accessoryId]: false
    });
    setAccessoryWeightInput({ ...accessoryWeightInput, [accessoryId]: "" });
  };

  const cancelAccessoryWeightEdit = (accessoryId: string): void => {
    setEditingAccessoryWeight({
      ...editingAccessoryWeight,
      [accessoryId]: false
    });
    setAccessoryWeightInput({ ...accessoryWeightInput, [accessoryId]: "" });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "light-content"}
        backgroundColor={theme.primary}
        translucent={false}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Simple 5×5</Text>
          <Text style={styles.headerSubtitle}>Workout {currentWorkout}</Text>
        </View>
        <View style={styles.timerContainer}>
          <View style={styles.timerRow}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          </View>
          <View style={styles.presetButtons}>
            <TouchableOpacity
              onPress={() => startTimer(TEST_MODE ? 1 : 90)}
              style={styles.presetButton}
            >
              <Text style={styles.presetButtonText}>1:30</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => startTimer(TEST_MODE ? 2 : 180)}
              style={styles.presetButton}
            >
              <Text style={styles.presetButtonText}>3:00</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => startTimer(TEST_MODE ? 3 : 300)}
              style={styles.presetButton}
            >
              <Text style={styles.presetButtonText}>5:00</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowBodyweightInput(!showBodyweightInput)}
              style={[
                styles.presetButton,
                showBodyweightInput && { backgroundColor: theme.primary }
              ]}
            >
              <Text
                style={[
                  styles.presetButtonText,
                  showBodyweightInput && { color: "white" }
                ]}
              >
                BW
              </Text>
            </TouchableOpacity>
          </View>
          {showBodyweightInput && (
            <View style={{ marginTop: 12 }}>
              <Text
                style={{
                  fontSize: 12,
                  color: theme.textSecondary,
                  marginBottom: 4
                }}
              >
                Bodyweight
              </Text>
              <View style={styles.weightEditContainer}>
                <TextInput
                  style={styles.weightInput}
                  value={bodyweight}
                  onChangeText={setBodyweight}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={theme.textSecondary}
                  onSubmitEditing={() => setShowBodyweightInput(false)}
                />
                <Text style={styles.exerciseWeight}>{unitSystem}</Text>
                <TouchableOpacity
                  onPress={() => setShowBodyweightInput(false)}
                  style={[
                    styles.weightEditButton,
                    styles.weightEditButtonConfirm
                  ]}
                >
                  <Text style={styles.weightEditButtonText}>✓</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setBodyweight("");
                    setShowBodyweightInput(false);
                  }}
                  style={[
                    styles.weightEditButton,
                    styles.weightEditButtonCancel
                  ]}
                >
                  <Text style={styles.weightEditButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        <View style={styles.workoutContainer}>
          {getCurrentExercises().map((exercise: ExerciseKey) => (
            <View key={exercise} style={styles.exerciseContainer}>
              <View style={styles.exerciseHeader}>
                <View>
                  <Text style={styles.exerciseName}>
                    {exerciseNames[exercise]}
                  </Text>
                  <Text style={{ fontSize: 11, color: theme.textSecondary }}>
                    {repSchemes[exercise]}
                  </Text>
                </View>
                {editingWeight === exercise ? (
                  <View style={styles.weightEditContainer}>
                    <TextInput
                      style={styles.weightInput}
                      value={weightInputValue}
                      onChangeText={setWeightInputValue}
                      keyboardType="numeric"
                      selectTextOnFocus
                      autoFocus
                      onSubmitEditing={confirmWeightEdit}
                      placeholderTextColor={theme.textSecondary}
                    />
                    <Text style={styles.exerciseWeight}>{unitSystem}</Text>
                    <TouchableOpacity
                      onPress={confirmWeightEdit}
                      style={[
                        styles.weightEditButton,
                        styles.weightEditButtonConfirm
                      ]}
                    >
                      <Text style={styles.weightEditButtonText}>✓</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={cancelWeightEdit}
                      style={[
                        styles.weightEditButton,
                        styles.weightEditButtonCancel
                      ]}
                    >
                      <Text style={styles.weightEditButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedExercise(exercise);
                        setShowWeightModal(true);
                      }}
                      activeOpacity={0.6}
                    >
                      <MaterialCommunityIcons
                        name="weight"
                        size={20}
                        color={theme.primary}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => startEditingWeight(exercise)}
                      activeOpacity={0.6}
                    >
                      <Text style={styles.exerciseWeightClickable}>
                        {formatWeight(weights[exercise], unitSystem)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <View style={styles.setsContainer}>
                {currentSession[exercise].sets.map(
                  (reps: number, setIndex: number) => {
                    return (
                      <View key={setIndex} style={styles.setContainer}>
                        <Text style={styles.setLabel}>Set {setIndex + 1}</Text>
                        <TouchableOpacity
                          onPress={() => updateSet(exercise, setIndex)}
                          style={[
                            styles.repButton,
                            getRepButtonStyle(reps) === "complete"
                              ? styles.repButtonComplete
                              : styles.repButtonEmpty
                          ]}
                        >
                          <Text
                            style={[
                              styles.repButtonText,
                              getRepButtonTextStyle(reps) === "complete"
                                ? styles.repButtonTextComplete
                                : styles.repButtonTextEmpty
                            ]}
                          >
                            {reps >= 0 ? reps.toString() : ""}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  }
                )}
              </View>
            </View>
          ))}
        </View>

        {activeAccessories.length > 0 && (
          <View style={styles.workoutContainer}>
            <View style={styles.weightsHeader}>
              <Text style={styles.weightsTitle}>Accessories</Text>
            </View>
            {activeAccessories.map((accessory: UserAccessoryExercise) => {
              const safeWeight = accessory.weight ?? 0;

              return (
                <View key={accessory.id} style={styles.exerciseContainer}>
                  <View style={styles.exerciseHeader}>
                    <Text style={styles.exerciseName}>{accessory.name}</Text>
                    {editingAccessoryWeight[accessory.id] ? (
                      <View style={styles.weightEditContainer}>
                        <TextInput
                          style={styles.weightInput}
                          value={accessoryWeightInput[accessory.id]}
                          onChangeText={(text) =>
                            setAccessoryWeightInput({
                              ...accessoryWeightInput,
                              [accessory.id]: text
                            })
                          }
                          keyboardType="numeric"
                          selectTextOnFocus
                          autoFocus
                          onSubmitEditing={() =>
                            confirmAccessoryWeightEdit(accessory.id)
                          }
                          placeholderTextColor={theme.textSecondary}
                        />
                        <Text style={styles.exerciseWeight}>{unitSystem}</Text>
                        <TouchableOpacity
                          onPress={() =>
                            confirmAccessoryWeightEdit(accessory.id)
                          }
                          style={[
                            styles.weightEditButton,
                            styles.weightEditButtonConfirm
                          ]}
                        >
                          <Text style={styles.weightEditButtonText}>✓</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            cancelAccessoryWeightEdit(accessory.id)
                          }
                          style={[
                            styles.weightEditButton,
                            styles.weightEditButtonCancel
                          ]}
                        >
                          <Text style={styles.weightEditButtonText}>✕</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8
                        }}
                      >
                        <TouchableOpacity
                          onPress={() =>
                            startEditingAccessoryWeight(
                              accessory.id,
                              safeWeight
                            )
                          }
                          activeOpacity={0.6}
                        >
                          <Text style={styles.exerciseWeightClickable}>
                            {formatWeight(safeWeight, unitSystem)}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                  <View style={styles.setsContainer}>
                    {accessorySession[accessory.id]?.map(
                      (reps: number, setIndex: number) => (
                        <View key={setIndex} style={styles.setContainer}>
                          <Text style={styles.setLabel}>
                            Set {setIndex + 1}
                          </Text>
                          <TouchableOpacity
                            onPress={() =>
                              toggleAccessorySet(
                                accessory.id,
                                setIndex,
                                accessory.reps,
                                accessory.rest
                              )
                            }
                            style={[
                              styles.repButton,
                              getRepButtonStyle(reps) === "complete"
                                ? styles.repButtonComplete
                                : styles.repButtonEmpty
                            ]}
                          >
                            <Text
                              style={[
                                styles.repButtonText,
                                getRepButtonTextStyle(reps) === "complete"
                                  ? styles.repButtonTextComplete
                                  : styles.repButtonTextEmpty
                              ]}
                            >
                              {reps >= 0 ? reps.toString() : ""}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <View style={styles.completeButtonContainer}>
          <TouchableOpacity
            onPress={completeWorkout}
            style={styles.completeButton}
          >
            <Text style={styles.completeButtonText}>Complete Workout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <PlateCalculator
        visible={showWeightModal}
        onClose={() => setShowWeightModal(false)}
        weight={selectedExercise ? weights[selectedExercise] : 0}
        unitSystem={unitSystem}
        exerciseName={selectedExercise ? exerciseNames[selectedExercise] : ""}
      />
    </SafeAreaView>
  );
};

const Simple5x5: React.FC = () => {
  return (
    <SafeAreaProvider>
      <Simple5x5App />
    </SafeAreaProvider>
  );
};

export default Simple5x5;
