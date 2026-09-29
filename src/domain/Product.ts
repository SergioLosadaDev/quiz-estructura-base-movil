export type ProductId = string;

export interface Product {
  id: ProductId;
  name: string;
  price: number;
}

export type CreateProductData = Pick<Product, "name" | "price">;
