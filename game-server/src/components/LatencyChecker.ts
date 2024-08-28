import { isNullOrUndefined } from "util";


export class LatencyChecker {
  static ping_received_at = {}
  static ping_sent_at = {}

  static setPingReceivedAt(user_uid: string, time: number) {
    LatencyChecker.ping_received_at[user_uid] = time
  }

  static setPingSentAt(user_uid: string, time: number) {
    LatencyChecker.ping_sent_at[user_uid] = time
  }

  static getLatencyTime(user_uid: string) {
    // console.log("in getlatency,, ", LatencyChecker.ping_received_at[user_uid], LatencyChecker.ping_sent_at[user_uid])
    try {
      let res = (LatencyChecker.ping_received_at[user_uid] - LatencyChecker.ping_sent_at[user_uid])/2;
      if (isNullOrUndefined(res)) {
        return 0;
      }
      return res;
    } catch (err) {
      console.log("error in getLatencyTime -- ", err)
      return 0;
    }
  }
}