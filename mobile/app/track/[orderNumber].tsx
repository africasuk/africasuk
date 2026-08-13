import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter, Href } from "expo-router";
import {
  ChevronLeft,
  Clock,
  MapPin,
  PackageCheck,
  Truck,
  Globe2,
  Radio,
} from "lucide-react-native";

import type { Order } from "@africasuk/types";

import { createClient } from "@/lib/auth/client";
import TrackingMap from "@/components/tracking/TrackingMap";

const BRAND = "#005c2e";
const BRAND_DARK = "#002b15";

function formatStatus(status: string) {
  if (!status) return "Pending";
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function TrackOrderScreen() {
  const { orderNumber } = useLocalSearchParams<{ orderNumber: string }>();
  const router = useRouter();

  const [order, setOrder] = useState<(Order & Record<string, any>) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrackingDetails = useCallback(async () => {
    if (!orderNumber) return;

    try {
      setError(null);
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace(`/auth/login?redirect=/track/${orderNumber}` as Href);
        return;
      }

      const { data: fetchedOrder, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderNumber)
        .single();

      if (orderError || !fetchedOrder) {
        setError("Order tracking details not found.");
        return;
      }

      setOrder(fetchedOrder as Order & Record<string, any>);
    } catch (err) {
      console.error("Failed to load tracking info:", err);
      setError("Unable to load order tracking details.");
    } finally {
      setLoading(false);
    }
  }, [orderNumber, router]);

  useEffect(() => {
    fetchTrackingDetails();
  }, [fetchTrackingDetails]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={BRAND} />
      </SafeAreaView>
    );
  }

  if (error || !order) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>{error ?? "Order not found"}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            fetchTrackingDetails();
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const formattedStatus = formatStatus(order.status);
  const displayOrderNum = order.order_number ?? order.orderNumber ?? order.id.slice(0, 8);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Navigation & Order ID Badge - Sharp Borders */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => router.back()}
          >
            <ChevronLeft size={16} color={BRAND_DARK} />
            <Text style={styles.backButtonText}>Back to Order</Text>
          </TouchableOpacity>

          <View style={styles.orderBadge}>
            <Truck size={14} color={BRAND} />
            <Text style={styles.orderBadgeText}>Order #{displayOrderNum}</Text>
          </View>
        </View>

        {/* Hero Header Card - Sharp Borders & Unbolded Typography */}
        <View style={styles.heroCard}>
          <View style={styles.heroMainRow}>
            <View style={styles.iconContainer}>
              <PackageCheck size={22} color="#ffffff" />
            </View>

            <View style={styles.titleWrapper}>
              <View style={styles.titleRow}>
                <Text style={styles.pageTitle}>Track Order</Text>
                <View style={styles.liveTag}>
                  <Radio size={10} color="#059669" />
                  <Text style={styles.liveTagText}>Live Telemetry</Text>
                </View>
              </View>

              <Text style={styles.subtitle}>
                Real-time route tracking across regional logistics corridors.
              </Text>
            </View>
          </View>

          {/* Quick Metrics */}
          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <View style={styles.metricLabelRow}>
                <Clock size={12} color={BRAND} />
                <Text style={styles.metricLabel}>Current Status</Text>
              </View>
              <Text style={styles.metricValue}>{formattedStatus}</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={styles.metricLabelRow}>
                <MapPin size={12} color={BRAND} />
                <Text style={styles.metricLabel}>Corridor</Text>
              </View>
              <Text style={styles.metricValue}>Uganda → S. Sudan</Text>
            </View>
          </View>
        </View>

        {/* Map Section */}
        <View style={styles.mapSection}>
          <View style={styles.mapHeaderRow}>
            <View style={styles.mapHeaderLeft}>
              <Globe2 size={16} color={BRAND} />
              <Text style={styles.mapHeaderTitle}>Live Route Overview</Text>
            </View>
            <Text style={styles.syncText}>Auto-Sync Active</Text>
          </View>

          <TrackingMap status={order.status} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default TrackOrderScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f8fafc",
    paddingTop: 50,
  },
  errorText: {
    fontSize: 13,
    fontWeight: "400",
    color: "#dc2626",
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: BRAND_DARK,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 0, // Sharp corners
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "500", // Non-bold button text
    textTransform: "uppercase",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 0, // Sharp corners
  },
  backButtonText: {
    fontSize: 11,
    fontWeight: "500", // Non-bold text
    color: BRAND_DARK,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  orderBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 0, // Sharp corners
  },
  orderBadgeText: {
    fontSize: 11,
    fontWeight: "500", // Non-bold text
    color: BRAND,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  heroCard: {
    backgroundColor: "#ffffff",
    borderRadius: 0, // Sharp corners
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 20,
    marginBottom: 20,
  },
  heroMainRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 0, // Sharp corners
    backgroundColor: BRAND_DARK,
    justifyContent: "center",
    alignItems: "center",
  },
  titleWrapper: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: "500", // Clean regular title weight
    color: BRAND_DARK,
    textTransform: "uppercase",
    letterSpacing: 0.2,
  },
  liveTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 0, // Sharp corners
  },
  liveTagText: {
    fontSize: 9,
    fontWeight: "500", // Non-bold text
    color: BRAND,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "400",
    color: "#6b7280",
    marginTop: 4,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 0, // Sharp corners
    padding: 10,
  },
  metricLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: "500", // Non-bold label
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 11,
    fontWeight: "500", // Non-bold metric value
    color: BRAND_DARK,
    textTransform: "uppercase",
    marginTop: 4,
  },
  mapSection: {
    gap: 12,
  },
  mapHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  mapHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  mapHeaderTitle: {
    fontSize: 11,
    fontWeight: "500", // Non-bold header
    color: BRAND_DARK,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  syncText: {
    fontSize: 9,
    fontWeight: "500",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});