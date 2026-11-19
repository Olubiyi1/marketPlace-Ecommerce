import { Router } from "express";
import productController from "./product.controller.js";

const productRouter = Router();

productRouter.get("/", productController.getAllProducts);
productRouter.post("/", productController.createProduct);
productRouter.patch("/:id", productController.updateProduct);
productRouter.patch("/deactivate/:id", productController.deactivateProduct);

export default productRouter;
