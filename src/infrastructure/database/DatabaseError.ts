/** Error exposed by the database infrastructure without leaking plugin types. */
export class DatabaseError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "DatabaseError";

    if (options && "cause" in options) {
      (this as Error & { cause?: unknown }).cause = options.cause;
    }
  }
}

export function toDatabaseError(error: unknown, operation: string): DatabaseError {
  const detail = error instanceof Error ? error.message : String(error);
  return new DatabaseError(`SQLite: ${operation} failed. ${detail}`, { cause: error });
}
