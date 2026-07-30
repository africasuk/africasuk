import { ProductRepository } from "@/repositories/ProductRepository";
import { supabase } from "@/lib/supabase/client";

const repository = new ProductRepository(supabase);

export const ProductService = {
  getAll: () => repository.getAll(),
  getById: (id: string) => repository.getById(id),
  getBySlug: (slug: string) => repository.getBySlug(slug),
};