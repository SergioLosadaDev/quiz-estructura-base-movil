import type { CreateProductData, Product } from "../../domain/Product";
import type { ProductRepository } from "../../domain/repositories/ProductRepository";
import type { RegistrationResult } from "../RegistrationResult";

export class RegisterProduct {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(input: CreateProductData): Promise<RegistrationResult<Product>> {
    const name = input.name.trim();
    const fieldErrors: Record<string, string> = {};

    if (!name) fieldErrors.name = "El nombre del producto es obligatorio.";
    if (!Number.isFinite(input.price) || input.price <= 0) {
      fieldErrors.price = "El precio debe ser un número mayor que cero.";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Revisa los datos del producto.",
          fieldErrors,
        },
      };
    }

    try {
      const product = await this.productRepository.saveProduct({
        name,
        price: input.price,
      });
      return { success: true, data: product };
    } catch {
      return {
        success: false,
        error: {
          code: "PERSISTENCE_ERROR",
          message: "No fue posible guardar el producto. Inténtalo nuevamente.",
        },
      };
    }
  }
}
