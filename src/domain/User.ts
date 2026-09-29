export type UserId = string;

export interface User {
  id: UserId;
  name: string;
  email: string;
}

export type CreateUserData = Pick<User, "name" | "email">;
