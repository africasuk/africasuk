import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Check, X } from "lucide-react-native";

import type { Profile } from "@africasuk/types";
import { createClient } from "@/lib/auth/client";

interface Props {
  visible: boolean;
  profile: Profile;
  onClose: () => void;
  onSuccess?: () => void | Promise<void>;
}

export default function EditProfileModal({
  visible,
  profile,
  onClose,
  onSuccess,
}: Props) {
  const insets = useSafeAreaInsets();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(profile.fullName ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");

  useEffect(() => {
    if (visible) {
      setFullName(profile.fullName ?? "");
      setPhone(profile.phone ?? "");
    }
  }, [visible, profile]);

  async function save() {
    const name = fullName.trim();
    const phoneNumber = phone.trim();
    const phoneRegex = /^\+?[0-9]{6,15}$/;

    if (!name) {
      Alert.alert("Validation Error", "Full name is required.");
      return;
    }

    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
      Alert.alert("Validation Error", "Please enter a valid phone number.");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Please sign in again.");
      }

      const { error } = await (supabase as any)
        .from("profiles")
        .update({
          full_name: name,
          phone: phoneNumber || null,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      await Promise.resolve(onSuccess?.());
      onClose();
    } catch (error) {
      console.error("Profile update error:", error);
      Alert.alert(
        "Update Failed",
        error instanceof Error ? error.message : "Failed to update profile."
      );
    } finally {
      setLoading(false);
    }
  }

  const bottomInset = insets.bottom > 0 ? insets.bottom : 16;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={onClose} />

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.keyboardView}
          >
            <View style={[styles.sheet, { paddingBottom: bottomInset + 12 }]}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerTextGroup}>
                  <Text style={styles.title}>Edit Profile</Text>
                  <Text style={styles.subtitle}>
                    Update your public identity and contact details
                  </Text>
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.closeButton,
                    pressed && styles.closeButtonPressed,
                  ]}
                  onPress={onClose}
                  disabled={loading}
                  hitSlop={8}
                >
                  <X size={15} color="#71717a" strokeWidth={2} />
                </Pressable>
              </View>

              {/* Form Body */}
              <View style={styles.form}>
                <View style={styles.field}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Enter your full name"
                    placeholderTextColor="#a1a1aa"
                    editable={!loading}
                    autoCapitalize="words"
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Phone Number</Text>
                  <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="+211912345678"
                    placeholderTextColor="#a1a1aa"
                    keyboardType="phone-pad"
                    editable={!loading}
                  />
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.cancelButton,
                      pressed && styles.cancelButtonPressed,
                    ]}
                    onPress={onClose}
                    disabled={loading}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </Pressable>

                  <Pressable
                    style={({ pressed }) => [
                      styles.saveButton,
                      loading && styles.disabledButton,
                      pressed && !loading && styles.saveButtonPressed,
                    ]}
                    onPress={save}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <>
                        <Check size={14} color="#ffffff" strokeWidth={2.2} />
                        <Text style={styles.saveText}>Save Changes</Text>
                      </>
                    )}
                  </Pressable>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  keyboardView: {
    width: "100%",
  },

  sheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "#e4e4e7",
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5",
  },

  headerTextGroup: {
    flex: 1,
    gap: 2,
    paddingRight: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.3,
  },

  subtitle: {
    fontSize: 12,
    color: "#71717a",
  },

  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#f4f4f5",
    alignItems: "center",
    justifyContent: "center",
  },

  closeButtonPressed: {
    backgroundColor: "#e4e4e7",
  },

  form: {
    gap: 14,
  },

  field: {
    gap: 6,
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#27272a",
  },

  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#e4e4e7",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontWeight: "500",
    color: "#18181b",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },

  cancelButton: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },

  cancelButtonPressed: {
    backgroundColor: "#f4f4f5",
  },

  cancelText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#71717a",
  },

  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#18181b",
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  saveButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },

  disabledButton: {
    opacity: 0.45,
  },

  saveText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
    letterSpacing: -0.1,
  },
});