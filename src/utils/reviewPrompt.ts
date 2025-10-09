import AsyncStorage from "@react-native-async-storage/async-storage";
import * as StoreReview from "expo-store-review";
import { Alert, Platform } from "react-native";

const REVIEW_STORAGE_KEY = "lifts_review_data";

interface ReviewData {
  completedWorkouts: number;
  lastPromptedAt: number;
  hasRequestedReview: boolean;
}

const getReviewData = async (): Promise<ReviewData> => {
  try {
    const data = await AsyncStorage.getItem(REVIEW_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Failed to load review data:", error);
  }
  return {
    completedWorkouts: 0,
    lastPromptedAt: 0,
    hasRequestedReview: false
  };
};

const saveReviewData = async (data: ReviewData): Promise<void> => {
  try {
    await AsyncStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save review data:", error);
  }
};

const shouldPromptForReview = (
  completedWorkouts: number,
  testMode: boolean
): boolean => {
  if (testMode) {
    return completedWorkouts % 2 === 0;
  }
  if (
    completedWorkouts === 2 ||
    completedWorkouts === 6 ||
    completedWorkouts === 12
  ) {
    return true;
  }
  if (completedWorkouts > 12 && (completedWorkouts - 12) % 10 === 0) {
    return true;
  }
  return false;
};

export const handleWorkoutCompletion = async (
  testMode: boolean = false
): Promise<void> => {
  const reviewData = await getReviewData();
  if (reviewData.hasRequestedReview) {
    return;
  }
  reviewData.completedWorkouts += 1;
  if (shouldPromptForReview(reviewData.completedWorkouts, testMode)) {
    const isAvailable = await StoreReview.isAvailableAsync();
    if (isAvailable) {
      Alert.alert(
        "Enjoying Simple 5×5?",
        "Are you enjoying your workouts with Simple 5×5?",
        [
          {
            text: "Not Really",
            style: "cancel",
            onPress: async () => {
              reviewData.lastPromptedAt = reviewData.completedWorkouts;
              await saveReviewData(reviewData);
            }
          },
          {
            text: "Yes!",
            onPress: async () => {
              reviewData.hasRequestedReview = true;
              reviewData.lastPromptedAt = reviewData.completedWorkouts;
              await saveReviewData(reviewData);

              if (Platform.OS === "ios" || Platform.OS === "android") {
                await StoreReview.requestReview();
              }
            }
          }
        ]
      );
    }
  }

  await saveReviewData(reviewData);
};
