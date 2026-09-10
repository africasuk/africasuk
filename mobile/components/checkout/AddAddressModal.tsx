import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as Location from "expo-location";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MapPin, PencilLine, X, ChevronRight } from "lucide-react-native";

import { createClient } from "@/lib/auth/client";
import ManualAddressForm from "./ManualAddressForm";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void | Promise<void>;
}

export default function AddAddressModal({
  visible,
  onClose,
  onSuccess,
}: Props) {
  const insets = useSafeAreaInsets();
  const [saving, setSaving] = useState(false);
  const [method, setMethod] = useState<"menu" | "manual">("menu");

  const bottomInset = insets.bottom > 0 ? insets.bottom : 16;

  const resetAndClose = () => {
    if (saving) return;
    setMethod("menu");
    onClose();
  };

  async function handleSuccess() {
    try {
      setSaving(true);
      await Promise.resolve(onSuccess?.());
      setMethod("menu");
      onClose();
    } finally {
      setSaving(false);
    }
  }

  async function handleCurrentLocation() {
    try {
      setSaving(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Permission to access location was denied. Please add your address details manually."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const [geo] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (!geo) {
        throw new Error("Unable to identify address details for this location.");
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Please log in to save addresses.");
      }

      // Query if user already has an address to set sensible default flag
      const { count } = await supabase
        .from("addresses")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      const isFirst = (count ?? 0) === 0;

      const { error: insertError } = await (supabase as any)
        .from("addresses")
        .insert({
          user_id: user.id,
          label: geo.name || geo.street || "Current Location",
          country: geo.country ?? "",
          state: geo.region ?? "",
          city: geo.city ?? geo.subregion ?? "",
          area: geo.district ?? "",
          street: [geo.streetNumber, geo.street].filter(Boolean).join(" ") || geo.name || "",
          building: "",
          apartment: "",
          landmark: "",
          postal_code: geo.postalCode ?? "",
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          is_default: isFirst,
        });

      if (insertError) throw insertError;

      await handleSuccess();
    } catch (error) {
      console.error("Location lookup error:", error);
      Alert.alert(
        "Location Error",
        error instanceof Error
          ? error.message
          : "Unable to detect your address. Please enter details manually."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={resetAndClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={styles.backdrop} onPress={resetAndClose} />

        <View style={[styles.sheet, { paddingBottom: bottomInset + 8 }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTextGroup}>
              <Text style={styles.title}>
                {method === "menu" ? "Add Delivery Address" : "New Address"}
              </Text>
              <Text style={styles.subtitle}>
                {method === "menu"
                  ? "Choose your preferred location entry method"
                  : "Provide accurate destination coordinates & details"}
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.closeButtonPressed,
              ]}
              onPress={resetAndClose}
              disabled={saving}
              hitSlop={8}
            >
              <X size={16} color="#71717a" strokeWidth={2} />
            </Pressable>
          </View>

          {/* Body Content */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            {method === "menu" ? (
              <View style={styles.menuContainer}>
                {/* 1. GPS Auto-Detect */}
                <Pressable
                  style={({ pressed }) => [
                    styles.optionCard,
                    pressed && styles.optionCardPressed,
                    saving && styles.optionDisabled,
                  ]}
                  onPress={() => {
                    void handleCurrentLocation();
                  }}
                  disabled={saving}
                >
                  <View style={styles.iconCircle}>
                    {saving ? (
                      <ActivityIndicator size="small" color="#18181b" />
                    ) : (
                      <MapPin size={18} color="#18181b" strokeWidth={1.8} />
                    )}
                  </View>

                  <View style={styles.optionContent}>
                    <Text style={styles.optionTitle}>Use Current Location</Text>
                    <Text style={styles.optionSubtitle}>
                      Automatically detect street and city via device GPS
                    </Text>
                  </View>

                  <ChevronRight size={16} color="#a1a1aa" strokeWidth={2} />
                </Pressable>

                {/* 2. Manual Form */}
                <Pressable
                  style={({ pressed }) => [
                    styles.optionCard,
                    pressed && styles.optionCardPressed,
                    saving && styles.optionDisabled,
                  ]}
                  onPress={() => setMethod("manual")}
                  disabled={saving}
                >
                  <View style={styles.iconCircle}>
                    <PencilLine size={18} color="#18181b" strokeWidth={1.8} />
                  </View>

                  <View style={styles.optionContent}>
                    <Text style={styles.optionTitle}>Enter Manually</Text>
                    <Text style={styles.optionSubtitle}>
                      Type specific street, building, and apartment numbers
                    </Text>
                  </View>

                  <ChevronRight size={16} color="#a1a1aa" strokeWidth={2} />
                </Pressable>
              </View>
            ) : (
              <ManualAddressForm
                onSuccess={handleSuccess}
                onCancel={() => setMethod("menu")}
              />
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
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

  sheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: "88%",
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "#e4e4e7",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5",
  },

  headerTextGroup: {
    flex: 1,
    paddingRight: 12,
    gap: 2,
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
    letterSpacing: -0.1,
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#f4f4f5",
    alignItems: "center",
    justifyContent: "center",
  },

  closeButtonPressed: {
    backgroundColor: "#e4e4e7",
  },

  scrollContent: {
    padding: 16,
  },

  menuContainer: {
    gap: 10,
  },

  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e4e4e7",
    backgroundColor: "#ffffff",
    gap: 12,
  },

  optionCardPressed: {
    backgroundColor: "#fafafa",
    borderColor: "#18181b",
  },

  optionDisabled: {
    opacity: 0.5,
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    alignItems: "center",
    justifyContent: "center",
  },

  optionContent: {
    flex: 1,
    gap: 2,
  },

  optionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.2,
  },

  optionSubtitle: {
    fontSize: 12,
    color: "#71717a",
    lineHeight: 16,
  },
});