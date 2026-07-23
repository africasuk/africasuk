import type { DatabaseClient } from "../types";
import type { Category } from "@africasuk/types";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  level: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export class CategoryRepository {
  constructor(private readonly db: DatabaseClient) {}

  private mapCategory(row: CategoryRow): Category {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      imageUrl: row.image_url,
      parentId: row.parent_id,
      level: row.level,
      sortOrder: row.sort_order,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async getAll(): Promise<Category[]> {
    const { data, error } = await this.db
      .from("categories")
      .select("*")
      .order("sort_order")
      .order("name");

    if (error) throw error;

    return (data ?? []).map((row) =>
      this.mapCategory(row as CategoryRow)
    );
  }

  async getById(id: string): Promise<Category> {
    const { data, error } = await this.db
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return this.mapCategory(data as CategoryRow);
  }

  async getBySlug(slug: string): Promise<Category> {
    const { data, error } = await this.db
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;

    return this.mapCategory(data as CategoryRow);
  }

  async existsByName(name: string): Promise<boolean> {
    const { count, error } = await this.db
      .from("categories")
      .select("*", {
        head: true,
        count: "exact",
      })
      .ilike("name", name);

    if (error) throw error;

    return (count ?? 0) > 0;
  }

  async create(
    category: Omit<
      Category,
      "id" | "createdAt" | "updatedAt"
    >
  ): Promise<Category> {
    const { data, error } = await this.db
      .from("categories")
      .insert({
        name: category.name,
        slug: category.slug,
        description: category.description,
        image_url: category.imageUrl,
        parent_id: category.parentId,
        level: category.level,
        sort_order: category.sortOrder,
        is_active: category.isActive,
      })
      .select()
      .single();

    if (error) throw error;

    return this.mapCategory(data as CategoryRow);
  }

  async update(
    id: string,
    updates: Partial<
      Omit<
        Category,
        "id" | "createdAt" | "updatedAt"
      >
    >
  ): Promise<Category> {
    const payload: Record<string, unknown> = {};

    if (updates.name !== undefined)
      payload.name = updates.name;

    if (updates.slug !== undefined)
      payload.slug = updates.slug;

    if (updates.description !== undefined)
      payload.description = updates.description;

    if (updates.imageUrl !== undefined)
      payload.image_url = updates.imageUrl;

    if (updates.parentId !== undefined)
      payload.parent_id = updates.parentId;

    if (updates.level !== undefined)
      payload.level = updates.level;

    if (updates.sortOrder !== undefined)
      payload.sort_order = updates.sortOrder;

    if (updates.isActive !== undefined)
      payload.is_active = updates.isActive;

    const { data, error } = await this.db
      .from("categories")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return this.mapCategory(data as CategoryRow);
  }

  async updateOrder(
  items: {
    id: string;
    sortOrder: number;
  }[]
): Promise<void> {
  for (const item of items) {
    const { error } = await this.db
      .from("categories")
      .update({
        sort_order: item.sortOrder,
      })
      .eq("id", item.id);

    if (error) throw error;
  }
}

  async delete(id: string): Promise<void> {
    const { error } = await this.db
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
}