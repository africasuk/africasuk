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
} from "react-native";
import { User, Phone, Check } from "lucide-react-native";
import { createClient } from "@/lib/auth/client";
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
  const [nameFocused, setNameFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);

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
      Alert.alert("Required Field", "Please enter your full name.");
      return;
    }

    if (!phoneNumber) {
      Alert.alert("Required Field", "Please enter your phone number.");
      return;
    }

    const phoneRegex = /^\+?[0-9]{7,15}$/;
    if (!phoneRegex.test(phoneNumber.replace(/[\s-]/g, ""))) {
      Alert.alert(
        "Invalid Phone Number",
        "Please provide a valid phone number with country code (e.g., +211...)."
      );
      return;
    }

    try {
      setLoading(true);
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Please log in to update contact details.");
      }

      const { error } = await (supabase as any)
        .from("profiles")
        .update({
          full_name: name,
          phone: phoneNumber,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      await Promise.resolve(onSuccess?.());
      onOpenChange(false);
    } catch (error) {
      console.error("Profile update error:", error);
      Alert.alert(
        "Update Failed",
        error instanceof Error
          ? error.message
          : "Failed to update contact details. Please try again."
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
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />

        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Contact Details</Text>
            <Text style={styles.description}>
              Delivery riders and order dispatch will reach you through this
              information.
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            {/* Full Name */}
            <View style={styles.field}>
              <Text style={styles.label}>Full Name</Text>
              <View
                style={[
                  styles.inputContainer,
                  nameFocused && styles.inputFocused,
                ]}
              >
                <User size={16} color="#71717a" strokeWidth={1.75} />
                <TextInput
                  value={fullName}
                  editable={!loading}
                  placeholder="e.g. George Kasmiro"
                  placeholderTextColor="#a1a1aa"
                  onChangeText={setFullName}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                  style={styles.input}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Phone Number */}
            <View style={styles.field}>
              <Text style={styles.label}>Phone Number</Text>
              <View
                style={[
                  styles.inputContainer,
                  phoneFocused && styles.inputFocused,
                ]}
              >
                <Phone size={16} color="#71717a" strokeWidth={1.75} />
                <TextInput
                  value={phone}
                  editable={!loading}
                  keyboardType="phone-pad"
                  placeholder="+211 912 345 678"
                  placeholderTextColor="#a1a1aa"
                  onChangeText={setPhone}
                  onFocus={() => setPhoneFocused(true)}
                  onBlur={() => setPhoneFocused(false)}
                  style={styles.input}
                />
              </View>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable
              disabled={loading}
              onPress={handleClose}
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.cancelPressed,
                loading && styles.disabledState,
              ]}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>

            <Pressable
              disabled={loading}
              onPress={save}
              style={({ pressed }) => [
                styles.saveButton,
                pressed && styles.savePressed,
                loading && styles.disabledState,
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <Text style={styles.saveText}>Save Details</Text>
                  <Check size={14} color="#ffffff" strokeWidth={2.2} />
                </>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  modalCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    gap: 18,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },

  header: {
    gap: 4,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.4,
  },

  description: {
    fontSize: 12,
    lineHeight: 18,
    color: "#71717a",
  },

  form: {
    gap: 12,
  },

  field: {
    gap: 6,
  },

  label: {
    fontSize: 11,
    fontWeight: "600",
    color: "#27272a",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    backgroundColor: "#f4f4f5",
    borderRadius: 10,
    paddingHorizontal: 12,
    gap: 8,
    borderWidth: 1.5,
    borderColor: "transparent",
  },

  inputFocused: {
    borderColor: "#18181b",
    backgroundColor: "#ffffff",
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: "#18181b",
    height: "100%",
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    paddingTop: 4,
  },

  cancelButton: {
    height: 42,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#f4f4f5",
    justifyContent: "center",
    alignItems: "center",
  },

  cancelPressed: {
    backgroundColor: "#e4e4e7",
  },

  cancelText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#52525b",
  },

  saveButton: {
    height: 42,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: "#18181b",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  savePressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },

  saveText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#ffffff",
    letterSpacing: -0.1,
  },

  disabledState: {
    opacity: 0.5,
  },
});