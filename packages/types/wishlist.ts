export interface WishlistItem {
  productId: string;

  variantId: string;

  name: string;

  slug: string;

  image: string;

  price: number;

  stock: number;

  quantity: number;

  allowCod: boolean;

  allowOnlinePayment: boolean;

  options: {
    optionName: string;
    value: string;
  }[];
}