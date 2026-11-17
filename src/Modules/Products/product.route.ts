import { Router } from "express";
import productController from "./product.controller.js";

const router = Router();

router.get("/", productController.getAllProducts);
router.post("/", productController.createProduct);
router.patch("/:id", productController.updateProduct);
router.patch("/:id/deactivate", productController.deactivateProduct);

export default router;
