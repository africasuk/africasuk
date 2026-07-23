import { BrandRepository } from "@africasuk/database";
import {
  brandSchema,
  type BrandFormData,
} from "@africasuk/validation";
import type { Brand } from "@africasuk/types";

export class BrandService {
  constructor(
    private readonly repository: BrandRepository
  ) {}

  async getAll(): Promise<Brand[]> {
    return this.repository.getAll();
  }

  async getById(id: string): Promise<Brand> {
    return this.repository.getById(id);
  }

  async create(
    data: BrandFormData
  ): Promise<Brand> {
    const validated = brandSchema.parse(data);

    const brands = await this.repository.getAll();

    const exists = brands.some(
      (brand) =>
        brand.name.toLowerCase() ===
        validated.name.toLowerCase()
    );

    if (exists) {
      throw new Error("Brand already exists.");
    }

    const slug =
      validated.slug?.trim() ||
      validated.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");

    return this.repository.create({
      name: validated.name,
      slug,
      logoUrl: validated.logoUrl ?? null,
      description: validated.description ?? null,
      website: validated.website ?? null,
      isActive: validated.isActive,
    });
  }

  async update(
    id: string,
    data: Partial<BrandFormData>
  ): Promise<Brand> {
    const brand = await this.repository.getById(id);

    if (!brand) {
      throw new Error("Brand not found.");
    }

    if (data.name) {
      const brands = await this.repository.getAll();

      const exists = brands.some(
        (item) =>
          item.id !== id &&
          item.name.toLowerCase() ===
            data.name!.toLowerCase()
      );

      if (exists) {
        throw new Error("Brand already exists.");
      }
    }

    const updates: Partial<Brand> = {
      ...brand,
      ...data,
    };

    if (data.name && !data.slug) {
      updates.slug = data.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");
    }

    return this.repository.update(id, updates);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}