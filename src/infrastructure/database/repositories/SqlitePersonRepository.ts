import type { PersonRepository } from "../../../domain/repositories/PersonRepository";
import type { CreatePersonData, Person } from "../../../domain/Person";
import { DatabaseError, runSql } from "../index";

export class SqlitePersonRepository implements PersonRepository {
  async savePerson(data: CreatePersonData): Promise<Person> {
    const result = await runSql(
      "INSERT INTO persons (name, identification) VALUES (?, ?)",
      [data.name, data.identification],
    );
    const id = result.changes?.lastId;

    if (id === undefined) {
      throw new DatabaseError("SQLite no devolvió el ID de la persona guardada.");
    }

    return { id: String(id), ...data };
  }
}
