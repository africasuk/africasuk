
import { redirect } from "next/navigation";
import Image from "next/image";
import { getOrders, getOrder } from "@/app/actions/orders";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import PrintOrdersButton from "@/components/orders/PrintOrdersButton";

type Props = {
  searchParams: Promise<{ status?: string }>;
};

const VALID_STATUSES = [
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
] as const;

export default async function PrintOrdersPage({ searchParams }: Props) {
  const { status } = await searchParams;

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const orders = await getOrders();

  const validStatus =
    status &&
    VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])
      ? status
      : null;

const filteredOrders = orders.filter((order) =>
  validStatus === "FULFILLMENT"
    ? [
        "READY_FOR_PICKUP",
        "IN_TRANSIT",
        "AT_BORDER",
        "AT_JUBA_WAREHOUSE",
        "OUT_FOR_DELIVERY",
      ].includes(order.status)
    : validStatus
      ? order.status === validStatus
      : [
          "PENDING",
          "PROCESSING",
          "IN_TRANSIT",
          "OUT_FOR_DELIVERY",
        ].includes(order.status),
);

  const details = await Promise.all(
    filteredOrders.map((order) => getOrder(order.orderNumber)),
  );

  const printableOrders = details.filter((detail) => detail !== null);

  const title = validStatus
    ? `${validStatus.replaceAll("_", " ")} ORDERS`
    : "ACTIVE ORDERS CHECKLIST";

  return (
    <main className="print-page mx-auto max-w-5xl p-6">
      <div className="mb-5 flex items-center justify-between gap-4 print:hidden">
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
          <p className="print-date">Date: __________________</p>
        </header>

        {printableOrders.length === 0 && (
          <p>No orders found for this status.</p>
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
                  <p className="customer-name">{order.customerName}</p>
                  <p>Phone: {order.customerPhone || "Not provided"}</p>
                  <p>Order: {order.orderNumber}</p>
                  <p className="customer-address">
                    Address: {address || "Not provided"}
                  </p>
                  <p>
                    Tracking: {order.trackingNumber || "________________"}
                  </p>
                </div>

                <div className="order-items">
                  {items.map(({ item, variant }) => {
                    const variantData = variant
                      ? JSON.stringify(variant)
                      : "";

                    const colour =
                      variantData.match(
                        /"(?:color|colour|colorName|colourName)"\s*:\s*"([^"]+)"/i,
                      )?.[1] ?? "";

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
                          <div className="product-image" />
                        )}

                        
                        
                        <div className="product-info">
                        <p className="product-name">{item.name}</p>
                        <p>
                            Unit price: ${item.price.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            })}
                        </p>
                        <p>
                            Qty: {item.quantity}
                            {colour ? ` · Colour: ${colour}` : ""}
                        </p>
                        <p>
                            Subtotal: ${(item.price * item.quantity).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            })}
                        </p>
                        </div>


                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="check-column">
                <span>Done</span>
                <div className="check-box" />
              </div>
            </section>
          );
        })}
      </div>

      <style>{`
        .print-page {
          box-sizing: border-box;
          width: 100%;
          max-width: 100%;
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
          align-items: end;
          justify-content: space-between;
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
          white-space: nowrap;
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
          gap: 5px;
          margin-top: 5px;
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
            background: white !important;
            color: black !important;
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
            background: white !important;
            color: black !important;
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
            background: white !important;
            color: black !important;
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

          .check-box {
            border: 1.5px solid black !important;
            background: white !important;
          }
        }
      `}</style>
    </main>
  );
}
