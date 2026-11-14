import AppError from "../ErrorHandlers/appError.js";
import { Prisma } from "../generated/prisma/client.js";
import prisma from "../lib/prisma.js";
import type { CreateOrderDTO } from "../Modules/Order/order.dto.js";

class OrderRepository {
  async createOrder(customerId: string, data: CreateOrderDTO) {
    // get all produts Id from the order
    const productIds = data.items.map((item) => {
      return item.productId;
    });

    // find all products contained in the productIds array
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });
    // check if all requested product exists
    if (products.length !== productIds.length) {
      throw new AppError("One or more products do not exist", 400);
    }

    // check product availability
    products.forEach((product) => {
      if (!product.isAvailable) {
        throw new AppError(`${product.name}not available`, 409);
      }
    });

    // check quantity
    data.items.forEach((item) => {
      const product = products.find((product) => {
        return product.id === item.productId;
      });
      if (product && product.quantity < item.quantity) {
        throw new AppError(` Insufficient stock for ${product.name}`, 409);
      }
    });
    // calculate total price
    let totalAmount = new Prisma.Decimal(0);
    data.items.forEach((item) => {
      const product = products.find((product) => {
        return product.id === item.productId;
      });

      if (product) {
        const subTotal = product.price.mul(item.quantity);
        totalAmount = totalAmount.plus(subTotal);
      }
    });

    // begin transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          customerId,
          totalAmount,
        },
      });

      // creating the ordered items
      await tx.orderItem.createMany({
        data: data.items.map((item) => {
          const product = products.find((product) => {
            return product.id === item.productId;
          });

          return {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: product!.price,
          };
        }),
      });

      // reduce product stock
      const stockUpdates = await Promise.all(
        data.items.map((item) => {
          return tx.product.updateMany({
            where: {
              id: item.productId,
              quantity: {
                gte: item.quantity,
              },
            },
            data: {
              quantity: {
                decrement: item.quantity,
              },
            },
          });
        }),
      );
        // check if all stock updates was successful
        //concurrency
        stockUpdates.forEach((result)=>{
            if(result.count === 0){
                throw new AppError("Insufficient stock", 409)
            }
        })

      return newOrder;
    });
    return order;
  }
}

export default new OrderRepository();
