"use client";

import type { Category } from "@africasuk/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

interface CategoryFormProps {
  mode: "create" | "edit";
  category?: Category;
  loading?: boolean;
  submitLabel?: string;
  onSubmit: (
    e: React.FormEvent<HTMLFormElement>
  ) => void;
}

export default function CategoryForm({
  mode,
  category,
  loading = false,
  submitLabel,
  onSubmit,
}: CategoryFormProps) {
  return (
    <Card>
      <CardContent className="space-y-8 pt-6">
        <form
          onSubmit={onSubmit}
          className="space-y-8"
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                Category Name
              </Label>

              <Input
                id="name"
                name="name"
                defaultValue={category?.name}
                placeholder="Electronics"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description
              </Label>

              <Textarea
                id="description"
                name="description"
                rows={5}
                defaultValue={
                  category?.description ?? ""
                }
                placeholder="Describe this category..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">
                Category Image
              </Label>

              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
              />

              {category?.imageUrl && (
                <div className="relative mt-3 h-28 w-28 overflow-hidden rounded-lg border">
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="isActive">
                Active
              </Label>

              <p className="text-sm text-muted-foreground">
                Allow customers to see this
                category.
              </p>
            </div>

            <Switch
              id="isActive"
              name="isActive"
              defaultChecked={
                category?.isActive ?? true
              }
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
            >
              {loading
                ? mode === "create"
                  ? "Creating..."
                  : "Saving..."
                : submitLabel ??
                  (mode === "create"
                    ? "Create Category"
                    : "Save Changes")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}