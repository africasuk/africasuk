"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductVariantList } from "./ProductVariantList";

import type { Color, Variant } from "./types";

interface ColorGroupCardProps {
  color: Color;
  colorIndex: number;
  productName?: string;
  removeColor: (index: number) => void;
  updateColorField: <K extends keyof Color>(
    colorIndex: number,
    field: K,
    value: Color[K]
  ) => void;
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

export function ColorGroupCard({
  color,
  colorIndex,
  productName,
  removeColor,
  updateColorField,
  addVariant,
  removeVariant,
  updateVariantField,
}: ColorGroupCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Color {colorIndex + 1}</CardTitle>

        <Button
          type="button"
          variant="destructive"
          onClick={() => removeColor(colorIndex)}
        >
          Remove Color
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <Label>Color Name</Label>

          <Input
            value={color.name}
            onChange={(e) =>
              updateColorField(
                colorIndex,
                "name",
                e.target.value
              )
            }
            placeholder="e.g. Space Black"
          />
        </div>

        {/* Images */}
        <div className="space-y-3">
          <Label>Images</Label>

          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              const files = Array.from(
                e.target.files ?? []
              ).map((file) => ({
                file,
              }));

              updateColorField(colorIndex, "images", [
                ...color.images,
                ...files,
              ]);
            }}
          />

          {color.images.length > 0 && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {color.images.map((image, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-lg border"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      image.file
                        ? URL.createObjectURL(image.file)
                        : image.url ?? ""
                    }
                    alt=""
                    className="h-32 w-full object-cover"
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() =>
                      updateColorField(
                        colorIndex,
                        "images",
                        color.images.filter(
                          (_, i) => i !== index
                        )
                      )
                    }
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <ProductVariantList
          productName={productName}
          color={color}
          colorIndex={colorIndex}
          updateColorField={updateColorField}
          addVariant={addVariant}
          removeVariant={removeVariant}
          updateVariantField={updateVariantField}
        />
      </CardContent>
    </Card>
  );
}