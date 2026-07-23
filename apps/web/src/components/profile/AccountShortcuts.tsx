"use client";

import Link from "next/link";
import {
  Bell,
  CreditCard,
  Globe,
  Heart,
  HelpCircle,
  Lock,
  MapPin,
  Package,
  ShoppingCart,
} from "lucide-react";

interface Shortcut {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

const shortcuts: Shortcut[] = [
  {
    title: "Orders",
    description: "Track and manage your orders",
    href: "/account/orders",
    icon: <Package className="h-7 w-7 text-[#004d26]" />,
  },
  {
    title: "Cart",
    description: "View items in your cart",
    href: "/cart",
    icon: <ShoppingCart className="h-7 w-7 text-[#004d26]" />,
  },
  {
    title: "Wishlist",
    description: "Products you've saved",
    href: "/wishlist",
    icon: <Heart className="h-7 w-7 text-[#004d26]" />,
  },
  {
    title: "Addresses",
    description: "Manage delivery addresses",
    href: "/account/addresses",
    icon: <MapPin className="h-7 w-7 text-[#004d26]" />,
  },
  {
    title: "Payment Methods",
    description: "Cards and payment options",
    href: "/account/payments",
    icon: <CreditCard className="h-7 w-7 text-[#004d26]" />,
  },
  {
    title: "Security",
    description: "Password and account security",
    href: "/account/security",
    icon: <Lock className="h-7 w-7 text-[#004d26]" />,
  },
  {
    title: "Notifications",
    description: "Email and app notifications",
    href: "/account/notifications",
    icon: <Bell className="h-7 w-7 text-[#004d26]" />,
  },
  {
    title: "Language & Region",
    description: "Language and currency",
    href: "/account/preferences",
    icon: <Globe className="h-7 w-7 text-[#004d26]" />,
  },
  {
    title: "Support",
    description: "Help center and contact us",
    href: "/support",
    icon: <HelpCircle className="h-7 w-7 text-[#004d26]" />,
  },
];

export default function AccountShortcuts() {
  return (
    <section className="rounded-3xl border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold">
          Your Account
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Quickly access everything related to your account.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shortcuts.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#004d26]/30 hover:shadow-lg"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#004d26]/10">
              {item.icon}
            </div>

            <h3 className="font-semibold transition-colors group-hover:text-[#004d26]">
              {item.title}
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}