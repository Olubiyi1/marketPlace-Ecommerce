import userService from "../User/user.service.js";
import AppError from "../../ErrorHandlers/appError.js";
import type { RegisterDTO, LoginDTO } from "./auth.dto.js";
import redisEmailVerificationHelper from "../../Helpers/redis.emailVerification.helper.js";
import { generateToken, hashToken } from "../../Helpers/token.helper.js";
import emailVerificationQueue from "../Queues/emailVerification.queue.js";
import { createLabel } from "../../Utils/createLabel.js";
import prisma from "../../lib/prisma.js";
import Guards from "../../Guards/guards.js";
import { use } from "react";

const auth_service_Log = createLabel("AUTH_SERVICE");
class AuthService {
  async registerUser(userData: RegisterDTO) {
    // find existing email/user
    const existingUser = await userService.getUserByEmail(userData.email);
    if (existingUser) {
      auth_service_Log.warn(
        "User with email: ${existingUser.email} already exists",
      );
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
    } catch (err) {
      console.error("failed to send verification token due to redis failure");
    }
    // queue verification email sending

    try {
      await emailVerificationQueue.add(
        "send-verification-email",
        {
          email: user.email,
          token,
        },
        {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 5000,
          },
        },
      );
    } catch (err) {
      console.error("Email verification could not be initiated:", err);
    }
    return user;
  }

  async verifyEmail(token: string) {
    try {
      const email =
        await redisEmailVerificationHelper.getVerificationToken(token);
      if (!email) {
        auth_service_Log.warn("Verification token is required or expired");
        throw new AppError("invalid or expired verification token", 400);
      }
      await prisma.user.update({
        where: { email },
        data: {
          verifiedAt: new Date(),
        },
      });

      // delete verification token from redis
      await redisEmailVerificationHelper.deleteVerificationToken(token);
      auth_service_Log.info("Email verification successful");
      return { message: "Email verification successful" };
    } catch (err) {
      auth_service_Log.error("Error validation your email, kindly try again");
      if (err instanceof AppError) {
        throw err;
      }
      throw new AppError(
        "Email verification failed. Please try again later.",
        500,
      );
    }
  }

  async loginUser(data: LoginDTO) {
    // find user
    const user = await userService.getUserByEmail(data.email);
    if (!user) {
      auth_service_Log.warn("Invalid email or password");
      throw new AppError("Invalid email or password", 401);
    }

    // compare password
    const passwordMatch = await Guards.verifyPassword(data.password,user.password);
    if (!passwordMatch) {
      auth_service_Log.warn("Invalid email or password");
      throw new AppError("Invalid email or password", 400);
    }

    // confirm if user is verified
    if (!user.verifiedAt) {
      auth_service_Log.warn("User email is not verified");
      throw new AppError("Please verify your email before logging in", 403);
    }
  }
}

export default new AuthService();
