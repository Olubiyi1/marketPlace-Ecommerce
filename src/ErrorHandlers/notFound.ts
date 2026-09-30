import type{ Request,Response,NextFunction } from "express";
import AppError from "./appError.js";

export const notFound =(req:Request,res:Response,next:NextFunction)=>{
    const err = new AppError(`Can't find ${req.originalUrl}`,404)
    next(err)
}