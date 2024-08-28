import { ScanIterator } from "@aws/dynamodb-data-mapper";
import STATS_DB from "@models/statsDB";
import USER_DETAILS from "@models/user_details";
import WEEKLY_STATS from "@models/weekly_stats";
import { mapper } from "@services/db/connection";
import { ILeaderboardData } from "@utils/leaderboard";
import { isNullOrUndefined } from "util";
import { WalletDAO } from "../wallets/dao";

export class LeaderBoardDao {
  static LEADERBOARD_INFO = [];
  static LEADERBOARD_UPDATED_AT: number = 0;
  static WEEKLY_LEADERBOARD_INFO = []

  public static async UpdateLeaderBoardData() {
    console.log("-----------UpdateLeaderBoardData------------------")
    let finalData = [];
    let finalWeeklyData = [];
    try {
      const user_details_data: Array<USER_DETAILS> = await USER_DETAILS.getAllItem();
      for (let i = 0; i < user_details_data.length; i++) {
        const stats = await STATS_DB.getItem(user_details_data[i].user_wallet_address);
        const weekly_stats = await WEEKLY_STATS.getItem(user_details_data[i].user_wallet_address);
        if (!isNullOrUndefined(stats) && stats.fights_count > 0) {
          let ldata = await WalletDAO.FetchUserWalletInfo(user_details_data[i].user_wallet_address);
          let tempData: ILeaderboardData = {
            user_wallet_address: ldata.user_wallet_address,
            web2_balance: ldata.web2_balance,
            num_fights: stats.fights_count,
            win_count: stats.wins_count,
            loss_count: stats.loss_count,
            alias: stats.player_alias
          }
        }
        if (!isNullOrUndefined(weekly_stats) && weekly_stats.fights_count > 0) {
          let ldata = await WalletDAO.FetchUserWalletInfo(user_details_data[i].user_wallet_address);
          let tempData1: ILeaderboardData = {
            user_wallet_address: ldata.user_wallet_address,
            web2_balance: ldata.web2_balance,
            num_fights: weekly_stats.fights_count,
            win_count: weekly_stats.wins_count,
            loss_count: weekly_stats.loss_count,
            alias: weekly_stats.player_alias
          }
          finalWeeklyData.push(tempData1);
        }
      }
      finalData.sort((a: ILeaderboardData, b: ILeaderboardData) => {
        return (b.win_count / b.loss_count) - (a.win_count / a.loss_count);
      });
      this.LEADERBOARD_INFO = finalData;
      this.LEADERBOARD_UPDATED_AT = new Date().getTime()
    } catch (err) {
      console.log("error in updating leaderboard ... ", err)
    }
  }


  public static async UpdateLeaderBoardDataV2() {
    console.log("----------------UpdateLeaderBoardDataV2------------------")
    let finalData = [];
    let finalWeeklyData = [];
    try {
      const scanIterator: ScanIterator<STATS_DB> = mapper.scan(STATS_DB);
      for await (const stats of scanIterator) {
        finalData.push(stats)
      }
      // finalData.sort((a: ILeaderboardData, b: ILeaderboardData) => {
      //   return (b.win_count / b.loss_count) - (a.win_count / a.loss_count);
      // });

      finalData.sort((a, b) => {
        return (b.wins_count) - (a.wins_count);
      });

      const scanIterator2: ScanIterator<WEEKLY_STATS> = mapper.scan(WEEKLY_STATS);
      for await (const stats of scanIterator2) {
        finalWeeklyData.push(stats)
      }
      // finalWeeklyData.sort((a: ILeaderboardData, b: ILeaderboardData) => {
      //   return (b.win_count / b.loss_count) - (a.win_count / a.loss_count);
      // });

      finalWeeklyData.sort((a, b) => {
        return (b.wins_count) - (a.wins_count);
      });

      this.WEEKLY_LEADERBOARD_INFO = finalWeeklyData;
      this.LEADERBOARD_INFO = finalData;
      this.LEADERBOARD_UPDATED_AT = new Date().getTime()
    } catch (err) {
      console.log("error in updating leaderboard ... ", err)
      throw err
    }
  }

  // public static async FetchLeaderBoard(user_wallet_address: string) {
  //   try {
  //     let {balance, count, redemptionCount} =  await fetchDepositInfo(user_wallet_address);
  //     const data: WALLET_DB = await WALLET_DB.getWalletInfoOfUser(user_wallet_address);
  //     // console.log(" data deposit count UpdateWalletInfo -- ", balance, data.web2_balance, data.deposit_count,  BigNumber(count).toNumber(), data.deposit_count < BigNumber(count).toNumber())
  //     if (data.deposit_count < BigNumber(count).toNumber()) { // 2, 3
  //       data.deposit_count = BigNumber(count).toNumber(); // 3
  //       let last_web3_balance = data.web3_balance; // 200
  //       data.web3_balance = BigNumber(balance).toNumber(); // 300
  //       if (data.deposit_count === 1) {
  //         data.web2_balance = data.web3_balance;
  //       } else {
  //         data.web2_balance += data.web3_balance - last_web3_balance;
  //       }

  //       await mapper.update(data);
  //       return
  //     }
  //     throw "ALREADY_UPDATED"
  //   } catch (err) {
  //     ANAKIN_LOGGER.error({
  //       function: "UpdateWalletInfo",
  //       user_wallet_address,
  //       error: err,
  //     })
  //     throw err;
  //   }
  // }

}