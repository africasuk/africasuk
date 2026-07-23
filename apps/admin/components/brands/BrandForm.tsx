"use client";

import Image from "next/image";

import type { Brand } from "@africasuk/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BrandFormProps {
  mode: "create" | "edit";
  brand?: Brand;
  loading?: boolean;
  submitLabel?: string;
  onSubmit: (
    e: React.FormEvent<HTMLFormElement>
  ) => Promise<void>;
}

export default function BrandForm({
  mode,
  brand,
  loading = false,
  submitLabel,
  onSubmit,
}: BrandFormProps) {
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
                Brand Name
              </Label>

              <Input
                id="name"
                name="name"
                required
                defaultValue={brand?.name}
                placeholder="Samsung"
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
                  brand?.description ?? ""
                }
                placeholder="Describe this brand..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">
                Website
              </Label>

              <Input
                id="website"
                name="website"
                type="url"
                defaultValue={
                  brand?.website ?? ""
                }
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">
                Brand Logo
              </Label>

              <Input
                  id="logo"
                  name="logo"
                  type="file"
                  accept="image/*"
                  required={mode === "create"}
                />

              {brand?.logoUrl && (
                <div className="relative mt-3 h-24 w-24 overflow-hidden rounded-lg border">
                  <Image
                    src={brand.logoUrl}
                    alt={brand.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
              )}
            </div>
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
                    ? "Create Brand"
                    : "Save Changes")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}