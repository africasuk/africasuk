import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter, Href } from "expo-router";
import {
  Package,
  Truck,
  MapPin,
  CreditCard,
  Clock,
  AlertCircle,
  ArrowLeft,
  ExternalLink,
} from "lucide-react-native";

import { createClient } from "@/lib/auth/client";
import type { Order } from "@africasuk/types";
import { Price } from "@/components/currency/Price";
import { ReviewForm } from "@/components/products/ReviewForm";
import * as WebBrowser from "expo-web-browser";

type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string | null;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
  product?: {
    name: string;
    brand?: { name: string } | null;
    category?: { name: string } | null;
  } | null;
  variant?: {
    optionName?: string;
    optionValue?: string;
  } | null;
};

type RawOrderItem = Omit<OrderItemRow, "product" | "variant">;

export default function OrderDetailsScreen() {
  const { orderNumber } = useLocalSearchParams<{ orderNumber: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [order, setOrder] = useState<(Order & Record<string, any>) | null>(null);
  const [items, setItems] = useState<OrderItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetails = useCallback(async () => {
    if (!orderNumber) return;

    try {
      setError(null);
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace(
          `/auth/login?redirect=/account/orders/${orderNumber}` as Href
        );
        return;
      }

      const { data, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderNumber)
        .single();

      if (orderError || !data) {
        setError("Order not found.");
        return;
      }

      const fetchedOrder = data as Order & Record<string, any>;
      setOrder(fetchedOrder);

      const { data: rawItemsData, error: itemsError } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", fetchedOrder.id);

      if (itemsError) {
        console.error("Failed to fetch order items:", itemsError);
        setError("Could not load items for this order.");
        return;
      }

      const rawItems = (rawItemsData as RawOrderItem[]) ?? [];

      if (rawItems.length === 0) {
        setItems([]);
        return;
      }

      const productIds = Array.from(
        new Set(rawItems.map((i) => i.product_id).filter(Boolean))
      );

      let productsMap: Record<string, any> = {};

      if (productIds.length > 0) {
        const { data: productsData } = await supabase
          .from("products")
          .select("id, name, brand:brands(name), category:categories(name)")
          .in("id", productIds);

        if (productsData) {
          productsMap = (productsData as any[]).reduce((acc, p) => {
            acc[p.id] = p;
            return acc;
          }, {} as Record<string, any>);
        }
      }

      const variantIds = Array.from(
        new Set(
          rawItems
            .map((item) => item.variant_id)
            .filter(Boolean)
        )
      );

      let variantsMap: Record<string, any> = {};

      if (variantIds.length > 0) {
        const { data: variantsData, error: variantsError } = await supabase
          .from("product_variants")
          .select("id, option_name, option_value")
          .in("id", variantIds);

        if (variantsError) {
          console.error("Failed to fetch variants:", variantsError);
        }

        if (variantsData) {
          variantsMap = (variantsData as any[]).reduce((acc, variant) => {
            acc[variant.id] = variant;
            return acc;
          }, {} as Record<string, any>);
        }
      }

      const hydratedItems: OrderItemRow[] = rawItems.map((item) => ({
        ...item,
        product: item.product_id
          ? productsMap[item.product_id] ?? null
          : null,
        variant: item.variant_id
          ? {
              optionName: variantsMap[item.variant_id]?.option_name,
              optionValue: variantsMap[item.variant_id]?.option_value,
            }
          : null,
      }));

      setItems(hydratedItems);
    } catch (err) {
      console.error("Failed to load order details:", err);
      setError("Unable to load order details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [orderNumber, router]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="small" color="#18181b" />
      </View>
    );
  }

  if (error || !order) {
    return (
      <SafeAreaView style={styles.centerContainer} edges={["top", "bottom"]}>
        <View style={styles.errorIconCircle}>
          <AlertCircle size={24} color="#dc2626" strokeWidth={1.8} />
        </View>
        <Text style={styles.errorText}>{error || "Order not found."}</Text>
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.back()}
        >
          <Text style={styles.primaryButtonText}>Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const rawDate = order.created_at ?? order.createdAt;
  const formattedDate = rawDate
    ? new Date(rawDate).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "N/A";

  const paymentStatus = (
    order.payment_status ??
    order.paymentStatus ??
    "PENDING"
  ).toUpperCase();

  const paymentMethod =
    order.payment_method ?? order.paymentMethod ?? "Credit Card";
  const customerName =
    order.customer_name ?? order.customerName ?? order.shipping_name ?? "N/A";
  const customerPhone =
    order.customer_phone ?? order.customerPhone ?? order.shipping_phone;
  const postalCode = order.postal_code ?? order.postalCode;
  const deliveryStart =
    order.estimated_delivery_start ?? order.estimatedDeliveryStart;
  const deliveryEnd =
    order.estimated_delivery_end ?? order.estimatedDeliveryEnd;
  const deliveryUpdated =
    order.estimated_delivery_updated_at ?? order.estimatedDeliveryUpdatedAt;

  const isDelivered = (order.status ?? "").toUpperCase() === "DELIVERED";
  const displayOrderNum =
    order.order_number ?? order.orderNumber ?? order.id.slice(0, 8).toUpperCase();

  const bottomInset = insets.bottom > 0 ? insets.bottom : 16;

  const renderStatusBadge = (status: string) => {
    const s = (status ?? "").toUpperCase();
    let isSuccess = ["PAID", "DELIVERED", "COMPLETED"].includes(s);
    let isDanger = ["CANCELLED", "FAILED", "REFUNDED"].includes(s);

    return (
      <View
        style={[
          styles.badge,
          isSuccess && styles.badgeSuccess,
          isDanger && styles.badgeDanger,
        ]}
      >
        <Text
          style={[
            styles.badgeText,
            isSuccess && styles.badgeTextSuccess,
            isDanger && styles.badgeTextDanger,
          ]}
        >
          {s}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <Pressable
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.iconButtonPressed,
          ]}
          onPress={() => router.back()}
          hitSlop={8}
        >
          <ArrowLeft size={18} color="#18181b" strokeWidth={2} />
        </Pressable>

        <Text style={styles.topBarTitle} numberOfLines={1}>
          Order Details
        </Text>

        <View style={styles.topBarSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomInset + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          {/* Header Card */}
          <View style={styles.card}>
            <View style={styles.orderHeaderTop}>
              <View style={styles.orderTitleGroup}>
                <View style={styles.iconTile}>
                  <Package size={16} color="#18181b" strokeWidth={1.8} />
                </View>
                <View>
                  <Text style={styles.orderTitle}>Order #{displayOrderNum}</Text>
                  <Text style={styles.orderDate}>Placed on {formattedDate}</Text>
                </View>
              </View>

           <Pressable
                style={({ pressed }) => [
                  styles.trackButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={async () => {
                  const trackingId =
                    order?.order_number ??
                    order?.orderNumber ??
                    order?.id;

                  if (!trackingId) {
                    Alert.alert("Tracking Unavailable", "Tracking information is not available for this order.");
                    return;
                  }

                  const url = `https://africasuk.com/track/${trackingId}`;

                  try {
                    await WebBrowser.openBrowserAsync(url);
                  } catch (error) {
                    console.error("Failed to open tracking URL:", error);
                    Alert.alert(
                      "Unable to Open",
                      "We couldn't open the tracking page. Please try again."
                    );
                  }
                }}
              >
                <Text style={styles.trackButtonText}>Track</Text>
                <ExternalLink size={12} color="#ffffff" strokeWidth={2} />
              </Pressable>
            </View>

            <View style={styles.divider} />

            <View style={styles.orderHeaderMeta}>
              <View style={styles.metaCol}>
                <Text style={styles.metaLabel}>Fulfillment Status</Text>
                {renderStatusBadge(order.status)}
              </View>

              <View style={styles.metaCol}>
                <Text style={styles.metaLabel}>Payment Status</Text>
                {renderStatusBadge(paymentStatus)}
              </View>
            </View>
          </View>

          {/* Delivery Estimation Card */}
          <View style={styles.card}>
            <View style={styles.cardHeaderWithIcon}>
              <View style={styles.iconTile}>
                <Truck size={14} color="#18181b" strokeWidth={1.8} />
              </View>
              <Text style={styles.cardHeading}>Estimated Arrival</Text>
            </View>

            {deliveryStart && deliveryEnd ? (
              <View style={styles.deliveryInfo}>
                <Text style={styles.deliveryDateRange}>
                  {new Date(deliveryStart).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  —{" "}
                  {new Date(deliveryEnd).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </Text>
                <Text style={styles.deliverySubtext}>
                  Delivery estimates may fluctuate depending on customs inspection
                  and regional carrier dispatch times.
                </Text>

                {deliveryUpdated && (
                  <View style={styles.updateTimeRow}>
                    <Clock size={12} color="#71717a" strokeWidth={1.8} />
                    <Text style={styles.updateTimeText}>
                      Updated{" "}
                      {new Date(deliveryUpdated).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.awaitingBox}>
                <View style={styles.pulseDot} />
                <Text style={styles.awaitingText}>
                  Awaiting courier fulfillment confirmation.
                </Text>
              </View>
            )}
          </View>

          {/* Delivery Address & Financial Summary */}
          <View style={styles.grid}>
            {/* Delivery Address */}
            <View style={styles.card}>
              <View style={styles.cardHeaderWithIcon}>
                <View style={styles.iconTile}>
                  <MapPin size={14} color="#18181b" strokeWidth={1.8} />
                </View>
                <Text style={styles.cardHeading}>Delivery Address</Text>
              </View>

              <View style={styles.addressBody}>
                <Text style={styles.customerName}>{customerName}</Text>
                <Text style={styles.addressText}>{order.address}</Text>
                <Text style={styles.addressText}>
                  {order.city}
                  {order.state ? `, ${order.state}` : ""}
                </Text>
                <Text style={styles.countryText}>{order.country}</Text>
                {Boolean(postalCode) && (
                  <Text style={styles.postalText}>{postalCode}</Text>
                )}
              </View>

              {Boolean(customerPhone) && (
                <View style={styles.phoneContainer}>
                  <Text style={styles.phoneLabel}>Phone: </Text>
                  <Text style={styles.phoneValue}>{customerPhone}</Text>
                </View>
              )}
            </View>

            {/* Payment Summary */}
            <View style={styles.card}>
              <View style={styles.cardHeaderWithIcon}>
                <View style={styles.iconTile}>
                  <CreditCard size={14} color="#18181b" strokeWidth={1.8} />
                </View>
                <Text style={styles.cardHeading}>Payment Summary</Text>
              </View>

              <View style={styles.summaryList}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Price price={order.subtotal} style={styles.summaryValue} />
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Shipping Fee</Text>
                  <Price price={order.shipping} style={styles.summaryValue} />
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Estimated Tax</Text>
                  <Price price={order.tax} style={styles.summaryValue} />
                </View>

                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total Payable</Text>
                  <Price price={order.total} style={styles.totalValue} />
                </View>

                <View style={styles.methodRow}>
                  <Text style={styles.metaLabel}>Payment Method</Text>
                  <View style={styles.methodChip}>
                    <Text style={styles.methodChipText}>{paymentMethod}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Order Items */}
          <View style={styles.card}>
            <View style={styles.cardHeaderWithIcon}>
              <View style={styles.iconTile}>
                <Package size={14} color="#18181b" strokeWidth={1.8} />
              </View>
              <Text style={styles.cardHeading}>Items Ordered ({items.length})</Text>
            </View>

            <View style={styles.itemsList}>
              {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                  <View
                    key={item.id}
                    style={[
                      styles.itemContainer,
                      !isLast && styles.itemBorderBottom,
                    ]}
                  >
                    <View style={styles.itemMainRow}>
                      <View style={styles.itemImageContainer}>
                        {item.image ? (
                          <Image
                            source={{ uri: item.image }}
                            style={styles.itemImage}
                            contentFit="cover"
                            transition={150}
                            cachePolicy="memory-disk"
                          />
                        ) : (
                          <View style={styles.fallbackBox}>
                            <Package size={16} color="#a1a1aa" strokeWidth={1.8} />
                          </View>
                        )}
                      </View>

                      <View style={styles.itemDetails}>
                        <Text style={styles.itemName} numberOfLines={2}>
                          {item.product?.name ?? item.name}
                        </Text>

                        <View style={styles.itemTagsRow}>
                          {item.product?.brand?.name && (
                            <View style={styles.neutralTag}>
                              <Text style={styles.neutralTagText}>
                                {item.product.brand.name}
                              </Text>
                            </View>
                          )}

                          {item.product?.category?.name && (
                            <View style={styles.neutralTag}>
                              <Text style={styles.neutralTagText}>
                                {item.product.category.name}
                              </Text>
                            </View>
                          )}

                          {item.variant?.optionName && (
                            <View style={styles.neutralTag}>
                              <Text style={styles.neutralTagText}>
                                {item.variant.optionName}: {item.variant.optionValue}
                              </Text>
                            </View>
                          )}
                        </View>

                        <View style={styles.itemQtyPriceRow}>
                          <Text style={styles.itemQtyText}>
                            Qty: <Text style={styles.boldText}>{item.quantity}</Text>
                          </Text>
                          <Price price={item.price} style={styles.itemUnitText} />
                        </View>
                      </View>

                      <View style={styles.itemTotalContainer}>
                        <Text style={styles.itemTotalLabel}>Total</Text>
                        <Price
                          price={item.price * item.quantity}
                          style={styles.itemTotalValue}
                        />
                      </View>
                    </View>

                    {/* Dedicated Review Form when delivered */}
                    {isDelivered && (
                      <View style={styles.reviewFormWrapper}>
                        <ReviewForm
                          productId={item.product_id}
                          orderId={order.id}
                          orderItemId={item.id}
                          variantId={item.variant_id}
                        />
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
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

  iconButtonPressed: {
    backgroundColor: "#e4e4e7",
  },

  topBarTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.2,
  },

  topBarSpacer: {
    width: 34,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  contentWrapper: {
    maxWidth: 700,
    width: "100%",
    alignSelf: "center",
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

  orderHeaderTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  orderTitleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },

  iconTile: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    justifyContent: "center",
    alignItems: "center",
  },

  orderTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.3,
  },

  orderDate: {
    fontSize: 12,
    color: "#71717a",
    marginTop: 1,
  },

  trackButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#18181b",
    paddingHorizontal: 12,
    height: 32,
    borderRadius: 8,
  },

  trackButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: -0.1,
  },

  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },

  divider: {
    height: 1,
    backgroundColor: "#f4f4f5",
  },

  orderHeaderMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  metaCol: {
    gap: 4,
  },

  metaLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#71717a",
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
  },

  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#52525b",
    letterSpacing: 0.4,
  },

  badgeSuccess: {
    backgroundColor: "#f0fdf4",
    borderColor: "#dcfce7",
  },

  badgeTextSuccess: {
    color: "#15803d",
  },

  badgeDanger: {
    backgroundColor: "#fef2f2",
    borderColor: "#fee2e2",
  },

  badgeTextDanger: {
    color: "#b91c1c",
  },

  grid: {
    gap: 12,
  },

  cardHeaderWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  cardHeading: {
    fontSize: 12,
    fontWeight: "700",
    color: "#18181b",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  deliveryInfo: {
    gap: 6,
  },

  deliveryDateRange: {
    fontSize: 14,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.2,
  },

  deliverySubtext: {
    fontSize: 12,
    color: "#71717a",
    lineHeight: 17,
  },

  updateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },

  updateTimeText: {
    fontSize: 11,
    color: "#71717a",
  },

  awaitingBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fafafa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    padding: 10,
  },

  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#71717a",
  },

  awaitingText: {
    fontSize: 12,
    color: "#71717a",
  },

  addressBody: {
    gap: 2,
  },

  customerName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#18181b",
  },

  addressText: {
    fontSize: 12,
    color: "#71717a",
  },

  countryText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#52525b",
    marginTop: 2,
  },

  postalText: {
    fontSize: 11,
    color: "#a1a1aa",
  },

  phoneContainer: {
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#f4f4f5",
    paddingTop: 8,
    flexDirection: "row",
  },

  phoneLabel: {
    fontSize: 12,
    color: "#71717a",
  },

  phoneValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#18181b",
  },

  summaryList: {
    gap: 8,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  summaryLabel: {
    fontSize: 13,
    color: "#71717a",
  },

  summaryValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#18181b",
  },

  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#f4f4f5",
    paddingTop: 8,
    marginTop: 2,
  },

  totalLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#18181b",
  },

  totalValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#18181b",
    letterSpacing: -0.3,
  },

  methodRow: {
    borderTopWidth: 1,
    borderTopColor: "#f4f4f5",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  methodChip: {
    backgroundColor: "#f4f4f5",
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e4e4e7",
  },

  methodChipText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#27272a",
  },

  itemsList: {
    gap: 12,
  },

  itemContainer: {
    paddingBottom: 12,
  },

  itemBorderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5",
  },

  itemMainRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },

  itemImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#f0f0f0",
    overflow: "hidden",
  },

  itemImage: {
    width: "100%",
    height: "100%",
  },

  fallbackBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  itemDetails: {
    flex: 1,
    gap: 3,
  },

  itemName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#18181b",
    lineHeight: 18,
    letterSpacing: -0.1,
  },

  itemTagsRow: {
    flexDirection: "row",
    gap: 4,
    flexWrap: "wrap",
    marginTop: 1,
  },

  neutralTag: {
    backgroundColor: "#f4f4f5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#e4e4e7",
  },

  neutralTagText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#52525b",
  },

  itemQtyPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 2,
  },

  itemQtyText: {
    fontSize: 12,
    color: "#71717a",
  },

  itemUnitText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#71717a",
  },

  boldText: {
    fontWeight: "700",
    color: "#18181b",
  },

  itemTotalContainer: {
    alignItems: "flex-end",
    gap: 2,
  },

  itemTotalLabel: {
    fontSize: 10,
    color: "#a1a1aa",
    fontWeight: "500",
  },

  itemTotalValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.2,
  },

  reviewFormWrapper: {
    width: "100%",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f4f4f5",
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

  primaryButton: {
    height: 40,
    paddingHorizontal: 16,
    backgroundColor: "#18181b",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: -0.1,
  },
});