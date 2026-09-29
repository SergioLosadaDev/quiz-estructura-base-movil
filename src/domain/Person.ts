export type PersonId = string;

export interface Person {
  id: PersonId;
  name: string;
  identification: string;
}

export type CreatePersonData = Pick<Person, "name" | "identification">;
