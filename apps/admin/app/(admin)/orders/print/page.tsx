
import { redirect } from "next/navigation";
import Image from "next/image";
import { getOrders, getOrder } from "@/app/actions/orders";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import PrintOrdersButton from "@/components/orders/PrintOrdersButton";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "READY_FOR_PICKUP"
  | "IN_TRANSIT"
  | "AT_BORDER"
  | "AT_JUBA_WAREHOUSE"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";


interface Props {
  searchParams: Promise<{ status?: string }>;
}

const VALID_STATUSES: readonly OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "READY_FOR_PICKUP",
  "IN_TRANSIT",
  "AT_BORDER",
  "AT_JUBA_WAREHOUSE",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

const FULFILLMENT_STATUSES: readonly OrderStatus[] = [
  "READY_FOR_PICKUP",
  "IN_TRANSIT",
  "AT_BORDER",
  "AT_JUBA_WAREHOUSE",
  "OUT_FOR_DELIVERY",
];

const DEFAULT_STATUSES: readonly OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
];

function formatMoney(amount: number | string | null | undefined) {
  const value = Number(amount);
  const safeAmount = Number.isFinite(value) ? value : 0;

  return `$${safeAmount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getColour(variant: unknown): string {
  if (!variant || typeof variant !== "object") return "";

  const data = variant as Record<string, unknown>;

  const colourKey = Object.keys(data).find((key) =>
    /^(color|colour|colorname|colourname)$/i.test(key),
  );

  const value = colourKey ? data[colourKey] : undefined;

  return typeof value === "string" ? value : "";
}

export default async function PrintOrdersPage({ searchParams }: Props) {
  const { status: requestedStatus } = await searchParams;

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const orders = await getOrders();

  const isFulfillment = requestedStatus === "FULFILLMENT";

  const validStatus = VALID_STATUSES.find(
    (item) => item === requestedStatus,
  );

  const filteredOrders = orders.filter((order) => {
    if (isFulfillment) {
      return FULFILLMENT_STATUSES.includes(
        order.status as OrderStatus,
      );
    }

    if (validStatus) {
      return order.status === validStatus;
    }

    return DEFAULT_STATUSES.includes(order.status as OrderStatus);
  });

  // Fetch order details concurrently.
  const details = await Promise.all(
    filteredOrders.map((order) => getOrder(order.orderNumber)),
  );

  const printableOrders = details.filter(
    (detail): detail is NonNullable<typeof detail> => detail !== null,
  );

  const title = isFulfillment
    ? "FULFILLMENT ORDERS CHECKLIST"
    : validStatus
      ? `${validStatus.replaceAll("_", " ")} ORDERS`
      : "ACTIVE ORDERS CHECKLIST";

  return (
    <main className="print-page mx-auto w-full max-w-5xl p-4 sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold">Print Order Checklist</h1>
          <p className="text-sm text-muted-foreground">
            {printableOrders.length} orders
          </p>
        </div>

        <PrintOrdersButton />
      </div>

      <div className="print-area">
        <header className="print-header">
          <div>
            <h1 className="brand-title">Africa Suk</h1>
            <p className="document-title">{title}</p>
          </div>

          <p className="print-date">
            Date: {new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </header>

        {printableOrders.length === 0 && (
          <p className="empty-message">
            No orders found for this status.
          </p>
        )}

        {printableOrders.map(({ order, items }) => {
          const addressParts = [
            order.address,
            order.city,
            order.state,
            order.country,
            order.postalCode,
          ].filter(Boolean);

          const address = [...new Set(addressParts)].join(", ");

          return (
            <section key={order.id} className="print-order">
              <div className="order-content">
                <div className="customer-details">
                  <p className="customer-name">
                    {order.customerName}
                  </p>
                  <p>
                    Phone: {order.customerPhone || "Not provided"}
                  </p>
                  <p>Order: {order.orderNumber}</p>
                  <p>
                    Status: {order.status.replaceAll("_", " ")}
                  </p>
                  <p className="customer-address">
                    Address: {address || "Not provided"}
                  </p>
                  <p>
                    Tracking: {order.trackingNumber || "________________"}
                  </p>
                </div>

                <div className="order-items">
                  {items.map(({ item, variant }) => {
                    const colour = getColour(variant);
                    const unitPrice = Number(item.price) || 0;
                    const quantity = Number(item.quantity) || 0;

                    return (
                      <div key={item.id} className="product-row">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={42}
                            height={42}
                            unoptimized
                            className="product-image"
                          />
                        ) : (
                          <div
                            className="product-image"
                            aria-hidden="true"
                          />
                        )}

                        <div className="product-info">
                          <p className="product-name">{item.name}</p>
                          <p>Unit price: {formatMoney(unitPrice)}</p>
                          <p>
                            Qty: {quantity}
                            {colour ? ` · Colour: ${colour}` : ""}
                          </p>
                          <p>
                            Subtotal: {formatMoney(unitPrice * quantity)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="order-totals">
                  <div>
                    <span>Items subtotal</span>
                    <span>{formatMoney(order.subtotal)}</span>
                  </div>
                  <div>
                    <span>Shipping</span>
                    <span>
                      {formatMoney(
                        order.fulfillmentMethod === "PICKUP"
                          ? 0
                          : order.shipping,
                      )}
                    </span>
                  </div>
                  <div>
                    <span>Tax</span>
                    <span>{formatMoney(order.tax)}</span>
                  </div>
                  <div>
                    <span>Discount</span>
                    <span>-{formatMoney(order.discount)}</span>
                  </div>
                  <div className="grand-total">
                    <span>Total (USD)</span>
                    <span>{formatMoney(order.total)}</span>
                  </div>
                </div>
              </div>

              <div className="check-column">
                <span>Done</span>
                <div className="check-box" aria-label="Order completed checkbox" />
              </div>
            </section>
          );
        })}
      </div>

      <style>{`
        .print-page {
          box-sizing: border-box;
          width: 100%;
          color: var(--foreground);
        }

        .print-area {
          box-sizing: border-box;
          width: 100%;
          padding: 16px;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          background: var(--card);
          color: var(--card-foreground);
          font-family: Arial, Helvetica, sans-serif;
        }

        .print-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          padding-bottom: 8px;
          margin-bottom: 4px;
          border-bottom: 1px solid var(--border);
        }

        .brand-title {
          font-size: 20px;
          line-height: 1.2;
          font-weight: 700;
        }

        .document-title {
          margin-top: 3px;
          font-size: 11px;
          font-weight: 700;
        }

        .print-date {
          font-size: 10px;
        }

        .empty-message {
          padding: 24px 0;
          text-align: center;
          font-size: 12px;
        }

        .print-order {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 40px;
          gap: 10px;
          padding: 10px 0;
          border-bottom: 1px solid var(--border);
          font-size: 10px;
          line-height: 1.4;
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .order-content,
        .customer-details,
        .product-info {
          min-width: 0;
        }

        .customer-details,
        .customer-address,
        .product-info {
          overflow-wrap: anywhere;
        }

        .customer-name {
          font-size: 11px;
          font-weight: 700;
        }

        .order-items {
          display: grid;
          gap: 7px;
          margin-top: 7px;
        }

        .product-row {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
        }

        .product-image {
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          object-fit: contain;
          border: 1px solid var(--border);
          border-radius: 3px;
        }

        .product-name {
          font-weight: 600;
        }

        .order-totals {
          display: grid;
          gap: 3px;
          margin-top: 10px;
          padding-top: 7px;
          border-top: 1px solid var(--border);
        }

        .order-totals > div {
          display: flex;
          justify-content: space-between;
          gap: 12px;
        }

        .grand-total {
          margin-top: 4px;
          padding-top: 5px;
          border-top: 1px solid var(--border);
          font-weight: 700;
          font-size: 11px;
        }

        .check-column {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          font-size: 9px;
        }

        .check-box {
          width: 24px;
          height: 24px;
          box-sizing: border-box;
          border: 1.5px solid currentColor;
          background: transparent;
        }

        @page {
          size: A4 portrait;
          margin: 10mm;
        }

        @media print {
          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            width: auto !important;
            min-width: 0 !important;
            background: #fff !important;
            color: #000 !important;
          }

          body * {
            visibility: hidden !important;
          }

          .print-area,
          .print-area * {
            visibility: visible !important;
          }

          .print-page {
            display: block !important;
            position: static !important;
            box-sizing: border-box !important;
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            border: none !important;
            box-shadow: none !important;
            background: #fff !important;
            color: #000 !important;
          }

          .print-area {
            position: relative !important;
            display: block !important;
            box-sizing: border-box !important;
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            background: #fff !important;
            color: #000 !important;
          }

          .print-header {
            border-bottom: 1px solid #999 !important;
          }

          .print-order {
            grid-template-columns: minmax(0, 1fr) 40px !important;
            gap: 10px !important;
            border-bottom: 1px solid #ccc !important;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .product-image {
            border-color: #ddd !important;
          }

          .order-totals {
            border-color: #999 !important;
          }

          .grand-total {
            border-color: #999 !important;
          }

          .check-box {
            border: 1.5px solid #000 !important;
            background: #fff !important;
          }
        }
      `}</style>
    </main>
  );
}
