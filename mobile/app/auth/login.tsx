import React from "react";
import { StyleSheet, View } from "react-native";
import { Stack } from "expo-router";

import LoginForm from "@/components/auth/LoginForm";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
          title: "Login",
        }}
      />

      <LoginForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f3f2",
  },
});