import { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import * as Location from "expo-location";
import { MapPin, PencilLine, X } from "lucide-react-native";

import ManualAddressForm from "./ManualAddressForm";
import { createClient } from "@/lib/auth/client";
interface AddAddressDialogProps {
  onSuccess?: () => void | Promise<void>;
}

export default function AddAddressDialog({ onSuccess }: AddAddressDialogProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [method, setMethod] = useState<"menu" | "manual">("menu");

  async function handleSuccess() {
    try {
      setSaving(true);
      await Promise.resolve(onSuccess?.());
      router.replace("/checkout" as any);

      setOpen(false);
      setMethod("menu");
    } finally {
      setSaving(false);
    }
  }

async function handleCurrentLocation() {
  try {
    setSaving(true);

    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      throw new Error("Location permission denied.");
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const geoResponse = await fetch(
      `https://us1.locationiq.com/v1/reverse?key=${process.env.EXPO_PUBLIC_LOCATIONIQ_API_KEY}&lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
    );

    const locationResult = await geoResponse.json();

    console.log("LocationIQ Response:", locationResult);

    if (!geoResponse.ok) {
      throw new Error(
        locationResult.error || "Unable to detect your address."
      );
    }

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Please login again.");
    }

    const { error } = await (supabase as any)
      .from("addresses")
      .insert({
        user_id: user.id,
        label: "Current Location",
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
        street: locationResult.display_name,
        building: "",
        apartment: "",
        landmark: "",
        postal_code: locationResult.address?.postcode ?? "",
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        is_default: true,
      });

    if (error) throw error;

    Alert.alert("Success", "Address added successfully.");

    await Promise.resolve(onSuccess?.());

    router.replace("/checkout" as any);

    setOpen(false);
    setMethod("menu");
  } catch (error) {
    console.error(error);

    Alert.alert(
      "Address Error",
      error instanceof Error
        ? error.message
        : "Unable to add address."
    );
  } finally {
    setSaving(false);
  }
}
  function handleClose() {
    if (saving) return;
    setOpen(false);
    setMethod("menu");
  }

  return (
    <>
      <Pressable style={styles.triggerButton} onPress={() => setOpen(true)}>
        <Text style={styles.triggerButtonText}>Add Address</Text>
      </Pressable>

      <Modal
        visible={open}
        animationType="slide"
        transparent
        onRequestClose={handleClose}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            {/* Header with Title and Close Button */}
            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={styles.title}>Add Delivery Address</Text>
                <Text style={styles.description}>
                  {"Choose how you'd like to add your delivery address."}
                </Text>
              </View>
              <Pressable
                style={styles.closeButton}
                onPress={handleClose}
                disabled={saving}
              >
                <X size={20} color="#6b7280" />
              </Pressable>
            </View>

            {method === "menu" && (
              <View style={styles.menu}>
                <Pressable
                  disabled={saving}
                  onPress={handleCurrentLocation}
                  style={styles.option}
                >
                  {saving ? (
                    <ActivityIndicator color="#004d26" />
                  ) : (
                    <MapPin size={24} color="#004d26" />
                  )}

                  <View style={styles.optionText}>
                    <Text style={styles.optionTitle}>Use Current Location</Text>
                    <Text style={styles.optionDescription}>
                      Detect your location automatically.
                    </Text>
                  </View>
                </Pressable>

                <Pressable
                  disabled={saving}
                  onPress={() => setMethod("manual")}
                  style={styles.option}
                >
                  <PencilLine size={24} color="#004d26" />

                  <View style={styles.optionText}>
                    <Text style={styles.optionTitle}>Enter Manually</Text>
                    <Text style={styles.optionDescription}>
                      Type your address yourself.
                    </Text>
                  </View>
                </Pressable>

                <Pressable
                  style={styles.cancelButton}
                  onPress={handleClose}
                  disabled={saving}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
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
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  triggerButton: {
    backgroundColor: "#004d26",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  triggerButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerText: {
    flex: 1,
    marginRight: 12,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    color: "#6b7280",
  },
  menu: {
    marginTop: 24,
    gap: 16,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    padding: 18,
  },
  optionText: {
    marginLeft: 16,
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  optionDescription: {
    marginTop: 4,
    fontSize: 13,
    color: "#6b7280",
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6b7280",
  },
});