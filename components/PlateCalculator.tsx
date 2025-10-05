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

const PlateCalculator: React.FC<PlateCalculatorProps> = ({
  visible,
  onClose,
  weight,
  unitSystem,
  exerciseName
}) => {
  const { theme } = useTheme();
  const styles = createPlateStyles(theme);

  const calculatePlates = (totalWeight: number): number[] => {
    const barWeight = unitSystem === "lbs" ? 45 : 20;
    const availablePlates =
      unitSystem === "lbs"
        ? [45, 35, 25, 10, 5, 2.5]
        : [20, 15, 10, 5, 2.5, 1.25];

    const weightPerSide = (totalWeight - barWeight) / 2;
    if (weightPerSide <= 0) return [];

    const plates: number[] = [];
    let remaining = weightPerSide;

    for (const plate of availablePlates) {
      while (remaining >= plate) {
        plates.push(plate);
        remaining = Math.round((remaining - plate) * 100) / 100;
      }
    }

    return plates;
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
            </View>
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default PlateCalculator;
