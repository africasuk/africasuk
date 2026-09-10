import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, ExternalLink, Inbox } from "lucide-react-native";
import { createClient } from "@/lib/auth/client";

const supabase = createClient();

export interface ProductRequest {
  id: string;
  phone: string;
  description: string;
  image_url: string;
  status: "pending" | "sourcing" | "available" | "unavailable";
  product_link: string | null;
  created_at?: string;
}

function RequestCard({ request }: { request: ProductRequest }) {
  if (!request) return null;

  const getStatusBadgeStyle = (status: ProductRequest["status"]) => {
    switch (status) {
      case "available":
        return {
          bg: "#f0fdf4",
          border: "#dcfce7",
          text: "#15803d",
          label: "AVAILABLE",
        };
      case "sourcing":
        return {
          bg: "#eff6ff",
          border: "#dbeafe",
          text: "#1d4ed8",
          label: "SOURCING",
        };
      case "unavailable":
        return {
          bg: "#fef2f2",
          border: "#fee2e2",
          text: "#b91c1c",
          label: "UNAVAILABLE",
        };
      case "pending":
      default:
        return {
          bg: "#f4f4f5",
          border: "#e4e4e7",
          text: "#52525b",
          label: "PENDING REVIEW",
        };
    }
  };

  const statusStyle = getStatusBadgeStyle(request.status);

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        {/* Preview Image */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: request.image_url }}
            style={styles.image}
            contentFit="cover"
            transition={150}
            cachePolicy="memory-disk"
          />
        </View>

        {/* Request Details */}
        <View style={styles.cardDetails}>
          <View style={styles.detailHeader}>
            <View style={styles.phoneGroup}>
              <Text style={styles.phoneLabel}>Contact Number</Text>
              <Text style={styles.phoneText}>
                {request.phone || "No phone provided"}
              </Text>
            </View>

            {/* Non-available status badge */}
            {request.status !== "available" && (
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: statusStyle.bg,
                    borderColor: statusStyle.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    { color: statusStyle.text },
                  ]}
                >
                  {statusStyle.label}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionLabel}>Product Specification</Text>
            <Text style={styles.descriptionText}>
              {request.description || "No description provided."}
            </Text>
          </View>

          {/* Available Ready Callout */}
          {request.status === "available" && (
            <View style={styles.availableBanner}>
              <View style={styles.availableHeader}>
                <View style={styles.availableBadge}>
                  <Text style={styles.availableBadgeText}>SOURCED</Text>
                </View>
                <Text style={styles.availableTitle}>Product is ready</Text>
              </View>

              <Text style={styles.availableSubtitle}>
                We successfully matched this product with our suppliers. You can now place an order directly.
              </Text>

              {Boolean(request.product_link) && (
                <Pressable
                  style={({ pressed }) => [
                    styles.orderButton,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={() => Linking.openURL(request.product_link!)}
                >
                  <Text style={styles.orderButtonText}>View & Purchase</Text>
                  <ExternalLink size={13} color="#ffffff" strokeWidth={2} />
                </Pressable>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

export default function MyRequestsScreen() {
  const router = useRouter();
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRequests = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/auth/login");
        return;
      }

      const user = session.user;

      const { data, error } = await supabase
        .from("product_requests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests((data as ProductRequest[]) || []);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRequests();
  }, [fetchRequests]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Top Bar Navigation */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.buttonPressed,
          ]}
          hitSlop={8}
        >
          <ArrowLeft size={18} color="#18181b" strokeWidth={2} />
        </Pressable>

        <Text style={styles.topBarTitle}>My Requests</Text>
        <View style={styles.iconButtonSpacer} />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="small" color="#18181b" />
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RequestCard request={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#18181b"
              colors={["#18181b"]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Inbox size={22} color="#71717a" strokeWidth={1.8} />
              </View>
              <Text style={styles.emptyTitle}>No requests submitted</Text>
              <Text style={styles.emptyText}>
                When you request custom or out-of-stock items, you can track their sourcing status right here.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  topBar: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5",
    backgroundColor: "#ffffff",
  },

  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    alignItems: "center",
    justifyContent: "center",
  },

  iconButtonSpacer: {
    width: 34,
  },

  topBarTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.2,
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  listContent: {
    padding: 16,
    gap: 12,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    padding: 14,
    gap: 12,
  },

  cardContent: {
    gap: 12,
  },

  imageWrapper: {
    height: 180,
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  cardDetails: {
    gap: 10,
  },

  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  phoneGroup: {
    gap: 2,
  },

  phoneLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#71717a",
  },

  phoneText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#18181b",
  },

  statusBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },

  statusBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
  },

  descriptionBox: {
    gap: 4,
    backgroundColor: "#fafafa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f4f4f5",
    padding: 10,
  },

  descriptionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#71717a",
  },

  descriptionText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#27272a",
    lineHeight: 17,
  },

  availableBanner: {
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#dcfce7",
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },

  availableHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  availableBadge: {
    backgroundColor: "#dcfce7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  availableBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#15803d",
    letterSpacing: 0.5,
  },

  availableTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#15803d",
    letterSpacing: -0.1,
  },

  availableSubtitle: {
    fontSize: 12,
    color: "#166534",
    lineHeight: 16,
  },

  orderButton: {
    backgroundColor: "#18181b",
    borderRadius: 8,
    paddingVertical: 9,
    paddingHorizontal: 14,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },

  orderButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: -0.1,
  },

  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },

  emptyContainer: {
    backgroundColor: "#fafafa",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    paddingVertical: 36,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    gap: 6,
  },

  emptyIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.2,
  },

  emptyText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#71717a",
    textAlign: "center",
    lineHeight: 17,
    maxWidth: 280,
  },
});