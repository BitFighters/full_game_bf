import { isNullOrUndefined } from "util";


export class HealthManager {
  static healthOfUsers = {}

  static setHealth(user_uid: string, _health: number, minted_id: string) {
    HealthManager.healthOfUsers[user_uid+"_"+minted_id] = _health
  }

  static getHealth(user_uid: string, minted_id: string) {
    try {
      let res = HealthManager.healthOfUsers[user_uid+"_"+minted_id];
      if (isNullOrUndefined(res)) {
        return -99;
      }
      return res;
    } catch (err) {
      console.log("error -- ", err)
      return -99;
    }
    
  }
}