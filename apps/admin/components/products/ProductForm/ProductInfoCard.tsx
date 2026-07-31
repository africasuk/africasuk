"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    value: ProductInfo[K]
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Information</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input
            value={info.name}
            onChange={(e) => updateInfoField("name", e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Description</Label>
          <Textarea
            value={info.description}
            onChange={(e) => updateInfoField("description", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Category</Label>
            <Select
              value={info.categoryId}
              onValueChange={(val) =>
                updateInfoField("categoryId", val ?? "")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
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

          <div>
            <Label>Brand</Label>
            <Select
              value={info.brandId}
              onValueChange={(val) =>
                    updateInfoField("brandId", val ?? "")
                  }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select brand" />
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
            onCheckedChange={(val) => updateInfoField("isActive", val)}
          />
          <Label>Active</Label>
        </div>
      </CardContent>
    </Card>
  );
}