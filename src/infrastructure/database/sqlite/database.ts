import type { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { DatabaseError, toDatabaseError } from "../DatabaseError";
import { DATABASE_SCHEMA } from "./schema";

/** Applies the idempotent schema to an already-open connection. */
export async function initializeDatabaseSchema(
  database: SQLiteDBConnection,
): Promise<void> {
  try {
    await database.execute(DATABASE_SCHEMA);
  } catch (error) {
    if (error instanceof DatabaseError) throw error;
    throw toDatabaseError(error, "schema creation");
  }
}
