"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Filter,
  Loader2,
  RotateCcw,
  Save,
  Search,
  X,
} from "lucide-react";
import { toast } from "sonner";
import React from "react";

interface Cost {
  id: string;
  colorId?: string | null;
  variantId?: string | null;

  wholesaleCost: number | null;
  nairobiHandling: number | null;
  transportShare: number | null;
  borderOfficialCost: number | null;
  jubaHandling: number | null;
  packagingCost: number | null;
  deliveryAllowance: number | null;
  notes: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Variant {
  id: string;
  profitabilityType: "color" | "variant";
  productColorId: string | null;
  optionName: string | null;
  optionValue: string | null;
  price: number;
  stock: number;
  sku: string | null;
  isActive: boolean;
  productName: string;
  productId: string;
  imageUrl: string | null;
  colorName: string | null;
  cost: Cost | null;
}

type CostField =
  | "wholesaleCost"
  | "nairobiHandling"
  | "transportShare"
  | "borderOfficialCost"
  | "jubaHandling"
  | "packagingCost"
  | "deliveryAllowance";

type StatusFilter = "all" | "complete" | "incomplete";
type ProfitFilter = "all" | "profitable" | "loss";
type ActiveFilter = "all" | "active" | "inactive";

type SortOption =
  | "product"
  | "selling-high"
  | "selling-low"
  | "landed-high"
  | "landed-low"
  | "profit-high"
  | "profit-low"
  | "margin-high"
  | "margin-low"
  | "markup-high"
  | "markup-low";

const costFields: {
  key: CostField;
  label: string;
}[] = [
  { key: "wholesaleCost", label: "Wholesale Cost" },
  { key: "nairobiHandling", label: "Nairobi Handling" },
  { key: "transportShare", label: "Transport" },
  { key: "borderOfficialCost", label: "Border / Official" },
  { key: "jubaHandling", label: "Juba Handling" },
  { key: "packagingCost", label: "Packaging" },
  { key: "deliveryAllowance", label: "Delivery Allowance" },
];

function calculateLandedCost(variant: Variant): number | null {
  if (!variant.cost) return null;

  for (const { key } of costFields) {
    if (variant.cost[key] === null) return null;
  }

  let total = 0;
  for (const { key } of costFields) {
    total += variant.cost[key] ?? 0;
  }
  return total;
}

function calculateProfit(variant: Variant, landedCost: number | null): number | null {
  if (landedCost === null) return null;
  return variant.price - landedCost;
}

function calculateMargin(variant: Variant, profit: number | null): number | null {
  if (profit === null || variant.price <= 0) return null;
  return (profit / variant.price) * 100;
}

function calculateMarkup(landedCost: number | null, profit: number | null): number | null {
  if (landedCost === null || landedCost <= 0 || profit === null) return null;
  return (profit / landedCost) * 100;
}

function money(value: number | null): string {
  if (value === null) return "—";
  return `$${value.toFixed(2)}`;
}

interface ProductProfitabilityProps {
  initialVariants: Variant[];
}

export default function ProductProfitability({
  initialVariants,
}: ProductProfitabilityProps) {
  const [variants, setVariants] = useState<Variant[]>(initialVariants);
  const [saving, setSaving] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [profitFilter, setProfitFilter] = useState<ProfitFilter>("all");
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("product");

  const hasFilters =
    search.trim() !== "" ||
    statusFilter !== "all" ||
    profitFilter !== "all" ||
    activeFilter !== "all" ||
    sortBy !== "product";

  function updateLocalVariant(variantId: string, updates: Partial<Variant>) {
    setVariants((current) =>
      current.map((variant) =>
        variant.id === variantId ? { ...variant, ...updates } : variant
      )
    );
  }

  function updateLocalCost(
    variantId: string,
    field: CostField,
    value: number | null
  ) {
    setVariants((current) =>
      current.map((variant) => {
        if (variant.id !== variantId) return variant;

        const existingCost = variant.cost;
        const nextCost: Cost = {
          id: existingCost?.id ?? "",
          variantId,
          wholesaleCost: existingCost?.wholesaleCost ?? null,
          nairobiHandling: existingCost?.nairobiHandling ?? null,
          transportShare: existingCost?.transportShare ?? null,
          borderOfficialCost: existingCost?.borderOfficialCost ?? null,
          jubaHandling: existingCost?.jubaHandling ?? null,
          packagingCost: existingCost?.packagingCost ?? null,
          deliveryAllowance: existingCost?.deliveryAllowance ?? null,
          notes: existingCost?.notes ?? null,
          createdBy: existingCost?.createdBy ?? null,
          updatedBy: existingCost?.updatedBy ?? null,
          createdAt: existingCost?.createdAt ?? "",
          updatedAt: existingCost?.updatedAt ?? "",
        };

        nextCost[field] = value;
        return { ...variant, cost: nextCost };
      })
    );
  }

  async function saveVariant(variant: Variant) {
    try {
      setSaving(variant.id);

      const costResponse = await fetch("/api/product-profitability/cost", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(variant.profitabilityType === "color"
            ? { colorId: variant.id }
            : { variantId: variant.id }),
          wholesaleCost: variant.cost?.wholesaleCost ?? null,
          nairobiHandling: variant.cost?.nairobiHandling ?? null,
          transportShare: variant.cost?.transportShare ?? null,
          borderOfficialCost: variant.cost?.borderOfficialCost ?? null,
          jubaHandling: variant.cost?.jubaHandling ?? null,
          packagingCost: variant.cost?.packagingCost ?? null,
          deliveryAllowance: variant.cost?.deliveryAllowance ?? null,
          notes: variant.cost?.notes ?? null,
        }),
      });

