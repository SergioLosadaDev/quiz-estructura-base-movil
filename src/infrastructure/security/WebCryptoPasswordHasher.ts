import type {
  HashedPassword,
  PasswordHasher,
} from "../../application/ports/PasswordHasher";

const PBKDF2_ITERATIONS = 600_000;
const SALT_LENGTH_BYTES = 16;
const HASH_LENGTH_BITS = 256;

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export class WebCryptoPasswordHasher implements PasswordHasher {
  async hash(password: string): Promise<HashedPassword> {
    if (!globalThis.crypto?.subtle) {
      throw new Error("Web Crypto no está disponible en este entorno.");
    }

    const saltBytes = crypto.getRandomValues(new Uint8Array(SALT_LENGTH_BYTES));
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveBits"],
    );
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: saltBytes,
        iterations: PBKDF2_ITERATIONS,
        hash: "SHA-256",
      },
      key,
      HASH_LENGTH_BITS,
    );

    return {
      hash: toHex(new Uint8Array(derivedBits)),
      salt: toHex(saltBytes),
    };
  }
}
