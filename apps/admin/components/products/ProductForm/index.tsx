
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

type CopyField = "price" | "optionValue" | "stock";

export function ProductForm({
  product,
  categories,
  brands,
}: ProductFormProps) {
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Global copy settings shared by every color group.
  const [copySettings, setCopySettings] = useState<
    Record<CopyField, boolean>
  >({
    price: false,
    optionValue: false,
    stock: false,
  });

  const [info, setInfo] = useState<ProductInfo>({
    name: product?.name ?? "",
    description: product?.description ?? "",
    categoryId: product?.categoryId ?? "",
    brandId: product?.brandId ?? "",
    isActive: product?.isActive ?? true,
  });

  const initialColors: Color[] = product?.colors
    ?.filter(
      (color) =>
        color.images.length > 0 || color.variants.length > 0,
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
          stock: 10,
          sku: "",
        },
      ],
    },
  ];

  const [colors, setColors] = useState<Color[]>(initialColors);

  const updateInfoField = <K extends keyof ProductInfo>(
    field: K,
    value: ProductInfo[K],
  ) => {
    setInfo((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const addColor = () => {
    setColors((previous) => [
      ...previous,
      {
        name: "",
        optionName: "",
        images: [],
        variants: [
          {
            optionValue: "",
            price: 0,
            stock: 10,
            sku: "",
          },
        ],
      },
    ]);
  };

  const removeColor = (colorIndex: number) => {
    setColors((previous) =>
      previous.filter((_, index) => index !== colorIndex),
    );
  };

  const updateColorField = <K extends keyof Color>(
    colorIndex: number,
    field: K,
    value: Color[K],
  ) => {
    setColors((previous) =>
      previous.map((color, index) =>
        index === colorIndex
          ? { ...color, [field]: value }
          : color,
      ),
    );
  };

  const addVariant = (colorIndex: number) => {
    setColors((previous) =>
      previous.map((color, index) => {
        if (index !== colorIndex) return color;

        const firstVariant = color.variants[0];

        const newVariant: Variant = {
          optionValue: copySettings.optionValue
            ? firstVariant?.optionValue ?? ""
            : "",
          price: copySettings.price
            ? firstVariant?.price ?? 0
            : 0,
          stock: copySettings.stock
            ? firstVariant?.stock ?? 10
            : 10,
          sku: "",
        };

        return {
          ...color,
          variants: [...color.variants, newVariant],
        };
      }),
    );
  };

  const removeVariant = (
    colorIndex: number,
    variantIndex: number,
  ) => {
    setColors((previous) =>
      previous.map((color, index) => {
        if (index !== colorIndex) return color;

        return {
          ...color,
          variants: color.variants.filter(
            (_, variantPosition) =>
              variantPosition !== variantIndex,
          ),
        };
      }),
    );
  };

  const generateSku = (
    productName: string,
    colorName: string,
    optionValue: string,
  ) => {
    const productPart = (productName || "PRD")
      .slice(0, 3)
      .toUpperCase();

    const colorPart = (colorName || "CLR")
      .slice(0, 3)
      .toUpperCase();

    const optionPart = (optionValue || "OPT")
      .replace(/\s/g, "")
      .toUpperCase();

    return `${productPart}-${colorPart}-${optionPart}`;
  };

  const applyCopyField = (
    field: CopyField,
    enabled: boolean,
  ) => {
    setCopySettings((previous) => ({
      ...previous,
      [field]: enabled,
    }));

    if (!enabled) return;

    setColors((previous) => {
      const source = previous[0]?.variants[0];

      if (!source) return previous;

      const sourceValue = source[field];

      return previous.map((color) => ({
        ...color,
        variants: color.variants.map((variant) => {
          const updated = {
            ...variant,
            [field]: sourceValue,
          };

          if (field === "optionValue") {
            updated.sku = generateSku(
              info.name,
              color.name,
              String(sourceValue ?? ""),
            );
          }

          return updated;
        }),
      }));
    });
  };

  const updateVariantField = <K extends keyof Variant>(
    colorIndex: number,
    variantIndex: number,
    field: K,
    value: Variant[K],
  ) => {
    setColors((previous) => {
      const isMasterVariant =
        colorIndex === 0 && variantIndex === 0;

      const shouldCopy =
        isMasterVariant &&
        (field === "price" ||
          field === "optionValue" ||
          field === "stock") &&
        copySettings[field as CopyField];

      return previous.map((color, currentColorIndex) => ({
        ...color,
        variants: color.variants.map(
          (variant, currentVariantIndex) => {
            const isEdited =
              currentColorIndex === colorIndex &&
              currentVariantIndex === variantIndex;

            if (isEdited) {
              return {
                ...variant,
                [field]: value,
              };
            }

            if (shouldCopy) {
              const updated = {
                ...variant,
                [field]: value,
              };

              if (field === "optionValue") {
                updated.sku = generateSku(
                  info.name,
                  color.name,
                  String(value ?? ""),
                );
              }

              return updated;
            }

            return variant;
          },
        ),
      }));
    });
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setSubmitting(true);
    setError(null);

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
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-5xl space-y-8 pb-12"
    >
      {error && (
        <div className="rounded-md bg-destructive/15 p-4 text-sm font-medium text-destructive">
          {error}
        </div>
      )}

      <ProductInfoCard
        info={info}
        categories={categories}
        brands={brands}
        updateInfoField={updateInfoField}
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold tracking-tight">
            Product Variants &amp; Media
          </h2>

          <Button
            type="button"
            variant="outline"
            onClick={addColor}
          >
            Add Color Group
          </Button>
        </div>

        {colors.map((color, colorIndex) => (
          <ColorGroupCard
            key={colorIndex}
            color={color}
            colorIndex={colorIndex}
            productName={info.name}
            removeColor={removeColor}
            updateColorField={updateColorField}
            addVariant={addVariant}
            removeVariant={removeVariant}
            updateVariantField={updateVariantField}
            showCopyControls={colorIndex === 0}
            copySettings={copySettings}
            onCopySettingChange={applyCopyField}
          />
        ))}
      </div>

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
