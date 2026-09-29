import type { CreateUserData, User } from "../../domain/User";
import type { UserRepository } from "../../domain/repositories/UserRepository";
import type { RegistrationResult } from "../RegistrationResult";

export class RegisterUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: CreateUserData): Promise<RegistrationResult<User>> {
    const name = input.name.trim();
    const email = input.email.trim();
    const fieldErrors: Record<string, string> = {};

    if (!name) fieldErrors.name = "El nombre es obligatorio.";
    if (!email) {
      fieldErrors.email = "El correo es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      fieldErrors.email = "Ingresa un correo válido.";
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

    try {
      const user = await this.userRepository.saveUser({ name, email });
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
