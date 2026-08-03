import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";
import { Image } from "expo-image";
import { useRouter, Href } from "expo-router";
import { ShoppingBag, ChevronRight, Package, AlertCircle } from "lucide-react-native";

import { createClient } from "@/lib/auth/client";
import type { Order } from "@africasuk/types";
import { Price } from "@/components/currency/Price";

const BRAND_LIGHT = "#008744";
const BRAND_DARK = "#002b15";
const LIGHT_GREEN = "#ecfdf5";

// Extend Order type interface locally if not yet updated in @africasuk/types package
type OrderWithImage = Order & {
  image?: string | null;
};

export default function OrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setError(null);

      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/auth/login");
        return;
      }

const { data, error } = await supabase
  .from("orders")
  .select(`
    *,
    order_items (
      image
    )
  `)
  .eq("user_id", user.id)
  .order("created_at", { ascending: false });

if (error) throw error;

setOrders(
  (data ?? []).map((order: any) => ({
    ...order,
    image: order.order_items?.[0]?.image ?? null,
  }))
);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Unable to load orders. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const renderStatusBadge = (status: string) => {
    const formatted = status.toUpperCase();
    let badgeStyle = styles.badgePending;
    let textStyle = styles.badgeTextPending;

    if (["PAID", "DELIVERED", "COMPLETED"].includes(formatted)) {
      badgeStyle = styles.badgeSuccess;
      textStyle = styles.badgeTextSuccess;
    } else if (["CANCELLED", "FAILED", "REFUNDED"].includes(formatted)) {
      badgeStyle = styles.badgeError;
      textStyle = styles.badgeTextError;
    } else if (["SHIPPED", "PROCESSING"].includes(formatted)) {
      badgeStyle = styles.badgeInfo;
      textStyle = styles.badgeTextInfo;
    }

    return (
      <View style={[styles.badge, badgeStyle]}>
        <Text style={[styles.badgeText, textStyle]}>{formatted}</Text>
      </View>
    );
  };

  const renderOrderItem = ({ item }: { item: OrderWithImage }) => {
    const formattedDate = new Date(item.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return (
      <Pressable
        style={({ pressed }) => [
          styles.orderCard,
          pressed && styles.cardPressed,
        ]}
        onPress={() =>
          router.push(`/account/order/${item.id}` as Href)
        }
      >
        <View style={styles.cardHeader}>
          <View style={styles.orderIdGroup}>
            <Package size={18} color={BRAND_LIGHT} />
            <Text style={styles.orderNumber}>
              Order #{item.orderNumber ?? item.id.slice(0, 8)}
            </Text>
          </View>
          {renderStatusBadge(item.status)}
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.cardFooter}>
          <View style={styles.orderInfo}>
            <Image
              source={{
                uri:
                  item.image ??
                  "https://placehold.co/80x80?text=No+Image",
              }}
              style={styles.productImage}
              contentFit="cover"
              transition={200}
            />

            <View style={styles.orderMeta}>
              <Text style={styles.dateLabel}>Placed on {formattedDate}</Text>
              <Price price={item.total} style={styles.totalAmount} />
            </View>
          </View>

          <View style={styles.detailsTrigger}>
            <Text style={styles.detailsText}>Details</Text>
            <ChevronRight size={16} color={BRAND_LIGHT} />
          </View>
        </View>
      </Pressable>
    );
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={BRAND_LIGHT} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <AlertCircle size={40} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={fetchOrders}>
          <Text style={styles.retryText}>Try Again</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={BRAND_LIGHT}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Your Orders</Text>
            <Text style={styles.subtitle}>
              Track and manage your order history
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <ShoppingBag size={32} color={BRAND_LIGHT} />
            </View>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptySubtitle}>
              When you place an order, it will appear here.
            </Text>
            <Pressable
              style={styles.shopButton}
              onPress={() => router.push("/" as Href)}
            >
              <Text style={styles.shopButtonText}>Start Shopping</Text>
            </Pressable>
          </View>
        }
      />
    </SafeAreaView>
  );
}

type Styles = {
  container: ViewStyle;
  centerContainer: ViewStyle;
  listContent: ViewStyle;
  header: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  orderCard: ViewStyle;
  cardPressed: ViewStyle;
  cardHeader: ViewStyle;
  orderIdGroup: ViewStyle;
  orderNumber: TextStyle;
  cardDivider: ViewStyle;
  cardFooter: ViewStyle;
  orderInfo: ViewStyle;
  orderMeta: ViewStyle;
  productImage: ImageStyle;
  dateLabel: TextStyle;
  totalAmount: TextStyle;
  detailsTrigger: ViewStyle;
  detailsText: TextStyle;
  badge: ViewStyle;
  badgeText: TextStyle;
  badgePending: ViewStyle;
  badgeTextPending: TextStyle;
  badgeSuccess: ViewStyle;
  badgeTextSuccess: TextStyle;
  badgeError: ViewStyle;
  badgeTextError: TextStyle;
  badgeInfo: ViewStyle;
  badgeTextInfo: TextStyle;
  emptyContainer: ViewStyle;
  emptyIconCircle: ViewStyle;
  emptyTitle: TextStyle;
  emptySubtitle: TextStyle;
  shopButton: ViewStyle;
  shopButtonText: TextStyle;
  errorText: TextStyle;
  retryButton: ViewStyle;
  retryText: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingTop: 60,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: 24,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: BRAND_DARK,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  orderCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(229, 231, 235, 0.8)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderIdGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: "800",
    color: BRAND_DARK,
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#f3f4f6",
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  orderMeta: {
    justifyContent: "center",
  },
  productImage: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  dateLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  totalAmount: {
    fontSize: 15,
    fontWeight: "800",
    color: BRAND_DARK,
    marginTop: 2,
  },
  detailsTrigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingLeft: 8,
  },
  detailsText: {
    fontSize: 13,
    fontWeight: "800",
    color: BRAND_LIGHT,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  badgePending: {
    backgroundColor: "#fef3c7",
  },
  badgeTextPending: {
    color: "#d97706",
  },
  badgeSuccess: {
    backgroundColor: LIGHT_GREEN,
    borderWidth: 1,
    borderColor: "#a7f3d0",
  },
  badgeTextSuccess: {
    color: BRAND_DARK,
  },
  badgeError: {
    backgroundColor: "#fee2e2",
  },
  badgeTextError: {
    color: "#dc2626",
  },
  badgeInfo: {
    backgroundColor: "#e0f2fe",
  },
  badgeTextInfo: {
    color: "#0284c7",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: LIGHT_GREEN,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#a7f3d0",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: BRAND_DARK,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 20,
  },
  shopButton: {
    backgroundColor: BRAND_LIGHT,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  shopButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 14,
  },
  errorText: {
    fontSize: 14,
    color: "#374151",
    marginTop: 12,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: BRAND_LIGHT,
    borderRadius: 8,
  },
  retryText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 13,
  },
});