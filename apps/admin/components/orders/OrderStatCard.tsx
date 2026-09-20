"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  CheckCircle2,
  PackageSearch,
  Truck,
  MapPinCheckInside,
  BadgeCheck,
  XCircle,
  Archive,
  Loader2,
  type LucideIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type OrderStageType =
  | "pending"
  | "confirmed"
  | "processing"
  | "fulfillment"
  | "delivered"
  | "completed"
  | "cancelled"
  | "history";

const stageConfig: Record<
  OrderStageType,
  { icon: LucideIcon; badgeClass: string; hoverGlow: string }
> = {
  pending: {
    icon: Clock,
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    hoverGlow: "hover:border-amber-500/40",
  },
  confirmed: {
    icon: CheckCircle2,
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    hoverGlow: "hover:border-blue-500/40",
  },
  processing: {
    icon: PackageSearch,
    badgeClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    hoverGlow: "hover:border-indigo-500/40",
  },
  fulfillment: {
    icon: Truck,
    badgeClass: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    hoverGlow: "hover:border-cyan-500/40",
  },
  delivered: {
    icon: MapPinCheckInside,
    badgeClass: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
    hoverGlow: "hover:border-teal-500/40",
  },
  completed: {
    icon: BadgeCheck,
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    hoverGlow: "hover:border-emerald-500/40",
  },
  cancelled: {
    icon: XCircle,
    badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    hoverGlow: "hover:border-rose-500/40",
  },
  history: {
    icon: Archive,
    badgeClass: "bg-muted text-muted-foreground border-border",
    hoverGlow: "hover:border-primary/40",
  },
};

interface OrderStatCardProps {
  href: string;
  title: string;
  description: string;
  count: number;
  stage: OrderStageType;
}

export default function OrderStatCard({
  href,
  title,
  description,
  count,
  stage,
}: OrderStatCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const config = stageConfig[stage];
  const Icon = config.icon;

  const handleClick = () => {
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <Card
      onClick={handleClick}
      className={cn(
        "group relative cursor-pointer overflow-hidden border border-border/70 bg-card/60 backdrop-blur-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        config.hoverGlow,
        isPending && "pointer-events-none opacity-60"
      )}
    >
      {isPending && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/50 backdrop-blur-[1px]">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1 pr-2">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          <CardDescription className="text-xs">{description}</CardDescription>
        </div>
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-transform duration-200 group-hover:scale-105",
            config.badgeClass
          )}
        >
          <Icon className="h-4.5 w-4.5" />
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <p className="font-mono text-3xl font-extrabold tracking-tight text-foreground">
          {count}
        </p>
      </CardContent>
    </Card>
  );
}