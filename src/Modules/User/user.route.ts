import userController from "./user.controller.js";
import { Router } from "express";

const userRoute = Router();

userRoute.get("/",userController.getAllUsers)


export default userRoute;