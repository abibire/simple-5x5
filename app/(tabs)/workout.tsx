import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type WorkoutType = "A" | "B";
type ExerciseKey = "squat" | "bench" | "row" | "ohp" | "deadlift";

interface Weights {
  squat: number;
  bench: number;
  row: number;
  ohp: number;
  deadlift: number;
}

interface ExerciseSession {
  sets: number[];
  completed: boolean;
}

interface CurrentSession {
  squat: ExerciseSession;
  bench: ExerciseSession;
  row: ExerciseSession;
  ohp: ExerciseSession;
  deadlift: ExerciseSession;
}

interface WorkoutExercise {
  name: string;
  weight: number;
  sets: number[];
}

interface WorkoutHistoryItem {
  date: string;
  type: WorkoutType;
  exercises: WorkoutExercise[];
}

const StrongLifts5x5App: React.FC = () => {
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutType>("A");
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(180);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistoryItem[]>(
    []
  );
  const [weights, setWeights] = useState<Weights>({
    squat: 45,
    bench: 45,
    row: 65,
    ohp: 45,
    deadlift: 95
  });
  const [currentSession, setCurrentSession] = useState<CurrentSession>({
    squat: { sets: [-1, -1, -1, -1, -1], completed: false },
    bench: { sets: [-1, -1, -1, -1, -1], completed: false },
    row: { sets: [-1, -1, -1, -1, -1], completed: false },
    ohp: { sets: [-1, -1, -1, -1, -1], completed: false },
    deadlift: { sets: [-1, -1, -1, -1, -1], completed: false }
  });

  const workouts: Record<WorkoutType, ExerciseKey[]> = {
    A: ["squat", "bench", "row"],
    B: ["squat", "ohp", "deadlift"]
  };

  const exerciseNames: Record<ExerciseKey, string> = {
    squat: "Squat",
    bench: "Bench Press",
    row: "Barbell Row",
    ohp: "Overhead Press",
    deadlift: "Deadlift"
  };

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

  const startTimer = (duration: number = 180): void => {
    setTimeLeft(duration);
    setIsTimerRunning(true);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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

  const completeWorkout = (): void => {
    const exercises = workouts[currentWorkout];
    const newWeights: Weights = { ...weights };
    exercises.forEach((exercise: ExerciseKey) => {
      const sets = currentSession[exercise].sets;
      const totalReps = sets.reduce((sum, reps) => sum + Math.max(0, reps), 0);
      const targetReps = exercise === "deadlift" ? 5 : 25;
      if (totalReps >= targetReps) {
        if (exercise === "deadlift") {
          newWeights[exercise] += 10;
        } else {
          newWeights[exercise] += 5;
        }
      }
    });
    const workout: WorkoutHistoryItem = {
      date: new Date().toLocaleDateString(),
      type: currentWorkout,
      exercises: exercises.map((ex: ExerciseKey) => ({
        name: exerciseNames[ex],
        weight: weights[ex],
        sets: currentSession[ex].sets.map((reps) => Math.max(0, reps))
      }))
    };
    setWorkoutHistory((prev) => [workout, ...prev]);
    setWeights(newWeights);
    setCurrentSession({
      squat: { sets: [-1, -1, -1, -1, -1], completed: false },
      bench: { sets: [-1, -1, -1, -1, -1], completed: false },
      row: { sets: [-1, -1, -1, -1, -1], completed: false },
      ohp: { sets: [-1, -1, -1, -1, -1], completed: false },
      deadlift: { sets: [-1, -1, -1, -1, -1], completed: false }
    });
    setCurrentWorkout(currentWorkout === "A" ? "B" : "A");
  };

  const getCurrentExercises = (): ExerciseKey[] => workouts[currentWorkout];
  const getRepButtonStyle = (reps: number) => {
    if (reps === 5) return styles.repButtonSuccess;
    if (reps > 0) return styles.repButtonPartial;
    if (reps === 0) return styles.repButtonFailure;
    return styles.repButtonEmpty;
  };
  const getRepButtonTextStyle = (reps: number) => {
    if (reps === 5) return styles.repButtonTextSuccess;
    if (reps > 0) return styles.repButtonTextPartial;
    if (reps === 0) return styles.repButtonTextFailure;
    return styles.repButtonTextEmpty;
  };

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
            <View style={styles.timerButtons}>
              <TouchableOpacity
                onPress={() => setIsTimerRunning(!isTimerRunning)}
                style={[styles.timerButton, styles.playButton]}
              >
                <Text style={styles.timerButtonText}>
                  {isTimerRunning ? "⏸" : "▶"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setTimeLeft(180);
                  setIsTimerRunning(false);
                }}
                style={[styles.timerButton, styles.resetButton]}
              >
                <Text style={styles.timerButtonText}>↻</Text>
              </TouchableOpacity>
            </View>
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
          {getCurrentExercises().map((exercise: ExerciseKey) => (
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
                {exercise === "deadlift" ? "1 set × 5 reps" : "5 sets × 5 reps"}
              </Text>
              <View style={styles.setsContainer}>
                {currentSession[exercise].sets.map(
                  (reps: number, setIndex: number) => {
                    if (exercise === "deadlift" && setIndex > 0) return null;
                    return (
                      <View key={setIndex} style={styles.setContainer}>
                        <Text style={styles.setLabel}>Set {setIndex + 1}</Text>
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
          ))}
        </View>
        <View style={styles.completeButtonContainer}>
          <TouchableOpacity
            onPress={completeWorkout}
            style={styles.completeButton}
          >
            <Text style={styles.completeButtonText}>Complete Workout</Text>
          </TouchableOpacity>
        </View>
        {workoutHistory.length > 0 && (
          <View style={styles.historyContainer}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>📅 Recent Workouts</Text>
            </View>
            <View style={styles.historyList}>
              {workoutHistory.slice(0, 5).map((workout, index) => (
                <View key={index} style={styles.historyItem}>
                  <View style={styles.historyItemHeader}>
                    <Text style={styles.historyWorkoutType}>
                      Workout {workout.type}
                    </Text>
                    <Text style={styles.historyDate}>{workout.date}</Text>
                  </View>
                  <View style={styles.historyExercises}>
                    {workout.exercises.map((exercise, exIndex) => (
                      <View key={exIndex} style={styles.historyExercise}>
                        <Text style={styles.historyExerciseName}>
                          {exercise.name}
                        </Text>
                        <Text style={styles.historyExerciseData}>
                          {exercise.weight}lbs × {exercise.sets.join(", ")}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
        <View style={styles.weightsContainer}>
          <View style={styles.weightsHeader}>
            <Text style={styles.weightsTitle}>📈 Current Weights</Text>
          </View>
          <View style={styles.weightsList}>
            {(Object.entries(exerciseNames) as [ExerciseKey, string][]).map(
              ([key, name]) => (
                <View key={key} style={styles.weightItem}>
                  <Text style={styles.weightName}>{name}</Text>
                  <Text style={styles.weightValue}>{weights[key]} lbs</Text>
                </View>
              )
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const StrongLifts5x5: React.FC = () => (
  <SafeAreaProvider>
    <StrongLifts5x5App />
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2563eb" },
  scrollView: { flex: 1, backgroundColor: "#f9fafb" },
  header: { backgroundColor: "#2563eb", padding: 16 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "white" },
  headerSubtitle: { fontSize: 14, color: "#dbeafe" },
  timerContainer: {
    backgroundColor: "white",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb"
  },
  timerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  timerText: { fontSize: 32, fontWeight: "bold", fontFamily: "monospace" },
  timerButtons: { flexDirection: "row", gap: 8 },
  timerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center"
  },
  playButton: { backgroundColor: "#2563eb" },
  resetButton: { backgroundColor: "#9ca3af" },
  timerButtonText: { color: "white", fontSize: 18 },
  presetButtons: { flexDirection: "row", gap: 8, marginTop: 8 },
  presetButton: {
    backgroundColor: "#e5e7eb",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4
  },
  presetButtonText: { fontSize: 12 },
  workoutContainer: { backgroundColor: "white" },
  exerciseContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb"
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },
  exerciseName: { fontSize: 18, fontWeight: "600" },
  exerciseWeight: { fontSize: 18, fontWeight: "bold", color: "#2563eb" },
  exerciseDescription: { fontSize: 12, color: "#6b7280", marginBottom: 8 },
  setsContainer: { flexDirection: "row", gap: 8 },
  setContainer: { alignItems: "center" },
  setLabel: { fontSize: 10, color: "#6b7280", marginBottom: 4 },
  repButton: {
    width: 48,
    height: 48,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center"
  },
  repButtonEmpty: { backgroundColor: "#f3f4f6", borderColor: "#d1d5db" },
  repButtonSuccess: { backgroundColor: "#dcfce7", borderColor: "#22c55e" },
  repButtonPartial: { backgroundColor: "#fef3c7", borderColor: "#eab308" },
  repButtonFailure: { backgroundColor: "#fee2e2", borderColor: "#ef4444" },
  repButtonText: { fontSize: 18, fontWeight: "bold" },
  repButtonTextEmpty: { color: "#9ca3af" },
  repButtonTextSuccess: { color: "#15803d" },
  repButtonTextPartial: { color: "#ca8a04" },
  repButtonTextFailure: { color: "#dc2626" },
  completeButtonContainer: { padding: 16 },
  completeButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center"
  },
  completeButtonText: { color: "white", fontSize: 18, fontWeight: "600" },
  historyContainer: { backgroundColor: "white", marginTop: 16 },
  historyHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#f9fafb"
  },
  historyTitle: { fontSize: 18, fontWeight: "600" },
  historyList: { maxHeight: 256 },
  historyItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb"
  },
  historyItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
  },
  historyWorkoutType: { fontWeight: "600" },
  historyDate: { fontSize: 12, color: "#6b7280" },
  historyExercises: { gap: 4 },
  historyExercise: { flexDirection: "row", justifyContent: "space-between" },
  historyExerciseName: { fontSize: 12 },
  historyExerciseData: { fontSize: 12 },
  weightsContainer: { backgroundColor: "white", marginTop: 16 },
  weightsHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#f9fafb"
  },
  weightsTitle: { fontSize: 18, fontWeight: "600" },
  weightsList: { padding: 16, gap: 8 },
  weightItem: { flexDirection: "row", justifyContent: "space-between" },
  weightName: { fontSize: 14 },
  weightValue: { fontSize: 14, fontWeight: "bold" }
});

export default StrongLifts5x5;
