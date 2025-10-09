import { AccessoryCategory, AccessoryExercise } from "@/src/types/types";

export const ACCESSORY_EXERCISES: AccessoryExercise[] = [
  {
    id: "barbell_curls",
    name: "Barbell Curls",
    category: "arms",
    defaultSets: 3,
    defaultReps: 8,
    defaultRest: 90,
    defaultWeight: 45
  },
  {
    id: "dumbbell_curls",
    name: "Dumbbell Curls",
    category: "arms",
    defaultSets: 3,
    defaultReps: 10,
    defaultRest: 90,
    defaultWeight: 25
  },
  {
    id: "hammer_curls",
    name: "Hammer Curls",
    category: "arms",
    defaultSets: 3,
    defaultReps: 10,
    defaultRest: 90,
    defaultWeight: 25
  },
  {
    id: "skullcrushers",
    name: "Skullcrushers",
    category: "arms",
    defaultSets: 3,
    defaultReps: 8,
    defaultRest: 90,
    defaultWeight: 45
  },
  {
    id: "tricep_extensions",
    name: "Tricep Extensions",
    category: "arms",
    defaultSets: 3,
    defaultReps: 10,
    defaultRest: 90,
    defaultWeight: 30
  },
  {
    id: "close_grip_bench",
    name: "Close-Grip Bench Press",
    category: "arms",
    defaultSets: 3,
    defaultReps: 8,
    defaultRest: 180,
    defaultWeight: 95
  },
  {
    id: "pullups",
    name: "Pull-ups",
    category: "back",
    defaultSets: 3,
    defaultReps: 8,
    defaultRest: 120,
    defaultWeight: 0
  },
  {
    id: "chinups",
    name: "Chin-ups",
    category: "back",
    defaultSets: 3,
    defaultReps: 8,
    defaultRest: 120,
    defaultWeight: 0
  },
  {
    id: "lat_pulldowns",
    name: "Lat Pulldowns",
    category: "back",
    defaultSets: 3,
    defaultReps: 10,
    defaultRest: 90,
    defaultWeight: 100
  },
  {
    id: "face_pulls",
    name: "Face Pulls",
    category: "back",
    defaultSets: 3,
    defaultReps: 15,
    defaultRest: 60,
    defaultWeight: 40
  },
  {
    id: "band_pull_aparts",
    name: "Band Pull-Aparts",
    category: "back",
    defaultSets: 3,
    defaultReps: 20,
    defaultRest: 60,
    defaultWeight: 0
  },
  {
    id: "dips",
    name: "Dips",
    category: "chest",
    defaultSets: 3,
    defaultReps: 8,
    defaultRest: 120,
    defaultWeight: 0
  },
  {
    id: "dumbbell_bench",
    name: "Dumbbell Bench Press",
    category: "chest",
    defaultSets: 3,
    defaultReps: 10,
    defaultRest: 120,
    defaultWeight: 50
  },
  {
    id: "incline_bench",
    name: "Incline Bench Press",
    category: "chest",
    defaultSets: 3,
    defaultReps: 8,
    defaultRest: 180,
    defaultWeight: 95
  },
  {
    id: "planks",
    name: "Planks",
    category: "core",
    defaultSets: 3,
    defaultReps: 60,
    defaultRest: 60,
    defaultWeight: 0
  },
  {
    id: "hanging_knee_raises",
    name: "Hanging Knee Raises",
    category: "core",
    defaultSets: 3,
    defaultReps: 10,
    defaultRest: 90,
    defaultWeight: 0
  },
  {
    id: "ab_wheel",
    name: "Ab Wheel Rollouts",
    category: "core",
    defaultSets: 3,
    defaultReps: 10,
    defaultRest: 90,
    defaultWeight: 0
  },
  {
    id: "cable_crunches",
    name: "Cable Crunches",
    category: "core",
    defaultSets: 3,
    defaultReps: 15,
    defaultRest: 60,
    defaultWeight: 50
  },
  {
    id: "good_mornings",
    name: "Good Mornings",
    category: "legs",
    defaultSets: 3,
    defaultReps: 8,
    defaultRest: 120,
    defaultWeight: 65
  },
  {
    id: "romanian_deadlifts",
    name: "Romanian Deadlifts",
    category: "legs",
    defaultSets: 3,
    defaultReps: 8,
    defaultRest: 120,
    defaultWeight: 95
  },
  {
    id: "hip_thrusts",
    name: "Hip Thrusts",
    category: "legs",
    defaultSets: 3,
    defaultReps: 10,
    defaultRest: 90,
    defaultWeight: 95
  },
  {
    id: "glute_bridges",
    name: "Glute Bridges",
    category: "legs",
    defaultSets: 3,
    defaultReps: 12,
    defaultRest: 90,
    defaultWeight: 65
  },
  {
    id: "leg_press",
    name: "Leg Press",
    category: "legs",
    defaultSets: 3,
    defaultReps: 10,
    defaultRest: 120,
    defaultWeight: 180
  },
  {
    id: "lunges",
    name: "Lunges",
    category: "legs",
    defaultSets: 3,
    defaultReps: 10,
    defaultRest: 90,
    defaultWeight: 45
  },
  {
    id: "lateral_raises",
    name: "Lateral Raises",
    category: "shoulders",
    defaultSets: 3,
    defaultReps: 12,
    defaultRest: 60,
    defaultWeight: 15
  },
  {
    id: "front_raises",
    name: "Front Raises",
    category: "shoulders",
    defaultSets: 3,
    defaultReps: 12,
    defaultRest: 60,
    defaultWeight: 15
  },
  {
    id: "shrugs",
    name: "Shrugs",
    category: "shoulders",
    defaultSets: 3,
    defaultReps: 12,
    defaultRest: 90,
    defaultWeight: 100
  }
];

export const CATEGORY_NAMES: Record<AccessoryCategory, string> = {
  arms: "Arms",
  back: "Back",
  chest: "Chest",
  core: "Core",
  legs: "Legs",
  shoulders: "Shoulders"
};
