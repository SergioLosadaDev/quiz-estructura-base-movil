import type { CreateUserData, User } from "../User";

export interface UserRepository {
  /** Saves a user and its already-hashed credential material. */
  saveUser(data: CreateUserData): Promise<User>;
}
