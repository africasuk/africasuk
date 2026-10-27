
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Search,
  Users,
  ShoppingBag,
  UserX,
  Repeat2,
  ChevronDown,
  ChevronUp,
  Phone,
  MessageCircle,
  Mail,
  Package,
} from "lucide-react";

type Profile = {
  id: string;
  user_id: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: string | null;
  created_at: string | null;
};

type OrderItem = {
  id: string;
  name: string | null;
  image: string | null;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  user_id: string | null;
  order_number: string;
  status: string;
  total: number;
  currency: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  created_at: string;
  order_items: OrderItem[] | null;
};

type Customer = {
  key: string;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  joinedAt: string | null;
  orders: Order[];
};

type Filter = "all" | "with-orders" | "without-orders" | "repeat";

const money = (amount: number, currency?: string | null) =>
  `${currency || "USD"} ${Number(amount || 0).toLocaleString()}`;

const date = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

const phoneDigits = (phone: string) => phone.replace(/\D/g, "");

export default function CustomersTable({
  profiles,
  orders,
}: {
  profiles: Profile[];
  orders: Order[];
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const customers = useMemo(() => {
    const map = new Map<string, Customer>();

    const getKey = (userId?: string | null, email?: string | null, phone?: string | null) => {
      if (userId) return `user:${userId}`;
      if (email?.trim()) return `email:${email.trim().toLowerCase()}`;
      if (phone?.trim()) return `phone:${phone.replace(/\D/g, "")}`;
      return null;
    };

    for (const profile of profiles) {
      const key = getKey(
        profile.user_id || profile.id,
        profile.email,
        profile.phone
      );

      if (!key) continue;

      map.set(key, {
        key,
        name: profile.full_name || "Unnamed customer",
        email: profile.email || "",
        phone: profile.phone || "",
        avatar: profile.avatar_url,
        joinedAt: profile.created_at,
        orders: [],
      });
    }

    for (const order of orders) {
      const key = getKey(
        order.user_id,
        order.customer_email,
        order.customer_phone
      );

      if (!key) continue;

      let customer = map.get(key);

      // Match guest orders to an existing registered customer
      // when their email or phone matches.
      if (!customer && order.customer_email) {
        const emailKey = `email:${order.customer_email.trim().toLowerCase()}`;
        customer = map.get(emailKey);
      }

      if (!customer && order.customer_phone) {
        const phoneKey = `phone:${phoneDigits(order.customer_phone)}`;
        customer = map.get(phoneKey);
      }

      if (!customer) {
        customer = {
          key,
          name: order.customer_name || "Guest customer",
          email: order.customer_email || "",
          phone: order.customer_phone || "",
          avatar: null,
          joinedAt: null,
          orders: [],
        };
        map.set(key, customer);
      }

      if (!customer.email && order.customer_email) {
        customer.email = order.customer_email;
      }

      if (!customer.phone && order.customer_phone) {
        customer.phone = order.customer_phone;
      }

      if (
        customer.name === "Unnamed customer" &&
        order.customer_name
      ) {
        customer.name = order.customer_name;
      }

      customer.orders.push(order);
    }

    return Array.from(map.values()).map((customer) => ({
      ...customer,
      orders: [...customer.orders].sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      ),
    }));
  }, [profiles, orders]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesSearch =
        !query ||
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query) ||
        customer.orders.some((order) =>
          order.order_number.toLowerCase().includes(query)
        );

      const count = customer.orders.length;

      const matchesFilter =
        filter === "all" ||
        (filter === "with-orders" && count > 0) ||
        (filter === "without-orders" && count === 0) ||
        (filter === "repeat" && count > 1);

      return matchesSearch && matchesFilter;
    });
  }, [customers, search, filter]);

  const stats = [
    {
      label: "All customers",
      value: customers.length,
      filter: "all" as Filter,
      icon: Users,
    },
    {
      label: "With orders",
      value: customers.filter((c) => c.orders.length > 0).length,
      filter: "with-orders" as Filter,
      icon: ShoppingBag,
    },
    {
      label: "No orders",
      value: customers.filter((c) => c.orders.length === 0).length,
      filter: "without-orders" as Filter,
      icon: UserX,
    },
    {
      label: "Repeat customers",
      value: customers.filter((c) => c.orders.length > 1).length,
      filter: "repeat" as Filter,
      icon: Repeat2,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stats.map(({ label, value, filter: target, icon: Icon }) => (
          <button
            key={label}
            onClick={() => setFilter(target)}
            className={`rounded-xl border p-4 text-left transition hover:border-primary/50 ${
              filter === target
                ? "border-primary bg-primary/5"
                : "border-border bg-card"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-muted-foreground">{label}</span>
              <Icon className="size-5 text-muted-foreground" />
            </div>
            <p className="mt-3 text-2xl font-semibold">{value}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, email, phone or order..."
            className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value as Filter)}
          className="h-11 rounded-lg border border-border bg-background px-3 text-sm"
          aria-label="Filter customers"
        >
          <option value="all">All customers</option>
          <option value="with-orders">Customers with orders</option>
          <option value="without-orders">Customers without orders</option>
          <option value="repeat">Repeat customers</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="font-semibold">Customer directory</h2>
          <span className="text-sm text-muted-foreground">
            {filtered.length} customers
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-3 font-medium">No customers found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try another search or filter.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((customer) => {
              const isExpanded = expanded === customer.key;
              const count = customer.orders.length;
              const latestOrder = customer.orders[0];
              const totalSpent = customer.orders.reduce(
                (sum, order) => sum + Number(order.total || 0),
                0
              );
              const currency = latestOrder?.currency;

              return (
                <div key={customer.key}>
                  <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      {customer.avatar ? (
                        <Image
                          src={customer.avatar}
                          alt=""
                          width={44}
                          height={44}
                          unoptimized
                          className="size-11 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted font-semibold">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate font-medium">{customer.name}</p>
                        <p className="truncate text-sm text-muted-foreground">
                          {customer.email || "No email provided"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {customer.phone || "No phone provided"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 lg:w-64">
                      <div>
                        <p className="text-xs text-muted-foreground">Orders</p>
                        <p className="mt-1 font-semibold">{count}</p>
                        <p className="text-xs text-muted-foreground">
                          {count > 1 ? "Repeat customer" : count === 1 ? "First order" : "No orders"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Total order value
                        </p>
                        <p className="mt-1 font-semibold">
                          {money(totalSpent, currency)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Joined {date(customer.joinedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {customer.phone && (
                        <>
                          <a
                            href={`tel:${customer.phone}`}
                            title="Call customer"
                            aria-label={`Call ${customer.name}`}
                            className="inline-flex size-9 items-center justify-center rounded-lg border border-border hover:bg-muted"
                          >
                            <Phone className="size-4" />
                          </a>
                          <a
                            href={`https://wa.me/${phoneDigits(customer.phone)}`}
                            target="_blank"
                            rel="noreferrer"
                            title="WhatsApp customer"
                            aria-label={`WhatsApp ${customer.name}`}
                            className="inline-flex size-9 items-center justify-center rounded-lg border border-border hover:bg-muted"
                          >
                            <MessageCircle className="size-4" />
                          </a>
                        </>
                      )}

                      {customer.email && (
                        <a
                          href={`mailto:${customer.email}`}
                          title="Email customer"
                          aria-label={`Email ${customer.name}`}
                          className="inline-flex size-9 items-center justify-center rounded-lg border border-border hover:bg-muted"
                        >
                          <Mail className="size-4" />
                        </a>
                      )}

                      <button
                        onClick={() =>
                          setExpanded(isExpanded ? null : customer.key)
                        }
                        className="inline-flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-sm hover:bg-muted"
                      >
                        Orders
                        {isExpanded ? (
                          <ChevronUp className="size-4" />
                        ) : (
                          <ChevronDown className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-border bg-muted/30 p-4">
                      <h3 className="mb-3 font-semibold">Order history</h3>

                      {count === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          This customer has not placed any orders yet.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {customer.orders.map((order) => (
                            <div
                              key={order.id}
                              className="rounded-lg border border-border bg-card p-3"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                  <p className="font-medium">
                                    {order.order_number}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {date(order.created_at)}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold">
                                    {money(Number(order.total), order.currency)}
                                  </p>
                                  <span className="text-xs text-muted-foreground">
                                    {order.status.replaceAll("_", " ")}
                                  </span>
                                </div>
                              </div>

                              <div className="mt-3 space-y-2">
                                {(order.order_items ?? []).map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-center gap-3"
                                  >
                                    {item.image ? (
                                      <Image
                                        src={item.image}
                                        alt={item.name || "Product"}
                                        width={40}
                                        height={40}
                                        unoptimized
                                        className="size-10 rounded-md border border-border object-cover"
                                      />
                                    ) : (
                                      <div className="flex size-10 items-center justify-center rounded-md bg-muted">
                                        <Package className="size-4" />
                                      </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                      <p className="truncate text-sm">
                                        {item.name || "Product"}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        Qty: {item.quantity}
                                      </p>
                                    </div>
                                    <p className="text-sm">
                                      {money(
                                        Number(item.price) * item.quantity,
                                        order.currency
                                      )}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
