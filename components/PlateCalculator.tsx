import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { UnitSystem } from "../app/types";
import { formatWeight } from "../app/utils";

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

  const plates = calculatePlates(weight);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center"
        }}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 24,
            width: "90%",
            maxWidth: 400,
            maxHeight: "80%"
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "600" }}>
              Plate Calculator
            </Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  textAlign: "center",
                  marginBottom: 4
                }}
              >
                {exerciseName}
              </Text>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: 16,
                  color: "#2563eb"
                }}
              >
                {formatWeight(weight, unitSystem)}
              </Text>

              <Text
                style={{
                  fontSize: 14,
                  color: "#6b7280",
                  textAlign: "center",
                  marginBottom: 12
                }}
              >
                Plates per side
              </Text>

              <View style={{ alignItems: "center", paddingVertical: 10 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      width: 80,
                      height: 20,
                      backgroundColor: "#9ca3af",
                      borderRadius: 2,
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 11,
                        fontWeight: "bold"
                      }}
                    >
                      {unitSystem === "lbs" ? "45" : "20"}
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {plates.map((plate, index) => {
                      let height;
                      if (unitSystem === "lbs") {
                        if (plate === 45) height = 110;
                        else if (plate === 35) height = 100;
                        else if (plate === 25) height = 90;
                        else if (plate === 10) height = 75;
                        else if (plate === 5) height = 65;
                        else height = 55;
                      } else {
                        if (plate === 20) height = 110;
                        else if (plate === 15) height = 100;
                        else if (plate === 10) height = 90;
                        else if (plate === 5) height = 75;
                        else if (plate === 2.5) height = 65;
                        else height = 55;
                      }

                      return (
                        <View
                          key={`plate-${index}`}
                          style={{
                            width: 30,
                            height: height,
                            backgroundColor: getPlateColor(plate),
                            borderRadius: 4,
                            justifyContent: "center",
                            alignItems: "center",
                            borderWidth: 2,
                            borderColor: "#e5e7eb"
                          }}
                        >
                          <Text
                            style={{
                              color: "#fff",
                              fontWeight: "bold",
                              fontSize: 12
                            }}
                          >
                            {plate}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>

              {plates.length === 0 && (
                <Text
                  style={{
                    fontSize: 14,
                    color: "#6b7280",
                    textAlign: "center",
                    marginTop: 8
                  }}
                >
                  Bar only
                </Text>
              )}
            </View>
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default PlateCalculator;
