export interface CartOption {
  optionName: string;
  value: string;
}


export interface CartItem {
  productId: string;
  variantId: string;

  name: string;
  slug: string;

  image: string;

  price: number;

  quantity: number;

  stock: number;

  allowCod: boolean;
  allowOnlinePayment: boolean;

  options: CartOption[];
}