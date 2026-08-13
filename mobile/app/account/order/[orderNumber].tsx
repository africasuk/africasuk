import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Image,
  ViewStyle,
  TextStyle,
  ImageStyle,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter, Href } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  Package,
  Truck,
  ArrowRight,
  MapPin,
  CreditCard,
  Clock,
  AlertCircle,
} from "lucide-react-native";

import { createClient } from "@/lib/auth/client";
import type { Order } from "@africasuk/types";
import { Price } from "@/components/currency/Price";
import { ReviewForm } from "@/components/products/ReviewForm";

const BRAND = "#005c2e";
const BRAND_LIGHT = "#008744";
const BRAND_DARK = "#111827";

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

// Raw row directly from order_items table before hydration
type RawOrderItem = Omit<OrderItemRow, "product" | "variant">;

export default function OrderDetailsScreen() {
  const { orderNumber } = useLocalSearchParams<{ orderNumber: string }>();
  const router = useRouter();

  // Explicitly typed to support Supabase snake_case & type safe Order interface
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
        router.replace(`/auth/login?redirect=/account/orders/${orderNumber}` as Href);
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

      // 1. Fetch raw order items
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

      // 2. Hydrate product details
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

      // 3. Hydrate variant details
      const variantIds = Array.from(
        new Set(
          rawItems
            .map((item) => item.variant_id)
            .filter(Boolean)
        )
      );

      let variantsMap: Record<string, any> = {};

      if (variantIds.length > 0) {
        const { data: variantsData, error: variantsError } =
          await supabase
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

      // 4. Build hydrated order items
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
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={BRAND} />
      </SafeAreaView>
    );
  }

  if (error || !order) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <AlertCircle size={40} color="#ef4444" />
        <Text style={styles.errorText}>{error || "Order not found."}</Text>
        <Pressable style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryText}>Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  // Safe field extractions
  const rawDate = order.created_at ?? order.createdAt;
  const formattedDate = rawDate
    ? new Date(rawDate).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "N/A";

  const paymentStatus = order.payment_status ?? order.paymentStatus ?? "PENDING";
  const paymentMethod = order.payment_method ?? order.paymentMethod ?? "CREDIT CARD";
  const customerName = order.customer_name ?? order.customerName ?? order.shipping_name ?? "N/A";
  const customerPhone = order.customer_phone ?? order.customerPhone ?? order.shipping_phone;
  const postalCode = order.postal_code ?? order.postalCode;
  const deliveryStart = order.estimated_delivery_start ?? order.estimatedDeliveryStart;
  const deliveryEnd = order.estimated_delivery_end ?? order.estimatedDeliveryEnd;
  const deliveryUpdated = order.estimated_delivery_updated_at ?? order.estimatedDeliveryUpdatedAt;

  const isDelivered = (order.status ?? "").toUpperCase() === "DELIVERED";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          {/* Header Module */}
          <View style={styles.card}>
            <Text style={styles.orderTitle}>
              Order #{order.order_number ?? order.orderNumber ?? order.id.slice(0, 8)}
            </Text>
            <Text style={styles.orderDate}>Placed on {formattedDate}</Text>

            <View style={styles.headerDivider} />

            <View style={styles.headerMetaRow}>
              <View style={styles.metaGroup}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Status:</Text>
                  <View style={styles.statusChip}>
                    <Text style={styles.statusChipText}>{order.status}</Text>
                  </View>
                </View>

                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Payment:</Text>
                  <View style={styles.paymentChip}>
                    <Text style={styles.paymentChipText}>{paymentStatus}</Text>
                  </View>
                </View>
              </View>

              <Pressable
                    onPress={() => {
                      const orderNumber =
                        order.order_number ?? order.orderNumber ?? order.id;

                      Linking.openURL(
                        `https://www.africasuk.com/track/${orderNumber}`
                      );
                    }}
                    style={styles.trackButtonContainer}
                  >
                <LinearGradient
                  colors={[BRAND_LIGHT, BRAND_DARK]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.trackButton}
                >
                  <Text style={styles.trackButtonText}>Track Order</Text>
                  <ArrowRight size={16} color="#ffffff" />
                </LinearGradient>
              </Pressable>
            </View>
          </View>

          {/* Delivery Address & Financial Summary */}
          <View style={styles.grid}>
            <View style={styles.card}>
              <View style={styles.cardHeaderWithIcon}>
                <MapPin size={16} color={BRAND} />
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
                {postalCode && (
                  <Text style={styles.postalText}>{postalCode}</Text>
                )}
              </View>

              {customerPhone && (
                <View style={styles.phoneContainer}>
                  <Text style={styles.phoneLabel}>Phone: </Text>
                  <Text style={styles.phoneValue}>{customerPhone}</Text>
                </View>
              )}
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeaderWithIcon}>
                <CreditCard size={16} color={BRAND} />
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
                  <Text style={styles.summaryLabel}>Tax</Text>
                  <Price price={order.tax} style={styles.summaryValue} />
                </View>

                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total Charged</Text>
                  <Price price={order.total} style={styles.totalValue} />
                </View>

                <View style={styles.methodRow}>
                  <Text style={styles.metaLabel}>Method</Text>
                  <View style={styles.methodChip}>
                    <Text style={styles.methodChipText}>{paymentMethod}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Delivery Estimation Card */}
          <View style={styles.card}>
            <View style={styles.cardHeaderWithIcon}>
              <Truck size={16} color={BRAND} />
              <Text style={styles.cardHeading}>Estimated Arrival</Text>
            </View>

            {deliveryStart && deliveryEnd ? (
              <>
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
                  Delivery estimates may change depending on supplier
                  availability, customs clearance, and local transit schedules.
                </Text>

                {deliveryUpdated && (
                  <View style={styles.updateTimeRow}>
                    <Clock size={12} color="#9ca3af" />
                    <Text style={styles.updateTimeText}>
                      Updated{" "}
                      {new Date(deliveryUpdated).toLocaleDateString(
                        undefined,
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <View style={styles.awaitingRow}>
                <View style={styles.pulseDot} />
                <Text style={styles.awaitingText}>
                  Awaiting fulfillment confirmation.
                </Text>
              </View>
            )}
          </View>

          {/* Order Items & Reviews */}
          <View style={styles.card}>
            <View style={styles.cardHeaderWithIcon}>
              <Package size={16} color={BRAND} />
              <Text style={styles.cardHeading}>
                Order Items ({items.length})
              </Text>
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
                    {/* Main Row: Image, Info & Price */}
                    <View style={styles.itemMainRow}>
                      <View style={styles.itemImageContainer}>
                        {item.image ? (
                          <Image
                            source={{ uri: item.image }}
                            style={styles.itemImage}
                          />
                        ) : (
                          <Text style={styles.noImageText}>No Image</Text>
                        )}
                      </View>

                      <View style={styles.itemDetails}>
                        <Text style={styles.itemName}>
                          {item.product?.name ?? item.name}
                        </Text>

                        <View style={styles.itemTagsRow}>
                          {/* Brand */}
                          {item.product?.brand?.name && (
                            <View style={styles.brandTag}>
                              <Text style={styles.brandTagText}>
                                {item.product.brand.name}
                              </Text>
                            </View>
                          )}

                          {/* Category */}
                          {item.product?.category?.name && (
                            <View style={styles.categoryTag}>
                              <Text style={styles.categoryTagText}>
                                {item.product.category.name}
                              </Text>
                            </View>
                          )}
                        </View>

                        {/* Variant */}
                        {item.variant?.optionName && (
                          <View style={styles.variantTag}>
                            <Text style={styles.variantTagText}>
                              {item.variant.optionName}: {item.variant.optionValue}
                            </Text>
                          </View>
                        )}

                        <View style={styles.itemQtyPriceRow}>
                          <Text style={styles.itemQtyText}>
                            Qty: <Text style={styles.boldText}>{item.quantity}</Text>
                          </Text>

                          <Price price={item.price} style={styles.itemUnitText} />
                        </View>
                      </View>

                      <View style={styles.itemTotalContainer}>
                        <Text style={styles.itemTotalLabel}>Item Total</Text>
                        <Price
                          price={item.price * item.quantity}
                          style={styles.itemTotalValue}
                        />
                      </View>
                    </View>

                    {/* Dedicated Full-Width Review Form (Only for Delivered Orders) */}
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

type Styles = {
  container: ViewStyle;
  centerContainer: ViewStyle;
  scrollContent: ViewStyle;
  contentWrapper: ViewStyle;
  card: ViewStyle;
  orderTitle: TextStyle;
  orderDate: TextStyle;
  headerDivider: ViewStyle;
  headerMetaRow: ViewStyle;
  metaGroup: ViewStyle;
  metaItem: ViewStyle;
  metaLabel: TextStyle;
  statusChip: ViewStyle;
  statusChipText: TextStyle;
  paymentChip: ViewStyle;
  paymentChipText: TextStyle;
  trackButtonContainer: ViewStyle;
  trackButton: ViewStyle;
  trackButtonText: TextStyle;
  grid: ViewStyle;
  cardHeaderWithIcon: ViewStyle;
  cardHeading: TextStyle;
  addressBody: ViewStyle;
  customerName: TextStyle;
  addressText: TextStyle;
  countryText: TextStyle;
  postalText: TextStyle;
  phoneContainer: ViewStyle;
  phoneLabel: TextStyle;
  phoneValue: TextStyle;
  summaryList: ViewStyle;
  summaryRow: ViewStyle;
  summaryLabel: TextStyle;
  summaryValue: TextStyle;
  totalRow: ViewStyle;
  totalLabel: TextStyle;
  totalValue: TextStyle;
  methodRow: ViewStyle;
  methodChip: ViewStyle;
  methodChipText: TextStyle;
  deliveryDateRange: TextStyle;
  deliverySubtext: TextStyle;
  updateTimeRow: ViewStyle;
  updateTimeText: TextStyle;
  awaitingRow: ViewStyle;
  pulseDot: ViewStyle;
  awaitingText: TextStyle;
  itemsList: ViewStyle;
  itemContainer: ViewStyle;
  itemBorderBottom: ViewStyle;
  itemMainRow: ViewStyle;
  itemImageContainer: ViewStyle;
  itemImage: ImageStyle;
  noImageText: TextStyle;
  itemDetails: ViewStyle;
  itemName: TextStyle;
  itemTagsRow: ViewStyle;
  brandTag: ViewStyle;
  brandTagText: TextStyle;
  categoryTag: ViewStyle;
  categoryTagText: TextStyle;
  variantTag: ViewStyle;
  variantTagText: TextStyle;
  itemQtyPriceRow: ViewStyle;
  itemQtyText: TextStyle;
  itemUnitText: TextStyle;
  boldText: TextStyle;
  itemTotalContainer: ViewStyle;
  itemTotalLabel: TextStyle;
  itemTotalValue: TextStyle;
  errorText: TextStyle;
  retryButton: ViewStyle;
  retryText: TextStyle;
  reviewFormWrapper: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: 24,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  contentWrapper: {
    maxWidth: 700,
    width: "100%",
    alignSelf: "center",
    gap: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 0,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 20,
  },
  orderTitle: {
    fontSize: 20,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.2,
    color: BRAND_DARK,
  },
  orderDate: {
    fontSize: 13,
    fontWeight: "400",
    color: "#6b7280",
    marginTop: 4,
  },
  headerDivider: {
    height: 1,
    backgroundColor: "#f3f4f6",
    marginVertical: 16,
  },
  headerMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  metaGroup: {
    gap: 6,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statusChip: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: "500",
    textTransform: "uppercase",
    color: BRAND_DARK,
  },
  paymentChip: {
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: "#a7f3d0",
  },
  paymentChipText: {
    fontSize: 11,
    fontWeight: "500",
    textTransform: "uppercase",
    color: "#047857",
  },
  trackButtonContainer: {
    borderRadius: 0,
    overflow: "hidden",
  },
  trackButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 0,
  },
  trackButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  grid: {
    gap: 16,
  },
  cardHeaderWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  cardHeading: {
    fontSize: 11,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: BRAND_DARK,
  },
  addressBody: {
    gap: 2,
  },
  customerName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 4,
  },
  addressText: {
    fontSize: 13,
    fontWeight: "400",
    color: "#4b5563",
  },
  countryText: {
    fontSize: 11,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#6b7280",
    marginTop: 2,
  },
  postalText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#9ca3af",
  },
  phoneContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    paddingTop: 10,
    flexDirection: "row",
  },
  phoneLabel: {
    fontSize: 12,
    fontWeight: "400",
    color: "#6b7280",
  },
  phoneValue: {
    fontSize: 12,
    fontWeight: "500",
    color: "#111827",
  },
  summaryList: {
    gap: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: "400",
    color: "#4b5563",
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#111827",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    paddingTop: 10,
    marginTop: 2,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: BRAND_DARK,
  },
  totalValue: {
    fontSize: 15,
    fontWeight: "500",
    color: BRAND_DARK,
  },
  methodRow: {
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  methodChip: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  methodChipText: {
    fontSize: 11,
    fontWeight: "500",
    textTransform: "uppercase",
    color: BRAND_DARK,
  },
  deliveryDateRange: {
    fontSize: 16,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.2,
    color: BRAND_DARK,
  },
  deliverySubtext: {
    fontSize: 12,
    fontWeight: "400",
    color: "#6b7280",
    marginTop: 6,
    lineHeight: 18,
  },
  updateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  updateTimeText: {
    fontSize: 10,
    fontWeight: "400",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#9ca3af",
  },
  awaitingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 0,
    backgroundColor: "#f59e0b",
  },
  awaitingText: {
    fontSize: 13,
    fontWeight: "400",
    color: "#6b7280",
  },
  itemsList: {
    gap: 16,
  },
  itemContainer: {
    paddingBottom: 16,
  },
  itemBorderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  itemMainRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  itemImageContainer: {
    width: 72,
    height: 72,
    borderRadius: 0,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  itemImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  noImageText: {
    fontSize: 9,
    fontWeight: "400",
    color: "#9ca3af",
    textTransform: "uppercase",
  },
  itemDetails: {
    flex: 1,
    gap: 4,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "500",
    color: BRAND_DARK,
  },
  itemTagsRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  brandTag: {
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: "#a7f3d0",
  },
  brandTagText: {
    fontSize: 9,
    fontWeight: "500",
    textTransform: "uppercase",
    color: "#047857",
  },
  categoryTag: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  categoryTagText: {
    fontSize: 9,
    fontWeight: "500",
    textTransform: "uppercase",
    color: "#4b5563",
  },
  variantTag: {
    alignSelf: "flex-start",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  variantTagText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#374151",
  },
  itemQtyPriceRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 2,
  },
  itemQtyText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#6b7280",
  },
  itemUnitText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#6b7280",
  },
  boldText: {
    fontWeight: "500",
    color: "#111827",
  },
  itemTotalContainer: {
    alignItems: "flex-end",
  },
  itemTotalLabel: {
    fontSize: 9,
    fontWeight: "400",
    textTransform: "uppercase",
    color: "#9ca3af",
  },
  itemTotalValue: {
    fontSize: 13,
    fontWeight: "500",
    color: BRAND_DARK,
    marginTop: 2,
  },
  reviewFormWrapper: {
    width: "100%",
    marginTop: 12,
  },
  errorText: {
    fontSize: 13,
    fontWeight: "400",
    color: "#374151",
    marginTop: 12,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: BRAND,
    borderRadius: 0,
  },
  retryText: {
    color: "#ffffff",
    fontWeight: "500",
    fontSize: 13,
  },
});