import prisma from "../../lib/prisma.js";

export const seedUser = async()=>{
    const users = await prisma.user.create({
        data:{firstName:"jide",lastName:"daniel",email:"olubiyibabajide@gmail.com",password:"12345678",phoneNumber:"123456789"}
    })
    return users
}