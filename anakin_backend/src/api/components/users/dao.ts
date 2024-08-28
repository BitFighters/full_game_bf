import { DB_CONFIG } from "@config/db_config";
import { PARTNER_WALLETS, SYSTEM_WALLETS } from "@config/system_wallets";
import { WEB_3_CONFIG } from "@config/web3_config";
import ASSETS_MANAGER from "@models/assets_manager";
import FRIENDS_DB from "@models/friends";
import SYSTEM_WALLET_DB from "@models/system_wallets";
import USER_DETAILS from "@models/user_details";
import WALLET_DB from "@models/wallet";
import WEB2_USERS from "@models/web2_users";
import { mapper, dbConnection } from "@services/db/connection";
import { ANAKIN_LOGGER } from "@services/logger";
import { makeTableName } from "@services/utils";
import { AcceptablePartners, AssetsName } from "@utils/asset_manager";
import { FRIENDS_STATUS } from "@utils/friends";
import { LoopWorker } from "../../../loopWorker";
import { isNullOrUndefined } from "util";
import WALLET_LOGS from "@models/wallet_logs";
import { WALLET_LOGS_GROUP } from "@utils/wallet_logs";
import BREW_PARTNER_WALLETS_DB from "@models/partner_wallets";
import { RedClient } from "@services/redis";
import { GetAllPartnerInfoRedisKey, GetAssetInfoRedisKey } from "@utils/user_details";

var priceOfBrew = 500;

export class UsersDao {
  static async loginUser(userWalletAddress: string) {
    let user: USER_DETAILS;
    try {
      user = await USER_DETAILS.getItem(userWalletAddress);
      // console.log("--------", userWalletAddress, LoopWorker.OneKUsersAddresses)
      if (LoopWorker.OneKUsersAddresses.includes(userWalletAddress.toLowerCase())) {
        console.log("--- here")
        user.user_type = "onek_club_owner";
      } else {
        user.user_type = "";
      }
      user.login_count += 1;
      user.updated_at = new Date()
      await mapper.update(user);
    } catch (err) {
      if (err.name === "ItemNotFoundException") {
        user = await USER_DETAILS.addUserToTable(userWalletAddress, 1);
      } else {
        throw new Error("Some unexpected error happened")
      }
    }
    return user;
  }

  /****
   * when sending friend request.
   * check if friend request is already sent by the user.
   * check if both are friends
   */
  static async SendFriendRequest(senderAddress: string, receiverAddress: string) {
    let sendersData: FRIENDS_DB = await FRIENDS_DB.getItem(senderAddress, receiverAddress);
    if (sendersData) {
      if (sendersData.friends_status === FRIENDS_STATUS.FRIENDS) {
        return {
          error: "Already Friends",
          message: ""
        }
      } else if (sendersData.friends_status === FRIENDS_STATUS.FRIEND_REQUEST_SENT) {
        return {
          error: "Already Friend Request Sent",
          message: ""
        }
      } else if (sendersData.friends_status === FRIENDS_STATUS.FRIEND_REQUEST_PENDING) {
        return {
          error: "You have pending friend Request",
          message: ""
        }
      }
    }
    const currentTime = new Date().getTime()
    await dbConnection.transactWriteItems({
      TransactItems: [
        {
          Put: {
            Item: {
              user_wallet_address: { S: senderAddress },
              other_user_address: { S: receiverAddress },
              friends_status: { N: FRIENDS_STATUS.FRIEND_REQUEST_SENT.toString() },
              created_at: { N: currentTime.toString() },
              updated_at: { N: currentTime.toString() },
              contract_address: { S: WEB_3_CONFIG.CONTRACT_ADDRESS }
            },
            TableName: makeTableName(DB_CONFIG.TABLES.FRIENDS_DB),
          },
        },
        {
          Put: {
            Item: {
              user_wallet_address: { S: receiverAddress },
              other_user_address: { S: senderAddress },
              friends_status: { N: FRIENDS_STATUS.FRIEND_REQUEST_PENDING.toString() },
              created_at: { N: currentTime.toString() },
              updated_at: { N: currentTime.toString() },
              contract_address: { S: WEB_3_CONFIG.CONTRACT_ADDRESS }
            },
            TableName: makeTableName(DB_CONFIG.TABLES.FRIENDS_DB),
          },
        }
      ]
    })
      .promise()
      .catch((e) => {
        console.log("failed in transaction writes ", e)
        return {
          error: "Failed to Add",
          message: ""
        }
      });
    return {
      error: "",
      message: "Success"
    }
  }

