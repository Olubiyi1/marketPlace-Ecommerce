import dotenv from "dotenv";
dotenv.config();

export default {
  port: Number(process.env.PORT),
  redis_url: process.env.REDIS_URL as string,
  db_url: process.env.DATABASE_URL as string,
  email_user: process.env.EMAIL_USER as string,
  email_password: process.env.EMAIL_PASSWORD as string,
  base_url:process.env.BASE_URL as string
};
