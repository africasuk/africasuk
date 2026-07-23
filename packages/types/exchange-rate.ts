export interface ExchangeRate {
  id: string;

  baseCurrency: CurrencyCode;

  targetCurrency: CurrencyCode;

  rate: number;

  effectiveDate: string;

  notes?: string | null;

  updatedBy?: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface UpdateExchangeRateDto {
  rate: number;

  effectiveDate?: string;

  notes?: string;
}

export type CurrencyCode =
  | "USD"
  | "SSP";