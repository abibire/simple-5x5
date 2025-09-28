import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  createDefaultSession,
  DELOAD_PERCENTAGE,
  exerciseNames,
  MAX_FAILURES_BEFORE_DELOAD,
  PROGRESSION_INCREMENTS,
  TARGET_REPS,
  workouts
} from "../constants";
import { styles } from "../styles";
import { CurrentSession, ExerciseKey, WorkoutType } from "../types";
import { formatTime, getRepButtonStyle, getRepButtonTextStyle } from "../utils";
import { useWorkout } from "../WorkoutContext";

const StrongLifts5x5App: React.FC = () => {
  const {
    weights,
    setWeights,
    setWorkoutHistory,
    exerciseFailures,
    setExerciseFailures,
    exerciseDeloads,
    setExerciseDeloads
  } = useWorkout();

  const [currentWorkout, setCurrentWorkout] = useState<WorkoutType>("A");
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(180);
  const [currentSession, setCurrentSession] = useState<CurrentSession>(
    createDefaultSession()
  );

  useEffect(() => {
    checkForDeloads();
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
      setTimeLeft(180);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeLeft]);

  const checkForDeloads = (): void => {
    const exercises = workouts[currentWorkout];
    const exercisesToDeload: Array<{
      exercise: ExerciseKey;
      oldWeight: number;
      newWeight: number;
    }> = [];

    exercises.forEach((exercise: ExerciseKey) => {
      if (exerciseFailures[exercise] >= MAX_FAILURES_BEFORE_DELOAD) {
        const oldWeight = weights[exercise];
        const deloadAmount = Math.round(oldWeight * DELOAD_PERCENTAGE);
        const newWeight = Math.max(
          PROGRESSION_INCREMENTS[exercise],
          oldWeight - deloadAmount
        );

        exercisesToDeload.push({
          exercise,
          oldWeight,
          newWeight
        });
      }
    });

    if (exercisesToDeload.length > 0) {
      const deloadText = exercisesToDeload
        .map(
          ({ exercise, oldWeight, newWeight }) =>
            `${exerciseNames[exercise]}: ${oldWeight}lbs → ${newWeight}lbs`
        )
        .join("\n");

      Alert.alert(
        "Deload Recommended",
        `After 3 failed sessions, these exercises should be deloaded by 10%\n\n${deloadText}`,
        [
          {
            text: "Ignore",
            style: "cancel"
          },
          {
            text: "Accept",
            onPress: () => applyDeloads(exercisesToDeload)
          }
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

  const startTimer = (duration: number = 180): void => {
    setTimeLeft(duration);
    setIsTimerRunning(true);
  };

  const updateSet = (exercise: ExerciseKey, setIndex: number): void => {
    setCurrentSession((prev) => {
      const currentReps = prev[exercise].sets[setIndex];
      let nextReps: number;

      if (currentReps === -1) {
        nextReps = 5;
      } else if (currentReps === 0) {
        nextReps = -1;
      } else {
        nextReps = currentReps - 1;
      }
      if (nextReps > 0) {
        const restTime = nextReps === 5 ? 180 : 300;
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

  const isExerciseCompleted = (exercise: ExerciseKey): boolean => {
    const sets = currentSession[exercise].sets;
    const totalReps = sets.reduce((sum, reps) => sum + Math.max(0, reps), 0);
    const targetReps = TARGET_REPS[exercise];
    return totalReps >= targetReps;
  };

  const completeWorkout = (): void => {
    const exercises = workouts[currentWorkout];
    const newWeights = { ...weights };
    const newFailures = { ...exerciseFailures };
    const newDeloads = { ...exerciseDeloads };

    exercises.forEach((exercise: ExerciseKey) => {
      const completed = isExerciseCompleted(exercise);

      if (completed) {
        newFailures[exercise] = 0;
        newWeights[exercise] += PROGRESSION_INCREMENTS[exercise];
      } else {
        newFailures[exercise] += 1;
      }
    });

    const workout = {
      date: new Date().toLocaleDateString(),
      type: currentWorkout,
      exercises: exercises.map((ex: ExerciseKey) => ({
        name: exerciseNames[ex],
        weight: weights[ex],
        sets: currentSession[ex].sets.map((reps) => Math.max(0, reps)),
        completed: isExerciseCompleted(ex)
      }))
    };

    setWorkoutHistory((prev) => [workout, ...prev]);
    setWeights(newWeights);
    setExerciseFailures(newFailures);
    setExerciseDeloads(newDeloads);
    setCurrentSession(createDefaultSession());
    setCurrentWorkout(currentWorkout === "A" ? "B" : "A");
  };

  const getCurrentExercises = (): ExerciseKey[] => workouts[currentWorkout];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#2563eb"
        translucent={false}
      />

      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>StrongLifts 5×5</Text>
          <Text style={styles.headerSubtitle}>Workout {currentWorkout}</Text>
        </View>

        <View style={styles.timerContainer}>
          <View style={styles.timerRow}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          </View>
          <View style={styles.presetButtons}>
            <TouchableOpacity
              onPress={() => startTimer(90)}
              style={styles.presetButton}
            >
              <Text style={styles.presetButtonText}>1:30</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => startTimer(180)}
              style={styles.presetButton}
            >
              <Text style={styles.presetButtonText}>3:00</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => startTimer(300)}
              style={styles.presetButton}
            >
              <Text style={styles.presetButtonText}>5:00</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.workoutContainer}>
          {getCurrentExercises().map(
            (exercise: ExerciseKey, exerciseIndex: number) => (
              <View key={exercise} style={styles.exerciseContainer}>
                <View style={styles.exerciseHeader}>
                  <Text style={styles.exerciseName}>
                    {exerciseNames[exercise]}
                  </Text>
                  <Text style={styles.exerciseWeight}>
                    {weights[exercise]} lbs
                  </Text>
                </View>

                <Text style={styles.exerciseDescription}>
                  {exercise === "deadlift"
                    ? "1 set × 5 reps"
                    : "5 sets × 5 reps"}
                </Text>

                <View style={styles.setsContainer}>
                  {currentSession[exercise].sets.map(
                    (reps: number, setIndex: number) => {
                      if (exercise === "deadlift" && setIndex > 0) return null;

                      return (
                        <View key={setIndex} style={styles.setContainer}>
                          <Text style={styles.setLabel}>
                            Set {setIndex + 1}
                          </Text>
                          <TouchableOpacity
                            onPress={() => updateSet(exercise, setIndex)}
                            style={[styles.repButton, getRepButtonStyle(reps)]}
                          >
                            <Text
                              style={[
                                styles.repButtonText,
                                getRepButtonTextStyle(reps)
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
            )
          )}
        </View>

        <View style={styles.completeButtonContainer}>
          <TouchableOpacity
            onPress={completeWorkout}
            style={styles.completeButton}
          >
            <Text style={styles.completeButtonText}>Complete Workout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const StrongLifts5x5: React.FC = () => {
  return (
    <SafeAreaProvider>
      <StrongLifts5x5App />
    </SafeAreaProvider>
  );
};

export default StrongLifts5x5;
