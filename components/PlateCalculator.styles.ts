import { StyleSheet } from "react-native";
import { Theme } from "../app/ThemeContext";

export const createPlateStyles = (theme: Theme) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center"
    },
    modalContent: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 24,
      width: "90%",
      maxWidth: 400,
      maxHeight: "80%"
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: theme.text
    },
    exerciseName: {
      fontSize: 16,
      fontWeight: "600",
      textAlign: "center",
      marginBottom: 4,
      color: theme.text
    },
    totalWeight: {
      fontSize: 28,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 16,
      color: theme.primary
    },
    plateDisplay: {
      alignItems: "center",
      paddingVertical: 10
    },
    plateRow: {
      flexDirection: "row",
      alignItems: "center"
    },
    barbell: {
      width: 80,
      height: 20,
      backgroundColor: "#9ca3af",
      borderRadius: 2,
      justifyContent: "center",
      alignItems: "center"
    },
    barbellText: {
      color: "white",
      fontSize: 11,
      fontWeight: "bold"
    },
    platesContainer: {
      flexDirection: "row",
      alignItems: "center"
    },
    plate: {
      width: 30,
      borderRadius: 4,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: theme.border
    },
    plateText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 12
    },
    barOnlyText: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: "center",
      marginTop: 8
    },
    warmupContainer: {
      marginTop: 24,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: theme.border
    },
    warmupTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 8
    },
    warmupSets: {
      gap: 4
    },
    warmupSetRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 4
    },
    warmupSetInfo: {
      flexDirection: "row",
      gap: 8,
      flex: 1
    },
    warmupSetLabel: {
      fontSize: 12,
      color: theme.textSecondary,
      minWidth: 36
    },
    warmupSetData: {
      fontSize: 12,
      color: theme.text
    },
    warmupPlates: {
      fontSize: 11,
      color: theme.textSecondary,
      fontStyle: "italic"
    },
    workSetContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 6,
      marginTop: 4,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: theme.border
    },
    workSetInfo: {
      flexDirection: "row",
      gap: 8,
      flex: 1
    },
    workSetLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.text,
      minWidth: 36
    },
    workSetData: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.primary
    },
    workSetPlates: {
      fontSize: 11,
      color: theme.textSecondary,
      fontStyle: "italic",
      fontWeight: "600"
    }
  });
