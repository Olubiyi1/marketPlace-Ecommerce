import { createClient } from "redis";
import config from "./config.js";

const redisClient = await createClient({
    url:config.REDIS_URL
})
redisClient.on("error",(err)=>{
    console.log("Redis client error",err);
})

export default redisClient;