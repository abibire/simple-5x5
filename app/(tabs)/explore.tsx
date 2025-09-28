import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>d</Text>
      <Text style={styles.text}>asdfasdfasdf</Text>
      <Text style={styles.text}>klľķð</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#690808ff"
  },
  text: {
    fontSize: 20,
    color: "silver"
  }
});
