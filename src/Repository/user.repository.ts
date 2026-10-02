import prisma from "../lib/prisma.js";
import type{ CreateUserData,UpdateUserData } from "../Modules/User/user.types.js";


class UserRepository{

    async getAllUsers(){
       return await prisma.user.findMany()
    }

    async getUserById(id: string){
        return await prisma.user.findUnique({
            where:{id,isActive:true}
        })
    }

    async getUserByEmail(email:string){
        return await prisma.user.findUnique({
            where:{
                email,
                isActive:true
            }
        })
    }

    async createUser(data:CreateUserData){
        return await prisma.user.create({
            data,
        })
    }

    async updateUser(id:string,data:UpdateUserData){
        return await prisma.user.update({
            where:{id, isActive:true},
            data
        })
    }

    async deleteUser(id:string){
        return await prisma.user.update({
            where:{id},
             data:{isActive:false}
        })
    }

}

export default new UserRepository;