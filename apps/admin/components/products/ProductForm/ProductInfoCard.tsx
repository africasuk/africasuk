
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { ProductInfo } from "./types";

interface ProductInfoCardProps {
  info: ProductInfo;
  updateInfoField: <K extends keyof ProductInfo>(
    field: K,
    value: ProductInfo[K],
  ) => void;
  categories: Array<{ id: string; name: string }>;
  brands: Array<{ id: string; name: string }>;
}

export function ProductInfoCard({
  info,
  updateInfoField,
  categories,
  brands,
}: ProductInfoCardProps) {
  const othersBrand = brands.find(
    (brand) => brand.name.trim().toLowerCase() === "others",
  );

  const selectedBrandId = info.brandId || othersBrand?.id || "";

  const selectedCategory = categories.find(
    (category) => category.id === info.categoryId,
  );

  const selectedBrand = brands.find(
    (brand) => brand.id === selectedBrandId,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Information</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            value={info.name}
            onChange={(e) => updateInfoField("name", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={info.description}
            onChange={(e) =>
              updateInfoField("description", e.target.value)
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={info.categoryId}
              onValueChange={(value) =>
                updateInfoField("categoryId", value ?? "")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category">
                  {selectedCategory?.name ?? "Select category"}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Brand</Label>
            <Select
              value={selectedBrandId}
              onValueChange={(value) =>
                updateInfoField(
                  "brandId",
                  value ?? othersBrand?.id ?? "",
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select brand">
                  {selectedBrand?.name ?? "Select brand"}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={info.isActive}
            onCheckedChange={(value) =>
              updateInfoField("isActive", value)
            }
          />
          <Label>Active</Label>
        </div>
      </CardContent>
    </Card>
  );
}
