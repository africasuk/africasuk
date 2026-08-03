import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Save, X } from "lucide-react-native";

import type { Profile } from "@africasuk/types";
import { createClient } from "@/lib/auth/client";


const BRAND = "#005c2e";
const BRAND_DARK = "#002b15";

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
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(profile.fullName ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");

  // Sync form state whenever the modal opens or profile changes
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

        if (error) {
          throw error;
        }
      await Promise.resolve(onSuccess?.());
      onClose();
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to update profile."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
          >
            <View style={styles.container}>
              {/* Header */}
              <View style={styles.header}>
                <View>
                  <Text style={styles.title}>Edit Profile</Text>
                  <Text style={styles.subtitle}>
                    Update your personal information.
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  disabled={loading}
                >
                  <X size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>

              {/* Form Body */}
              <View style={styles.form}>
                <View style={styles.field}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Enter full name"
                    placeholderTextColor="#9ca3af"
                    editable={!loading}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Phone Number</Text>
                  <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="+211912345678"
                    placeholderTextColor="#9ca3af"
                    keyboardType="phone-pad"
                    editable={!loading}
                  />
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={onClose}
                    disabled={loading}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.saveButton, loading && styles.disabledButton]}
                    onPress={save}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <>
                        <Save size={16} color="#ffffff" style={styles.saveIcon} />
                        <Text style={styles.saveText}>Save Changes</Text>
                      </>
                    )}
                  </TouchableOpacity>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  keyboardView: {
    width: "100%",
  },
  container: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    gap: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: BRAND_DARK,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6b7280",
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  form: {
    gap: 16,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: BRAND_DARK,
  },
  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: BRAND_DARK,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cancelText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4b5563",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BRAND,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 9999,
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveIcon: {
    marginRight: 6,
  },
  saveText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#ffffff",
  },
});