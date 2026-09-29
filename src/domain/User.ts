export type UserId = string;

export interface User {
  id: UserId;
  name: string;
  email: string;
}

/** Persistence input: credential material is already hashed by Application. */
export interface CreateUserData extends Pick<User, "name" | "email"> {
  passwordHash: string;
  passwordSalt: string;
}
