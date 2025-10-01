import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Alert,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  defaultDeloads,
  defaultFailures,
  defaultWeights,
  exerciseNames
} from "../constants";
import { styles } from "../styles";
import { ExerciseKey, WorkoutExercise, WorkoutHistoryItem } from "../types";
import { convertWeight, formatWeight } from "../utils";
import { useWorkout } from "../WorkoutContext";

const HomeApp: React.FC = () => {
  const {
    weights,
    workoutHistory,
    setWorkoutHistory,
    setWeights,
    setExerciseFailures,
    setExerciseDeloads,
    unitSystem,
    isLoading
  } = useWorkout();

  const confirmDeleteHistory = (): void => {
    Alert.alert(
      "Reset All Data",
      "Are you sure you want to permanently delete all workout history and reset weights to starting values? This cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Reset All",
          style: "destructive",
          onPress: () => {
            setWorkoutHistory([]);
            setWeights(defaultWeights[unitSystem]);
            setExerciseFailures(defaultFailures);
            setExerciseDeloads(defaultDeloads);
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f9fafb"
        }}
      >
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Simple 5×5</Text>
        <Text style={styles.headerSubtitle}>Workout log</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.weightsContainer}>
          <View style={styles.weightsHeader}>
            <Text style={styles.weightsTitle}>📈 Current Weights</Text>
          </View>
          <View style={styles.weightsList}>
            {(Object.entries(exerciseNames) as [ExerciseKey, string][]).map(
              ([key, name]) => (
                <View key={key} style={styles.weightItem}>
                  <Text style={styles.weightName}>{name}</Text>
                  <Text style={styles.weightValue}>
                    {formatWeight(weights[key], unitSystem)}
                  </Text>
                </View>
              )
            )}
          </View>
        </View>
        {workoutHistory.length > 0 && (
          <View style={styles.historyContainer}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>📅 Recent Workouts</Text>
              <TouchableOpacity onPress={confirmDeleteHistory}>
                <MaterialCommunityIcons name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>
            <View style={styles.historyList}>
              {workoutHistory.map(
                (workout: WorkoutHistoryItem, index: number) => {
                  const workoutUnit = workout.unit || "lbs";
                  const displayBodyweight = workout.bodyweight
                    ? convertWeight(workout.bodyweight, workoutUnit, unitSystem)
                    : undefined;

                  return (
                    <View key={index} style={styles.historyItem}>
                      <View style={styles.historyItemHeader}>
                        <Text style={styles.historyWorkoutType}>
                          Workout {workout.type}
                          {displayBodyweight &&
                            ` • ${displayBodyweight} ${unitSystem}`}
                        </Text>
                        <Text style={styles.historyDate}>{workout.date}</Text>
                      </View>
                      <View style={styles.historyExercises}>
                        {workout.exercises.map(
                          (exercise: WorkoutExercise, exIndex: number) => {
                            const displayWeight = convertWeight(
                              exercise.weight,
                              workoutUnit,
                              unitSystem
                            );
                            return (
                              <View
                                key={exIndex}
                                style={styles.historyExercise}
                              >
                                <Text style={styles.historyExerciseName}>
                                  {exercise.name}
                                </Text>
                                <Text style={styles.historyExerciseData}>
                                  {displayWeight}
                                  {unitSystem} × {exercise.sets.join(", ")}
                                </Text>
                              </View>
                            );
                          }
                        )}
                      </View>
                    </View>
                  );
                }
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const HomeScreen: React.FC = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#2563eb" }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#2563eb"
          translucent={false}
        />
        <HomeApp />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default HomeScreen;
