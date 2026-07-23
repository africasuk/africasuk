"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/store/cart";
import CheckoutPaymentMethod from "./CheckoutPaymentMethod";

interface PaymentSetting {
  id: string;
  allowCod: boolean;
  allowOnlinePayment: boolean;
}

export default function CheckoutPaymentWrapper() {
  const items = useCart((state) => state.items);

  const [products, setProducts] = useState<PaymentSetting[]>([]);

  useEffect(() => {
    async function load() {
      if (!items.length) {
        setProducts([]);
        return;
      }

      const ids = items
        .map((item) => item.productId)
        .join(",");

      const res = await fetch(
        `/api/products/payment-settings?ids=${ids}`,
        {
          cache: "no-store",
        }
      );

      const data: PaymentSetting[] =
        await res.json();

      setProducts(data);
    }

    load();
  }, [items]);

  return (
    <CheckoutPaymentMethod
      products={products}
    />
  );
}