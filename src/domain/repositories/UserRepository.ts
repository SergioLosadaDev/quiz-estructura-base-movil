import type { CreateUserData, User } from "../User";

export interface UserRepository {
  saveUser(data: CreateUserData): Promise<User>;
}
