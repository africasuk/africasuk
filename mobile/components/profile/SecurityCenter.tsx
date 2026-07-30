import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ChevronRight,
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
  const router = useRouter();



  return (
    <View style={styles.card}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Security Center</Text>
        <Text style={styles.subtitle}>Protect your AfricaSuk account.</Text>
      </View>

      <View style={styles.content}>
        {/* Change Password Link */}
        <TouchableOpacity
          style={styles.navRow}
          activeOpacity={0.7}
          onPress={() => router.push("/account/security/password" as any)}
        >
          <View style={styles.navRowLeft}>
            <View style={styles.iconCircle}>
              <KeyRound size={20} color={BRAND} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.navRowTitle}>Change Password</Text>
              <Text style={styles.navRowSubtitle}>
                Update your account password.
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color="#9ca3af" />
        </TouchableOpacity>

        {/* Two-Factor Authentication Link */}
        <TouchableOpacity
          style={styles.navRow}
          activeOpacity={0.7}
          onPress={() => router.push("/account/security/2fa" as any)}
        >
          <View style={styles.navRowLeft}>
            <View style={styles.iconCircle}>
              <ShieldCheck size={20} color={BRAND} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.navRowTitle}>Two-Factor Authentication</Text>
              <Text style={styles.navRowSubtitle}>
                Add an extra layer of protection.
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color="#9ca3af" />
        </TouchableOpacity>

        {/* Active Devices Section */}
        <View style={styles.devicesCard}>
          <View style={styles.devicesHeader}>
            <Laptop size={20} color={BRAND} />
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
                    <Smartphone size={18} color={BRAND} style={styles.deviceIcon} />
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
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(229, 231, 235, 0.8)",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: BRAND_DARK,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "500",
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
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  navRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e6f4ed",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  navRowTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: BRAND_DARK,
  },
  navRowSubtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  devicesCard: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  devicesHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  devicesTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: BRAND_DARK,
  },
  devicesSubtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 1,
  },
  devicesList: {
    gap: 10,
  },
  emptyText: {
    fontSize: 12,
    color: "#6b7280",
    fontStyle: "italic",
  },
  deviceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#f3f4f6",
    borderRadius: 12,
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
    fontSize: 13,
    fontWeight: "700",
    color: "#1f2937",
  },
  deviceDetail: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 1,
  },
  deviceSubDetail: {
    fontSize: 10,
    color: "#9ca3af",
    marginTop: 1,
  },
  currentBadge: {
    backgroundColor: "#dcfce7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  currentBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#15803d",
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#fecaca",
    backgroundColor: "#fef2f2",
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 4,
  },
  disabledButton: {
    opacity: 0.6,
  },
  signOutButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#dc2626",
  },
});