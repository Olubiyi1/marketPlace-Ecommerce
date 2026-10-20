import userService from "../User/user.service.js";
import AppError from "../../ErrorHandlers/appError.js";
import type { RegisterDTO, LoginDTO } from "./auth.dto.js";
import redisEmailVerificationHelper from "../../Helpers/redis.emailVerification.helper.js";
import { generateToken, hashToken } from "../../Helpers/token.helper.js";
import emailVerificationQueue from "../Queues/emailVerification.queue.js";
import prisma from "../../lib/prisma.js";

class AuthService {
    async registerUser(userData: RegisterDTO) {
        // find existing email/user
        const existingUser = await userService.getUserByEmail(userData.email);
        if (existingUser) {
            throw new AppError(
            `User with email: ${existingUser.email} already exists`,
            409,
            );
        }
        // create new user
        const user = await userService.createUser(userData);

        // generate token

        const token = generateToken();

        // hash token for redis
        const hashedToken = hashToken(token);

        // save to redis
        try {
            await redisEmailVerificationHelper.setVerificationToken(
            hashedToken,
            user.email,
        );
        }       
        catch (err) {
            console.error("failed to send verification token due to redis failure");
        }
        // send verification token

        try{
            await emailVerificationQueue.add("send-verification-email",{
                email:user.email,
                token
            },
            {
                attempts:3,
                backoff:{
                    type:"exponential",
                    delay:5000
                }
            }
        );
        }
        catch(err){

           console.error("Email verification could not be initiated:", err);
        };
        return user

    }
}
