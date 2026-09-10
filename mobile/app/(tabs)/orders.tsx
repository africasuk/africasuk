import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  RefreshControl,
} from "react-native";
import { Image } from "expo-image";
import { useRouter, Href } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ShoppingBag,
  ChevronRight,
  Package,
  AlertCircle,
  ArrowRight,
} from "lucide-react-native";

import { createClient } from "@/lib/auth/client";
import type { Order } from "@africasuk/types";
import { Price } from "@/components/currency/Price";

type OrderWithImage = Order & {
  image?: string | null;
  itemsCount?: number;
};

export default function OrdersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
        router.replace("/auth/login" as Href);
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
          itemsCount: order.order_items?.length ?? 0,
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

    let badgeContainerStyle = styles.badgeNeutral;
    let badgeTextStyle = styles.badgeTextNeutral;

    if (["PAID", "DELIVERED", "COMPLETED"].includes(formatted)) {
      badgeContainerStyle = styles.badgeSuccess;
      badgeTextStyle = styles.badgeTextSuccess;
    } else if (["CANCELLED", "FAILED", "REFUNDED"].includes(formatted)) {
      badgeContainerStyle = styles.badgeDanger;
      badgeTextStyle = styles.badgeTextDanger;
    } else if (["SHIPPED", "PROCESSING"].includes(formatted)) {
      badgeContainerStyle = styles.badgeActive;
      badgeTextStyle = styles.badgeTextActive;
    }

    return (
      <View style={[styles.badge, badgeContainerStyle]}>
        <Text style={[styles.badgeText, badgeTextStyle]}>{formatted}</Text>
      </View>
    );
  };

  const renderOrderItem = ({ item }: { item: OrderWithImage }) => {
    const formattedDate = new Date(item.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const displayOrderNumber =
      item.orderNumber ?? item.id.slice(0, 8).toUpperCase();

    return (
      <Pressable
        style={({ pressed }) => [
          styles.orderCard,
          pressed && styles.cardPressed,
        ]}
        onPress={() => router.push(`/account/order/${item.id}` as Href)}
      >
        {/* Top Header: Order ID + Status Badge */}
        <View style={styles.cardHeader}>
          <View style={styles.orderIdGroup}>
            <Package size={16} color="#71717a" strokeWidth={1.8} />
            <Text style={styles.orderNumber}>#{displayOrderNumber}</Text>
          </View>
          {renderStatusBadge(item.status)}
        </View>

        <View style={styles.cardDivider} />

        {/* Card Body */}
        <View style={styles.cardBody}>
          <View style={styles.orderInfo}>
            <View style={styles.imageWrapper}>
              {item.image ? (
                <Image
                  source={{ uri: item.image }}
                  style={styles.productImage}
                  contentFit="cover"
                  transition={150}
                  cachePolicy="memory-disk"
                />
              ) : (
                <View style={styles.imageFallback}>
                  <Package size={20} color="#a1a1aa" strokeWidth={1.5} />
                </View>
              )}
            </View>

            <View style={styles.orderMeta}>
              <Text style={styles.dateLabel}>{formattedDate}</Text>
              <Price price={item.total} style={styles.totalAmount} />
              {Boolean(item.itemsCount) && (
                <Text style={styles.itemCountText}>
                  {item.itemsCount} {item.itemsCount === 1 ? "item" : "items"}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.detailsTrigger}>
            <Text style={styles.detailsText}>Details</Text>
            <ChevronRight size={14} color="#71717a" strokeWidth={2} />
          </View>
        </View>
      </Pressable>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="small" color="#18181b" />
      </View>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centerContainer} edges={["top", "bottom"]}>
        <View style={styles.errorIconCircle}>
          <AlertCircle size={24} color="#dc2626" strokeWidth={1.8} />
        </View>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable
          style={({ pressed }) => [
            styles.retryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={fetchOrders}
        >
          <Text style={styles.retryText}>Try Again</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const bottomInset = insets.bottom > 0 ? insets.bottom : 16;

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: bottomInset + 32 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#18181b"
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Orders</Text>
            <Text style={styles.subtitle}>
              Track shipments, download receipts, and manage order history
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <ShoppingBag size={24} color="#71717a" strokeWidth={1.8} />
            </View>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptySubtitle}>
              When you place an order, its status and tracking details will appear here.
            </Text>
            <Pressable
              style={({ pressed }) => [
                styles.shopButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => router.push("/products" as Href)}
            >
              <Text style={styles.shopButtonText}>Explore Products</Text>
              <ArrowRight size={14} color="#ffffff" strokeWidth={2} />
            </Pressable>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 24,
    gap: 12,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
  },

  header: {
    marginBottom: 10,
    gap: 2,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#18181b",
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 13,
    color: "#71717a",
    letterSpacing: -0.1,
  },

  orderCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    padding: 14,
  },

  cardPressed: {
    backgroundColor: "#fafafa",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  orderIdGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  orderNumber: {
    fontSize: 13,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.2,
  },

  cardDivider: {
    height: 1,
    backgroundColor: "#f4f4f5",
    marginVertical: 12,
  },

  cardBody: {
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

  imageWrapper: {
    width: 60,
    height: 60,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },

  productImage: {
    width: "100%",
    height: "100%",
  },

  imageFallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  orderMeta: {
    justifyContent: "center",
    gap: 2,
  },

  dateLabel: {
    fontSize: 11,
    color: "#71717a",
    fontWeight: "500",
  },

  totalAmount: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.3,
  },

  itemCountText: {
    fontSize: 11,
    color: "#a1a1aa",
    fontWeight: "400",
  },

  detailsTrigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "#f4f4f5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e4e4e7",
  },

  detailsText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#52525b",
  },

  /* Badges */
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },

  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
  },

  badgeNeutral: {
    backgroundColor: "#f4f4f5",
    borderColor: "#e4e4e7",
  },

  badgeTextNeutral: {
    color: "#52525b",
  },

  badgeSuccess: {
    backgroundColor: "#f0fdf4",
    borderColor: "#dcfce7",
  },

  badgeTextSuccess: {
    color: "#15803d",
  },

  badgeActive: {
    backgroundColor: "#f4f4f5",
    borderColor: "#18181b",
  },

  badgeTextActive: {
    color: "#18181b",
  },

  badgeDanger: {
    backgroundColor: "#fef2f2",
    borderColor: "#fee2e2",
  },

  badgeTextDanger: {
    color: "#b91c1c",
  },

  /* Empty & Error States */
  emptyContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 44,
    paddingHorizontal: 24,
    marginTop: 8,
  },

  emptyIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.3,
  },

  emptySubtitle: {
    fontSize: 13,
    color: "#71717a",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 19,
    maxWidth: 260,
  },

  shopButton: {
    marginTop: 20,
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: "#18181b",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  shopButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: -0.1,
  },

  errorIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fee2e2",
    alignItems: "center",
    justifyContent: "center",
  },

  errorText: {
    fontSize: 13,
    color: "#71717a",
    textAlign: "center",
  },

  retryButton: {
    height: 40,
    paddingHorizontal: 16,
    backgroundColor: "#18181b",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  retryText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },

  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
});