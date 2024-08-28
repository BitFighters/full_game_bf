
export function GetSyatemWalletsBalanceRedisKey() {
  let arr = [`${process.env.NODE_ENV || "dev"}`, "system", "wallets"];
  return arr;
}


export function GetConstantValueRedisKey(key: string) {
  let arr = [`${process.env.NODE_ENV || "dev"}`, "constants", key];
  return arr;
}