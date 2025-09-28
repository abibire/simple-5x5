import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from "react";
import { defaultDeloads, defaultFailures, defaultWeights } from "./constants";
import {
  ExerciseDeloads,
  ExerciseFailures,
  Weights,
  WorkoutHistoryItem
} from "./types";

interface WorkoutContextType {
  weights: Weights;
  setWeights: (weights: Weights) => void;
  workoutHistory: WorkoutHistoryItem[];
  setWorkoutHistory: React.Dispatch<React.SetStateAction<WorkoutHistoryItem[]>>;
  exerciseFailures: ExerciseFailures;
  setExerciseFailures: (failures: ExerciseFailures) => void;
  exerciseDeloads: ExerciseDeloads;
  setExerciseDeloads: (deloads: ExerciseDeloads) => void;
  isLoading: boolean;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

const STORAGE_KEYS = {
  WEIGHTS: "stronglifts_weights",
  WORKOUT_HISTORY: "stronglifts_workout_history",
  EXERCISE_FAILURES: "stronglifts_exercise_failures",
  EXERCISE_DELOADS: "stronglifts_exercise_deloads"
};

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [weights, setWeightsState] = useState<Weights>(defaultWeights);
  const [workoutHistory, setWorkoutHistoryState] = useState<
    WorkoutHistoryItem[]
  >([]);
  const [exerciseFailures, setExerciseFailuresState] =
    useState<ExerciseFailures>(defaultFailures);
  const [exerciseDeloads, setExerciseDeloadsState] =
    useState<ExerciseDeloads>(defaultDeloads);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [savedWeights, savedHistory, savedFailures, savedDeloads] =
        await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.WEIGHTS),
          AsyncStorage.getItem(STORAGE_KEYS.WORKOUT_HISTORY),
          AsyncStorage.getItem(STORAGE_KEYS.EXERCISE_FAILURES),
          AsyncStorage.getItem(STORAGE_KEYS.EXERCISE_DELOADS)
        ]);

      if (savedWeights) {
        const parsedWeights = JSON.parse(savedWeights);
        setWeightsState(parsedWeights);
      }

      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setWorkoutHistoryState(parsedHistory);
      }

      if (savedFailures) {
        const parsedFailures = JSON.parse(savedFailures);
        setExerciseFailuresState(parsedFailures);
      }

      if (savedDeloads) {
        const parsedDeloads = JSON.parse(savedDeloads);
        setExerciseDeloadsState(parsedDeloads);
      }
    } catch (error) {
      console.error("Failed to load data from storage:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setWeights = async (newWeights: Weights) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.WEIGHTS,
        JSON.stringify(newWeights)
      );
      setWeightsState(newWeights);
    } catch (error) {
      console.error("Failed to save weights:", error);
      setWeightsState(newWeights);
    }
  };

  const setExerciseFailures = async (newFailures: ExerciseFailures) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.EXERCISE_FAILURES,
        JSON.stringify(newFailures)
      );
      setExerciseFailuresState(newFailures);
    } catch (error) {
      console.error("Failed to save exercise failures:", error);
      setExerciseFailuresState(newFailures);
    }
  };

  const setExerciseDeloads = async (newDeloads: ExerciseDeloads) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.EXERCISE_DELOADS,
        JSON.stringify(newDeloads)
      );
      setExerciseDeloadsState(newDeloads);
    } catch (error) {
      console.error("Failed to save exercise deloads:", error);
      setExerciseDeloadsState(newDeloads);
    }
  };

  const setWorkoutHistory = (
    updateFn: React.SetStateAction<WorkoutHistoryItem[]>
  ) => {
    setWorkoutHistoryState((prevHistory) => {
      const newHistory =
        typeof updateFn === "function" ? updateFn(prevHistory) : updateFn;

      AsyncStorage.setItem(
        STORAGE_KEYS.WORKOUT_HISTORY,
        JSON.stringify(newHistory)
      ).catch((error) =>
        console.error("Failed to save workout history:", error)
      );

      return newHistory;
    });
  };

  return (
    <WorkoutContext.Provider
      value={{
        weights,
        setWeights,
        workoutHistory,
        setWorkoutHistory,
        exerciseFailures,
        setExerciseFailures,
        exerciseDeloads,
        setExerciseDeloads,
        isLoading
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout(): WorkoutContextType {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error("useWorkout must be used within a WorkoutProvider");
  }
  return context;
}
