import express from "express"
import orderController from "./order.controller.js"

const orderRouter = express()

orderRouter.post("/create-orders",orderController.createOrder)

export default orderRouter;