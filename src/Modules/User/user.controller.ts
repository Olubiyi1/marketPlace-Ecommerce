import type{ Request,Response } from "express";
import { asyncHandler } from "../../ErrorHandlers/asyncHandler.js";
import userService from "./user.service.js";
import ResponseHandler from "../../Utils/responseHandler.js";


class UserController{
    getAllUsers= asyncHandler(async(_,res:Response)=>{
        const users = await userService.getAllusers()
        return ResponseHandler.success(res,"All users fetched",users)
    })
    getUserbyEmail  = asyncHandler(async(req:Request,res:Response)=>{
        const id = req.params.id as string
        const user = await userService.getUserByEmail(id)
        return ResponseHandler.success(res,"User retrieved",user)
    })

    getUserById = asyncHandler(async(req:Request,res:Response)=>{
        const id = req.params.id as string
        const user = await userService.getUserById(id)
        return ResponseHandler.success(res,"User retrieved",user)
    })

    updateUser = asyncHandler(async(req:Request,res:Response)=>{
        const id = req.params.id as string
        const data = req.body
        const updatedData = await userService.updateUserProfile(id,data)
        return ResponseHandler.success(res,"Profile update successful",updatedData)
    })

    deleteUser = asyncHandler(async(req:Request,res:Response)=>{
        const id = req.params.id as string
        return ResponseHandler.success(res,"user successfully deleted")
    })
}