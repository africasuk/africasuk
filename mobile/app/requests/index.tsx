import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { createClient } from "@/lib/auth/client";

const supabase = createClient();

const BRAND_GREEN = "#004d26";

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
        return { bg: "#ecfdf5", border: "#a7f3d0", text: "#047857" };
      case "sourcing":
        return { bg: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8" };
      case "unavailable":
        return { bg: "#fef2f2", border: "#fecaca", text: "#b91c1c" };
      case "pending":
      default:
        return { bg: "#f3f4f6", border: "#e5e7eb", text: "#374151" };
    }
  };

  const statusStyle = getStatusBadgeStyle(request.status);

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: request.image_url }}
            style={styles.image}
            contentFit="cover"
          />
        </View>

        <View style={styles.cardDetails}>
          <View>
            <Text style={styles.phoneText}>
              {request.phone || "No phone provided"}
            </Text>

            <Text style={styles.descriptionText}>
              {request.description || "No description provided."}
            </Text>
          </View>

          {request.status === "available" ? (
            <View style={styles.availableBanner}>
              <Text style={styles.availableTitle}>
                🎉 Your requested product is ready!
              </Text>

              <Text style={styles.availableSubtitle}>
                We found the product you requested. Click below to order.
              </Text>

              {!!request.product_link && (
                <TouchableOpacity
                  style={styles.orderButton}
                  activeOpacity={0.8}
                  onPress={() => Linking.openURL(request.product_link!)}
                >
                  <Text style={styles.orderButtonText}>
                    🛒 Click to Order
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.statusBadgeWrapper}>
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
                  {request.status ?? "pending"}
                </Text>
              </View>
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
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MY PRODUCT REQUESTS</Text>
        <View style={styles.placeholder} />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={BRAND_GREEN} />
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RequestCard request={item} />}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[BRAND_GREEN]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                You haven&apos;t submitted any product requests yet.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "500", // Non-bold clean header
    color: "#111827",
    letterSpacing: 0.5,
  },
  placeholder: {
    width: 28,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 0, // Sharp corners
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
    marginBottom: 16,
  },
  cardContent: {
    flexDirection: "column",
    gap: 14,
  },
  imageWrapper: {
    height: 160,
    width: "100%",
    borderRadius: 0, // Sharp corners
    overflow: "hidden",
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  cardDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  phoneText: {
    fontSize: 14,
    fontWeight: "500", // Clean regular weight
    color: "#111827",
  },
  descriptionText: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "400",
    color: "#4b5563",
    lineHeight: 18,
  },
  availableBanner: {
    marginTop: 14,
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    borderRadius: 0, // Sharp corners
    padding: 14,
  },
  availableTitle: {
    fontSize: 14,
    fontWeight: "500", // Clean weight
    color: BRAND_GREEN,
  },
  availableSubtitle: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "400",
    color: "#065f46",
    lineHeight: 16,
  },
  orderButton: {
    marginTop: 12,
    backgroundColor: BRAND_GREEN,
    borderRadius: 0, // Sharp corners
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
  },
  orderButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "500", // Clean button text weight
  },
  statusBadgeWrapper: {
    marginTop: 12,
    alignItems: "flex-start",
  },
  statusBadge: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 0, // Sharp corners
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  emptyContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 0, // Sharp corners
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  emptyText: {
    fontSize: 13,
    fontWeight: "400",
    color: "#6b7280",
    textAlign: "center",
  },
});