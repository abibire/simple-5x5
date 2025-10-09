export type WorkoutType = "A" | "B";
export type ExerciseKey = "squat" | "bench" | "row" | "ohp" | "deadlift";
export type UnitSystem = "lbs" | "kg";
export type AccessoryCategory =
  | "arms"
  | "back"
  | "chest"
  | "core"
  | "legs"
  | "shoulders";
export type RepScheme = "5x5" | "3x5" | "1x5";

export interface Weights {
  squat: number;
  bench: number;
  row: number;
  ohp: number;
  deadlift: number;
}

export interface ExerciseFailures {
  squat: number;
  bench: number;
  row: number;
  ohp: number;
  deadlift: number;
}

export interface ExerciseDeloads {
  squat: number;
  bench: number;
  row: number;
  ohp: number;
  deadlift: number;
}

export interface RepSchemes {
  squat: RepScheme;
  bench: RepScheme;
  row: RepScheme;
  ohp: RepScheme;
  deadlift: RepScheme;
}

export interface ExerciseSession {
  sets: number[];
  completed: boolean;
}

export interface CurrentSession {
  squat: ExerciseSession;
  bench: ExerciseSession;
  row: ExerciseSession;
  ohp: ExerciseSession;
  deadlift: ExerciseSession;
}

export interface WorkoutExercise {
  name: string;
  weight: number;
  sets: number[];
  completed: boolean;
  repScheme?: RepScheme;
}

export interface AccessoryWorkoutExercise {
  id: string;
  name: string;
  weight: number;
  sets: number[];
  targetReps: number;
}

export interface WorkoutHistoryItem {
  date: string;
  type: WorkoutType;
  exercises: WorkoutExercise[];
  accessories?: AccessoryWorkoutExercise[];
  bodyweight?: number;
  unit?: UnitSystem;
}

export interface AccessoryExercise {
  id: string;
  name: string;
  category: AccessoryCategory;
  defaultSets: number;
  defaultReps: number;
  defaultRest: number;
  defaultWeight: number;
}

export interface UserAccessoryExercise extends AccessoryExercise {
  enabled: boolean;
  sets: number;
  reps: number;
  rest: number;
  weight: number;
  workouts: ("A" | "B")[];
}
