import {
  Address,
  AddressRepository,
  CreateAddressDto,
  UpdateAddressDto,
} from "packages/database/repositories/AddressRepository";

export class AddressService {
  constructor(
    private readonly repository: AddressRepository
  ) {}

  async getAll(
    userId: string
  ): Promise<Address[]> {
    return this.repository.getAll(userId);
  }

  async getDefault(
    userId: string
  ): Promise<Address | null> {
    return this.repository.getDefault(userId);
  }

  async getById(
    id: string
  ): Promise<Address | null> {
    return this.repository.getById(id);
  }

  async create(
    input: CreateAddressDto
  ): Promise<Address> {
    this.validate(input);

    if (input.isDefault) {
      await this.repository.clearDefault(
        input.userId
      );
    }

    return this.repository.create(input);
  }

  async update(
    id: string,
    input: UpdateAddressDto
  ): Promise<Address> {
    const existing =
      await this.repository.getById(id);

    if (!existing) {
      throw new Error(
        "Address not found."
      );
    }

    this.validate({
      country:
        input.country ??
        existing.country,

      city:
        input.city ??
        existing.city,

      street:
        input.street ??
        existing.street,
    });

    if (input.isDefault) {
      await this.repository.clearDefault(
        existing.userId
      );
    }

    return this.repository.update(
      id,
      input
    );
  }

  async delete(
    id: string
  ): Promise<void> {
    const existing =
      await this.repository.getById(id);

    if (!existing) {
      throw new Error(
        "Address not found."
      );
    }

    await this.repository.delete(id);
  }

  async setDefault(
    id: string
  ): Promise<void> {
    const existing =
      await this.repository.getById(id);

    if (!existing) {
      throw new Error(
        "Address not found."
      );
    }

    await this.repository.clearDefault(
      existing.userId
    );

    await this.repository.setDefault(
      id
    );
  }

  private validate(
    address: Pick<
      CreateAddressDto,
      | "country"
      | "city"
      | "street"
    >
  ) {
    if (
      !address.country?.trim()
    ) {
      throw new Error(
        "Country is required."
      );
    }

    if (
      !address.city?.trim()
    ) {
      throw new Error(
        "City is required."
      );
    }

    if (
      !address.street?.trim()
    ) {
      throw new Error(
        "Street address is required."
      );
    }
  }
}