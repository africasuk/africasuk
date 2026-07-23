import type {
  ExchangeRate,
  UpdateExchangeRateDto,
} from "@africasuk/types";

import type { SupabaseClient } from "@supabase/supabase-js";

export class ExchangeRateRepository {
  constructor(
    private readonly supabase: SupabaseClient,
  ) {}

 private map(
  row: any,
): ExchangeRate {
  return {
    id: row.id,
    baseCurrency:
      row.base_currency,
    targetCurrency:
      row.target_currency,
    rate: Number(row.rate),
    effectiveDate:
      row.effective_date,
    notes:
      row.notes,
    updatedBy:
      row.updated_by,
    createdAt:
      row.created_at,
    updatedAt:
      row.updated_at,
  };
}

  async getCurrent(): Promise<ExchangeRate | null> {
    const { data, error } =
      await this.supabase
        .from("exchange_rates")
        .select("*")
        .eq("base_currency", "USD")
        .eq("target_currency", "SSP")
        .order("effective_date", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

    if (error) {
      throw error;
    }

    return data
      ? this.map(data)
      : null;
  }

  async getHistory(): Promise<
    ExchangeRate[]
  > {
    const { data, error } =
      await this.supabase
        .from("exchange_rates")
        .select("*")
        .eq("base_currency", "USD")
        .eq("target_currency", "SSP")
        .order("effective_date", {
          ascending: false,
        });

    if (error) {
      throw error;
    }

    return (data ?? []).map(
      (row) => this.map(row),
    );
  }

  async create(
    rate: UpdateExchangeRateDto,
    updatedBy?: string,
  ): Promise<ExchangeRate> {
    const { data, error } =
      await this.supabase
        .from("exchange_rates")
        .insert({
          base_currency: "USD",
          target_currency: "SSP",
          rate: rate.rate,
          effective_date:
            rate.effectiveDate ??
            new Date().toISOString(),
          notes:
            rate.notes ?? null,
          updated_by:
            updatedBy ?? null,
        })
        .select()
        .single();

    if (error) {
      throw error;
    }

    return this.map(data);
  }
}