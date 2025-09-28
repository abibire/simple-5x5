import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from "react";
import { defaultWeights } from "./constants";
import { Weights, WorkoutHistoryItem } from "./types";

interface WorkoutContextType {
  weights: Weights;
  setWeights: (weights: Weights) => void;
  workoutHistory: WorkoutHistoryItem[];
  setWorkoutHistory: React.Dispatch<React.SetStateAction<WorkoutHistoryItem[]>>;
  isLoading: boolean;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

const STORAGE_KEYS = {
  WEIGHTS: "stronglifts_weights",
  WORKOUT_HISTORY: "stronglifts_workout_history"
};

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [weights, setWeightsState] = useState<Weights>(defaultWeights);
  const [workoutHistory, setWorkoutHistoryState] = useState<
    WorkoutHistoryItem[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [savedWeights, savedHistory] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.WEIGHTS),
        AsyncStorage.getItem(STORAGE_KEYS.WORKOUT_HISTORY)
      ]);

      if (savedWeights) {
        const parsedWeights = JSON.parse(savedWeights);
        setWeightsState(parsedWeights);
      }

      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setWorkoutHistoryState(parsedHistory);
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
