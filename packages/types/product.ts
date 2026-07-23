export interface Product {
  id: string;

  categoryId: string;
  brandId: string;

  name: string;
  description: string | null;

  isActive: boolean;

  // Payment settings
  allowCod: boolean;
  allowOnlinePayment: boolean;

  slug: string;

  createdAt: string;
  updatedAt: string;
}


export interface ProductColor {
  id: string;

  productId: string;

  name: string;
  hexCode: string | null;

  images: ProductImage[];

  createdAt: string;
  updatedAt: string;
}


export interface ProductImage {
  id: string;

  productColorId: string;

  imageUrl: string;
  sortOrder: number;

  createdAt: string;
}


export interface ProductVariant {
  id: string;

  productColorId: string;

  optionName: string;
  optionValue: string;

  price: number;
  stock: number;

  sku: string | null;

  isActive: boolean;

  productColor?: ProductColor;

  createdAt: string;
  updatedAt: string;
}

export interface CreateProductVariantDto {
  optionValue: string;
  price: number;
  stock: number;
  sku?: string | null;
}


export interface CreateProductColorDto {
  name: string;
  hexCode?: string | null;

  optionName: string;

  images: string[];

  variants: CreateProductVariantDto[];
}


export interface CreateProductDto {
  categoryId: string;
  brandId: string;

  name: string;
  description: string | null;

  isActive: boolean;

  allowCod?: boolean;
  allowOnlinePayment?: boolean;

  colors: CreateProductColorDto[];
}


export interface UpdateProductDto
  extends Partial<CreateProductDto> {}


export interface ProductWithDetails extends Product {

  category?: {
    id: string;
    name: string;
  };

  brand?: {
    id: string;
    name: string;
  };


  colors: (
    ProductColor & {
      images: ProductImage[];
      variants: ProductVariant[];
    }
  )[];
}