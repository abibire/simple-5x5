import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../app/ThemeContext";
import { UnitSystem } from "../app/types";
import { formatWeight } from "../app/utils";
import { createPlateStyles } from "./PlateCalculator.styles";

interface PlateCalculatorProps {
  visible: boolean;
  onClose: () => void;
  weight: number;
  unitSystem: UnitSystem;
  exerciseName: string;
}

interface WarmupSet {
  weight: number;
  reps: number;
  plateText: string;
}

const PlateCalculator: React.FC<PlateCalculatorProps> = ({
  visible,
  onClose,
  weight,
  unitSystem,
  exerciseName
}) => {
  const { theme } = useTheme();
  const styles = createPlateStyles(theme);

  const barWeight = unitSystem === "lbs" ? 45 : 20;

  const getPlatesText = (totalWeight: number): string => {
    const availablePlates =
      unitSystem === "lbs"
        ? [45, 35, 25, 10, 5, 2.5]
        : [20, 15, 10, 5, 2.5, 1.25];

    const weightPerSide = (totalWeight - barWeight) / 2;
    if (weightPerSide <= 0) return "Bar only";

    const platesList: Array<{ plate: number; count: number }> = [];
    let remaining = weightPerSide;

    for (const plate of availablePlates) {
      const count = Math.floor(remaining / plate);
      if (count > 0) {
        platesList.push({ plate, count });
        remaining = Math.round((remaining - plate * count) * 100) / 100;
      }
    }

    if (platesList.length === 0) return "Bar only";

    return platesList.map(({ plate, count }) => `${count}×${plate}`).join(", ");
  };

  const calculatePlates = (totalWeight: number): number[] => {
    const availablePlates =
      unitSystem === "lbs"
        ? [45, 35, 25, 10, 5, 2.5]
        : [20, 15, 10, 5, 2.5, 1.25];

    const weightPerSide = (totalWeight - barWeight) / 2;
    if (weightPerSide <= 0) return [];

    const plates: number[] = [];
    let remaining = weightPerSide;

    for (const plate of availablePlates) {
      const count = Math.floor(remaining / plate);
      for (let i = 0; i < count; i++) {
        plates.push(plate);
      }
      remaining = Math.round((remaining - plate * count) * 100) / 100;
    }

    return plates;
  };

  const calculateWarmupSets = (): WarmupSet[] => {
    const isDeadliftOrRow =
      exerciseName.toLowerCase().includes("deadlift") ||
      exerciseName.toLowerCase().includes("row");

    const startWeight = isDeadliftOrRow
      ? unitSystem === "lbs"
        ? 95
        : 40
      : barWeight;

    if (weight <= startWeight) {
      return [];
    }

    const warmupSets: WarmupSet[] = [];

    if (!isDeadliftOrRow) {
      warmupSets.push({
        weight: barWeight,
        reps: 5,
        plateText: "Bar only"
      });
      warmupSets.push({
        weight: barWeight,
        reps: 5,
        plateText: "Bar only"
      });
    }

    const totalIncrease = weight - startWeight;
    const numSteps = 3;
    const increment = totalIncrease / (numSteps + 1);

    const roundTo = unitSystem === "lbs" ? 5 : 2.5;

    for (let i = 1; i <= numSteps; i++) {
      const rawWeight = startWeight + increment * i;
      const roundedWeight = Math.round(rawWeight / roundTo) * roundTo;

      if (roundedWeight < weight) {
        let reps = 5;
        if (i === 2) reps = 3;
        if (i === 3) reps = 2;

        warmupSets.push({
          weight: roundedWeight,
          reps,
          plateText: getPlatesText(roundedWeight)
        });
      }
    }

    return warmupSets;
  };

  const getPlateColor = (plate: number): string => {
    if (unitSystem === "lbs") {
      if (plate === 45) return "#ef4444";
      if (plate === 35) return "#eab308";
      if (plate === 25) return "#22c55e";
      if (plate === 10) return "#3b82f6";
      if (plate === 5) return "#8b5cf6";
      return "#6b7280";
    } else {
      if (plate === 20) return "#ef4444";
      if (plate === 15) return "#eab308";
      if (plate === 10) return "#22c55e";
      if (plate === 5) return "#3b82f6";
      if (plate === 2.5) return "#8b5cf6";
      return "#6b7280";
    }
  };

  const getPlateHeight = (plate: number): number => {
    if (unitSystem === "lbs") {
      if (plate === 45) return 110;
      if (plate === 35) return 100;
      if (plate === 25) return 90;
      if (plate === 10) return 75;
      if (plate === 5) return 65;
      return 55;
    } else {
      if (plate === 20) return 110;
      if (plate === 15) return 100;
      if (plate === 10) return 90;
      if (plate === 5) return 75;
      if (plate === 2.5) return 65;
      return 55;
    }
  };

  const plates = calculatePlates(weight);
  const warmupSets = calculateWarmupSets();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          style={styles.modalContent}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Plate Calculator</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View>
              <Text style={styles.exerciseName}>{exerciseName}</Text>
              <Text style={styles.totalWeight}>
                {formatWeight(weight, unitSystem)}
              </Text>
              <View style={styles.plateDisplay}>
                <View style={styles.plateRow}>
                  <View style={styles.barbell}>
                    <Text style={styles.barbellText}>
                      {unitSystem === "lbs" ? "45" : "20"}
                    </Text>
                  </View>
                  <View style={styles.platesContainer}>
                    {plates.map((plate, index) => (
                      <View
                        key={`plate-${index}`}
                        style={[
                          styles.plate,
                          {
                            height: getPlateHeight(plate),
                            backgroundColor: getPlateColor(plate)
                          }
                        ]}
                      >
                        <Text style={styles.plateText}>{plate}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
              {plates.length === 0 && (
                <Text style={styles.barOnlyText}>Bar only</Text>
              )}

              {warmupSets.length > 0 && (
                <View style={styles.warmupContainer}>
                  <Text style={styles.warmupTitle}>Warmup Sets</Text>
                  <View style={styles.warmupSets}>
                    {warmupSets.map((set, index) => (
                      <View key={index} style={styles.warmupSetRow}>
                        <View style={styles.warmupSetInfo}>
                          <Text style={styles.warmupSetLabel}>
                            Set {index + 1}
                          </Text>
                          <Text style={styles.warmupSetData}>
                            {set.weight} {unitSystem} × {set.reps}
                          </Text>
                        </View>
                        <Text style={styles.warmupPlates}>{set.plateText}</Text>
                      </View>
                    ))}
                    <View style={styles.workSetContainer}>
                      <View style={styles.workSetInfo}>
                        <Text style={styles.workSetLabel}>Work Sets</Text>
                        <Text style={styles.workSetData}>
                          {weight} {unitSystem} × 5 sets of 5
                        </Text>
                      </View>
                      <Text style={styles.workSetPlates}>
                        {getPlatesText(weight)}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default PlateCalculator;
