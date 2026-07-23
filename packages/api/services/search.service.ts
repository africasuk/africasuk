import type { Product } from "@africasuk/types";

import { ProductRepository } from "@africasuk/database";

export interface GlobalSearchResult {
  products: Product[];
}

export class SearchService {
  constructor(
    private readonly productRepository: ProductRepository
  ) {}

  /**
   * Search products only.
   * This will later be extended to search
   * brands, categories, businesses, suppliers, etc.
   */
  async search(
    query: string
  ): Promise<GlobalSearchResult> {
    const search = query.trim();

    if (!search) {
      return {
        products: [],
      };
    }

    const products =
      await this.productRepository.search(
        search
      );

    return {
      products,
    };
  }

  async searchProducts(
    query: string
  ): Promise<Product[]> {
    const search = query.trim();

    if (!search) {
      return [];
    }

    return this.productRepository.search(
      search
    );
  }
}