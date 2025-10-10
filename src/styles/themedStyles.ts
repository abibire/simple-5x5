import { Theme } from "@/src/contexts/ThemeContext";
import { StyleSheet } from "react-native";

export const createThemedStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.primary
    },
    scrollView: {
      flex: 1,
      backgroundColor: theme.background
    },
    header: {
      backgroundColor: theme.primary,
      padding: 16
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: "white"
    },
    headerSubtitle: {
      fontSize: 14,
      color: "#dbeafe"
    },
    timerContainer: {
      backgroundColor: theme.surface,
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border
    },
    timerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    },
    timerText: {
      fontSize: 32,
      fontWeight: "bold",
      fontFamily: "monospace",
      color: theme.text
    },
    presetButtons: {
      flexDirection: "row",
      gap: 8,
      marginTop: 8
    },
    presetButton: {
      backgroundColor: theme.surfaceSecondary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4
    },
    presetButtonText: {
      fontSize: 12,
      color: theme.text
    },
    workoutContainer: {
      backgroundColor: theme.surface
    },
    exerciseContainer: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border
    },
    exerciseHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12
    },
    exerciseName: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.text
    },
    exerciseWeight: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.primary
    },
    exerciseWeightClickable: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.primary,
      textDecorationLine: "underline",
      textDecorationColor: theme.primary,
      textDecorationStyle: "solid"
    },
    weightEditContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8
    },
    weightInput: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
      fontSize: 18,
      fontWeight: "bold",
      color: theme.primary,
      minWidth: 60,
      textAlign: "center"
    },
    weightEditButton: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      minWidth: 28,
      minHeight: 28,
      justifyContent: "center",
      alignItems: "center"
    },
    weightEditButtonConfirm: {
      backgroundColor: theme.success
    },
    weightEditButtonCancel: {
      backgroundColor: theme.error
    },
    weightEditButtonText: {
      color: "white",
      fontSize: 14,
      fontWeight: "bold"
    },
    setsContainer: {
      flexDirection: "row",
      gap: 8
    },
    setContainer: {
      alignItems: "center"
    },
    setLabel: {
      fontSize: 10,
      color: theme.textSecondary,
      marginBottom: 4
    },
    repButton: {
      width: 48,
      height: 48,
      borderRadius: 4,
      borderWidth: 2,
      justifyContent: "center",
      alignItems: "center"
    },
    repButtonEmpty: {
      backgroundColor: theme.surfaceSecondary,
      borderColor: theme.border
    },
    repButtonComplete: {
      backgroundColor: theme.primary,
      borderColor: theme.primary
    },
    repButtonText: {
      fontSize: 18,
      fontWeight: "bold"
    },
    repButtonTextEmpty: {
      color: theme.textSecondary
    },
    repButtonTextComplete: {
      color: "white"
    },
    completeButtonContainer: {
      padding: 16
    },
    completeButton: {
      backgroundColor: theme.primary,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center"
    },
    completeButtonText: {
      color: "white",
      fontSize: 18,
      fontWeight: "600"
    },
    historyContainer: {
      backgroundColor: theme.surface
    },
    historyHeader: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.surfaceSecondary,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    },
    historyTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.text
    },
    historyList: {
      backgroundColor: theme.surface
    },
    historyItem: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border
    },
    historyItemHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8
    },
    historyWorkoutType: {
      fontWeight: "600",
      color: theme.text
    },
    historyDate: {
      fontSize: 12,
      color: theme.textSecondary
    },
    historyExercises: {
      gap: 4
    },
    historyExercise: {
      flexDirection: "row",
      justifyContent: "space-between"
    },
    historyExerciseName: {
      fontSize: 12,
      color: theme.text
    },
    historyExerciseData: {
      fontSize: 12,
      color: theme.text
    },
    weightsContainer: {
      backgroundColor: theme.surface
    },
    weightsHeader: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.surfaceSecondary,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    },
    weightsTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.text
    },
    weightsList: {
      padding: 16,
      gap: 8
    },
    weightItem: {
      flexDirection: "row",
      justifyContent: "space-between"
    },
    weightName: {
      fontSize: 14,
      color: theme.text
    },
    weightValue: {
      fontSize: 14,
      fontWeight: "bold",
      color: theme.text
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background
    },
    loadingText: {
      color: theme.text
    },
    homeContainer: {
      flex: 1,
      backgroundColor: theme.background
    },
    progressContainer: {
      flex: 1,
      backgroundColor: theme.background
    },
    progressHeaderContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12
    },
    progressChartContainer: {
      backgroundColor: theme.surface,
      paddingVertical: 16
    },
    progressNoDataContainer: {
      height: 280,
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 8
    },
    progressNoDataText: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: "center"
    },
    progressChartLabel: {
      textAlign: "center",
      color: theme.textSecondary,
      fontSize: 12,
      marginTop: 8
    },
    progressSelectContainer: {
      backgroundColor: theme.surface,
      padding: 16,
      marginTop: 1
    },
    progressSelectTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 12,
      color: theme.text
    },
    progressSelectList: {
      gap: 8
    },
    progressExerciseButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      borderRadius: 8,
      borderWidth: 2
    },
    progressExerciseButtonActive: {
      backgroundColor: theme.surfaceSecondary
    },
    progressExerciseButtonInactive: {
      backgroundColor: theme.surface
    },
    progressExerciseDot: {
      width: 20,
      height: 20,
      borderRadius: 10,
      marginRight: 12
    },
    progressExerciseText: {
      fontSize: 16
    },
    progressExerciseTextActive: {
      fontWeight: "600",
      color: theme.text
    },
    progressExerciseTextInactive: {
      fontWeight: "400",
      color: theme.textSecondary
    },
    progressEmptyState: {
      backgroundColor: theme.surface,
      padding: 32,
      alignItems: "center"
    },
    progressEmptyStateText: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: "center"
    },
    dataManagementSection: {
      backgroundColor: theme.surface,
      marginTop: 1
    },
    dataManagementHeader: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.surfaceSecondary
    },
    dataManagementTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.text
    },
    dataManagementButtons: {
      padding: 16,
      gap: 12
    },
    exportButton: {
      backgroundColor: theme.primary,
      padding: 16,
      borderRadius: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8
    },
    exportButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "white"
    },
    importButton: {
      backgroundColor: theme.surfaceSecondary,
      padding: 16,
      borderRadius: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      borderWidth: 1,
      borderColor: theme.border
    },
    importButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text
    }
  });
