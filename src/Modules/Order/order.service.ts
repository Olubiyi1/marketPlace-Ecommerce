import AppError from "../../ErrorHandlers/appError.js";
import { Prisma } from "../../generated/prisma/client.js";
import type { CreateOrderDTO } from "../../Modules/Order/order.dto.js";
import orderRepository from "../../Repository/order.repository.js"

class OrderService {
  async createOrder(customerId: string, data: CreateOrderDTO) {
    // get all products Id from the order
    const productIds = data.items.map((item) => {
      return item.productId;
    });

    // find all products contained in the productIds array
    const products = await orderRepository.findProductsByIds(productIds);

    // check if all requested product exists
    if (products.length !== productIds.length) {
      throw new AppError("One or more products do not exist", 400);
    }

    // check product availability
    products.forEach((product) => {
      if (!product.isAvailable) {
        throw new AppError(`${product.name} not available`, 409);
      }
    });

    // check quantity
    data.items.forEach((item) => {
      const product = products.find((product) => {
        return product.id === item.productId;
      });

      if (product && product.quantity < item.quantity) {
        throw new AppError(`Insufficient stock for ${product.name}`, 409);
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

    // prepare order items with their unit prices
    const orderItems = data.items.map((item) => {
      const product = products.find((product) => {
        return product.id === item.productId;
      });

      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product!.price,
      };
    });

    // send prepared data to repository
    return orderRepository.createOrder(
      customerId,
      totalAmount,
      orderItems
    );
  }
}

export default new OrderService();
