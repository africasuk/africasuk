"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { Color, Variant } from "./types";

interface ProductVariantListProps {
  color: Color;
  colorIndex: number;
  addVariant: (colorIndex: number) => void;
  removeVariant: (
    colorIndex: number,
    variantIndex: number
  ) => void;
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
  addVariant,
  removeVariant,
  updateVariantField,
}: ProductVariantListProps) {
  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">
        Variants ({color.name || "No color specified"})
      </Label>

      {color.variants.map((variant, variantIndex) => (
        <div
          key={variantIndex}
          className="space-y-4 rounded-lg border p-4"
        >
          <div className="grid grid-cols-2 items-end gap-4 md:grid-cols-4">
            <div>
              <Label>{color.optionName || "Option Value"}</Label>

              <Input
                value={variant.optionValue}
                onChange={(e) =>
                  updateVariantField(
                    colorIndex,
                    variantIndex,
                    "optionValue",
                    e.target.value
                  )
                }
                placeholder="e.g. 128GB, XL"
              />
            </div>

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

            <div>
              <Label>SKU</Label>

              <Input
                value={variant.sku}
                onChange={(e) =>
                  updateVariantField(
                    colorIndex,
                    variantIndex,
                    "sku",
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="destructive"
              onClick={() =>
                removeVariant(colorIndex, variantIndex)
              }
            >
              Remove
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