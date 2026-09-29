export type RegistrationErrorCode = "VALIDATION_ERROR" | "PERSISTENCE_ERROR";

export interface RegistrationError {
  code: RegistrationErrorCode;
  message: string;
  fieldErrors?: Record<string, string>;
}

export type RegistrationResult<Entity> =
  | { success: true; data: Entity }
  | { success: false; error: RegistrationError };
