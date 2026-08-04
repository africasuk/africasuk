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
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "XXXL",
    "28",
    "30",
    "32",
    "34",
    "36",
    "38",
    "40",
    "42",
    "Other",
  ],

  storage: [
    "32GB",
    "64GB",
    "128GB",
    "256GB",
    "512GB",
    "1TB",
    "Other",
  ],

  memory: [
    "2GB",
    "4GB",
    "6GB",
    "8GB",
    "12GB",
    "16GB",
    "24GB",
  ],
};

interface ProductVariantListProps {
  color: Color;
  colorIndex: number;
  productName?: string;
  updateColorField: <K extends keyof Color>(
    colorIndex: number,
    field: K,
    value: Color[K]
  ) => void;
  addVariant: (colorIndex: number) => void;
  removeVariant: (colorIndex: number, variantIndex: number) => void;
  updateVariantField: <K extends keyof Variant>(
    colorIndex: number,
    variantIndex: number,
    field: K,
    value: Variant[K]
  ) => void;
}

export function ProductVariantList({
  color,
  colorIndex,
  productName = "PROD",
  updateColorField,
  addVariant,
  removeVariant,
  updateVariantField,
}: ProductVariantListProps) {
  // 1. Normalize option name to lowercase safely handling null/undefined
  const optionType = (color.optionName ?? "").toLowerCase();

  // Auto SKU Generator function
  const generateSku = (
    prodName: string,
    colorName: string,
    optionVal: string
  ) => {
    const prodPart = (prodName || "PRD").slice(0, 3).toUpperCase();
    const colorPart = (colorName || "CLR").slice(0, 3).toUpperCase();
    const optionPart = (optionVal || "OPT").replace(/\s/g, "").toUpperCase();
    return `${prodPart}-${colorPart}-${optionPart}`;
  };

  // Helper to handle option value change + SKU auto update
  const handleOptionValueChange = (
    variantIndex: number,
    newValue: string
  ) => {
    updateVariantField(colorIndex, variantIndex, "optionValue", newValue);

    const generatedSku = generateSku(
      productName,
      color.name ?? "",
      newValue
    );
    updateVariantField(colorIndex, variantIndex, "sku", generatedSku);
  };

  return (
    <div className="space-y-4">
      {/* Header with Option Type Selection */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Label className="text-base font-semibold">
          Variants ({color.name || "No color specified"})
        </Label>

        <div className="flex items-center gap-2">
          <Label className="text-sm font-normal text-muted-foreground">
            Option Type:
          </Label>
                  <Select
                    value={color.optionName}
                    onValueChange={(value) => {
                      updateColorField(
                        colorIndex,
                        "optionName",
                        value ?? ""
                      );
                    }}
                  >
            <SelectTrigger className="w-36">
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

      {/* Variant Cards */}
      {color.variants.map((variant, variantIndex) => (
        <div
          key={variantIndex}
          className="space-y-4 rounded-lg border p-4 shadow-sm"
        >
          <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-4">
            
          {/* Dynamic Option Value Renderer */}
          <div>
            <Label>{color.optionName || "Option Value"}</Label>

            {optionType === "weight" ? (
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={(variant.optionValue ?? "").replace(/[^\d.]/g, "")}
                  onChange={(e) => {
                    const unit =
                      (variant.optionValue ?? "").endsWith("kg")
                        ? "kg"
                        : "g";

                    handleOptionValueChange(
                      variantIndex,
                      `${e.target.value}${unit}`
                    );
                  }}
                  placeholder="500"
                />

                <Select
                  value={
                    (variant.optionValue ?? "").endsWith("kg")
                      ? "kg"
                      : "g"
                  }
                  onValueChange={(unit) => {
                    if (!unit) return;

                    const number = (variant.optionValue ?? "").replace(
                      /[^\d.]/g,
                      ""
                    );

                    handleOptionValueChange(
                      variantIndex,
                      `${number}${unit}`
                    );
                  }}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="g">Gram</SelectItem>
                    <SelectItem value="kg">Kilogram</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : OPTION_VALUES[optionType] ? (
              <>
                <Select
                  value={
                    OPTION_VALUES[optionType].includes(
                      variant.optionValue
                    )
                      ? variant.optionValue
                      : "Other"
                  }
                  onValueChange={(value) => {
                    if (!value) return;

                    if (value === "Other") {
                      handleOptionValueChange(variantIndex, "");
                    } else {
                      handleOptionValueChange(
                        variantIndex,
                        value
                      );
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select value" />
                  </SelectTrigger>

                  <SelectContent>
                    {(OPTION_VALUES[optionType] ?? []).map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}

                    <SelectItem value="Other">
                      Other
                    </SelectItem>
                  </SelectContent>
                </Select>

                {!OPTION_VALUES[optionType].includes(
                  variant.optionValue
                ) && (
                  <Input
                    className="mt-2"
                    placeholder="Enter custom value"
                    value={variant.optionValue}
                    onChange={(e) =>
                      handleOptionValueChange(
                        variantIndex,
                        e.target.value
                      )
                    }
                  />
                )}
              </>
            ) : (
              <Input
                value={variant.optionValue}
                onChange={(e) =>
                  handleOptionValueChange(
                    variantIndex,
                    e.target.value
                  )
                }
                placeholder="Enter custom value"
              />
            )}
          </div>
            {/* Price Input */}
            <div>
              <Label>Price</Label>
              <Input
                type="number"
                value={variant.price}
                onChange={(e) =>
                  updateVariantField(
                    colorIndex,
                    variantIndex,
                    "price",
                    Number(e.target.value)
                  )
                }
              />
            </div>

            {/* Stock Input */}
            <div>
              <Label>Stock</Label>
              <Input
                type="number"
                value={variant.stock}
                onChange={(e) =>
                  updateVariantField(
                    colorIndex,
                    variantIndex,
                    "stock",
                    Number(e.target.value)
                  )
                }
              />
            </div>

            {/* Auto-Generated Read-Only SKU */}
            <div>
              <Label>SKU (Auto)</Label>
              <Input
                value={variant.sku ?? ""}
                readOnly
                disabled
                className="bg-muted font-mono text-xs uppercase"
              />
            </div>
          </div>

          {/* Remove Button */}
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

      {/* Add Variant Button */}
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