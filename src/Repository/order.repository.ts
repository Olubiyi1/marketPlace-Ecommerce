import AppError from "../ErrorHandlers/appError.js";
import { Prisma } from "../generated/prisma/client.js";
import prisma from "../lib/prisma.js";

class OrderRepository {
  // find products by their IDs
  async findProductsByIds(productIds: string[]) {
    return prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });
  }

  async createOrder(
    customerId: string,
    totalAmount: Prisma.Decimal,
    items: { productId: string; quantity: number; unitPrice: Prisma.Decimal }[],
  ) {
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
        data: items.map((item) => {
          return {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          };
        }),
      });

      // reduce product stock
      const stockUpdates = await Promise.all(
        items.map((item) => {
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

      // check if all stock updates were successful
      stockUpdates.forEach((result) => {
        if (result.count === 0) {
          throw new AppError("Insufficient stock", 409);
        }
      });

      return newOrder;
    });

    return order;
  }

  async findCustomerOrderById(orderId:string,customerId:string){
    const order = await prisma.order.findUnique({
      where:{
        id:orderId,
        customerId
      },
      include:{
        items:{
          include:{
            product:true
          }
        }
      }
    })
    return order;
  }

  async findOrderById(orderId:string){
    const order= prisma.order.findUnique({
      where:{
      id:orderId
      },
      include:{
        items:{
          include:{
            product:true
          }
        },
        customer:true
      }    
    })
    return order;
  }
  
  async findAllOrders(orderId:string){
    return prisma.order.findMany({
      where:{
        id:orderId
      },
      include:{
        items:{
          include:{
            product:true
          }
        },
        customer:true
      }
    })

  }
}

export default new OrderRepository();
