import type {
  ExchangeRate,
  UpdateExchangeRateDto,
} from "@africasuk/types";

import { ExchangeRateRepository } from "@africasuk/database";

export class ExchangeRateService {
  constructor(
    private readonly repository: ExchangeRateRepository,
  ) {}

  async getCurrent(): Promise<ExchangeRate | null> {
    return this.repository.getCurrent();
  }

  async getHistory(): Promise<
    ExchangeRate[]
  > {
    return this.repository.getHistory();
  }

  async updateRate(
    dto: UpdateExchangeRateDto,
    updatedBy?: string,
  ): Promise<ExchangeRate> {
    if (dto.rate <= 0) {
      throw new Error(
        "Exchange rate must be greater than zero.",
      );
    }

    return this.repository.create(
      dto,
      updatedBy,
    );
  }

  convertUsdToSsp(
    amount: number,
    rate: number,
  ): number {
    return Number(
      (amount * rate).toFixed(2),
    );
  }

  convertSspToUsd(
    amount: number,
    rate: number,
  ): number {
    return Number(
      (amount / rate).toFixed(2),
    );
  }
}