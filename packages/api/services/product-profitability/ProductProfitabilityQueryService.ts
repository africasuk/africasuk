import {
  ProductProfitabilityRepository,
} from "@africasuk/database";

export class ProductProfitabilityQueryService {
  constructor(
    private readonly repository: ProductProfitabilityRepository
  ) {}

  async getAll() {
    return this.repository.getAll();
  }

  async getByVariantId(
    variantId: string
  ) {
    return this.repository.getByVariantId(
      variantId
    );
  }

  async getByColorId(
    colorId: string
  ) {
    return this.repository.getByColorId(
      colorId
    );
  }
}