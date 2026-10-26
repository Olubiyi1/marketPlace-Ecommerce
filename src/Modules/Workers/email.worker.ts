import { Worker } from "bullmq";
import redisConnection from "../../config/redis.config.js";
import { sendMail } from "../../Helpers/sendMail.js";
import config from "../../config/config.js";

const emailVerificationWorker = new Worker(
  "email-queue",
  async (job) => {
    if (job.name === "send-verification-email") {
      const { email, token } = job.data;

      // send verification email here
      const verificationUrl =`${config.base_url}/api/v1/auth/verify-email/${token}`

      await sendMail(
        email,
        "Verify your email",
        `<h1>Verify your email</h1>
        <p>Click the link below to verify your account:</p>
        <a href="${verificationUrl}">Verify my email</a>`,
      );

      console.log("preparing to send email");
    }
  },
  {
    connection: redisConnection,
  },
);

emailVerificationWorker.on("completed", (job) => {
  console.log(`Email job ${job.id} completed`);
});
emailVerificationWorker.on("failed", (job, err) => {
  console.error(`Email job ${job?.id} failed`, err.message);
});
export default emailVerificationWorker;
