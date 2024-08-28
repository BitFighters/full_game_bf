import { ScanIterator } from "@aws/dynamodb-data-mapper";
import CONSTANTS_DB from "@models/constants";
import SYSTEM_WALLET_DB from "@models/system_wallets";
import WALLET_DB from "@models/wallet";
import WALLET_LOGS from "@models/wallet_logs";
import { mapper } from "@services/db/connection";
import { ANAKIN_LOGGER } from "@services/logger";
import { RedClient } from "@services/redis";
import { fetchDepositInfo } from "@services/web3/gamelogic_reader";
import { RedeemMoneyForUser, UpdateWalletBalanceForUser } from "@services/web3/writer";
import { GetBitfightersNameRedisKey } from "@utils/bitfighter_nft_specs";
import { GetConstantValueRedisKey, GetSyatemWalletsBalanceRedisKey } from "@utils/wallet";
import { WALLET_LOGS_GROUP } from "@utils/wallet_logs";
import BigNumber from "bignumber.js";
import { isNullOrUndefined } from "util";

export class WalletDAO {
  static WALLET_LOGS_INFO: Map<string, Array<WALLET_LOGS>> = new Map();
  static WALLET_LOGS_INFO_UPDATED: Map<string, number> = new Map();

  public static async FetchUserWalletInfo(user_wallet_address: string) {
    // if (this.WALLET_FULL_INFO.get(user_wallet_address) && new Date().getTime() - this.WALLET_INFO_UPDATED.get(user_wallet_address) > 10*1000) {
    //   console.log("found user wallet info in local ", user_wallet_address);
    //   return this.WALLET_FULL_INFO.get(user_wallet_address);
    // }
    try {
      const data: WALLET_DB = await WALLET_DB.getWalletInfoOfUser(user_wallet_address);
      // this.WALLET_FULL_INFO.set(user_wallet_address, data);
      // this.WALLET_INFO_UPDATED.set(user_wallet_address, new Date().getTime())
      return data;
    } catch (err) {
      if (err.name === "ItemNotFoundException") {
        console.log(" item not found .. ", err.message);
        return await WALLET_DB.createWalletForUser(user_wallet_address);
      }
      throw err.message;
    }
  }

  public static async FetchUserWalletLogs(user_wallet_address: string) {
    try {
      if (this.WALLET_LOGS_INFO.get(user_wallet_address) && this.WALLET_LOGS_INFO_UPDATED.get(user_wallet_address) && new Date().getTime() - this.WALLET_LOGS_INFO_UPDATED.get(user_wallet_address) < 30 * 1000) {
        return this.WALLET_LOGS_INFO.get(user_wallet_address);
      }
      const data: Array<WALLET_LOGS> = await WALLET_LOGS.FetchWalletLogsOfUser(user_wallet_address);
      this.WALLET_LOGS_INFO.set(user_wallet_address, data);
      this.WALLET_LOGS_INFO_UPDATED.set(user_wallet_address, new Date().getTime());
      return data;
    } catch (err) {
      throw err.message;
    }
  }

  public static async UpdateWalletInfo(user_wallet_address: string) {
    try {
      let { balance, count, redemptionCount } = await fetchDepositInfo(user_wallet_address);
      const data: WALLET_DB = await WALLET_DB.getWalletInfoOfUser(user_wallet_address);
      console.log(" data deposit count UpdateWalletInfo -- ", balance, data.web2_balance, data.deposit_count, BigNumber(count).toNumber(), data.deposit_count < BigNumber(count).toNumber());
      // 300, 3
      if (data.deposit_count < BigNumber(count).toNumber()) {
        // 2, 3
        data.deposit_count = BigNumber(count).toNumber(); // 3
        let last_web3_balance = data.web3_balance; // 200
        data.web3_balance = BigNumber(balance).toNumber(); // 300

        // let last_web2_balance = data.web2_balance;
        let diff = 0;
        if (data.deposit_count === 1) {
          data.web2_balance = data.web3_balance;
          diff = data.web2_balance;
        } else {
          data.web2_balance += data.web3_balance - last_web3_balance;
          diff = data.web3_balance - last_web3_balance;
          // if (last_web3_balance >= data.web3_balance) {
        }
        diff = Math.floor(diff / 100);

        let wallet_log_msg = `Added ${diff} Bits into ATM.`;
        await WALLET_LOGS.addIntoWalletLogs(user_wallet_address, diff, WALLET_LOGS_GROUP.ATM_DEPOSIT, wallet_log_msg);

        //   data.web2_balance = data.web3_balance; //
        // } else {
        //   data.web2_balance += data.web3_balance - last_web3_balance; // 200 + 300 - 200 = 300
        // }

        // this.WALLET_FULL_INFO.set(user_wallet_address, data);
        // this.WALLET_INFO_UPDATED.set(user_wallet_address, new Date().getTime())

        await mapper.update(data);
        return;
      }
      throw "ALREADY_UPDATED";
    } catch (err) {
      ANAKIN_LOGGER.error({
        function: "UpdateWalletInfo",
        user_wallet_address,
        error: err,
      });
      throw err;
    }
  }

