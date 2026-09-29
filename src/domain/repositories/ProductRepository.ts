import type { CreateProductData, Product } from "../Product";

export interface ProductRepository {
  saveProduct(data: CreateProductData): Promise<Product>;
}
