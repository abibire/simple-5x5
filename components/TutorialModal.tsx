import { MaterialCommunityIcons } from "@expo/vector-icons";
import Octicons from "@expo/vector-icons/Octicons";
import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";
import { createTutorialStyles } from "./TutorialModal.styles";

interface TutorialModalProps {
  visible: boolean;
  onClose: () => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ visible, onClose }) => {
  const { theme } = useTheme();
  const styles = createTutorialStyles(theme);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.header}>Welcome to Simple 5×5!</Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Getting Started</Text>
              <Text style={styles.text}>
                This app follows the classic 5×5 program - you'll alternate
                between Workout A (Squat, Bench, Row) and Workout B (Squat,
                Overhead Press, Deadlift).
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Logging Sets</Text>
              <Text style={styles.text}>
                Tap the rep buttons to cycle through 5→4→3→2→1→0→empty. The rest
                timer starts automatically when you complete a set.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Key Features</Text>

              <View style={styles.feature}>
                <View style={styles.featureIcon}>
                  <MaterialCommunityIcons
                    name="weight"
                    size={20}
                    color={theme.primary}
                  />
                </View>
                <Text style={styles.featureText}>
                  <Text style={{ fontWeight: "600" }}>Plate Calculator</Text> -
                  Tap the weight icon next to any exercise to see exactly which
                  plates to load on the bar, including warmup sets.
                </Text>
              </View>

              <View style={styles.feature}>
                <View style={styles.featureIcon}>
                  <MaterialCommunityIcons
                    name="delete"
                    size={20}
                    color={theme.error}
                  />
                </View>
                <Text style={styles.featureText}>
                  <Text style={{ fontWeight: "600" }}>Reset Data</Text> - Tap
                  the trash can icon on the home screen to reset all workout
                  history and weights (use with caution!).
                </Text>
              </View>

              <View style={styles.feature}>
                <View style={styles.featureIcon}>
                  <Octicons name="graph" size={20} color={theme.primary} />
                </View>
                <Text style={styles.featureText}>
                  <Text style={{ fontWeight: "600" }}>Progress Tracking</Text> -
                  View your strength gains over time by tapping the graph icon
                  on the home screen.
                </Text>
              </View>

              <View style={styles.feature}>
                <Text style={styles.featureText}>
                  <Text style={{ fontWeight: "600" }}>⚙️ Accessories</Text> -
                  Add extra exercises in Settings and customize sets, reps, and
                  which workouts they appear in.
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tips</Text>
              <Text style={styles.text}>
                • Edit weights by tapping them{"\n"}• Track your bodyweight
                using the BW button{"\n"}• Switch between lbs/kg in Settings
                {"\n"}• Change rep schemes (5×5, 3×5, 1×5) per exercise
              </Text>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Let's Go!</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default TutorialModal;
