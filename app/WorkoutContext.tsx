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
  UnitSystem,
  UserAccessoryExercise,
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
  unitSystem: UnitSystem;
  setUnitSystem: (unit: UnitSystem) => void;
  accessories: UserAccessoryExercise[];
  setAccessories: (accessories: UserAccessoryExercise[]) => void;
  isLoading: boolean;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

const STORAGE_KEYS = {
  WEIGHTS: "stronglifts_weights",
  WORKOUT_HISTORY: "stronglifts_workout_history",
  EXERCISE_FAILURES: "stronglifts_exercise_failures",
  EXERCISE_DELOADS: "stronglifts_exercise_deloads",
  UNIT_SYSTEM: "stronglifts_unit_system",
  ACCESSORIES: "stronglifts_accessories"
};

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [weights, setWeightsState] = useState<Weights>(defaultWeights.lbs);
  const [workoutHistory, setWorkoutHistoryState] = useState<
    WorkoutHistoryItem[]
  >([]);
  const [exerciseFailures, setExerciseFailuresState] =
    useState<ExerciseFailures>(defaultFailures);
  const [exerciseDeloads, setExerciseDeloadsState] =
    useState<ExerciseDeloads>(defaultDeloads);
  const [unitSystem, setUnitSystemState] = useState<UnitSystem>("lbs");
  const [accessories, setAccessoriesState] = useState<UserAccessoryExercise[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [
        savedWeights,
        savedHistory,
        savedFailures,
        savedDeloads,
        savedUnitSystem,
        savedAccessories
      ] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.WEIGHTS),
        AsyncStorage.getItem(STORAGE_KEYS.WORKOUT_HISTORY),
        AsyncStorage.getItem(STORAGE_KEYS.EXERCISE_FAILURES),
        AsyncStorage.getItem(STORAGE_KEYS.EXERCISE_DELOADS),
        AsyncStorage.getItem(STORAGE_KEYS.UNIT_SYSTEM),
        AsyncStorage.getItem(STORAGE_KEYS.ACCESSORIES)
      ]);

      if (savedUnitSystem) {
        const parsedUnit = JSON.parse(savedUnitSystem) as UnitSystem;
        setUnitSystemState(parsedUnit);
      }

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

      if (savedAccessories) {
        const parsedAccessories = JSON.parse(savedAccessories);
        setAccessoriesState(parsedAccessories);
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

  const setUnitSystem = async (newUnit: UnitSystem) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.UNIT_SYSTEM,
        JSON.stringify(newUnit)
      );
      setUnitSystemState(newUnit);
    } catch (error) {
      console.error("Failed to save unit system:", error);
      setUnitSystemState(newUnit);
    }
  };

  const setAccessories = async (newAccessories: UserAccessoryExercise[]) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.ACCESSORIES,
        JSON.stringify(newAccessories)
      );
      setAccessoriesState(newAccessories);
    } catch (error) {
      console.error("Failed to save accessories:", error);
      setAccessoriesState(newAccessories);
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
        unitSystem,
        setUnitSystem,
        accessories,
        setAccessories,
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
