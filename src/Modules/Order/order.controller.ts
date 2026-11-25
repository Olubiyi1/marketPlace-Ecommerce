import type { Request, Response } from "express";
import orderService from "./order.service.js";
import ResponseHandler from "../../Utils/responseHandler.js";
import asyncHandler from "../../Utils/asyncHandler.js";

class OrderController {
  createOrder = asyncHandler(async (req: Request, res: Response) => {
    const { customerId, ...orderData } = req.body;

    const order = await orderService.createOrder(
      customerId,
      orderData
    );

    return ResponseHandler.created(
      res,
      "Order created successfully",
      order
    );
  });
  
  getCustomerOrderById = asyncHandler(async(req:Request,res:Response)=>{
    const {customerId,orderId} = req.body
    
      const order = await orderService.getCustomerOrderById(orderId,customerId)
      return ResponseHandler.success(res,"Order retrieved successfully",order)
  })

  getOrderId = asyncHandler(async(req:Request,res:Response)=>{
    const {orderId} = req.body
    const order = await orderService.getOrderById(orderId)
    return ResponseHandler.success(res,`${order.customer.firstName} ${order.customer.lastName} order retrieved successfully`,order)
  })
}

export default new OrderController();
