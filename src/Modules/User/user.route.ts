import userController from "./user.controller.js";
import { Router } from "express";

const userRoute = Router();

userRoute.post("/",userController.getAllUsers)