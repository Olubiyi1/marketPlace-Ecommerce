import type{ Request,Response,NextFunction } from "express";

export const asyncHandler = <T extends Request>(fn:(req:T, res:Response, next:NextFunction)=> any)=>{
    return( req:T,res:Response,next:NextFunction)=>{
        Promise.resolve(fn(req,res,next)).catch(next)
    }
}