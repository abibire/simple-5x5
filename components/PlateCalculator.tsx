import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { UnitSystem } from "../app/types";
import { formatWeight } from "../app/utils";
import { plateStyles } from "./PlateCalculator.styles";

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
        style={plateStyles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          style={plateStyles.modalContent}
        >
          <View style={plateStyles.header}>
            <Text style={plateStyles.headerTitle}>Plate Calculator</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View>
              <Text style={plateStyles.exerciseName}>{exerciseName}</Text>
              <Text style={plateStyles.totalWeight}>
                {formatWeight(weight, unitSystem)}
              </Text>
              <View style={plateStyles.plateDisplay}>
                <View style={plateStyles.plateRow}>
                  <View style={plateStyles.barbell}>
                    <Text style={plateStyles.barbellText}>
                      {unitSystem === "lbs" ? "45" : "20"}
                    </Text>
                  </View>
                  <View style={plateStyles.platesContainer}>
                    {plates.map((plate, index) => (
                      <View
                        key={`plate-${index}`}
                        style={[
                          plateStyles.plate,
                          {
                            height: getPlateHeight(plate),
                            backgroundColor: getPlateColor(plate)
                          }
                        ]}
                      >
                        <Text style={plateStyles.plateText}>{plate}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
              {plates.length === 0 && (
                <Text style={plateStyles.barOnlyText}>Bar only</Text>
              )}
            </View>
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default PlateCalculator;
