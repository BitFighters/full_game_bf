

export function GetFightInfoRedisKey(fight_id: string) {
  let arr = [ `${process.env.NODE_ENV || "dev"}` , "fight_info", fight_id ];
  return arr;
}