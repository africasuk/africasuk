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
              {request.phone || "No phone"}
            </Text>

            <Text style={styles.descriptionText}>
              {request.description || "No description"}
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
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>
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
    backgroundColor: "#f9fafb",
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
    borderBottomColor: "#f3f4f6",
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: 0.5,
  },
  placeholder: {
    width: 32,
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
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    padding: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 16,
  },
  cardContent: {
    flexDirection: "column",
    gap: 16,
  },
  imageWrapper: {
    height: 160,
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#f3f4f6",
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
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  descriptionText: {
    marginTop: 8,
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
  availableBanner: {
    marginTop: 16,
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    borderRadius: 12,
    padding: 16,
  },
  availableTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: BRAND_GREEN,
  },
  availableSubtitle: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "500",
    color: "#065f46",
    lineHeight: 18,
  },
  orderButton: {
    marginTop: 16,
    backgroundColor: BRAND_GREEN,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
  },
  orderButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
  statusBadgeWrapper: {
    marginTop: 16,
    alignItems: "flex-start",
  },
  statusBadge: {
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#d1fae5",
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: BRAND_GREEN,
    textTransform: "capitalize",
  },
  emptyContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
    textAlign: "center",
  },
});