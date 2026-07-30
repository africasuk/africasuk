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
  ViewStyle,
  TextStyle,
} from "react-native";
import { Save } from "lucide-react-native";

import type { Profile } from "@africasuk/types";

interface CheckoutContactDialogProps {
  open: boolean;
  profile: Profile | null;
  onOpenChange(open: boolean): void;
  onSuccess?: () => void | Promise<void>;
}

export default function CheckoutContactDialog({
  open,
  profile,
  onOpenChange,
  onSuccess,
}: CheckoutContactDialogProps) {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(profile?.fullName ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");

  // Sync state whenever the profile or dialog visibility changes
  useEffect(() => {
    if (open) {
      setFullName(profile?.fullName ?? "");
      setPhone(profile?.phone ?? "");
    }
  }, [open, profile]);

  async function save() {
    const name = fullName.trim();
    const phoneNumber = phone.trim();

    if (!name) {
      Alert.alert("Full Name", "Please enter your full name.");
      return;
    }

    if (!phoneNumber) {
      Alert.alert("Phone Number", "Please enter your phone number.");
      return;
    }

    const phoneRegex = /^\+?[0-9]{6,15}$/;

    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert(
        "Invalid Phone Number",
        "Please enter a valid phone number."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: name,
            phone: phoneNumber,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ?? "Failed to update contact information."
        );
      }

      Alert.alert("Success", "Contact information updated.");

      await Promise.resolve(onSuccess?.());
      onOpenChange(false);
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Update Failed",
        error instanceof Error
          ? error.message
          : "Failed to update contact information."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    if (loading) return;
    onOpenChange(false);
  }

  return (
    <Modal
      visible={open}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>
            Complete Your Contact Information
          </Text>

          <Text style={styles.description}>
            Before placing your order, please provide your full name and phone
            number. This information is used for delivery and order updates.
          </Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              value={fullName}
              editable={!loading}
              placeholder="John Doe"
              placeholderTextColor="#9ca3af"
              onChangeText={setFullName}
              style={styles.input}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              value={phone}
              editable={!loading}
              keyboardType="phone-pad"
              placeholder="+211912345678"
              placeholderTextColor="#9ca3af"
              onChangeText={setPhone}
              style={styles.input}
            />
          </View>

          <View style={styles.actions}>
            <Pressable
              disabled={loading}
              onPress={handleClose}
              style={[
                styles.button,
                styles.cancelButton,
                loading && styles.disabledButton,
              ]}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>

            <Pressable
              disabled={loading}
              onPress={save}
              style={[
                styles.button,
                styles.saveButton,
                loading && styles.disabledButton,
              ]}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#ffffff" size="small" />
                  <Text style={styles.saveText}>Saving...</Text>
                </View>
              ) : (
                <View style={styles.loadingContainer}>
                  <Save size={16} color="#ffffff" />
                  <Text style={styles.saveText}>Save & Continue</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

type Styles = {
  overlay: ViewStyle;
  modal: ViewStyle;
  title: TextStyle;
  description: TextStyle;
  formGroup: ViewStyle;
  label: TextStyle;
  input: TextStyle;
  actions: ViewStyle;
  button: ViewStyle;
  disabledButton: ViewStyle;
  cancelButton: ViewStyle;
  cancelText: TextStyle;
  saveButton: ViewStyle;
  saveText: TextStyle;
  loadingContainer: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  description: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 18,
  },
  formGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#ffffff",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  cancelText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  saveButton: {
    backgroundColor: "#004d26",
  },
  saveText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#ffffff",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});