
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Color, Variant } from "./types";

type CopySettings = {
  price: boolean;
  optionValue: boolean;
  stock: boolean;
};

type CopyField = keyof CopySettings;

const OPTION_TYPES = [
  { label: "Size", value: "size" },
  { label: "Weight", value: "weight" },
  { label: "Storage", value: "storage" },
  { label: "Memory", value: "memory" },
  { label: "Length", value: "length" },
  { label: "Volume", value: "volume" },
] as const;

const OPTION_VALUES: Record<string, string[]> = {
  size: [
    "XS", "S", "M", "L", "XL", "XXL", "XXXL",
    "28", "30", "32", "34", "36", "38", "40", "42",
  ],
  storage: ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"],
  memory: ["2GB", "4GB", "6GB", "8GB", "12GB", "16GB", "24GB"],
};

interface ProductVariantListProps {
  color: Color;
  colorIndex: number;
  productName?: string;
  updateColorField: <K extends keyof Color>(
    colorIndex: number,
    field: K,
    value: Color[K],
  ) => void;
  addVariant: (colorIndex: number) => void;
  removeVariant: (colorIndex: number, variantIndex: number) => void;
  updateVariantField: <K extends keyof Variant>(
    colorIndex: number,
    variantIndex: number,
    field: K,
    value: Variant[K],
  ) => void;
  showCopyControls: boolean;
  copySettings: CopySettings;
  onCopySettingChange: (field: CopyField, enabled: boolean) => void;
}

