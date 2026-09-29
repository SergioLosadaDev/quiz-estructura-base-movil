export interface HashedPassword {
  hash: string;
  salt: string;
}

export interface PasswordHasher {
  hash(password: string): Promise<HashedPassword>;
}
