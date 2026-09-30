import dotenv from "dotenv"
dotenv.config()

export default{
    port:Number(process.env.PORT),
    REDIS_URL:process.env.REDIS_URL as string
}