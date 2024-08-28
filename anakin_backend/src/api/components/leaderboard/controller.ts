import * as Hapi from "hapi";
import { LeaderBoardDao } from "./dao";

export async function FetchLeaderboard(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  console.log("-----------FetchLeaderboard------------------")
  try {
    if (new Date().getTime() - LeaderBoardDao.LEADERBOARD_UPDATED_AT < 60 * 1000) {
      return h.response({ data: LeaderBoardDao.LEADERBOARD_INFO, tournament_data: LeaderBoardDao.WEEKLY_LEADERBOARD_INFO }).code(200);
    }
    await LeaderBoardDao.UpdateLeaderBoardDataV2()
    return h.response({ data: LeaderBoardDao.LEADERBOARD_INFO, tournament_data: LeaderBoardDao.WEEKLY_LEADERBOARD_INFO }).code(200);
  } catch (err) {
    console.log(" err ", err)
    return h.response({ error: err }).code(400);
  }
}

// export async function UpdateLeaderBoard(request: Hapi.Request, h: Hapi.ResponseToolkit) {
//   try {
//     await LeaderBoardDao.UpdateLeaderBoardData()
//     return h.response({ success: 1 }).code(200);
//   } catch (err) {
//     return h.response({ error: err }).code(400);
//   }
// }
