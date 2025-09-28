import React, { createContext, ReactNode, useContext, useState } from "react";
import { defaultWeights } from "./constants";
import { Weights, WorkoutHistoryItem } from "./types";

interface WorkoutContextType {
  weights: Weights;
  setWeights: React.Dispatch<React.SetStateAction<Weights>>;
  workoutHistory: WorkoutHistoryItem[];
  setWorkoutHistory: React.Dispatch<React.SetStateAction<WorkoutHistoryItem[]>>;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

interface WorkoutProviderProps {
  children: ReactNode;
}

export const WorkoutProvider: React.FC<WorkoutProviderProps> = ({
  children
}) => {
  const [weights, setWeights] = useState<Weights>(defaultWeights);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistoryItem[]>(
    []
  );

  const value = {
    weights,
    setWeights,
    workoutHistory,
    setWorkoutHistory
  };

  return (
    <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>
  );
};

export const useWorkout = (): WorkoutContextType => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error("useWorkout must be used within a WorkoutProvider");
  }
  return context;
};
