import { createClient } from "@/lib/auth/client";

export interface PaymentSetting {
  id: string;
  allowCod: boolean;
  allowOnlinePayment: boolean;
}

type ProductPaymentSettings = {
  id: string;
  allow_cod: boolean;
  allow_online_payment: boolean;
};

export class PaymentService {
  static async getPaymentSettings(productIds: string[]) {
    try {
      if (!productIds.length) {
        return {
          data: [] as PaymentSetting[],
          error: null,
        };
      }

      const supabase = createClient();

      const { data, error } = await supabase
        .from("products")
        .select("id, allow_cod, allow_online_payment")
        .in("id", productIds);

      if (error) {
        throw error;
      }

      const products = (data ?? []) as ProductPaymentSettings[];

      return {
        data: products.map((product) => ({
          id: product.id,
          allowCod: product.allow_cod,
          allowOnlinePayment: product.allow_online_payment,
        })),
        error: null,
      };
    } catch (error) {
      return {
        data: [] as PaymentSetting[],
        error:
          error instanceof Error
            ? error.message
            : "Failed to load payment settings.",
      };
    }
  }
}