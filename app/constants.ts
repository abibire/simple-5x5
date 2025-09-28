import { CurrentSession, ExerciseKey, Weights, WorkoutType } from './types';

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

export const createDefaultSession = (): CurrentSession => ({
  squat: { sets: [-1, -1, -1, -1, -1], completed: false },
  bench: { sets: [-1, -1, -1, -1, -1], completed: false },
  row: { sets: [-1, -1, -1, -1, -1], completed: false },
  ohp: { sets: [-1, -1, -1, -1, -1], completed: false },
  deadlift: { sets: [-1, -1, -1, -1, -1], completed: false }
});