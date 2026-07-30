import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  SafeAreaView,
  Platform,
} from "react-native";
import * as Location from "expo-location";
import { MapPin, PencilLine, X } from "lucide-react-native";

import ManualAddressForm from "./ManualAddressForm";

const BRAND = "#005c2e";
const BRAND_DARK = "#002b15";

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
  const [saving, setSaving] = useState(false);
  const [method, setMethod] = useState<"menu" | "manual">("menu");

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
          "Permission to access location was denied. Please enter your address manually."
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
        throw new Error("Unable to detect address details for your location.");
      }

      // Save via native API endpoint or repository layer
      const response = await fetch("/api/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: "Current Location",
          country: geo.country ?? "",
          state: geo.region ?? "",
          city: geo.city ?? geo.subregion ?? "",
          area: geo.district ?? "",
          street: geo.street ?? "",
          building: "",
          apartment: "",
          landmark: "",
          postalCode: geo.postalCode ?? "",
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          isDefault: true,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to save address.");
      }

      Alert.alert("Success", "Address added successfully.");
      await handleSuccess();
    } catch (error) {
      console.error("Location lookup error:", error);
      Alert.alert(
        "Location Error",
        error instanceof Error ? error.message : "Unable to add address using current location."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={resetAndClose}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.sheetContainer}>
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>Add Delivery Address</Text>
                <Text style={styles.subtitle}>
                  Choose how you&apos;d like to add your delivery address.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={resetAndClose}
                disabled={saving}
                activeOpacity={0.7}
              >
                <X size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              {method === "menu" && (
                <View style={styles.menuContainer}>
                  {/* Option 1: Current Location */}
                  <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => {
                      void handleCurrentLocation();
                    }}
                    disabled={saving}
                    activeOpacity={0.8}
                  >
                    <View style={styles.iconCircle}>
                      {saving ? (
                        <ActivityIndicator size="small" color={BRAND} />
                      ) : (
                        <MapPin size={22} color={BRAND} />
                      )}
                    </View>
                    <View style={styles.optionTextContainer}>
                      <Text style={styles.optionTitle}>Use Current Location</Text>
                      <Text style={styles.optionSubtitle}>
                        Detect your location automatically.
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* Option 2: Enter Manually */}
                  <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => setMethod("manual")}
                    disabled={saving}
                    activeOpacity={0.8}
                  >
                    <View style={styles.iconCircle}>
                      <PencilLine size={22} color={BRAND} />
                    </View>
                    <View style={styles.optionTextContainer}>
                      <Text style={styles.optionTitle}>Enter Manually</Text>
                      <Text style={styles.optionSubtitle}>
                        Type your address details manually.
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}

              {method === "manual" && (
                <ManualAddressForm
                  onSuccess={handleSuccess}
                  onCancel={() => setMethod("menu")}
                />
              )}
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
    alignItems: "flex-start",
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
  menuContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#f9fafb",
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#e6f4ed",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: BRAND_DARK,
  },
  optionSubtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
});