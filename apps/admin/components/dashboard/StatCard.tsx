"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Loader2,
  Building2,
  Boxes,
  Package,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type StatIconType = "brands" | "categories" | "products" | "orders";

const iconMap: Record<StatIconType, LucideIcon> = {
  brands: Building2,
  categories: Boxes,
  products: Package,
  orders: ShoppingCart,
};

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  iconName: StatIconType;
  href?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  colorScheme?: "blue" | "violet" | "emerald" | "amber";
}

const colorMap = {
  blue: {
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    glow: "group-hover:border-blue-500/40",
  },
  violet: {
    badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    glow: "group-hover:border-purple-500/40",
  },
  emerald: {
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    glow: "group-hover:border-emerald-500/40",
  },
  amber: {
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    glow: "group-hover:border-amber-500/40",
  },
};

export default function StatCard({
  title,
  value,
  description,
  iconName,
  href,
  trend,
  colorScheme = "blue",
}: StatCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const Icon = iconMap[iconName];
  const isClickable = Boolean(href);
  const colors = colorMap[colorScheme];

  const handleClick = () => {
    if (!href) return;
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <Card
      onClick={isClickable ? handleClick : undefined}
      className={cn(
        "group relative overflow-hidden border border-border/70 bg-card/60 backdrop-blur-xs transition-all duration-200",
        isClickable &&
          "cursor-pointer hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40",
        colors.glow,
        isPending && "pointer-events-none opacity-60"
      )}
    >
      {/* Loading Overlay */}
      {isPending && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      )}

      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </p>

          <div className="flex items-center gap-1">
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg border transition-transform duration-200 group-hover:scale-105",
                colors.badge
              )}
            >
              {Icon && <Icon className="h-4.5 w-4.5" />}
            </div>

            {isClickable && (
              <ArrowUpRight className="h-4 w-4 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
            )}
          </div>
        </div>

        {/* Value Display */}
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
            {new Intl.NumberFormat().format(value)}
          </span>

          {trend && (
            <span
              className={cn(
                "inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border",
                trend.isPositive !== false
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
              )}
            >
              {trend.value}
            </span>
          )}
        </div>

        {/* Footer Subtext */}
        <p className="mt-1 text-xs text-muted-foreground truncate">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}