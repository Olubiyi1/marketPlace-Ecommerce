// import redisConnection from "./config/redis.config.js";
import app from "./app.js";
import config from "./config/config.js";


app.listen(config.port, () => {
  console.log(`server runnin on ${config.port}`);
});

