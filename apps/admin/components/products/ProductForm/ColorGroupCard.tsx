
"use client";

import { useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductVariantList } from "./ProductVariantList";
import type {
  Color,
  Variant,
  ProductImageState,
} from "./types";

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

const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function getImageFile(
  image: ProductImageState
): File | undefined {
  return image.file;
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [imageError, setImageError] = useState("");

  const addImages = (fileList: FileList | File[]) => {
    setImageError("");

    const selected = Array.from(fileList);
    const remaining = MAX_IMAGES - color.images.length;

    if (remaining <= 0) {
      setImageError(`Maximum ${MAX_IMAGES} images per color.`);
      return;
    }

    const valid: File[] = [];
    const errors: string[] = [];

    for (const file of selected) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        errors.push(`${file.name}: use JPG, PNG, or WebP.`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: maximum size is 8 MB.`);
        continue;
      }

      const duplicate = [...color.images, ...valid].some(
        (image) => {
          const existingFile =
            image instanceof File ? image : getImageFile(image);

          return (
            existingFile?.name === file.name &&
            existingFile?.size === file.size &&
            existingFile?.lastModified === file.lastModified
          );
        }
      );

      if (!duplicate) {
        valid.push(file);
      }
    }

    const accepted = valid.slice(0, remaining);

    if (valid.length > remaining) {
      errors.push(`Only ${remaining} more image(s) can be added.`);
    }

    if (accepted.length > 0) {
      updateColorField(colorIndex, "images", [
        ...color.images,
        ...accepted.map((file) => ({ file })),
      ]);
    }

    if (errors.length) {
      setImageError(errors.join(" "));
    }
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const target = index + direction;

    if (target < 0 || target >= color.images.length) return;

    const reordered = [...color.images];

    [reordered[index], reordered[target]] = [
      reordered[target],
      reordered[index],
    ];

    updateColorField(colorIndex, "images", reordered);
  };

  const removeImage = (index: number) => {
    updateColorField(
      colorIndex,
      "images",
      color.images.filter((_, i) => i !== index)
    );

    setImageError("");
  };

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
        <div className="space-y-2">
          <Label>Color Name</Label>

          <Input
            value={color.name}
            onChange={(e) =>
              updateColorField(colorIndex, "name", e.target.value)
            }
            placeholder="e.g. Space Black"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Product Images</Label>

            <span className="text-xs text-muted-foreground">
              {color.images.length}/{MAX_IMAGES}
            </span>
          </div>

          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                addImages(e.target.files);
              }

              e.target.value = "";
            }}
          />

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragEnter={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();

              if (
                !e.currentTarget.contains(
                  e.relatedTarget as Node | null
                )
              ) {
                setDragging(false);
              }
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              addImages(e.dataTransfer.files);
            }}
            disabled={color.images.length >= MAX_IMAGES}
            className={`flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              dragging
                ? "border-primary bg-primary/10"
                : "border-muted-foreground/30 hover:border-primary hover:bg-muted/50"
            }`}
          >
            <span className="text-3xl" aria-hidden="true">
              {dragging ? "📥" : "🖼️"}
            </span>

            <span className="font-medium">
              {dragging
                ? "Drop images here"
                : "Drag and drop product images"}
            </span>

            <span className="text-sm text-muted-foreground">
              or click to browse · JPG, PNG, WebP · Max 8 MB each
            </span>
          </button>

          {imageError && (
            <p role="alert" className="text-sm text-destructive">
              {imageError}
            </p>
          )}

          {color.images.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {color.images.map((image, index) => {
                const imageFile = getImageFile(image);
                const src = imageFile
                  ? URL.createObjectURL(imageFile)
                  : image.url ?? "";

                return (
                  <div
                    key={
                      imageFile
                        ? `${imageFile.name}-${imageFile.lastModified}-${index}`
                        : image.id ?? `existing-${index}`
                    }
                    className="relative overflow-hidden rounded-lg border bg-muted"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`${color.name || `Color ${colorIndex + 1}`} image ${index + 1}`}
                      className="aspect-square w-full object-cover"
                    />

                    {index === 0 && (
                      <span className="absolute left-2 top-2 rounded bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
                        Main Image
                      </span>
                    )}

                    <div className="flex items-center justify-between gap-1 p-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={index === 0}
                        aria-label="Move image left"
                        onClick={() => moveImage(index, -1)}
                      >
                        ←
                      </Button>

                      <span className="text-xs text-muted-foreground">
                        {index + 1}/{color.images.length}
                      </span>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={index === color.images.length - 1}
                        aria-label="Move image right"
                        onClick={() => moveImage(index, 1)}
                      >
                        →
                      </Button>
                    </div>

                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="m-2 mt-0 w-[calc(100%-1rem)]"
                      onClick={() => removeImage(index)}
                    >
                      Remove Image
                    </Button>
                  </div>
                );
              })}
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
