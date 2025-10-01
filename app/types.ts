export type WorkoutType = 'A' | 'B';
export type ExerciseKey = 'squat' | 'bench' | 'row' | 'ohp' | 'deadlift';

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
}

export interface WorkoutHistoryItem {
  date: string;
  type: WorkoutType;
  exercises: WorkoutExercise[];
  bodyweight?: number;
}