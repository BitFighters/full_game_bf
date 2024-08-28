// import {
//   createClient
// } from 'redis';

import Redis from "ioredis";

const REDIS_CLUSTER_CLIENT = process.env.REDIS_CLUSTER_CLIENT || "redis://default:akK4NtxxCSY4L5Pqqx8iT2p56dFtHtLf@redis-13706.c301.ap-south-1-1.ec2.cloud.redislabs.com:13706"

// const redisClient = createClient({
//   url: REDIS_CLUSTER_CLIENT,
// });


const redisClient = new Redis.Cluster([
  {
    port: 6379,
    host: REDIS_CLUSTER_CLIENT,
  },
]);


export class RedisClient {
  public static async hget (key: string, memberKey: string) {
    try {
      return await redisClient.hget(key, memberKey);
    } catch (e) {
      return undefined
    }
  }

  public static async increase(key: string) {
    try {
      return await redisClient.incr(key);
    } catch (e) {
      console.log("redis increment failed ", key)
      return undefined
    }
  }

  public static async decrease(key: string) {
    try {
      return await redisClient.decr(key);
    } catch (e) {
      console.log("redis decrease failed ", key)
      return undefined
    }
  }

  public static async get(key: string) {
    try {
      return await redisClient.get(key);
    } catch (e) {
      console.log("redis get failed ", key)
      return undefined
    }
  }
}
