import { StyleSheet } from "react-native";
import { Theme } from "../app/ThemeContext";

export const createTutorialStyles = (theme: Theme) =>
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
      maxHeight: "85%"
    },
    header: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 16,
      textAlign: "center"
    },
    section: {
      marginBottom: 20
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 8
    },
    text: {
      fontSize: 14,
      color: theme.text,
      lineHeight: 20,
      marginBottom: 12
    },
    feature: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 12,
      gap: 12
    },
    featureIcon: {
      marginTop: 2
    },
    featureText: {
      flex: 1,
      fontSize: 14,
      color: theme.text,
      lineHeight: 20
    },
    button: {
      backgroundColor: theme.primary,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 8
    },
    buttonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600"
    }
  });
