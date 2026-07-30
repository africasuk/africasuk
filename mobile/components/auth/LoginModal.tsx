import React, { useState } from "react";
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Pressable,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";

import { createClient } from "@/lib/auth/client";
import LoginForm from "./LoginForm";

interface LoginModalProps {
  children: React.ReactNode;
  onAuthenticated?: () => void | Promise<void>;
}

export default function LoginModal({
  children,
  onAuthenticated,
}: LoginModalProps) {
  const [visible, setVisible] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(false);

  const handlePress = async () => {
    try {
      setCheckingAuth(true);

      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await onAuthenticated?.();
        return;
      }

      setVisible(true);
    } catch (error) {
      console.error("Authentication check failed:", error);
      setVisible(true);
    } finally {
      setCheckingAuth(false);
    }
  };

  const closeModal = () => setVisible(false);

  const handleSuccess = async () => {
    closeModal();
    await onAuthenticated?.();
  };

  return (
    <>
      <Pressable onPress={handlePress} disabled={checkingAuth}>
        {checkingAuth ? (
          <ActivityIndicator color="#004d26" />
        ) : (
          children
        )}
      </Pressable>

      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoid}
          >
            <View style={styles.headerBar}>
              <Pressable
                onPress={closeModal}
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed && styles.pressed,
                ]}
                hitSlop={12}
              >
                <Text style={styles.closeText}>Close</Text>
              </Pressable>
            </View>

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <LoginForm onSuccess={handleSuccess} />
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </>
  );
}

type Styles = {
  safeArea: ViewStyle;
  keyboardAvoid: ViewStyle;
  headerBar: ViewStyle;
  closeButton: ViewStyle;
  closeText: TextStyle;
  pressed: ViewStyle;
  scrollView: ViewStyle;
  scrollContent: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  keyboardAvoid: {
    flex: 1,
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  closeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  closeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#004d26",
  },
  pressed: {
    opacity: 0.6,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
});