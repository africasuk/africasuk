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
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <X size={18} color="#6b7280" />
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
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.saveButton, loading && styles.disabledButton]}
                    onPress={save}
                    disabled={loading}
                    activeOpacity={0.85}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <>
                        <Save size={14} color="#ffffff" style={styles.saveIcon} />
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
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  keyboardView: {
    width: "100%",
  },
  container: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 0, // Sharp corners design language
    borderTopRightRadius: 0, // Sharp corners design language
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    padding: 20,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 16,
    fontWeight: "500", // Non-bold clean header weight
    color: BRAND_DARK,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "400", // Clean regular weight
    color: "#6b7280",
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  form: {
    gap: 14,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: "500", // Clean weight
    color: "#374151",
  },
  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 0, // Sharp corners
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    fontWeight: "400",
    color: BRAND_DARK,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
    marginTop: 6,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 0, // Sharp corners
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  cancelText: {
    fontSize: 12,
    fontWeight: "500", // Clean regular weight
    color: "#4b5563",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BRAND,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 0, // Sharp corners
  },
  disabledButton: {
    backgroundColor: "#e5e7eb",
    opacity: 0.8,
  },
  saveIcon: {
    marginRight: 6,
  },
  saveText: {
    fontSize: 12,
    fontWeight: "500", // Clean regular weight
    color: "#ffffff",
    letterSpacing: 0.2,
  },
});