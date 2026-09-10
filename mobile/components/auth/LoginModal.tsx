import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Pressable,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { X } from "lucide-react-native";

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
  const insets = useSafeAreaInsets();

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

  const bottomInset = insets.bottom > 0 ? insets.bottom : 16;

  return (
    <>
      <Pressable onPress={handlePress} disabled={checkingAuth}>
        {checkingAuth ? (
          <ActivityIndicator color="#18181b" size="small" />
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
        <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
          {/* Header Bar */}
          <View style={styles.headerBar}>
            <View style={styles.grabber} />
            <Pressable
              onPress={closeModal}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.closeButtonPressed,
              ]}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Close sign in sheet"
            >
              <X size={15} color="#71717a" strokeWidth={2} />
            </Pressable>
          </View>

          {/* Form Container */}
          <View style={[styles.contentWrapper, { paddingBottom: bottomInset }]}>
            <LoginForm onSuccess={handleSuccess} />
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  headerBar: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    position: "relative",
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5",
  },

  grabber: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#e4e4e7",
  },

  closeButton: {
    position: "absolute",
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    alignItems: "center",
    justifyContent: "center",
  },

  closeButtonPressed: {
    backgroundColor: "#e4e4e7",
    transform: [{ scale: 0.97 }],
  },

  contentWrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
});