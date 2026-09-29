import type { ProductRepository } from "../../../domain/repositories/ProductRepository";
import type { CreateProductData, Product } from "../../../domain/Product";
import { DatabaseError, runSql } from "../index";

export class SqliteProductRepository implements ProductRepository {
  async saveProduct(data: CreateProductData): Promise<Product> {
    const result = await runSql(
      "INSERT INTO products (name, price) VALUES (?, ?)",
      [data.name, data.price],
    );
    const id = result.changes?.lastId;

    if (id === undefined) {
      throw new DatabaseError("SQLite no devolvió el ID del producto guardado.");
    }

    return { id: String(id), ...data };
  }
}
