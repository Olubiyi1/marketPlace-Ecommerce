import AppError from "../../ErrorHandlers/appError.js";
import productRepository from "../../Repository/product.repository.js";
import { createLabel } from "../../Utils/createLabel.js";
import type { CreateProductData, UpdateProductData } from "./product.dto.js";

const productLogs = createLabel("PRODUCT_LOGS");

class ProductService {
  // get all products
  async getAllProducts() {
    const allProducts = await productRepository.findAllProducts();
    productLogs.info("All products");
    return allProducts;
  }

  // create product
  async createProduct(data: CreateProductData) {
    const newProduct = await productRepository.createProduct(data);
    productLogs.info(`Product ${data.name} added to available product`);
    return newProduct;
  }

  // update product
  async updateProduct(id: string, updatedData: UpdateProductData) {
    const existingProduct = await productRepository.findProductById(id);
    if (!existingProduct) {
      throw new AppError("Product not found", 404);
    }
    if (!existingProduct.isAvailable) {
      throw new AppError("Product is not available and can't be updated", 400);
    }
    const updatedProduct = await productRepository.updateProduct(
      id,
      updatedData,
    );
    productLogs.info(`Product ${id} updated successfully`);
    return updatedProduct;
  }

async deactivateProduct(id: string) {
  const deactivatedProduct =
    await productRepository.deactivateProduct(id);

  productLogs.info(
    `${deactivatedProduct.name} currently set to unavailable`
  );

  return deactivatedProduct;
}
}

export default ProductService;
