import redisConnection from "../config/redis.config.js";
import AppError from "../ErrorHandlers/appError.js";
import { hashToken } from "./token.helper.js";

class EmailVerificationTokenService {
  async setVerificationToken(token: string, email: string): Promise<void> {
    const hashedToken = hashToken(token);
    const key = `emailVerification:${hashedToken}`;
    try {
      await redisConnection.setex(key, 900, email);
    } catch (err) {
      throw new AppError(
        "Email verification service currently unavailabel",
        503,
      );
    }
  }
  async getVerificationToken(token: string): Promise<string | null> {
    const hashedToken = hashToken(token);
    const key = `emailVerification:${hashedToken}`;
    try {
      const email = await redisConnection.get(key);
      return email;
    } catch (err) {
      throw new AppError(
        "Email verification service currently unavailable",
        503,
      );
    }
  }

  async deleteVerificationToken(token: string): Promise<void> {
    const hashedToken = hashToken(token);
    const key = `emailVerification:${hashedToken}`;

    try {
      await redisConnection.del(key);
    } catch (err) {
      throw new AppError(
        "Email verification service currently unavailable",
        503,
      );
    }
  }
}

export default new EmailVerificationTokenService;
