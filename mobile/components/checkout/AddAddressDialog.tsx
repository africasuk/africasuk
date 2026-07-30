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
import { MapPin, PencilLine } from "lucide-react-native";

import ManualAddressForm from "./ManualAddressForm";

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

    const position =
      await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      console.log("API URL:", process.env.EXPO_PUBLIC_API_URL);
console.log("Latitude:", position.coords.latitude);
console.log("Longitude:", position.coords.longitude);
console.log(process.env.EXPO_PUBLIC_API_URL);

    const geoResponse = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/geocode/reverse`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      }
    );

    const geo = await geoResponse.json();

    if (!geoResponse.ok) {
      throw new Error(
        geo.message ??
          "Unable to detect your address."
      );
    }

    const saveResponse = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/addresses`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: "Current Location",
          country: geo.country,
          state: geo.state,
          city: geo.city,
          area: geo.area,
          street: geo.street,
          building: "",
          apartment: "",
          landmark: "",
          postalCode: geo.postalCode,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          isDefault: true,
        }),
      }
    );

    const result = await saveResponse.json();

    if (!saveResponse.ok) {
      throw new Error(
        result.message ??
          "Unable to save address."
      );
    }

    Alert.alert(
      "Success",
      "Address added successfully."
    );

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
            <Text style={styles.title}>Add Delivery Address</Text>
            <Text style={styles.description}>
              {"Choose how you'd like to add your delivery address."}
            </Text>

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
});