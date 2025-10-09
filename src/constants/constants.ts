import {
  CurrentSession,
  ExerciseDeloads,
  ExerciseFailures,
  ExerciseKey,
  RepScheme,
  RepSchemes,
  UnitSystem,
  Weights,
  WorkoutType
} from "@/src/types/types";

export const workouts: Record<WorkoutType, ExerciseKey[]> = {
  A: ["squat", "bench", "row"],
  B: ["squat", "ohp", "deadlift"]
};

export const exerciseNames: Record<ExerciseKey, string> = {
  squat: "Squat",
  bench: "Bench Press",
  row: "Barbell Row",
  ohp: "Overhead Press",
  deadlift: "Deadlift"
};

export const defaultWeights: Record<UnitSystem, Weights> = {
  lbs: {
    squat: 45,
    bench: 45,
    row: 65,
    ohp: 45,
    deadlift: 95
  },
  kg: {
    squat: 20,
    bench: 20,
    row: 30,
    ohp: 20,
    deadlift: 40
  }
};

export const defaultFailures: ExerciseFailures = {
  squat: 0,
  bench: 0,
  row: 0,
  ohp: 0,
  deadlift: 0
};

export const defaultDeloads: ExerciseDeloads = {
  squat: 0,
  bench: 0,
  row: 0,
  ohp: 0,
  deadlift: 0
};

export const defaultRepSchemes: RepSchemes = {
  squat: "5x5",
  bench: "5x5",
  row: "5x5",
  ohp: "5x5",
  deadlift: "1x5"
};

export const getDefaultSessionForScheme = (scheme: RepScheme): number[] => {
  if (scheme === "5x5") return [-1, -1, -1, -1, -1];
  if (scheme === "3x5") return [-1, -1, -1];
  if (scheme === "1x5") return [-1];
  return [-1, -1, -1, -1, -1];
};

export const createDefaultSession = (
  repSchemes?: RepSchemes
): CurrentSession => {
  const schemes = repSchemes || defaultRepSchemes;
  return {
    squat: {
      sets: getDefaultSessionForScheme(schemes.squat),
      completed: false
    },
    bench: {
      sets: getDefaultSessionForScheme(schemes.bench),
      completed: false
    },
    row: { sets: getDefaultSessionForScheme(schemes.row), completed: false },
    ohp: { sets: getDefaultSessionForScheme(schemes.ohp), completed: false },
    deadlift: {
      sets: getDefaultSessionForScheme(schemes.deadlift),
      completed: false
    }
  };
};

export const PROGRESSION_INCREMENTS: Record<
  UnitSystem,
  Record<ExerciseKey, number>
> = {
  lbs: {
    squat: 5,
    bench: 5,
    row: 5,
    ohp: 5,
    deadlift: 10
  },
  kg: {
    squat: 2.5,
    bench: 2.5,
    row: 2.5,
    ohp: 2.5,
    deadlift: 5
  }
};

export const MINIMUM_INCREMENT: Record<UnitSystem, number> = {
  lbs: 5,
  kg: 2.5
};

export const getTargetRepsForScheme = (scheme: RepScheme): number => {
  if (scheme === "5x5") return 25;
  if (scheme === "3x5") return 15;
  if (scheme === "1x5") return 5;
  return 25;
};

export const TARGET_REPS = {
  squat: 25,
  bench: 25,
  row: 25,
  ohp: 25,
  deadlift: 5
};

export const DELOAD_PERCENTAGE = 0.1;
export const MAX_FAILURES_BEFORE_DELOAD = 3;
export const MAX_DELOADS_BEFORE_3X5 = 3;
