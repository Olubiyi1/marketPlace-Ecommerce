import userRepository from "../../Repository/user.repository.js";
import AppError from "../../ErrorHandlers/appError.js";
import type{ CreateUserData,UpdateUserData } from "./user.types.js";
import type { User } from "../../generated/prisma/client.js";


class UserService{
    async getAllusers(){
        const users = await userRepository.getAllUsers()
        return users;
    }

    async getUserById(id:string){
        const existingUser = await userRepository.getUserById(id)
        if(!existingUser){
            throw new AppError("User not found",404)
        }
        return existingUser;
    }

    // check whether a user exists
    async getUserByEmail(email:string):Promise<User | null>{
       return await userRepository.getUserByEmail(email)
        
    }
    
    async createUser(data:CreateUserData){
        const existingUser = await userRepository.getUserByEmail(data.email)
        if(existingUser){
            throw new AppError("User already exists",409)
        }
        const newUser = await userRepository.createUser(data)

        const {password,...safeUser} = newUser

        return safeUser;
    }

    async updateUserProfile(id:string,data:UpdateUserData){
        await this.getUserById(id)

        const updatedata = await userRepository.updateUser(id,data)   

        // remove password from being returned to the user
        const {password, ...safeUserData} = updatedata

        return safeUserData
    }

    async softDeleteUser(id:string){
        await this.getUserById(id)
       return await userRepository.deleteUser(id)
    }
}

export default new UserService;