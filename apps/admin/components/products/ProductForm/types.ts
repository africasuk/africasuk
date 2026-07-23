import type { ProductWithDetails } from "@africasuk/types";

export interface ProductInfo {
  name: string;
  description: string;
  categoryId: string;
  brandId: string;
  isActive: boolean;
}

export type Variant = {
  id?: string;
  optionValue: string;
  price: number;
  stock: number;
  sku: string;
};

export type ProductImageState = {
  id?: string;
  url?: string;
  file?: File;
};

export type Color = {
  id?: string;
  name: string;
  optionName: string;
  images: ProductImageState[];
  variants: Variant[];
};

export interface CategoryOption {
  id: string;
  name: string;
}

export interface BrandOption {
  id: string;
  name: string;
}

export interface ProductFormProps {
  product?: ProductWithDetails;
  categories: CategoryOption[];
  brands: BrandOption[];
}

export type { ProductWithDetails };