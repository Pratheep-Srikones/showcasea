import { createClient } from "redis";

const redisPub = createClient({ url: process.env.REDIS_URL });

let redisConnected = false;

const connectRedis = async () => {
  if (!redisConnected) {
    try {
      await redisPub.connect();
      redisConnected = true;
      console.log("Next.js server connected to Redis");
    } catch (err) {
      console.error("Redis connection error:", err);
    }
  }
};

redisPub.on("error", (err) => {
  console.error("Redis client error:", err);
  redisConnected = false;

  setTimeout(connectRedis, 5000); // Retry after 5 seconds
});

export { redisPub, connectRedis };
