import AppError from "../../ErrorHandlers/appError.js";
import productRepository from "../../Repository/product.repository.js";
import { createLabel } from "../../Utils/createLabel.js";
import type{ CreateProductData,UpdateProductData } from "./product.dto.js";

const productLogs = createLabel("PRODUCT_LOGS")

class ProductService{

    // get all products
    async getAllProducts(){
        const allProducts = await productRepository.findAllProducts()
        productLogs.info("All products")
        return allProducts;
    }

    // create product
    async createProduct(data:CreateProductData){
       const newProduct = await productRepository.createProduct(data)
       productLogs.info(`Product ${data.name} added to available product`)
       return newProduct
    };

    // update product
    async updateProduct(id:string,updatedData:UpdateProductData){
     const existingProduct = await productRepository.findProductById(id)
     if(!existingProduct){
        throw new AppError("Product not found",404)
     }
     
     const updatedProduct = await productRepository.updateProduct(id,updatedData)
     productLogs.info(`Product ${id} updated successfully`)
     return updatedProduct
    }
}

export default ProductService