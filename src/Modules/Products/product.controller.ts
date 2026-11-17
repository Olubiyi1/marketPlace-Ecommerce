import type { Request, Response } from "express";
import productService from "./product.service.js";
import ResponseHandler from "../../Utils/responseHandler.js";
import asyncHandler from "../../Utils/asyncHandler.js";
import AppError from "../../ErrorHandlers/appError.js";
import { string } from "joi";

class ProductController {
  // get all products
  getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    const products = await productService.getAllProducts();

    return ResponseHandler.success(
      res,
      "Products retrieved successfully",
      products,
    );
  });

  // create product
  createProduct = asyncHandler(async (req: Request, res: Response) => {
    const newProduct = await productService.createProduct(req.body);

    return ResponseHandler.created(
      res,
      "Product created successfully",
      newProduct,
    );
  });

  // update product
  updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (typeof id !== "string") {
      throw new AppError("Invalid product ID", 400);
    }

    const updatedProduct = await productService.updateProduct(id, req.body);

    return ResponseHandler.success(
      res,
      "Product updated successfully",
      updatedProduct,
    );
  });

  // deactivate product
  deactivateProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (typeof id !== "string") {
      throw new AppError("Invalid product ID", 400);
    }
    const deactivatedProduct = await productService.deactivateProduct(id);

    return ResponseHandler.success(
      res,
      "Product deactivated successfully",
      deactivatedProduct,
    );
  });
}

export default new ProductController();
