import config from "./config.js"
import {Redis} from "ioredis"


const redisUrl = config.redis_url
if (!redisUrl) {
  throw new Error("REDIS_URL is not set");
}

const redisConnection = new Redis(redisUrl,{
    maxRetriesPerRequest: null
})

redisConnection.on("connect", () => {
  const { host, port } = redisConnection.options;
  console.log(`Redis connected to ${host}:${port}`);
});
redisConnection.on("error",(error)=>{
    console.error(`error connecting to redis, ${error}`);
})

export default redisConnection;