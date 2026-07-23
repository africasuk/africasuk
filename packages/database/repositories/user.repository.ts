import type { DatabaseClient } from "../types";
import type { User } from "@africasuk/types";

type ProfileRow = {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  role:
    | "SUPER_ADMIN"
    | "ADMIN"
    | "MANAGER"
    | "STAFF";
  is_active: boolean;
  must_change_password: boolean;
  created_at: string;
  updated_at: string;
};

export class UserRepository {
  constructor(
    private readonly db: DatabaseClient
  ) {}

  private mapUser(row: ProfileRow): User {
    return {
      id: row.id,
      userId: row.user_id,
      fullName: row.full_name ?? "",
      email: row.email,
      phone: row.phone,
      role: row.role,
      isActive: row.is_active,
      mustChangePassword:
        row.must_change_password,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async getAll(): Promise<User[]> {
    const { data, error } = await this.db
      .from("profiles")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) throw error;

    return (data ?? []).map((row) =>
      this.mapUser(row as ProfileRow)
    );
  }

  async getById(id: string): Promise<User> {
    const { data, error } = await this.db
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return this.mapUser(data as ProfileRow);
  }

  async create(): Promise<User> {
    throw new Error("Coming next");
  }

  async update(): Promise<User> {
    throw new Error("Coming next");
  }

  async delete(): Promise<void> {
    throw new Error("Coming next");
  }
}