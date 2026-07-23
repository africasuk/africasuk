import type { DatabaseClient } from "./types";

export async function withTransaction<T>(
  db: DatabaseClient,
  callback: (db: DatabaseClient) => Promise<T>
): Promise<T> {
  /**
   * Supabase/PostgREST doesn't support client-side SQL
   * transactions across multiple requests.
   *
   * For now we execute the callback directly.
   *
   * Later we'll replace this with a PostgreSQL RPC
   * transaction if we need true atomic operations.
   */
  return callback(db);
}