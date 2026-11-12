import AppError from "../ErrorHandlers/appError.js";
import { Prisma } from "../generated/prisma/client.js";
import prisma from "../lib/prisma.js";
import type{ CreateOrderDTO } from "../Modules/Order/order.dto.js";

class OrderRepository{
    async createOrder(customerId:string,data:CreateOrderDTO){
        // get all produts Id from the order
        const productIds = data.items.map((item)=>{return item.productId})

        // find all products contained in the productIds array
        const products= await prisma.product.findMany({
            where:{
                id:{
                    in:productIds
                }
            }
            
        })
        // check if all requested product exists
            if(products.length !== productIds.length){
                throw new AppError("One or more products do not exist",400)
            }

            // check product availability
            products.forEach((product)=>{
                if(!product.isAvailable){
                    throw new AppError(`${product.name}not available`,409)
                }
            })

            // check quantity
            data.items.forEach((item)=>{
                const product = products.find((product)=>{
                    return product.id === item.productId
                })
                if(product && product.quantity < item.quantity){
                    throw new AppError(` Insufficient stock for ${product.name}`,409)
                }
            })
            // calculate total price
            let totalAmount = new Prisma.Decimal(0)
            data.items.forEach((item)=>{
                const product = products.find((product)=>{
                    return product.id === item.productId
                })

                if(product){
                    const subTotal = product.price.mul(item.quantity)
                    totalAmount = totalAmount.plus(subTotal)
                }
            })
            const order = await prisma.order.create({
                data:{
                    customerId,
                    totalAmount
                }
                
            })
            

            
            return order;
    }
}

export default new OrderRepository;

