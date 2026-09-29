import type { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { DatabaseError, toDatabaseError } from "../DatabaseError";
import { DATABASE_SCHEMA } from "./schema";

/** Applies the idempotent schema to an already-open connection. */
export async function initializeDatabaseSchema(
  database: SQLiteDBConnection,
): Promise<void> {
  try {
    await database.execute(DATABASE_SCHEMA);
    await addUserCredentialColumnsIfMissing(database);
  } catch (error) {
    if (error instanceof DatabaseError) throw error;
    throw toDatabaseError(error, "schema creation");
  }
}

/** Adds the credential columns when upgrading a database created by the earlier schema. */
async function addUserCredentialColumnsIfMissing(
  database: SQLiteDBConnection,
): Promise<void> {
  const result = await database.query("PRAGMA table_info(users)");
  const columns = (result.values ?? []) as Array<{ name?: string }>;
  const columnNames = new Set(columns.map((column) => column.name));

  if (!columnNames.has("password_hash")) {
    await database.execute(
      "ALTER TABLE users ADD COLUMN password_hash TEXT NOT NULL DEFAULT ''",
    );
  }

  if (!columnNames.has("password_salt")) {
    await database.execute(
      "ALTER TABLE users ADD COLUMN password_salt TEXT NOT NULL DEFAULT ''",
    );
  }
}
