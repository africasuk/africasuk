import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
} from "react-native";
import { X } from "lucide-react-native";

import type { Address } from "@africasuk/database";

import ManualAddressForm from "./ManualAddressForm";

const BRAND_DARK = "#002b15";

interface Props {
  visible: boolean;
  address: Address | null;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
}

export default function EditAddressModal({
  visible,
  address,
  onClose,
  onSuccess,
}: Props) {
  const [submitting, setSubmitting] = useState(false);

  if (!address) {
    return null;
  }

  async function handleSuccess() {
    try {
      setSubmitting(true);
      await Promise.resolve(onSuccess());
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.sheetContainer}>
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>Edit Address</Text>
                <Text style={styles.subtitle}>
                  Update details for &quot;{address.label || "Address"}&quot;
                </Text>
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                disabled={submitting}
                activeOpacity={0.7}
              >
                <X size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Scrollable Form Body */}
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <ManualAddressForm
                mode="edit"
                address={address}
                onSuccess={handleSuccess}
                onCancel={onClose}
              />
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  safeArea: {
    maxHeight: "90%",
  },
  sheetContainer: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 10 : 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: BRAND_DARK,
  },
  subtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  closeButton: {
    padding: 6,
    backgroundColor: "#f3f4f6",
    borderRadius: 9999,
  },
  scrollContent: {
    paddingVertical: 16,
  },
});