      const costResult = await costResponse.json();
      if (!costResponse.ok || !costResult.success) {
        throw new Error(costResult.error || "Failed to save costs.");
      }

      const priceResponse = await fetch("/api/product-profitability/price", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId: variant.id,
          price: variant.price,
        }),
      });

      const priceResult = await priceResponse.json();
      if (!priceResponse.ok || !priceResult.success) {
        throw new Error(priceResult.error || "Failed to update selling price.");
      }

      setVariants((current) =>
        current.map((item) =>
          item.id === variant.id
            ? {
                ...item,
                cost: costResult.data,
                price: priceResult.data?.price ?? variant.price,
              }
            : item
        )
      );

      toast.success("Profitability updated successfully.");
    } catch (error) {
      console.error("Failed to save profitability:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save changes."
      );
    } finally {
      setSaving(null);
    }
  }

  const filteredVariants = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = variants.filter((variant) => {
      const landedCost = calculateLandedCost(variant);
      const profit = calculateProfit(variant, landedCost);

      const matchesSearch =
        !query ||
        [
          variant.productName,
          variant.optionName,
          variant.optionValue,
          variant.sku,
          variant.colorName,
        ]
          .filter((value): value is string => Boolean(value))
          .some((value) => value.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "complete" && landedCost !== null) ||
        (statusFilter === "incomplete" && landedCost === null);

      const matchesProfit =
        profitFilter === "all" ||
        (profitFilter === "profitable" && profit !== null && profit >= 0) ||
        (profitFilter === "loss" && profit !== null && profit < 0);

      const matchesActive =
        activeFilter === "all" ||
        (activeFilter === "active" && variant.isActive) ||
        (activeFilter === "inactive" && !variant.isActive);

      return matchesSearch && matchesStatus && matchesProfit && matchesActive;
    });

    return [...result].sort((a, b) => {
      const aLanded = calculateLandedCost(a);
      const bLanded = calculateLandedCost(b);
      const aProfit = calculateProfit(a, aLanded);
      const bProfit = calculateProfit(b, bLanded);
      const aMargin = calculateMargin(a, aProfit);
      const bMargin = calculateMargin(b, bProfit);
      const aMarkup = calculateMarkup(aLanded, aProfit);
      const bMarkup = calculateMarkup(bLanded, bProfit);

      switch (sortBy) {
        case "selling-high": return b.price - a.price;
        case "selling-low": return a.price - b.price;
        case "landed-high": return (bLanded ?? -Infinity) - (aLanded ?? -Infinity);
        case "landed-low": return (aLanded ?? Infinity) - (bLanded ?? Infinity);
        case "profit-high": return (bProfit ?? -Infinity) - (aProfit ?? -Infinity);
        case "profit-low": return (aProfit ?? Infinity) - (bProfit ?? Infinity);
        case "margin-high": return (bMargin ?? -Infinity) - (aMargin ?? -Infinity);
        case "margin-low": return (aMargin ?? Infinity) - (bMargin ?? Infinity);
        case "markup-high": return (bMarkup ?? -Infinity) - (aMarkup ?? -Infinity);
        case "markup-low": return (aMarkup ?? Infinity) - (bMarkup ?? Infinity);
        case "product":
        default:
          return a.productName.localeCompare(b.productName);
      }
    });
  }, [variants, search, statusFilter, profitFilter, activeFilter, sortBy]);

  const stats = useMemo(() => {
    let sellingValue = 0;
    let landedCost = 0;
    let expectedProfit = 0;
    let complete = 0;

    for (const variant of variants) {
      const cost = calculateLandedCost(variant);
      sellingValue += variant.price;

      if (cost !== null) {
        landedCost += cost;
        expectedProfit += variant.price - cost;
        complete += 1;
      }
    }

    return {
      products: variants.length,
      complete,
      incomplete: variants.length - complete,
      sellingValue,
      landedCost,
      expectedProfit,
      averageMargin:
        sellingValue > 0 ? (expectedProfit / sellingValue) * 100 : 0,
    };
  }, [variants]);

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setProfitFilter("all");
    setActiveFilter("all");
    setSortBy("product");
  }

  return (
    <div className="w-full space-y-4 select-none sm:space-y-6">
      {/* Stats Cards: 2 cols on mobile, 3 cols on medium, 5 cols on desktop */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 xl:grid-cols-5">
        <Stat label="Variants" value={stats.products} />
        <Stat label="Complete" value={stats.complete} />
        <Stat label="Incomplete" value={stats.incomplete} />
        <Stat label="Expected Profit" value={money(stats.expectedProfit)} />
        <div className="col-span-2 sm:col-span-1 md:col-span-2 xl:col-span-1">
          <Stat label="Avg. Margin" value={`${stats.averageMargin.toFixed(2)}%`} />
        </div>
      </div>

      {/* Filter Toolbar: Responsive Wrap */}
      <div className="rounded-xl border border-zinc-200 bg-white p-3.5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900 sm:p-4">
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3 xl:flex xl:items-center">
            {/* Search */}
            <div className="relative min-w-0 flex-1 sm:col-span-2 md:col-span-3 xl:col-span-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
              <input
                type="search"
                placeholder="Search products, variants, SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-xs sm:text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="h-10 rounded-lg border border-zinc-200 bg-white px-2.5 text-xs sm:text-sm text-zinc-700 outline-none transition dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
            >
              <option value="all">All Status</option>
              <option value="complete">Complete</option>
              <option value="incomplete">Incomplete</option>
            </select>

            <select
              value={profitFilter}
              onChange={(e) => setProfitFilter(e.target.value as ProfitFilter)}
              className="h-10 rounded-lg border border-zinc-200 bg-white px-2.5 text-xs sm:text-sm text-zinc-700 outline-none transition dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
            >
              <option value="all">All Profit</option>
              <option value="profitable">Profitable</option>
              <option value="loss">Loss</option>
            </select>

            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value as ActiveFilter)}
              className="h-10 rounded-lg border border-zinc-200 bg-white px-2.5 text-xs sm:text-sm text-zinc-700 outline-none transition dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
            >
              <option value="all">All Products</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="h-10 rounded-lg border border-zinc-200 bg-white px-2.5 text-xs sm:text-sm text-zinc-700 outline-none transition dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 sm:col-span-2 md:col-span-2 xl:col-span-1"
            >
              <option value="product">Sort: Product</option>
              <option value="selling-high">Selling Price: High → Low</option>
              <option value="selling-low">Selling Price: Low → High</option>
              <option value="landed-high">Landed Cost: High → Low</option>
              <option value="landed-low">Landed Cost: Low → High</option>
              <option value="profit-high">Profit: High → Low</option>
              <option value="profit-low">Profit: Low → High</option>
              <option value="margin-high">Margin: High → Low</option>
              <option value="margin-low">Margin: Low → High</option>
              <option value="markup-high">Markup: High → Low</option>
              <option value="markup-low">Markup: Low → High</option>
            </select>
          </div>

          {/* Filter Footer */}
          <div className="flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800/80">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              <Filter className="size-3.5" />
              <span>
                Showing{" "}
                <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {filteredVariants.length}
                </strong>{" "}
                of {variants.length}
              </span>
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-black dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
              >
                <RotateCcw className="size-3" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        
        {/* Mobile & Medium Device Layout (up to 1279px / <xl): Adaptive Cards */}
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800 xl:hidden">
          {filteredVariants.map((variant) => {
            const landedCost = calculateLandedCost(variant);
            const profit = calculateProfit(variant, landedCost);
            const margin = calculateMargin(variant, profit);
            const markup = calculateMarkup(landedCost, profit);
            const isExpanded = expanded === variant.id;

            return (
              <div key={`m-${variant.id}`} className="p-4 sm:p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 sm:size-14">
                      {variant.imageUrl ? (
                        <Image
                          src={variant.imageUrl}
                          alt={variant.productName}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center text-[10px] text-zinc-400">
                          N/A
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:text-base">
                        {variant.productName}
                      </p>
                      <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                        {variant.optionName}: {variant.optionValue}
                        {variant.colorName ? ` · ${variant.colorName}` : ""}
                      </p>
                      {variant.sku && (
                        <p className="text-[10px] text-zinc-400 font-mono">
                          SKU: {variant.sku}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Tablet Metric Pills & Toggle */}
                  <div className="flex items-center justify-between gap-3 md:justify-end">
                    <div className="flex items-center gap-2">
                      {landedCost !== null ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                          <CheckCircle2 className="size-3" />
                          Complete
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                          Incomplete
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpanded(isExpanded ? null : variant.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      <span>{isExpanded ? "Close" : "Cost Breakdown"}</span>
                      {isExpanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Metrics Bar */}
                <div className="mt-3.5 grid grid-cols-4 gap-2 rounded-lg bg-zinc-50 p-2.5 text-center dark:bg-zinc-950/60 sm:gap-3">
                  <div>
                    <span className="block text-[10px] uppercase text-zinc-400 font-medium">Selling</span>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 sm:text-sm">{money(variant.price)}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-zinc-400 font-medium">Landed</span>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 sm:text-sm">{money(landedCost)}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-zinc-400 font-medium">Profit</span>
                    <span
                      className={`text-xs font-bold sm:text-sm ${
                        profit === null
                          ? "text-zinc-400"
                          : profit >= 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {money(profit)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-zinc-400 font-medium">Margin</span>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 sm:text-sm">
                      {margin === null ? "—" : `${margin.toFixed(1)}%`}
                    </span>
                  </div>
                </div>

                {/* Inline Responsive Breakdown Form */}
                {isExpanded && (
                  <div className="mt-4 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                    <BreakdownForm
                      variant={variant}
                      landedCost={landedCost}
                      profit={profit}
                      margin={margin}
                      markup={markup}
                      isSaving={saving === variant.id}
                      onUpdateCost={updateLocalCost}
                      onUpdateVariant={updateLocalVariant}
                      onSave={() => void saveVariant(variant)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Large Desktop Layout (≥xl / 1280px+): Clean Table with Inline Sub-Row */}
        <div className="hidden xl:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="border-b border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-950/80">
              <tr>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Product</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Total Cost</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Landed</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Selling</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Profit</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Margin</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Markup</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Status</th>
                <th className="px-4 py-3 text-right" />
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {filteredVariants.map((variant) => {
                const landedCost = calculateLandedCost(variant);
                const profit = calculateProfit(variant, landedCost);
                const margin = calculateMargin(variant, profit);
                const markup = calculateMarkup(landedCost, profit);
                const isExpanded = expanded === variant.id;

                const totalCost = variant.cost
                  ? costFields.reduce(
                      (total, { key }) => total + (variant.cost?.[key] ?? 0),
                      0
                    )
                  : null;

                return (
                  <React.Fragment key={variant.id}>
                    <tr className="group bg-white align-middle transition hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800/50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative size-11 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950">
                            {variant.imageUrl ? (
                              <Image
                                src={variant.imageUrl}
                                alt={variant.productName}
                                fill
                                sizes="44px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex size-full items-center justify-center text-[10px] text-zinc-400">
                                N/A
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                              {variant.productName}
                            </p>
                            <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                              {variant.optionName}: {variant.optionValue}
                              {variant.colorName ? ` · ${variant.colorName}` : ""}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">{money(totalCost)}</td>
                      <td className="px-4 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">{money(landedCost)}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{money(variant.price)}</td>
                      <td className="px-4 py-4 text-sm font-semibold">
                        <span
                          className={
                            profit === null
                              ? "text-zinc-400"
                              : profit >= 0
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                          }
                        >
                          {money(profit)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {margin === null ? "—" : `${margin.toFixed(2)}%`}
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {markup === null ? "—" : `${markup.toFixed(2)}%`}
                      </td>
                      <td className="px-4 py-4">
                        {landedCost !== null ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                            <CheckCircle2 className="size-3" />
                            Complete
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                            Incomplete
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setExpanded(isExpanded ? null : variant.id)}
                          className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                          aria-label="Toggle details"
                        >
                          {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                        </button>
                      </td>
                    </tr>

                    {/* Inline Sub-Row for Desktop */}
                    {isExpanded && (
                      <tr className="bg-zinc-50/50 dark:bg-zinc-950/50">
                        <td colSpan={9} className="p-6">
                          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                            <BreakdownForm
                              variant={variant}
                              landedCost={landedCost}
                              profit={profit}
                              margin={margin}
                              markup={markup}
                              isSaving={saving === variant.id}
                              onUpdateCost={updateLocalCost}
                              onUpdateVariant={updateLocalVariant}
                              onSave={() => void saveVariant(variant)}
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredVariants.length === 0 && (
          <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
              <Search className="size-4 text-zinc-400" />
            </div>
            <p className="mt-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">No products found</p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Try changing your search or filters.</p>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-900 hover:underline dark:text-zinc-100"
              >
                <X className="size-3.5" />
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function BreakdownForm({
  variant,
  landedCost,
  profit,
  margin,
  markup,
  isSaving,
  onUpdateCost,
  onUpdateVariant,
  onSave,
}: {
  variant: Variant;
  landedCost: number | null;
  profit: number | null;
  margin: number | null;
  markup: number | null;
  isSaving: boolean;
  onUpdateCost: (id: string, field: CostField, val: number | null) => void;
  onUpdateVariant: (id: string, updates: Partial<Variant>) => void;
  onSave: () => void;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-[1fr_260px]">
      <div>
        <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Cost Breakdown
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {costFields.map(({ key, label }) => (
            <label key={key} className="space-y-1">
              <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 truncate block">
                {label}
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={variant.cost?.[key] ?? ""}
                onChange={(e) =>
                  onUpdateCost(
                    variant.id,
                    key,
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
                className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-2.5 text-xs font-medium text-zinc-900 outline-none focus:border-black focus:ring-1 focus:ring-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-white dark:focus:ring-white"
              />
            </label>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <label className="space-y-1 block max-w-xs">
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Selling Price ($)
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={variant.price}
              onChange={(e) =>
                onUpdateVariant(variant.id, { price: Number(e.target.value) })
              }
              className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm font-bold text-zinc-900 outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-white"
            />
          </label>
        </div>
      </div>

      {/* Summary Box */}
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60 flex flex-col justify-between">
        <div className="space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Analysis</p>
          <SummaryRow label="Landed Cost" value={money(landedCost)} />
          <SummaryRow label="Selling Price" value={money(variant.price)} />
          <SummaryRow label="Gross Profit" value={money(profit)} />
          <SummaryRow label="Gross Margin" value={margin === null ? "—" : `${margin.toFixed(2)}%`} />
          <SummaryRow label="Markup" value={markup === null ? "—" : `${markup.toFixed(2)}%`} />
        </div>

        <button
          type="button"
          disabled={isSaving}
          onClick={onSave}
          className="mt-5 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-black px-4 text-xs font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          {isSaving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
          <span>{isSaving ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900 sm:p-4">
      <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 truncate">{label}</p>
      <p className="mt-0.5 text-base font-bold text-zinc-900 dark:text-zinc-100 sm:text-lg truncate">
        {value}
      </p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-200/60 pb-1.5 last:border-0 dark:border-zinc-800">
      <span className="text-[11px] text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{value}</span>
    </div>
  );
}