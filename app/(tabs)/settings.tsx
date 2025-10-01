import React from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useWorkout } from "../WorkoutContext";
import { styles } from "../styles";
import { ExerciseKey, UnitSystem } from "../types";

const lbsToKg = (lbs: number): number => {
  return Math.round((lbs * 0.453592) / 1.25) * 1.25;
};

const kgToLbs = (kg: number): number => {
  return Math.round(kg / 0.453592 / 5) * 5;
};

const SettingsApp: React.FC = () => {
  const { unitSystem, setUnitSystem, weights, setWeights } = useWorkout();

  const handleUnitChange = (newUnit: UnitSystem) => {
    if (newUnit === unitSystem) return;

    Alert.alert(
      "Convert Weights?",
      `Do you want to convert all your current weights from ${unitSystem} to ${newUnit}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Convert",
          onPress: () => {
            const newWeights = { ...weights };
            const exercises: ExerciseKey[] = [
              "squat",
              "bench",
              "row",
              "ohp",
              "deadlift"
            ];

            exercises.forEach((exercise) => {
              if (newUnit === "kg") {
                newWeights[exercise] = lbsToKg(weights[exercise]);
              } else {
                newWeights[exercise] = kgToLbs(weights[exercise]);
              }
            });

            setWeights(newWeights);
            setUnitSystem(newUnit);
          }
        }
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Preferences</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.weightsContainer}>
          <View style={styles.weightsHeader}>
            <Text style={styles.weightsTitle}>Unit System</Text>
          </View>
          <View style={{ padding: 16 }}>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={() => handleUnitChange("lbs")}
                style={{
                  flex: 1,
                  backgroundColor: unitSystem === "lbs" ? "#2563eb" : "#e5e7eb",
                  padding: 16,
                  borderRadius: 8,
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: unitSystem === "lbs" ? "white" : "#374151"
                  }}
                >
                  Pounds (lbs)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleUnitChange("kg")}
                style={{
                  flex: 1,
                  backgroundColor: unitSystem === "kg" ? "#2563eb" : "#e5e7eb",
                  padding: 16,
                  borderRadius: 8,
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: unitSystem === "kg" ? "white" : "#374151"
                  }}
                >
                  Kilograms (kg)
                </Text>
              </TouchableOpacity>
            </View>
            <Text
              style={{
                marginTop: 12,
                fontSize: 12,
                color: "#6b7280",
                textAlign: "center"
              }}
            >
              Changing units will offer to convert your current weights
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const SettingsScreen: React.FC = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#2563eb" }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#2563eb"
          translucent={false}
        />
        <SettingsApp />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default SettingsScreen;
