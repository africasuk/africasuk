import { CategoryRepository } from "@africasuk/database";
import {
  categorySchema,
  type CategoryFormData,
} from "@africasuk/validation";

import type { Category } from "@africasuk/types";

export class CategoryService {
  constructor(
    private readonly repository: CategoryRepository
  ) {}

  async getAll(): Promise<Category[]> {
    return this.repository.getAll();
  }

  async getById(id: string): Promise<Category> {
    return this.repository.getById(id);
  }

  async getBySlug(slug: string): Promise<Category> {
    return this.repository.getBySlug(slug);
  }

  async create(
    data: CategoryFormData
  ): Promise<Category> {
    const validated = categorySchema.parse(data);

    const exists = await this.repository.existsByName(
      validated.name
    );

    if (exists) {
      throw new Error("Category already exists.");
    }

    const slug =
      validated.slug?.trim() ||
      validated.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");

   const parent =
  validated.parentId &&
  validated.parentId !== "none"
    ? await this.repository.getById(validated.parentId)
    : null;

      const level = parent ? parent.level + 1 : 0;

      return this.repository.create({
        name: validated.name,
        slug,
        description: validated.description ?? null,
        imageUrl: validated.imageUrl ?? null,

        parentId: parent?.id ?? null,
        level,

        isActive: validated.isActive,
        sortOrder: 0,
      });
  }

  async update(
    id: string,
    data: Partial<CategoryFormData>
  ): Promise<Category> {
    const category = await this.repository.getById(id);

    if (!category) {
      throw new Error("Category not found.");
    }

    if (data.name) {
      const categories = await this.repository.getAll();

      const exists = categories.some(
        (item) =>
          item.id !== id &&
          item.name.toLowerCase() ===
            data.name!.toLowerCase()
      );

      if (exists) {
        throw new Error("Category already exists.");
      }
    }

    const updates: Partial<Category> = {
      ...category,
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

  async reorder(
  items: {
    id: string;
    sortOrder: number;
  }[]
): Promise<void> {
  await this.repository.updateOrder(items);
}


  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}