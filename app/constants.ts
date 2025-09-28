import { CurrentSession, ExerciseDeloads, ExerciseFailures, ExerciseKey, Weights, WorkoutType } from './types';

export const workouts: Record<WorkoutType, ExerciseKey[]> = {
  A: ['squat', 'bench', 'row'],
  B: ['squat', 'ohp', 'deadlift']
};

export const exerciseNames: Record<ExerciseKey, string> = {
  squat: 'Squat',
  bench: 'Bench Press',
  row: 'Barbell Row',
  ohp: 'Overhead Press',
  deadlift: 'Deadlift'
};

export const defaultWeights: Weights = {
  squat: 45,
  bench: 45,
  row: 65,
  ohp: 45,
  deadlift: 95
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

export const createDefaultSession = (): CurrentSession => ({
  squat: { sets: [-1, -1, -1, -1, -1], completed: false },
  bench: { sets: [-1, -1, -1, -1, -1], completed: false },
  row: { sets: [-1, -1, -1, -1, -1], completed: false },
  ohp: { sets: [-1, -1, -1, -1, -1], completed: false },
  deadlift: { sets: [-1, -1, -1, -1, -1], completed: false }
});

export const PROGRESSION_INCREMENTS = {
  squat: 5,
  bench: 5,
  row: 5,
  ohp: 5,
  deadlift: 10
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