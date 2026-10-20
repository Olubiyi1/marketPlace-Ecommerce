import { Queue } from "bullmq";
import redisConnection from "../../config/redis.config.js";

const emailVerificationQueue = new Queue("send-verification-email",{
    connection:redisConnection
})

export default emailVerificationQueue;