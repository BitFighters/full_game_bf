import * as Hapi from "hapi";
import { WalletDAO } from "./dao";
import { PlayerAuthCredentials } from "@services/utils";
import SYSTEM_WALLET_DB from "@models/system_wallets";
import BREW_PARTNER_WALLETS_DB from "@models/partner_wallets";
import { SYSTEM_WALLETS } from "@config/system_wallets";
import { ANAKIN_LOGGER } from "@services/logger";
import CONSTANTS_DB from "@models/constants";

export async function FetchUserWalletInfo(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const user = request.auth.credentials.user as PlayerAuthCredentials;
  // console.log(" user -- ", user)
  // console.log(" user 2 -- FetchUserWalletInfo ", user.user_wallet_address)
  try {
    let data = await WalletDAO.FetchUserWalletInfo(user.user_wallet_address)
    return h.response({ data }).code(200);
  } catch (err) {
    console.log(" err ", err)
    return h.response({ error: err }).code(400);
  }
}

export async function FetchWalletLogs(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const user = request.auth.credentials.user as PlayerAuthCredentials;
  try {
    let data = await WalletDAO.FetchUserWalletLogs(user.user_wallet_address)
    return h.response({ data }).code(200);
  } catch (err) {
    console.log(" err ", err)
    return h.response({ error: err }).code(400);
  }
}

export async function UpdateWalletInfo(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const user = request.auth.credentials.user as PlayerAuthCredentials;
  // console.log(" user -- ", user)
  console.log(" user in UpdateWalletInfo -- ", user.user_wallet_address)
  try {
    let data = await WalletDAO.UpdateWalletInfo(user.user_wallet_address)
    return h.response({ success: 1 }).code(200);
  } catch (err) {
    return h.response({ error: err }).code(400);
  }
}

export async function RedeemMoneyFromWallet(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const user = request.auth.credentials.user as PlayerAuthCredentials;
  const payload = request.payload || {};
  const redeemAmount = payload["redeem_amount"];
  try {
    await WalletDAO.RedeemMoneyFromWallet(user.user_wallet_address, redeemAmount);
    return h.response({ success: 1 }).code(200);
  } catch (err) {
    return h.response({ error: err }).code(400);
  }
}

// export async function AddUserWalletInfo(request: Hapi.Request, h: Hapi.ResponseToolkit) {
//   const payload = request.payload || {};
//   const userWalletAddress = payload["user_wallet_address"];
//   const amount = payload["amount"];
//   try {
//     let data = await WalletDAO.addMoneyInWallet(userWalletAddress, amount)
//     return h.response({ data }).code(200);
//   } catch ( err ) {
//     console.log(" err in AddUserWalletInfo ", err)
//     return h.response({ error: err }).code(400);
//   }
// }

export async function CreateasystemWallets(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  try {
    await SYSTEM_WALLET_DB.initateWallets()
    await SYSTEM_WALLET_DB.initatePartnerWallets()
    await BREW_PARTNER_WALLETS_DB.CreatePartnerWalletsIfNotExist()
    return h.response({ success: 1 }).code(200);
  } catch (err) {
    console.log(" err in CreateasystemWallets ", err)
    return h.response({ error: err }).code(400);
  }
}

export async function FetchSystemWalletsInfo(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const user = request.auth.credentials.user as PlayerAuthCredentials;
  try {
    let data: Array<SYSTEM_WALLET_DB> = await WalletDAO.fetchSystemWalletsData();
    let jacPotConstantProb: CONSTANTS_DB = await WalletDAO.fetchConstantValueFromRedis("JACKPOT_PROBABILITY_INFO");
    let prize_drop_amount = await WalletDAO.fetchConstantValueFromRedis("PRIZE_DROP_AMOUNT")
    let result = [];
    for (let i = 0; i < data.length; i++) {
      result.push({
        index: data[i].wallet_name,
        value: data[i].web2_balance,
      })
    }
    result.push({
      index: "JACKPOT_PROBABILITY_INFO",
      value: jacPotConstantProb.value,
    })
    result.push({
      index: "PRIZE_DROP_AMOUNT",
      value: prize_drop_amount.value,
    })
    console.log("FetchSystemWalletsInfo", result)
    return h.response({ data: result }).code(200);
  } catch (err) {
    ANAKIN_LOGGER.error({ function: "FetchPartnersInfo", error: err });
    return h.response({ success: 0, message: err.message }).code(400);
  }
}