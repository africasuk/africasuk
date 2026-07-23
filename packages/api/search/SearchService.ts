import { Redis } from "@upstash/redis";
import type { ProductWithDetails } from "@africasuk/types";
import type { SupabaseClient } from "@supabase/supabase-js";


const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});


export class SearchRepository {

  constructor(
    private readonly db: SupabaseClient
  ) {}


  async search(
    query: string
  ): Promise<ProductWithDetails[]> {


    const key =
      `search:${query.toLowerCase().trim()}`;


    const cached =
      await redis.get<ProductWithDetails[]>(key);


    if (cached) {
      return cached;
    }



    const { data, error } =
      await this.db.rpc(
        "search_products",
        {
          search_query: query,
        }
      );


    if (error) {
      throw error;
    }


    const products =
      (data ?? []) as ProductWithDetails[];



    await redis.set(
      key,
      products,
      {
        ex: 300,
      }
    );


    return products;
  }
}