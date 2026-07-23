import { UserRepository } from "@africasuk/database";
import type { User } from "@africasuk/types";

export class UserService {
  constructor(
    private readonly repository: UserRepository
  ) {}

  async getAll(): Promise<User[]> {
    return this.repository.getAll();
  }

  async getById(id: string): Promise<User> {
    return this.repository.getById(id);
  }

  async create() {
    return this.repository.create();
  }

  async update() {
    return this.repository.update();
  }

  async delete() {
    return this.repository.delete();
  }
}