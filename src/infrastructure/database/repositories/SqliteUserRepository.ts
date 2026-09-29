import type { UserRepository } from "../../../domain/repositories/UserRepository";
import type { CreateUserData, User } from "../../../domain/User";
import { DatabaseError, runSql } from "../index";

export class SqliteUserRepository implements UserRepository {
  async saveUser(data: CreateUserData): Promise<User> {
    const result = await runSql(
      "INSERT INTO users (name, email, password_hash, password_salt) VALUES (?, ?, ?, ?)",
      [data.name, data.email, data.passwordHash, data.passwordSalt],
    );
    const id = result.changes?.lastId;

    if (id === undefined) {
      throw new DatabaseError("SQLite no devolvió el ID del usuario guardado.");
    }

    return { id: String(id), name: data.name, email: data.email };
  }
}