export function ProductVariantList({
  color,
  colorIndex,
  productName = "PROD",
  updateColorField,
  addVariant,
  removeVariant,
  updateVariantField,
  showCopyControls,
  copySettings,
  onCopySettingChange,
}: ProductVariantListProps) {
  const optionType = (color.optionName || "size").toLowerCase();
  const optionValues = OPTION_VALUES[optionType] ?? [];

  const generateSku = (
    prodName: string,
    colorName: string,
    optionValue: string,
  ) => {
    const prodPart = (prodName || "PRD").slice(0, 3).toUpperCase();
    const colorPart = (colorName || "CLR").slice(0, 3).toUpperCase();
    const optionPart = (optionValue || "OPT")
      .replace(/\s/g, "")
      .toUpperCase();

    return `${prodPart}-${colorPart}-${optionPart}`;
  };

  // Update only the edited variant.
  // ProductForm/index.tsx handles cross-color synchronization.
  const handleOptionValueChange = (
    variantIndex: number,
    newValue: string,
  ) => {
    updateVariantField(
      colorIndex,
      variantIndex,
      "optionValue",
      newValue,
    );

    updateVariantField(
      colorIndex,
      variantIndex,
      "sku",
      generateSku(productName, color.name ?? "", newValue),
    );
  };

  const handlePriceChange = (
    variantIndex: number,
    price: number,
  ) => {
    updateVariantField(colorIndex, variantIndex, "price", price);
  };

  const handleStockChange = (
    variantIndex: number,
    stock: number,
  ) => {
    updateVariantField(colorIndex, variantIndex, "stock", stock);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Label className="text-sm font-semibold">
          Variants ({color.name || "No color specified"})
        </Label>

        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">
            Option type
          </Label>

          <Select
            value={color.optionName || "size"}
            onValueChange={(value) => {
              if (value) {
                updateColorField(colorIndex, "optionName", value);
              }
            }}
          >
            <SelectTrigger className="h-8 w-32 text-xs">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {OPTION_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {color.variants.map((variant, variantIndex) => (
        <div
          key={variantIndex}
          className="space-y-3 rounded-lg border p-3"
        >
          {showCopyControls && variantIndex === 0 && (
            <div className="space-y-2 rounded-md bg-muted/30 p-3">
              <p className="text-xs font-semibold">
                Copy first variant to all color groups
              </p>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <label className="flex cursor-pointer items-start gap-2 rounded-md border p-2 text-xs">
                  <input
                    type="checkbox"
                    className="mt-0.5 size-3.5 shrink-0 accent-primary"
                    checked={copySettings.price}
                    onChange={(event) =>
                      onCopySettingChange("price", event.target.checked)
                    }
                  />
                  <span>
                    <span className="block font-medium">Copy price</span>
                    <span className="text-muted-foreground">
                      Same price for all
                    </span>
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-2 rounded-md border p-2 text-xs">
                  <input
                    type="checkbox"
                    className="mt-0.5 size-3.5 shrink-0 accent-primary"
                    checked={copySettings.optionValue}
                    onChange={(event) =>
                      onCopySettingChange(
                        "optionValue",
                        event.target.checked,
                      )
                    }
                  />
                  <span>
                    <span className="block font-medium">
                      Copy option value
                    </span>
                    <span className="text-muted-foreground">
                      Same option for all
                    </span>
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-2 rounded-md border p-2 text-xs">
                  <input
                    type="checkbox"
                    className="mt-0.5 size-3.5 shrink-0 accent-primary"
                    checked={copySettings.stock}
                    onChange={(event) =>
                      onCopySettingChange("stock", event.target.checked)
                    }
                  />
                  <span>
                    <span className="block font-medium">Copy stock</span>
                    <span className="text-muted-foreground">
                      Same quantity for all
                    </span>
                  </span>
                </label>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="min-w-0 space-y-1.5">
              <Label className="text-xs">
                {color.optionName || "Option value"}
              </Label>

              {optionType === "weight" ? (
                <div className="flex gap-1.5">
                  <Input
                    type="number"
                    min="0"
                    className="h-9 min-w-0"
                    value={(variant.optionValue ?? "").replace(/[^\d.]/g, "")}
                    onChange={(event) => {
                      const unit = (variant.optionValue ?? "").endsWith("kg")
                        ? "kg"
                        : "g";

                      handleOptionValueChange(
                        variantIndex,
                        `${event.target.value}${unit}`,
                      );
                    }}
                    placeholder="500"
                  />

                  <Select
                    value={
                      (variant.optionValue ?? "").endsWith("kg") ? "kg" : "g"
                    }
                    onValueChange={(unit) => {
                      const number = (variant.optionValue ?? "").replace(
                        /[^\d.]/g,
                        "",
                      );

                      handleOptionValueChange(
                        variantIndex,
                        `${number}${unit}`,
                      );
                    }}
                  >
                    <SelectTrigger className="h-9 w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="g">Gram</SelectItem>
                      <SelectItem value="kg">Kilogram</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : optionValues.length > 0 ? (
                <>
                  <Select
                    value={
                      optionValues.includes(variant.optionValue ?? "")
                        ? variant.optionValue
                        : "Other"
                    }
                    onValueChange={(value) => {
                      if (!value) return;

                      handleOptionValueChange(
                        variantIndex,
                        value === "Other" ? "" : value,
                      );
                    }}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select value" />
                    </SelectTrigger>
                    <SelectContent>
                      {optionValues.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  {!optionValues.includes(variant.optionValue ?? "") && (
                    <Input
                      className="h-9"
                      placeholder="Enter custom value"
                      value={variant.optionValue ?? ""}
                      onChange={(event) =>
                        handleOptionValueChange(
                          variantIndex,
                          event.target.value,
                        )
                      }
                    />
                  )}
                </>
              ) : (
                <Input
                  className="h-9"
                  value={variant.optionValue ?? ""}
                  onChange={(event) =>
                    handleOptionValueChange(
                      variantIndex,
                      event.target.value,
                    )
                  }
                  placeholder="Enter custom value"
                />
              )}
            </div>

            <div className="min-w-0 space-y-1.5">
              <Label className="text-xs">Price</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                className="h-9"
                value={variant.price === 0 ? "" : variant.price}
                onChange={(event) =>
                  handlePriceChange(
                    variantIndex,
                    event.target.value === ""
                      ? 0
                      : Number(event.target.value),
                  )
                }
                placeholder="Enter price"
              />
            </div>

            <div className="min-w-0 space-y-1.5">
              <Label className="text-xs">Stock</Label>
              <Select
                value={String(variant.stock)}
                onValueChange={(value) =>
                  handleStockChange(variantIndex, Number(value))
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select stock" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 items</SelectItem>
                  <SelectItem value="3">3 items</SelectItem>
                  <SelectItem value="5">5 items</SelectItem>
                  <SelectItem value="10">10 items</SelectItem>
                  <SelectItem value="25">25 items</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-0 space-y-1.5">
              <Label className="text-xs">SKU (Auto)</Label>
              <Input
                value={variant.sku ?? ""}
                readOnly
                disabled
                className="h-9 bg-muted font-mono text-xs uppercase"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removeVariant(colorIndex, variantIndex)}
            >
              Remove Variant
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => addVariant(colorIndex)}
      >
        Add Variant
      </Button>
    </div>
  );
}
