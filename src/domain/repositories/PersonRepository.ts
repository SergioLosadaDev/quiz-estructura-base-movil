import type { CreatePersonData, Person } from "../Person";

export interface PersonRepository {
  savePerson(data: CreatePersonData): Promise<Person>;
}
