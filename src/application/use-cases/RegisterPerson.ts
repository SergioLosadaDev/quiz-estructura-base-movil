import type { CreatePersonData, Person } from "../../domain/Person";
import type { PersonRepository } from "../../domain/repositories/PersonRepository";
import type { RegistrationResult } from "../RegistrationResult";

export class RegisterPerson {
  constructor(private readonly personRepository: PersonRepository) {}

  async execute(input: CreatePersonData): Promise<RegistrationResult<Person>> {
    const name = input.name.trim();
    const identification = input.identification.trim();
    const fieldErrors: Record<string, string> = {};

    if (!name) fieldErrors.name = "El nombre es obligatorio.";
    if (!identification) {
      fieldErrors.identification = "La identificación es obligatoria.";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Revisa los datos de la persona.",
          fieldErrors,
        },
      };
    }

    try {
      const person = await this.personRepository.savePerson({
        name,
        identification,
      });
      return { success: true, data: person };
    } catch {
      return {
        success: false,
        error: {
          code: "PERSISTENCE_ERROR",
          message: "No fue posible guardar la persona. Inténtalo nuevamente.",
        },
      };
    }
  }
}
