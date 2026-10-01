import {
  ProductProfitabilityRepository,
  type UpsertProductProfitabilityCostInput,
} from "@africasuk/database";

export class ProductProfitabilityCommandService {
  constructor(
    private readonly repository: ProductProfitabilityRepository
  ) {}

  async upsertCost(
    input: UpsertProductProfitabilityCostInput
  ) {
    return this.repository.upsertCost(input);
  }

  async updateSellingPrice(
    variantId: string,
    price: number
  ) {
    return this.repository.updateSellingPrice(
      variantId,
      price
    );
  }
}