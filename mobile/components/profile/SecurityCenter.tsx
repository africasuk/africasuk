import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import * as Linking from "expo-linking";
import {
  ExternalLink,
  KeyRound,
  Laptop,
  ShieldCheck,
  Smartphone,
} from "lucide-react-native";

const BRAND = "#005c2e";
const BRAND_DARK = "#002b15";

export interface Device {
  id: string;
  name: string;
  location: string;
  lastSeen: string;
  current: boolean;
}

interface Props {
  devices: Device[];
  onRefresh?: () => void;
}

export default function SecurityCenter({ devices }: Props) {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  const handleChangePassword = async () => {
    const url = "https://www.africasuk.com/auth/forgot-password";
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "Unable to open password reset link.");
      }
    } catch (err) {
      Alert.alert("Error", "Could not launch web page.");
    }
  };

  const handleToggle2FA = (value: boolean) => {
    setIs2FAEnabled(value);
    Alert.alert(
      "Two-Factor Authentication",
      value
        ? "Temporary 2FA has been enabled for your account."
        : "Temporary 2FA has been disabled."
    );
  };

  return (
    <View style={styles.card}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Security Center</Text>
        <Text style={styles.subtitle}>Protect your AfricaSuk account.</Text>
      </View>

      <View style={styles.content}>
        {/* Change Password Link -> Opens Web URL */}
        <TouchableOpacity
          style={styles.navRow}
          activeOpacity={0.85}
          onPress={handleChangePassword}
        >
          <View style={styles.navRowLeft}>
            <View style={styles.iconSquare}>
              <KeyRound size={18} color={BRAND} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.navRowTitle}>Change Password</Text>
              <Text style={styles.navRowSubtitle}>
                Reset or update your account password on web.
              </Text>
            </View>
          </View>
          <ExternalLink size={18} color="#9ca3af" />
        </TouchableOpacity>

        {/* Two-Factor Authentication Toggle */}
        <View style={styles.navRow}>
          <View style={styles.navRowLeft}>
            <View style={styles.iconSquare}>
              <ShieldCheck size={18} color={BRAND} />
            </View>
            <View style={styles.textContainer}>
              <View style={styles.rowTitleContainer}>
                <Text style={styles.navRowTitle}>Two-Factor Authentication</Text>
                {is2FAEnabled && (
                  <View style={styles.active2faBadge}>
                    <Text style={styles.active2faBadgeText}>Active</Text>
                  </View>
                )}
              </View>
              <Text style={styles.navRowSubtitle}>
                Add an extra layer of protection.
              </Text>
            </View>
          </View>
          <Switch
            value={is2FAEnabled}
            onValueChange={handleToggle2FA}
            trackColor={{ false: "#e5e7eb", true: "#a7f3d0" }}
            thumbColor={is2FAEnabled ? BRAND : "#f3f4f6"}
          />
        </View>

        {/* Active Devices Section */}
        <View style={styles.devicesCard}>
          <View style={styles.devicesHeader}>
            <Laptop size={18} color={BRAND} />
            <View>
              <Text style={styles.devicesTitle}>Active Devices</Text>
              <Text style={styles.devicesSubtitle}>
                Devices currently signed in.
              </Text>
            </View>
          </View>

          <View style={styles.devicesList}>
            {devices.length === 0 ? (
              <Text style={styles.emptyText}>No active devices found.</Text>
            ) : (
              devices.map((device) => (
                <View key={device.id} style={styles.deviceRow}>
                  <View style={styles.deviceInfo}>
                    <Smartphone size={16} color={BRAND} style={styles.deviceIcon} />
                    <View style={styles.deviceTextContainer}>
                      <Text style={styles.deviceName}>{device.name}</Text>
                      <Text style={styles.deviceDetail}>{device.location}</Text>
                      <Text style={styles.deviceSubDetail}>
                        Last active: {device.lastSeen}
                      </Text>
                    </View>
                  </View>

                  {device.current && (
                    <View style={styles.currentBadge}>
                      <Text style={styles.currentBadgeText}>Current Device</Text>
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 0,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 18,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: BRAND_DARK,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "400",
    color: "#6b7280",
    marginTop: 2,
  },
  content: {
    gap: 12,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 0,
    padding: 14,
    backgroundColor: "#ffffff",
  },
  navRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 12,
  },
  iconSquare: {
    width: 36,
    height: 36,
    borderRadius: 0,
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  rowTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  navRowTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: BRAND_DARK,
  },
  navRowSubtitle: {
    fontSize: 11,
    fontWeight: "400",
    color: "#6b7280",
    marginTop: 2,
  },
  active2faBadge: {
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 0,
  },
  active2faBadgeText: {
    fontSize: 9,
    fontWeight: "500",
    color: BRAND,
    textTransform: "uppercase",
  },
  devicesCard: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 0,
    padding: 14,
    backgroundColor: "#ffffff",
  },
  devicesHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  devicesTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: BRAND_DARK,
  },
  devicesSubtitle: {
    fontSize: 11,
    fontWeight: "400",
    color: "#6b7280",
    marginTop: 1,
  },
  devicesList: {
    gap: 10,
  },
  emptyText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#6b7280",
    fontStyle: "italic",
  },
  deviceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 0,
    padding: 12,
    backgroundColor: "#f9fafb",
  },
  deviceInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    paddingRight: 8,
  },
  deviceIcon: {
    marginTop: 2,
    marginRight: 10,
  },
  deviceTextContainer: {
    flex: 1,
  },
  deviceName: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1f2937",
  },
  deviceDetail: {
    fontSize: 11,
    fontWeight: "400",
    color: "#6b7280",
    marginTop: 1,
  },
  deviceSubDetail: {
    fontSize: 10,
    fontWeight: "400",
    color: "#9ca3af",
    marginTop: 1,
  },
  currentBadge: {
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 0,
  },
  currentBadgeText: {
    fontSize: 9,
    fontWeight: "500",
    color: BRAND,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});