  public static async RedeemMoneyFromWallet(user_wallet_address: string, amount: string) {
    let data: WALLET_DB;
    try {
      data = await WALLET_DB.getWalletInfoOfUser(user_wallet_address);

      // if (data.last_redeemed_at && new Date().getTime() - data.last_redeemed_at < 1 * 60 * 60* 1000 ) {
      //   throw "CAN REDEEM ONCE EVERY HOUR"
      // }
      ANAKIN_LOGGER.info({
        event: "Redeem_start",
        function: "RedeemMoneyFromWallet",
        user_wallet_address,
        web2_balance: data.web2_balance,
        amount,
      });

      console.log("------RedeemMoneyFromWallet---", data.web2_balance, BigNumber(amount).toNumber());
      if (data.web2_balance < BigNumber(amount).toNumber()) {
        throw "MORE AMOUNT ERROR";
      }
      let { balance, count } = await fetchDepositInfo(user_wallet_address);
      console.log("__in_RedeemMoneyFromWallet__", BigNumber(balance).toNumber(), data.web2_balance, BigNumber(balance).toNumber() === data.web2_balance);
      if (BigNumber(balance).toNumber() !== data.web2_balance) {
        await UpdateWalletBalanceForUser(user_wallet_address, data.web2_balance.toString());
      }
      await RedeemMoneyForUser(user_wallet_address, amount);
      data.web3_balance = data.web2_balance - BigNumber(amount).toNumber();
      data.web2_balance -= BigNumber(amount).toNumber();
      data.last_redeemed_at = new Date().getTime();

      let wallet_log_msg = `Removed ${BigNumber(amount).toNumber()} Bits from ATM.`;
      await WALLET_LOGS.addIntoWalletLogs(user_wallet_address, -BigNumber(amount).toNumber(), WALLET_LOGS_GROUP.ATM_WITHDRAWAL, wallet_log_msg);

      // this.WALLET_FULL_INFO.set(user_wallet_address, data);
      // this.WALLET_INFO_UPDATED.set(user_wallet_address, new Date().getTime())

      console.log("------RedeemMoneyFromWallet_ updated---", data.web2_balance);

      ANAKIN_LOGGER.info({
        event: "Redeem_end",
        function: "RedeemMoneyFromWallet",
        user_wallet_address,
        web2_balance: data.web2_balance,
        amount,
      });

      await mapper.update(data);
    } catch (err) {
      ANAKIN_LOGGER.error({
        event: "Redeem_error",
        function: "RedeemMoneyFromWallet",
        user_wallet_address,
        amount,
        error: err,
      });
      throw err;
    }
  }

  public static async addMoneyInWallet(user_wallet_address: string, amount: number) {
    // try {
    //   const data: WALLET_DB = await WALLET_DB.getWalletInfoOfUser(user_wallet_address);
    //   data.updated_at = new Date().getTime();
    //   // data.web2_coins += amount;
    //   await mapper.update(data);
    //   return data;
    // } catch (err) {
    //   throw err.message;
    // }
  }

  static async fetchSystemWalletsData() {
    const data = await RedClient.getOrSetThenGet(
      GetSyatemWalletsBalanceRedisKey(),
      async () => {
        const scanIterator: ScanIterator<SYSTEM_WALLET_DB> = mapper.scan(SYSTEM_WALLET_DB);
        let data = [];
        for await (const bfInfo of scanIterator) {
          data.push(bfInfo);
        }
        return JSON.stringify(data);
      },
      2 * 60
    );
    return JSON.parse(data);
  }

  static async fetchConstantValueFromRedis(key: string) {
    let data = await CONSTANTS_DB.GetConstantData(key);
    return data;
    // const data = await RedClient.getOrSetThenGet(
    //   GetConstantValueRedisKey(key),
    //   async () => {
    //     let data = await CONSTANTS_DB.GetConstantData(key);
    //     return JSON.stringify(data);
    //   },
    //   2 * 60
    // );
    // return JSON.parse(data);
  }
}
