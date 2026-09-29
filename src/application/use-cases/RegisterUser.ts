import type { CreateUserData, User } from "../../domain/User";
import type { UserRepository } from "../../domain/repositories/UserRepository";
import type { PasswordHasher } from "../ports/PasswordHasher";
import type { RegistrationResult } from "../RegistrationResult";

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export class RegisterUser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: RegisterUserInput): Promise<RegistrationResult<User>> {
    const name = input.name.trim();
    const email = input.email.trim();
    const fieldErrors: Record<string, string> = {};

    if (!name) fieldErrors.name = "El nombre es obligatorio.";
    if (!email) {
      fieldErrors.email = "El correo es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      fieldErrors.email = "Ingresa un correo válido.";
    }
    if (input.password.length < 8) {
      fieldErrors.password = "La contraseña debe tener al menos 8 caracteres.";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Revisa los datos del usuario.",
          fieldErrors,
        },
      };
    }

    let credential: Awaited<ReturnType<PasswordHasher["hash"]>>;
    try {
      credential = await this.passwordHasher.hash(input.password);
    } catch {
      return {
        success: false,
        error: {
          code: "SECURITY_ERROR",
          message: "No fue posible proteger la contraseña para el registro.",
        },
      };
    }

    const userData: CreateUserData = {
      name,
      email,
      passwordHash: credential.hash,
      passwordSalt: credential.salt,
    };

    try {
      const user = await this.userRepository.saveUser(userData);
      return { success: true, data: user };
    } catch {
      return {
        success: false,
        error: {
          code: "PERSISTENCE_ERROR",
          message: "No fue posible guardar el usuario. Inténtalo nuevamente.",
        },
      };
    }
  }
}
