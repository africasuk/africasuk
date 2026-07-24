"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProductInfoCard } from "./ProductInfoCard";
import { ColorGroupCard } from "./ColorGroupCard";
import { submitProduct } from "./submitProduct";
import type {
  Color,
  ProductFormProps,
  ProductInfo,
  Variant,
} from "./types";
import { validateProduct } from "./validation";

export function ProductForm({
  product,
  categories,
  brands,
}: ProductFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [info, setInfo] = useState<ProductInfo>({
    name: product?.name ?? "",
    description: product?.description ?? "",
    categoryId: product?.categoryId ?? "",
    brandId: product?.brandId ?? "",
    isActive: product?.isActive ?? true,
  });

  const initialColors: Color[] =
    product?.colors
      ?.filter(
        (color) =>
          color.images.length > 0 ||
          color.variants.length > 0
      )
      .map((color) => ({
        name: color.name,
        optionName: color.variants[0]?.optionName ?? "",
        images: color.images.map((image) => ({
          id: image.id,
          url: image.imageUrl,
        })),
        variants: color.variants.map((variant) => ({
          optionValue: variant.optionValue,
          price: Number(variant.price),
          stock: variant.stock,
          sku: variant.sku ?? "",
        })),
      })) ?? [
      {
        name: "",
        optionName: "",
        images: [],
        variants: [
          {
            optionValue: "",
            price: 0,
            stock: 0,
            sku: "",
          },
        ],
      },
    ];

  const [colors, setColors] = useState<Color[]>(initialColors);

  // Form Field Handlers
  const updateInfoField = <K extends keyof ProductInfo>(
    field: K,
    value: ProductInfo[K]
  ) => {
    setInfo((prev) => ({ ...prev, [field]: value }));
  };

  const addColor = () => {
    setColors((prev) => [
      ...prev,
      {
        name: "",
        optionName: "",
        images: [],
        variants: [
          {
            optionValue: "",
            price: 0,
            stock: 0,
            sku: "",
          },
        ],
      },
    ]);
  };

  const removeColor = (colorIndex: number) => {
    setColors((prev) => prev.filter((_, i) => i !== colorIndex));
  };

  const updateColorField = <K extends keyof Color>(
    colorIndex: number,
    field: K,
    value: Color[K]
  ) => {
    setColors((prev) =>
      prev.map((color, i) =>
        i === colorIndex ? { ...color, [field]: value } : color
      )
    );
  };

  const addVariant = (colorIndex: number) => {
    setColors((prev) =>
      prev.map((color, i) => {
        if (i !== colorIndex) return color;
        return {
          ...color,
          variants: [
            ...color.variants,
            { optionValue: "", price: 0, stock: 0, sku: "" },
          ],
        };
      })
    );
  };

  const removeVariant = (colorIndex: number, variantIndex: number) => {
    setColors((prev) =>
      prev.map((color, i) => {
        if (i !== colorIndex) return color;
        return {
          ...color,
          variants: color.variants.filter((_, vI) => vI !== variantIndex),
        };
      })
    );
  };

  const updateVariantField = <K extends keyof Variant>(
    colorIndex: number,
    variantIndex: number,
    field: K,
    value: Variant[K]
  ) => {
    setColors((prev) =>
      prev.map((color, cI) => {
        if (cI !== colorIndex) return color;
        return {
          ...color,
          variants: color.variants.map((variant, vI) =>
            vI === variantIndex ? { ...variant, [field]: value } : variant
          ),
        };
      })
    );
  };

  // Submit Handler using standalone helper
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    setError(null);

    // Validate form state before submitting
    const validation = validateProduct(info, colors);
    if (!validation.valid) {
      setError(validation.message ?? "Invalid product.");
      setSubmitting(false);
      return;
    }

    try {
      await submitProduct({
        product,
        info,
        colors,
      });

      router.push("/products");
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-12">
      {error && (
        <div className="rounded-md bg-destructive/15 p-4 text-sm text-destructive font-medium">
          {error}
        </div>
      )}

      {/* Basic Product Info */}
      <ProductInfoCard
        info={info}
        categories={categories}
        brands={brands}
        updateInfoField={updateInfoField}
      />

      {/* Color Groups & Variants */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Product Variants & Media</h2>
          <Button type="button" onClick={addColor} variant="outline">
            Add Color Group
          </Button>
        </div>

        {colors.map((color, colorIndex) => (
          <ColorGroupCard
            key={colorIndex}
            color={color}
            colorIndex={colorIndex}
            removeColor={removeColor}
            updateColorField={updateColorField}
            addVariant={addVariant}
            removeVariant={removeVariant}
            updateVariantField={updateVariantField}
          />
        ))}
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting
            ? "Saving..."
            : product?.id
            ? "Update Product"
            : "Create Product"}
        </Button>
      </div>
    </form>
  );
}

export * from "./types";