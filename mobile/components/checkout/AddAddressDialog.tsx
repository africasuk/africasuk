import { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as Location from "expo-location";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MapPin, PencilLine, X, Plus, ChevronRight } from "lucide-react-native";

import ManualAddressForm from "./ManualAddressForm";
import { createClient } from "@/lib/auth/client";

interface AddAddressDialogProps {
  onSuccess?: () => void | Promise<void>;
}

export default function AddAddressDialog({ onSuccess }: AddAddressDialogProps) {
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [method, setMethod] = useState<"menu" | "manual">("menu");

  const bottomInset = insets.bottom > 0 ? insets.bottom : 16;

  function handleClose() {
    if (saving) return;
    setOpen(false);
    setMethod("menu");
  }

  async function handleSuccess() {
    try {
      setSaving(true);
      await Promise.resolve(onSuccess?.());
      setOpen(false);
      setMethod("menu");
    } finally {
      setSaving(false);
    }
  }

  async function handleCurrentLocation() {
    try {
      setSaving(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error(
          "Location permission was denied. Please enter your address details manually."
        );
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const key = process.env.EXPO_PUBLIC_LOCATIONIQ_API_KEY;
      if (!key) {
        throw new Error("LocationIQ API key is missing in app configuration.");
      }

      const geoResponse = await fetch(
        `https://us1.locationiq.com/v1/reverse?key=${key}&lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
      );

      const locationResult = await geoResponse.json();

      if (!geoResponse.ok) {
        throw new Error(
          locationResult.error || "Unable to detect your address location."
        );
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Please log in again.");
      }

      // Reset default flag from previous entries
      const { error: resetDefaultError } = await (supabase as any)
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id);

      if (resetDefaultError) throw resetDefaultError;

      const detectedLabel =
        locationResult.address?.suburb ??
        locationResult.address?.neighbourhood ??
        locationResult.address?.city ??
        "Current Location";

      const { error } = await (supabase as any).from("addresses").insert({
        user_id: user.id,
        label: detectedLabel,
        recipient_name: user.user_metadata?.full_name ?? "",
        phone: user.user_metadata?.phone ?? "",
        country: locationResult.address?.country ?? "",
        state: locationResult.address?.state ?? "",
        city:
          locationResult.address?.city ??
          locationResult.address?.town ??
          locationResult.address?.village ??
          "",
        area:
          locationResult.address?.suburb ??
          locationResult.address?.county ??
          "",
        street: locationResult.display_name ?? "",
        building: "",
        apartment: "",
        landmark: "",
        postal_code: locationResult.address?.postcode ?? "",
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        is_default: true,
      });

      if (error) throw error;

      await handleSuccess();
    } catch (error) {
      console.error("Location detection error:", error);
      Alert.alert(
        "Address Error",
        error instanceof Error ? error.message : "Unable to add address."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {/* Editorial Trigger Button */}
      <Pressable
        style={({ pressed }) => [
          styles.triggerButton,
          pressed && styles.triggerButtonPressed,
        ]}
        onPress={() => setOpen(true)}
      >
        <Plus size={13} color="#18181b" strokeWidth={2.2} />
        <Text style={styles.triggerButtonText}>Add New</Text>
      </Pressable>

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
          <Pressable style={styles.backdrop} onPress={handleClose} />

          <View style={[styles.sheet, { paddingBottom: bottomInset + 8 }]}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={styles.title}>
                  {method === "menu" ? "Add Delivery Address" : "Manual Address"}
                </Text>
                <Text style={styles.description}>
                  {method === "menu"
                    ? "Select an automated or manual entry method"
                    : "Fill in specific coordinates and street location"}
                </Text>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed && styles.closeButtonPressed,
                ]}
                onPress={handleClose}
                disabled={saving}
                hitSlop={8}
              >
                <X size={15} color="#71717a" strokeWidth={2} />
              </Pressable>
            </View>

            {/* Menu Options */}
            {method === "menu" && (
              <View style={styles.menu}>
                <Pressable
                  disabled={saving}
                  onPress={handleCurrentLocation}
                  style={({ pressed }) => [
                    styles.optionCard,
                    pressed && styles.optionCardPressed,
                    saving && styles.optionDisabled,
                  ]}
                >
                  <View style={styles.iconCircle}>
                    {saving ? (
                      <ActivityIndicator size="small" color="#18181b" />
                    ) : (
                      <MapPin size={18} color="#18181b" strokeWidth={1.8} />
                    )}
                  </View>

                  <View style={styles.optionText}>
                    <Text style={styles.optionTitle}>Use Current Location</Text>
                    <Text style={styles.optionDescription}>
                      Detect street, city, and GPS coordinates automatically
                    </Text>
                  </View>

                  <ChevronRight size={15} color="#a1a1aa" strokeWidth={2} />
                </Pressable>

                <Pressable
                  disabled={saving}
                  onPress={() => setMethod("manual")}
                  style={({ pressed }) => [
                    styles.optionCard,
                    pressed && styles.optionCardPressed,
                    saving && styles.optionDisabled,
                  ]}
                >
                  <View style={styles.iconCircle}>
                    <PencilLine size={18} color="#18181b" strokeWidth={1.8} />
                  </View>

                  <View style={styles.optionText}>
                    <Text style={styles.optionTitle}>Enter Manually</Text>
                    <Text style={styles.optionDescription}>
                      Type your recipient name, building, and street details
                    </Text>
                  </View>

                  <ChevronRight size={15} color="#a1a1aa" strokeWidth={2} />
                </Pressable>
              </View>
            )}

            {method === "manual" && (
              <ManualAddressForm
                onSuccess={handleSuccess}
                onCancel={() => setMethod("menu")}
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  triggerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },

  triggerButtonPressed: {
    backgroundColor: "#e4e4e7",
  },

  triggerButtonText: {
    color: "#18181b",
    fontWeight: "600",
    fontSize: 12,
    letterSpacing: -0.1,
  },

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
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "#e4e4e7",
    paddingHorizontal: 16,
    paddingTop: 16,
    maxHeight: "88%",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5",
  },

  headerText: {
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

  description: {
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

  menu: {
    paddingVertical: 14,
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
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    alignItems: "center",
    justifyContent: "center",
  },

  optionText: {
    flex: 1,
    gap: 2,
  },

  optionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.2,
  },

  optionDescription: {
    fontSize: 12,
    color: "#71717a",
    lineHeight: 16,
  },
});