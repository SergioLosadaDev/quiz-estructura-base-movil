import type { capSQLiteChanges } from "@capacitor-community/sqlite";
import { DatabaseError, toDatabaseError } from "./DatabaseError";
import { getDatabaseConnection, persistWebDatabase } from "./sqlite/connection";

export { DatabaseError } from "./DatabaseError";

/** Opens the database and creates its tables if they do not exist. */
export async function initializeDatabase(): Promise<void> {
  await getDatabaseConnection();
}

/** Executes DDL or other non-parameterized SQL statements. */
export async function executeSql(statements: string): Promise<void> {
  try {
    const database = await getDatabaseConnection();
    await database.execute(statements);
    await persistWebDatabase();
  } catch (error) {
    if (error instanceof DatabaseError) throw error;
    throw toDatabaseError(error, "SQL execution");
  }
}

/** Executes a parameterized INSERT, UPDATE, or DELETE statement. */
export async function runSql(
  statement: string,
  values: unknown[] = [],
): Promise<capSQLiteChanges> {
  try {
    const database = await getDatabaseConnection();
    const result = await database.run(statement, values);
    await persistWebDatabase();
    return result;
  } catch (error) {
    if (error instanceof DatabaseError) throw error;
    throw toDatabaseError(error, "SQL write");
  }
}

/** Executes a parameterized SELECT statement. */
export async function querySql<Row extends Record<string, unknown>>(
  statement: string,
  values: unknown[] = [],
): Promise<Row[]> {
  try {
    const database = await getDatabaseConnection();
    const result = await database.query(statement, values);
    return (result.values ?? []) as Row[];
  } catch (error) {
    if (error instanceof DatabaseError) throw error;
    throw toDatabaseError(error, "SQL query");
  }
}
