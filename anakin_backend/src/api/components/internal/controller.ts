import { Web3Dao } from './../web3/dao';
import QueueDB from "@models/queueDB";
import * as Hapi from "hapi";
import { ANAKIN_LOGGER } from "@services/logger";
import { WalletDAO } from "../wallets/dao";
import CONSTANTS_DB from "@models/constants";
import { IRewardsRatsDropData } from "@utils/prizePoolRat";
import { mapper } from "@services/db/connection";
import SYSTEM_WALLET_DB from "@models/system_wallets";
import { SYSTEM_WALLETS } from "@config/system_wallets";
import BITFIGHTER_NFT_SPECS from '@models/bitfighter_nft_specs';



export async function DeleteUserFromQueue(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  // const { user_wallet_address } = request.params;
  const payload = request.payload || {};
  const user_wallet_address = payload["user_wallet_address"];
  try {
    const items: Array<QueueDB> = await QueueDB.getItemsFromQueueForUserAddress(user_wallet_address);
    await Promise.all(items.map(async item => {
      await QueueDB.deleteFromQueue(item);
    }))

    return h.response({ success: 1 }).code(200);
  } catch (err) {
    ANAKIN_LOGGER.err("DeleteUserFromQueue", err)
    return h.response({ success: 0 }).code(400);
  }
}

export async function RatKillReceiveReward(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const payload = request.payload || {};
  const user_wallet_address = payload["user_wallet_address"];
  const rat_uuid_killed = payload["rat_uuid"]
  console.log("--debug RatKillReceiveReward ", user_wallet_address, rat_uuid_killed)
  try {
    // const items: Array<QueueDB> = await QueueDB.getItemsFromQueueForUserAddress(user_wallet_address);
    // await Promise.all(items.map(async item => {
    //   await QueueDB.deleteFromQueue(item);
    // }))

    let user_balance_data = await WalletDAO.FetchUserWalletInfo(user_wallet_address);
    let rats_prize_data = await CONSTANTS_DB.GetConstantData("RATS_GAME_PRIZE_DATA");
    let rats_prize_data_json: Array<IRewardsRatsDropData> = JSON.parse(rats_prize_data.json_string);

    let updateJson = false;
    let killed_rat_id = ''
    for (let i = 0; i < rats_prize_data_json.length; i++) {
      const arr = rats_prize_data_json[i].rats_info
      if (updateJson) {
        continue
      }
      for (let j = 0; j < arr.length; j++) {
        // console.log("--------debug RatKillReceiveReward--", arr[j].rat_uuid, arr[j].prize)
        if (arr[j].rat_uuid === rat_uuid_killed && !arr[j].killed) {
          // correct rat killed
          let currentPPAmount = await WalletDAO.fetchConstantValueFromRedis("PRIZE_DROP_AMOUNT");
          // console.log("--------debug RatKillReceiveReward--1",)
          // console.log("--------debug RatKillReceiveReward--", arr[j].rat_uuid, arr[j].prize)
          await CONSTANTS_DB.updateConstantValue("PRIZE_DROP_AMOUNT", currentPPAmount.value - arr[j].prize);
          // console.log("--------debug RatKillReceiveReward--2", arr[j].prize)


          // check if web2
          let user_data = await BITFIGHTER_NFT_SPECS.fetchNFTsOfUserAddress(
            user_wallet_address
          );
          if (user_data[0].user_type == 'web2') {
            user_balance_data.web2_balance += arr[j].prize * 100;
          } else {
            user_balance_data.web2_coins += arr[j].prize;
          }
          // console.log("--------debug RatKillReceiveReward--3",)
          await mapper.update(user_balance_data)
          // update the db
          arr[j].killed = true
          killed_rat_id = arr[j].rat_uuid
          updateJson = true;
          ANAKIN_LOGGER.info({
            event: "RatKillReceiveReward_info",
            user_wallet_address: user_wallet_address,
            data: arr[j],
            value: currentPPAmount.value,
          });
          break
        }
      }
      if (updateJson) {
        rats_prize_data_json[i].rats_info = arr
      }
    }
    if (updateJson) {
      rats_prize_data.json_string = JSON.stringify(rats_prize_data_json, null, 2);
      await mapper.update(rats_prize_data)
    }

    ANAKIN_LOGGER.info({
      event: "RatKillReceiveReward",
      user_wallet_address: user_wallet_address,
      updateJson,
      killed_rat_id,

    });


    // console.log("--debug RatKillReceiveReward ", updateJson)


    return h.response({ success: 1 }).code(200);
  } catch (err) {
    ANAKIN_LOGGER.err({ event: "RatKillReceiveReward", error: err });
    return h.response({ success: 0 }).code(400);
  }
}

export async function ReceiveAdminItem(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const payload = request.payload || {};
  const user_wallet_address = payload["user_wallet_address"];
  const item_name = payload["item_name"];
  console.log("--debug ReceiveAdminItem ", user_wallet_address)
  try {
    let data: Array<SYSTEM_WALLET_DB> = await WalletDAO.fetchSystemWalletsData();
    let ppBalance = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].wallet_name === SYSTEM_WALLETS.PrizePool5) {
        ppBalance = data[i].web2_balance;
        break
      }
    }
    // console.log("--debug ReceiveAdminItem 1", user_wallet_address)

    if (ppBalance <= 0) {
      throw new Error("PP balance not found");
    }

    // console.log("--debug ReceiveAdminItem 2", user_wallet_address)

    let user_balance_data = await WalletDAO.FetchUserWalletInfo(user_wallet_address);

    // console.log("--debug ReceiveAdminItem 3", user_wallet_address)

    if (item_name === 'admin_coin') {
      let winAmt = 10;
      await SYSTEM_WALLET_DB.updateWeb2Balance(SYSTEM_WALLETS.PrizePool5, -winAmt)
      user_balance_data.web2_coins += winAmt;
      await mapper.update(user_balance_data);
      // console.log("--debug ReceiveAdminItem 4", user_wallet_address)
    } else {
      throw new Error("Item not recognized");
    }
    // console.log("--debug ReceiveAdminItem 5", user_wallet_address)
    return h.response({ success: 1 }).code(200);
  } catch (err) {
    // console.log("--debug ReceiveAdminItem 6", user_wallet_address)
    console.log("error ReceiveAdminItem", err)
    ANAKIN_LOGGER.error({ event: "ReceiveAdminItem", error: err });
    return h.response({ error: err }).code(400);
  }
}