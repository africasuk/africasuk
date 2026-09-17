import { ProductRepository } from "@africasuk/database";

export class ProductQueryService {
  constructor(
    private readonly repository: ProductRepository
  ) {}

  async getAll(options?: { random?: boolean }) {
    return this.repository.getAll(options);
  }

  async getById(id: string) {
    return this.repository.getById(id);
  }

  async getBySlug(slug: string) {
    return this.repository.getBySlug(slug);
  }
}