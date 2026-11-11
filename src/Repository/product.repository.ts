import prisma from "../lib/prisma.js";
import type {
  CreateProductData,
  UpdateProductData,
} from "../Modules/Products/product.dto.js";

class ProductRepository {
  // Create a new product
  async createProduct(data: CreateProductData) {
    return await prisma.product.create({
      data,
    });
  }

  // Find a product by ID
  async findProductById(id: string) {
    return await prisma.product.findUnique({
      where: { id },
    });
  }

  // Find all products
  async findAllProducts() {
    return await prisma.product.findMany({
        where:{isAvailable:true}
    });
  }

  // Update a product
  async updateProduct(id: string, data: UpdateProductData) {
    return await prisma.product.update({
      where: { id },
      data,
    });
  }

  //soft  Delete a product
  async deactivateProduct(id: string) {
    return await prisma.product.update({
      where: { id },data:{isAvailable:false}
    });
  }
}

export default new ProductRepository();