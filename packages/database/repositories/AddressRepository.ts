import type { SupabaseClient } from "@supabase/supabase-js";

export interface Address {
  id: string;

  userId: string;

  label: string;

  recipientName: string;
  phone: string;

  country: string;
  state: string | null;
  city: string;
  area: string | null;

  street: string;
  building: string | null;
  apartment: string | null;
  landmark: string | null;

  postalCode: string | null;

  latitude: number | null;
  longitude: number | null;

  isDefault: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressDto {
  userId: string;

  label: string;

  recipientName: string;
  phone: string;

  country: string;
  state?: string | null;
  city: string;
  area?: string | null;

  street: string;
  building?: string | null;
  apartment?: string | null;
  landmark?: string | null;

  postalCode?: string | null;

  latitude?: number | null;
  longitude?: number | null;

  isDefault?: boolean;
}

export interface UpdateAddressDto
  extends Partial<
    Omit<CreateAddressDto, "userId">
  > {}

export class AddressRepository {
  constructor(
    private readonly db: SupabaseClient
  ) {}

  private map(
    row: Record<string, unknown>
  ): Address {
    return {
      id: row.id as string,

      userId: row.user_id as string,

      label: row.label as string,

      recipientName:
        row.recipient_name as string,

      phone: row.phone as string,

      country: row.country as string,

      state:
        (row.state as string) ??
        null,

      city: row.city as string,

      area:
        (row.area as string) ??
        null,

      street: row.street as string,

      building:
        (row.building as string) ??
        null,

      apartment:
        (row.apartment as string) ??
        null,

      landmark:
        (row.landmark as string) ??
        null,

      postalCode:
        (row.postal_code as string) ??
        null,

      latitude:
        (row.latitude as number) ??
        null,

      longitude:
        (row.longitude as number) ??
        null,

      isDefault:
        row.is_default as boolean,

      createdAt:
        row.created_at as string,

      updatedAt:
        row.updated_at as string,
    };
  }

  async getAll(
    userId: string
  ): Promise<Address[]> {
    const { data, error } =
      await this.db
        .from("addresses")
        .select("*")
        .eq("user_id", userId)
        .order("is_default", {
          ascending: false,
        })
        .order("created_at", {
          ascending: false,
        });

    if (error) throw error;

    return (data ?? []).map((row) =>
      this.map(row)
    );
  }

  async getDefault(
    userId: string
  ): Promise<Address | null> {
    const { data, error } =
      await this.db
        .from("addresses")
        .select("*")
        .eq("user_id", userId)
        .eq("is_default", true)
        .maybeSingle();

    if (error) throw error;

    return data
      ? this.map(data)
      : null;
  }

  async getById(
    id: string
  ): Promise<Address | null> {
    const { data, error } =
      await this.db
        .from("addresses")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) throw error;

    return data
      ? this.map(data)
      : null;
  }

  async create(
    input: CreateAddressDto
  ): Promise<Address> {
    const { data, error } =
      await this.db
        .from("addresses")
        .insert({
          user_id: input.userId,

          label: input.label,

          recipient_name:
            input.recipientName,

          phone: input.phone,

          country: input.country,

          state: input.state,

          city: input.city,

          area: input.area,

          street: input.street,

          building: input.building,

          apartment:
            input.apartment,

          landmark:
            input.landmark,

          postal_code:
            input.postalCode,

          latitude:
            input.latitude,

          longitude:
            input.longitude,

          is_default:
            input.isDefault ??
            false,
        })
        .select()
        .single();

    if (error) throw error;

    return this.map(data);
  }

  async update(
    id: string,
    input: UpdateAddressDto
  ): Promise<Address> {
    const { data, error } =
      await this.db
        .from("addresses")
        .update({
          label: input.label,

          recipient_name:
            input.recipientName,

          phone: input.phone,

          country: input.country,

          state: input.state,

          city: input.city,

          area: input.area,

          street: input.street,

          building: input.building,

          apartment:
            input.apartment,

          landmark:
            input.landmark,

          postal_code:
            input.postalCode,

          latitude:
            input.latitude,

          longitude:
            input.longitude,

          is_default:
            input.isDefault,

          updated_at:
            new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;

    return this.map(data);
  }

  async delete(
    id: string
  ): Promise<void> {
    const { error } =
      await this.db
        .from("addresses")
        .delete()
        .eq("id", id);

    if (error) throw error;
  }

  async clearDefault(
    userId: string
  ): Promise<void> {
    const { error } =
      await this.db
        .from("addresses")
        .update({
          is_default: false,
        })
        .eq("user_id", userId);

    if (error) throw error;
  }

  async setDefault(
    id: string
  ): Promise<void> {
    const { error } =
      await this.db
        .from("addresses")
        .update({
          is_default: true,
        })
        .eq("id", id);

    if (error) throw error;
  }
}