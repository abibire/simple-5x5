import { UnitSystem } from "./types";

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const getRepButtonStyle = (reps: number) => {
  return reps > -1 ? "complete" : "empty";
};

export const getRepButtonTextStyle = (reps: number) => {
  return reps > -1 ? "complete" : "empty";
};

export const formatWeight = (weight: number, unit: UnitSystem): string => {
  return `${weight} ${unit}`;
};

export const lbsToKg = (lbs: number): number => {
  const kg = lbs * 0.453592;
  return Math.round(kg / 2.5) * 2.5;
};

export const kgToLbs = (kg: number): number => {
  const lbs = kg / 0.453592;
  return Math.round(lbs / 5) * 5;
};

export const convertWeight = (
  weight: number,
  fromUnit: UnitSystem,
  toUnit: UnitSystem
): number => {
  if (fromUnit === toUnit) return weight;
  if (fromUnit === "lbs" && toUnit === "kg") return lbsToKg(weight);
  if (fromUnit === "kg" && toUnit === "lbs") return kgToLbs(weight);
  return weight;
};
