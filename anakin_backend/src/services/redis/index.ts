// import { REDIS_CONFIG } from "@config/redis_config";
import { REDIS_CONFIG } from "@config/redis_config";
import Redis from "ioredis";
// import { Cluster } from 'ioredis'
import { isNullOrUndefined } from "util";
// var RedisClustr = require('redis-clustr');

console.log("---------", REDIS_CONFIG.ANAKIN_REDIS_PORT, REDIS_CONFIG.ANAKIN_REDIS_HOST)
const anakin_redis_client = new Redis.Cluster([
  {
    port: parseInt(REDIS_CONFIG.ANAKIN_REDIS_PORT),
    host: REDIS_CONFIG.ANAKIN_REDIS_HOST,
  },
]);

// const anakin_redis_client = new Redis.Cluster([
//   { port: 6179, host: '127.0.0.1' },  // Initial node you connected to
//   { port: 6181, host: '127.0.0.1' }   // Additional node as seen in the redirection
//   // Include other nodes as necessary
// ]);

anakin_redis_client.on('connect', () => {
  console.log('Redis Cluster connected');
});

anakin_redis_client.on('error', (err) => console.log('Redis Cluster Error', err));

// export var anakin_redis_client = new RedisClustr({
//   servers: [
//     {
//       host: '127.0.0.1',
//       port: 6179
//     }
//   ]
// });

// import { createCluster } from 'redis';

// const anakin_redis_client = createCluster({
//   rootNodes: [
//     {
//       url: 'redis://10.0.0.1:30001'
//     },
//     {
//       url: 'redis://10.0.0.2:30002'
//     }
//   ]
// });

// anakin_redis_client.on('error', (err) => console.log('Redis Cluster Error', err));

// import { createClient } from 'redis';

// const oneHr = 1000 * 60 * 60;
// const retry_strategy = function (options) {
//   if (options.error && options.error.code === "ECONNREFUSED") {
//     // End reconnecting on a specific error and flush all commands with
//     // a individual error
//     return "Conn Refused";
//   }
//   if (options.total_retry_time > oneHr) {
//     // End reconnecting after a specific timeout and flush all commands
//     // with a individual error
//     return "Retry time exhausted";
//   }
//   if (options.attempt > 10) {
//     // End reconnecting with built in error
//     return undefined;
//   }
//   // reconnect after
//   return Math.min(options.attempt * 100, 3000);
// };




export class RedClient {
  // static anakin_redis_client;

  static async StartRedis() {
    // this.anakin_redis_client = createClient({
    //   host: CONFIG.REDIS_HOST,
    //   db: CONFIG.REDIS_DATABASE,
    //   retry_strategy
    // })
    // this.anakin_redis_client.on('error', err => console.log('Redis Client Error', err))
    // // this.anakin_redis_client.connect();
    // await this.anakin_redis_client.set('key', 'value');
  }

  static getKey(key: Array<any>) {
    return key.join(":");
  }

  static async GET(keySet: Array<any>) {
    const redisKey = this.getKey(keySet);
    console.log("GET ", redisKey)
    const cache = await anakin_redis_client.get(redisKey);
    return cache;
  }

  static async getOrSetThenGet(keySet: Array<any>, callback: any, expire: number) {
    const redisKey = this.getKey(keySet);
    console.log("getOrSetThenGet ", redisKey)
    const cache = await anakin_redis_client.get(redisKey).catch(e => undefined);;
    if (!isNullOrUndefined(cache)) {
      return cache;
    }
    const result = await callback().catch((e) => { throw e; });
    if (!isNullOrUndefined(result)) {
      await anakin_redis_client.set(redisKey, result);
      await anakin_redis_client.expire(redisKey, expire);
    }
    return result;
  }

  static async Set(keySet: Array<any>, value: any, expire: number) {
    const redisKey = this.getKey(keySet);
    await anakin_redis_client.set(redisKey, value);
    await anakin_redis_client.expire(redisKey, expire);
  }

  static async deleteKey(key: Array<any>) {
    console.log("deleting key... ", key)
    const redisKey = this.getKey(key);
    await anakin_redis_client.del(redisKey);
  }
}