  /****
   * when sending friend request.
   * check if friend request is already sent by the user.
   * check if both are friends
   */
  static async AcceptFriendRequest(acceptorAddress: string, otherAddress: string) {
    let otherData: FRIENDS_DB = await FRIENDS_DB.getItem(otherAddress, acceptorAddress);
    let acceptorData: FRIENDS_DB = await FRIENDS_DB.getItem(acceptorAddress, otherAddress);
    if (otherData) {
      // if (otherData.friends_status === FRIENDS_STATUS.FRIENDS) {
      //   return {
      //     error: "Already Friends",
      //     message: ""
      //   }
      // }
      if (otherData.friends_status !== FRIENDS_STATUS.FRIEND_REQUEST_SENT) {
        return {
          error: "No Friend Request sent by this user.",
          message: ""
        }
      }
    }
    if (acceptorData) {
      if (acceptorData.friends_status != FRIENDS_STATUS.FRIEND_REQUEST_PENDING) {
        return {
          error: "Error",
          message: ""
        }
      }
    } else {
      return {
        error: "No Friend Request",
        message: ""
      }
    }
    const currentTime = new Date().getTime().toString()
    await dbConnection.transactWriteItems({
      TransactItems: [
        {
          Update: {
            UpdateExpression: "set friends_status = :val, updated_at= :uval ",
            TableName: makeTableName(DB_CONFIG.TABLES.FRIENDS_DB),
            ExpressionAttributeValues: {
              ":val": { N: FRIENDS_STATUS.FRIENDS.toString() },
              ":uval": { N: currentTime },
            },
            Key: {
              user_wallet_address: { S: acceptorAddress },
              other_user_address: { S: otherAddress },
            },
          },
        },
        {
          Update: {
            UpdateExpression: "set friends_status = :val, updated_at= :uval ",
            Key: {
              user_wallet_address: { S: otherAddress },
              other_user_address: { S: acceptorAddress },
            },
            TableName: makeTableName(DB_CONFIG.TABLES.FRIENDS_DB),
            ExpressionAttributeValues: {
              ":val": { N: FRIENDS_STATUS.FRIENDS.toString() },
              ":uval": { N: currentTime },
            },
          },
        }
      ]
    })
      .promise()
      .catch((e) => {
        console.log("failed in transaction writes ", e)
        return {
          error: "Failed to Accept",
          message: ""
        }
      });
    return {
      error: "",
      message: "Success"
    }
  }

  static async RegisterWeb2User(email: string, user_wallet_address: string, password: string) {
    try {
      const res = await UsersDao.FetchWeb2User(email);
      if (!isNullOrUndefined(res)) {
        throw "User Already Exist"
      }
      await WEB2_USERS.addUserToWeb2DB(email, user_wallet_address, password);
      return "";
    } catch (err) {
      ANAKIN_LOGGER.error({ event: "RegisterWeb2User", error: err });
      throw err;
    }
  }

  static async FetchWeb2User(email: string) {
    try {
      const result = await WEB2_USERS.getItemFromWeb2DB(email);
      return result;
    } catch (err) {
      ANAKIN_LOGGER.error({ event: "FetchWeb2User", error: err });
      return null;
    }
  }

  static async addAssetIntoTable(userWalletAddress: string, assetName: AssetsName, quantity: number, partner_id: string, identity: string) {
    try {

      if (identity == 'bot') {
        let data = await WALLET_DB.createWalletForUser(userWalletAddress)
        data.web2_balance = 1000 * 100;
        await mapper.update(data)
      }

      let data: WALLET_DB = await WALLET_DB.getWalletInfoOfUser(userWalletAddress);
      if (data.web2_balance < quantity * priceOfBrew) {
        throw "INSUFICIENT FUNDS"
      }
      if (!AcceptablePartners.includes(partner_id)) {
        throw "Invalid Partner"
      }
      let promises = [];

      promises.push(ASSETS_MANAGER.addAssetIntoTable(userWalletAddress, assetName, quantity))
      data.web2_balance -= quantity * priceOfBrew;
      promises.push(mapper.update(data));
      //
      let wallet_log_msg = `Bought ${quantity} Brew`
      promises.push(WALLET_LOGS.addIntoWalletLogs(
        userWalletAddress, -Math.floor(quantity * priceOfBrew / 100), WALLET_LOGS_GROUP.BREW, wallet_log_msg
      ));
      // transfer money to pp and partner purse.
      promises.push(SYSTEM_WALLET_DB.updateWeb2Balance(SYSTEM_WALLETS.PrizePool5, Math.floor(priceOfBrew / 2)))
      promises.push(BREW_PARTNER_WALLETS_DB.updatePartnerBalanceAndItemSold(partner_id, Math.floor(priceOfBrew / 2), quantity))
      await Promise.all(promises);

      await this.DeletePartnersInfoInRedis();
      await this.DeleteUserAssetInfoInRedis(userWalletAddress);
      return
    } catch (err) {
      ANAKIN_LOGGER.error({ event: "addAssetIntoTable", error: err });
      throw err;
    }
  }

  static async FetchAssetsOfUser(userWalletAddress: string) {
    return this.FetchAssetsOfUserFromRedis(userWalletAddress);
  }

  static async FetchAllPartnersInfo() {
    return this.FetchAllPartnerInfoFromRedis();
  }

  static async DeleteUserAssetInfoInRedis(userWalletAddress: string) {
    try {
      await RedClient.deleteKey(GetAssetInfoRedisKey(userWalletAddress));
    } catch (err) {
      return null;
    }
  }

  static async DeletePartnersInfoInRedis() {
    try {
      await RedClient.deleteKey(GetAllPartnerInfoRedisKey());
    } catch (err) {
      return null;
    }
  }

  static async FetchAssetsOfUserFromRedis(userWalletAddress: string) {
    const data = await RedClient.getOrSetThenGet(GetAssetInfoRedisKey(userWalletAddress),
      async () => {
        let result = await ASSETS_MANAGER.getAllAssetsOfUser(userWalletAddress);
        return JSON.stringify(result);
      },
      2 * 60
    );
    return JSON.parse(data);
  }

  static async FetchAllPartnerInfoFromRedis() {
    const data = await RedClient.getOrSetThenGet(GetAllPartnerInfoRedisKey(),
      async () => {
        let all_assets_info: Array<BREW_PARTNER_WALLETS_DB> = await BREW_PARTNER_WALLETS_DB.getAllEntries();
        return JSON.stringify(all_assets_info);
      },
      60
    );
    return JSON.parse(data);
  }

}
