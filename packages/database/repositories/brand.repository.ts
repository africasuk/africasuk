import type { DatabaseClient } from "../types";
import type { Brand } from "@africasuk/types";

type BrandRow = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  website: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export class BrandRepository {
  constructor(private readonly db: DatabaseClient) {}

  private mapBrand(row: BrandRow): Brand {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      logoUrl: row.logo_url,
      description: row.description,
      website: row.website,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async getAll(): Promise<Brand[]> {
    const { data, error } = await this.db
      .from("brands")
      .select("*")
      .order("name");

    if (error) throw error;

    return (data ?? []).map((row) =>
      this.mapBrand(row as BrandRow)
    );
  }

  async getById(id: string): Promise<Brand> {
    const { data, error } = await this.db
      .from("brands")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return this.mapBrand(data as BrandRow);
  }

  async create(
    brand: Omit<
      Brand,
      "id" | "createdAt" | "updatedAt"
    >
  ): Promise<Brand> {
    const { data, error } = await this.db
      .from("brands")
      .insert({
        name: brand.name,
        slug: brand.slug,
        logo_url: brand.logoUrl,
        description: brand.description,
        website: brand.website,
        is_active: brand.isActive,
      })
      .select()
      .single();

    if (error) throw error;

    return this.mapBrand(data as BrandRow);
  }

  async update(
    id: string,
    updates: Partial<
      Omit<
        Brand,
        "id" | "createdAt" | "updatedAt"
      >
    >
  ): Promise<Brand> {
    const payload: Record<string, unknown> = {};

    if (updates.name !== undefined)
      payload.name = updates.name;

    if (updates.slug !== undefined)
      payload.slug = updates.slug;

    if (updates.logoUrl !== undefined)
      payload.logo_url = updates.logoUrl;

    if (updates.description !== undefined)
      payload.description = updates.description;

    if (updates.website !== undefined)
      payload.website = updates.website;

    if (updates.isActive !== undefined)
      payload.is_active = updates.isActive;

    const { data, error } = await this.db
      .from("brands")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return this.mapBrand(data as BrandRow);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.db
      .from("brands")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  async getBySlug(
  slug: string
): Promise<Brand | null> {
  const { data, error } =
    await this.db
      .from("brands")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return this.mapBrand(
    data as BrandRow
  );
}
}