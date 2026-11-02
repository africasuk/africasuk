
import { redirect } from "next/navigation";

import { getOrders, getOrder } from "@/app/actions/orders";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import OrderAnalytics from "@/components/orders/OrderAnalytics";

type ProductAnalytics = {
  name: string;
  quantity: number;
  revenue: number;
  image: string | null;
};

export default async function OrdersAnalyticsPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch orders
  const orders = await getOrders();

  // Fetch order details
  const details = await Promise.all(
    orders.map((order) => getOrder(order.orderNumber))
  );

  const validDetails = details.filter(
    (detail): detail is NonNullable<typeof detail> =>
      detail !== null
  );

  // Order groups
  const delivered = orders.filter(
    (order) => order.status === "DELIVERED"
  );

  const paid = orders.filter(
    (order) => order.paymentStatus === "PAID"
  );

  // Revenue collected
  const totalRevenue = paid.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  // Delivered sales value
  const deliveredValue = delivered.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  // Outstanding payments
  const outstanding = delivered
    .filter((order) => order.paymentStatus !== "PAID")
    .reduce(
      (sum, order) => sum + Number(order.total || 0),
      0
    );

  // Product analytics
  const productMap = new Map<string, ProductAnalytics>();

  for (const detail of validDetails) {
    // Only count delivered products
    if (detail.order.status !== "DELIVERED") continue;

    for (const { item } of detail.items) {
      const name = item.name;
      const quantity = Number(item.quantity) || 0;
      const revenue =
        (Number(item.price) || 0) * quantity;

      // Get actual image stored in order_items.image
      const image = item.image ?? null;

      const existing = productMap.get(name) || {
        name,
        quantity: 0,
        revenue: 0,
        image,
      };

      existing.quantity += quantity;
      existing.revenue += revenue;

      // Use an available image if the first order has none
      if (!existing.image && image) {
        existing.image = image;
      }

      productMap.set(name, existing);
    }
  }

  // Top 10 products
  const topProducts = Array.from(productMap.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);

  // Last 30 days
  const now = new Date();

  const dailySales = Array.from(
    { length: 30 },
    (_, index) => {
      const date = new Date(now);

      date.setDate(now.getDate() - (29 - index));
      date.setHours(0, 0, 0, 0);

      return {
        date: date.toISOString().slice(0, 10),
        orders: 0,
        revenue: 0,
      };
    }
  );

  const dailyMap = new Map(
    dailySales.map((day) => [day.date, day])
  );

  // Count all orders, revenue only from paid orders
  for (const order of orders) {
    const key = new Date(order.createdAt)
      .toISOString()
      .slice(0, 10);

    const day = dailyMap.get(key);

    if (!day) continue;

    day.orders += 1;

    if (order.paymentStatus === "PAID") {
      day.revenue += Number(order.total) || 0;
    }
  }

  // Order breakdowns
  const statusMap = new Map<string, number>();
  const paymentMap = new Map<string, number>();
  const fulfillmentMap = new Map<string, number>();

  for (const order of orders) {
    statusMap.set(
      order.status,
      (statusMap.get(order.status) || 0) + 1
    );

    paymentMap.set(
      order.paymentStatus,
      (paymentMap.get(order.paymentStatus) || 0) + 1
    );

    fulfillmentMap.set(
      order.fulfillmentMethod,
      (fulfillmentMap.get(order.fulfillmentMethod) || 0) + 1
    );
  }

  // Convert maps into chart data
  const toChartData = (map: Map<string, number>) =>
    Array.from(map.entries()).map(([name, value]) => ({
      name: name.replaceAll("_", " "),
      value,
    }));

  // Render analytics
  return (
    <OrderAnalytics
      data={{
        totalOrders: orders.length,
        deliveredOrders: delivered.length,
        paidOrders: paid.length,

        totalRevenue,
        deliveredValue,
        outstanding,

        averageOrderValue:
          paid.length > 0
            ? totalRevenue / paid.length
            : 0,

        topProducts,
        dailySales,

        statusData: toChartData(statusMap),
        paymentData: toChartData(paymentMap),
        fulfillmentData: toChartData(fulfillmentMap),
      }}
    />
  );
}
