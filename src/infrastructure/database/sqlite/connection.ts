import { Capacitor } from "@capacitor/core";
import {
  CapacitorSQLite,
  SQLiteConnection,
  type SQLiteDBConnection,
} from "@capacitor-community/sqlite";
import { applyPolyfills, defineCustomElements } from "jeep-sqlite/loader";
import { DatabaseError, toDatabaseError } from "../DatabaseError";
import { DATABASE_NAME, DATABASE_VERSION } from "./config";
import { initializeDatabaseSchema } from "./database";

let sqliteConnection: SQLiteConnection | undefined;
let databasePromise: Promise<SQLiteDBConnection> | undefined;
let webSetupPromise: Promise<void> | undefined;

function getSQLiteConnection(): SQLiteConnection {
  sqliteConnection ??= new SQLiteConnection(CapacitorSQLite);
  return sqliteConnection;
}

async function setupWebPlatform(connection: SQLiteConnection): Promise<void> {
  if (Capacitor.getPlatform() !== "web") return;

  webSetupPromise ??= (async () => {
    await applyPolyfills();
    defineCustomElements(window);

    if (!document.querySelector("jeep-sqlite")) {
      document.body.appendChild(document.createElement("jeep-sqlite"));
    }

    await customElements.whenDefined("jeep-sqlite");
    await connection.initWebStore();
  })().catch((error: unknown) => {
    webSetupPromise = undefined;
    throw toDatabaseError(error, "web platform initialization");
  });

  await webSetupPromise;
}

async function openDatabase(): Promise<SQLiteDBConnection> {
  const connection = getSQLiteConnection();

  try {
    await setupWebPlatform(connection);
    await connection.checkConnectionsConsistency();

    const hasConnection = (await connection.isConnection(DATABASE_NAME, false))
      .result;
    const database = hasConnection
      ? await connection.retrieveConnection(DATABASE_NAME, false)
      : await connection.createConnection(
          DATABASE_NAME,
          false,
          "no-encryption",
          DATABASE_VERSION,
          false,
        );

    const isOpen = (await database.isDBOpen()).result;
    if (!isOpen) await database.open();

    await initializeDatabaseSchema(database);
    await persistWebDatabase();
    return database;
  } catch (error) {
    if (error instanceof DatabaseError) throw error;
    throw toDatabaseError(error, "connection or initialization");
  }
}

/** Returns the single initialized connection shared by infrastructure adapters. */
export function getDatabaseConnection(): Promise<SQLiteDBConnection> {
  databasePromise ??= openDatabase().catch((error: unknown) => {
    databasePromise = undefined;
    throw error;
  });

  return databasePromise;
}

/** Persists the web implementation's in-memory database to IndexedDB. */
export async function persistWebDatabase(): Promise<void> {
  if (Capacitor.getPlatform() !== "web") return;

  try {
    await getSQLiteConnection().saveToStore(DATABASE_NAME);
  } catch (error) {
    throw toDatabaseError(error, "web database persistence");
  }
}
