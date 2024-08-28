import { WEB_3_CONFIG } from "@config/web3_config";
import BITFIGHTER_NFT_SPECS from "@models/bitfighter_nft_specs";
import FRIENDS_DB from "@models/friends";
import USER_DETAILS from "@models/user_details";
import { ANAKIN_LOGGER } from "@services/logger";
import { FRIENDS_STATUS } from "@utils/friends";
import * as Hapi from "hapi";
import { isNullOrUndefined } from "util";
import { Web3Dao } from "../web3/dao";
import { UsersDao } from "./dao";
import ASSETS_MANAGER from "@models/assets_manager";
import { PlayerAuthCredentials } from "@services/utils";

export async function HealthCheckUserAPIs(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  return h.response({message: "Success"}).code(200);
}


export async function SendFriendRequest(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  // const { user_wallet_address } = request.params;
  const payload = request.payload || {};
  const others_wallet_address: string = payload["others_wallet_address"];
  const others_minted_id: number = payload["others_minted_id"];
  const requester_minted_id: number = payload["requester_minted_id"];
  const request_made_by = request.auth.credentials.user["user_wallet_address"];
  // const requested_to = others_wallet_address;

  const request_made_by_composite_key: string = request_made_by + ":" + requester_minted_id.toString()
  const requested_to_composite_key: string = others_wallet_address + ":" + others_minted_id.toString()
  try {
    const res = await UsersDao.SendFriendRequest(request_made_by_composite_key, requested_to_composite_key);
    return h.response(res).code(200);
  } catch (err) {
    ANAKIN_LOGGER.error("AddSentFriendRequestToUser", {error: err})
    return h.response({message: "Failed to send Friend Request", error: err.message}).code(400);
  }
}

export async function AcceptFriendRequest(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const payload = request.payload || {};
  const others_wallet_address: string = payload["others_wallet_address"];
  const others_minted_id: number = payload["others_minted_id"];
  const acceptor_minted_id: number = payload["requester_minted_id"];
  const acceptorAddress = request.auth.credentials.user["user_wallet_address"];
  const acceptor_composite_key: string = acceptorAddress + ":" + acceptor_minted_id.toString()
  const accpting_of_composite_key: string = others_wallet_address + ":" + others_minted_id.toString()
  try {
    const res = await UsersDao.AcceptFriendRequest(acceptor_composite_key, accpting_of_composite_key);
    return h.response(res).code(200);
  } catch (err) {
    ANAKIN_LOGGER.error("AddSentFriendRequestToUser", {error: err})
    return h.response({message: "Failed to Accept Friend Request", error: err.message}).code(400);
  }
}

export async function GetFriends(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { minted_id } = request.params;
  const user_wallet_address = request.auth.credentials.user["user_wallet_address"];
  const composite_key: string = user_wallet_address + ":" + minted_id.toString()
  const result: Array<FRIENDS_DB> = await FRIENDS_DB.getAllFriendsForUser(composite_key);
  let data: Array<FRIENDS_DB> = [];
  await Promise.all(result.map(async (df, index) => {
    let ndata = await BITFIGHTER_NFT_SPECS.fetchNFTsOfUserAddress(df.other_user_address.split(":")[0])
    ndata.map(nd => {
      if (
        nd.contract_address === WEB_3_CONFIG.CONTRACT_ADDRESS && 
        nd.minted_id === parseInt(df.other_user_address.split(":")[1])
      ) {
        df["friends_nick_name"] = nd.nick_name 
        // df["friends_profile_image"] = nd.profile_image
        // data[index] = df
        data.push(df)
      }
    })
  }))
  // console.log()
  // const ndata: Array<BITFIGHTER_NFT_SPECS> = await BITFIGHTER_NFT_SPECS.fetchNFTsOfUserAddress()
  if (!isNullOrUndefined(data)) {
    var friends = [];
    var pendingRequests = [];
    var sentRequests = [];
    friends = data.filter(item => {
      if (item.friends_status === FRIENDS_STATUS.FRIENDS) return item;
    }).map(dd => {
      return dd;
    })
    pendingRequests = data.filter(item => {
      if (item.friends_status === FRIENDS_STATUS.FRIEND_REQUEST_PENDING) return item;
    }).map(dd => {
      return dd;
    })

    sentRequests = data.filter(item => {
      if (item.friends_status === FRIENDS_STATUS.FRIEND_REQUEST_SENT) return item;
    }).map(dd => {
      return dd;
    })

    return h.response({
      "friends": friends,
      "pending": pendingRequests,
      "sent": sentRequests
    }).code(200)
  }
  return h.response({message: "", error: "Failed"}).code(400);
}

export async function RegisterWeb2User(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const payload = request.payload || {};
  const userWalletAddress = payload["user_wallet_address"];
  const email = payload["email"];
  const password = payload["password"];
  try {
    const res = await UsersDao.RegisterWeb2User(email, userWalletAddress, password);
    if (isNullOrUndefined(res)) {
      return h.response({success: 0, message: "Some unknow error happened"}).code(404);
    }
    return h.response({success: 1}).code(200);
  } catch (err) {
    return h.response({success: 0, message: err.message}).code(400);
  }
}

export async function FetchWeb2User(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { email } = request.params;
  try {
    const result = await UsersDao.FetchWeb2User(email);
    return h.response({result}).code(200);
  } catch (err) {
    return h.response({success: 0}).code(400);
  }
}

export async function LoginWeb2User(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { email } = request.params;
  const { password } = request.params;
  try {
    const res = await UsersDao.FetchWeb2User(email);
    if (isNullOrUndefined(res)) {
      return h.response({success: 0, message: "User does not Exist"}).code(400);
    }
    if (res.password === password) {
      return h.response({success: 1}).code(200);
    } else {
      return h.response({success: 0, message: "wrong password"}).code(400);
    }
  } catch (err) {
    return h.response({success: 0, message: err.message}).code(500);
  }
}

export async function AddAssets(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const payload = request.payload || {};
  const userWalletAddress = payload["user_wallet_address"];
  const assetName = payload["asset_name"];
  const quantity = payload["quantity"];
  const partner_id = payload["partner_id"];
  const identity = payload["identity"] || "";


  try {
    const data = await UsersDao.addAssetIntoTable(userWalletAddress, assetName, quantity, partner_id, identity);
    return h.response({success: 1}).code(200);
  } catch (err) {
    ANAKIN_LOGGER.error({
      function: "AddAssets",
      error: err,
    });
    return h.response({error: err}).code(400);
  }
}

export async function DisccardAssets(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const user = request.auth.credentials.user as PlayerAuthCredentials;
  const payload = request.payload || {};
  // const userWalletAddress = payload["user_wallet_address"];
  const assetName = payload["asset_name"];
  try {
    await ASSETS_MANAGER.discardAsset(user.user_wallet_address, assetName);
    await UsersDao.DeleteUserAssetInfoInRedis(user.user_wallet_address)
    return h.response({success: 1}).code(200);
  } catch (err) {
    ANAKIN_LOGGER.error({
      function: "DisccardAssets",
      error: err,
    });
    return h.response({success: 0, error: err.message}).code(400);
  }
}

export async function FetchAssetsOfUser(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const user = request.auth.credentials.user as PlayerAuthCredentials;
  try {
    // let result = await ASSETS_MANAGER.getAllAssetsOfUser(user.user_wallet_address);
    let result = await UsersDao.FetchAssetsOfUser(user.user_wallet_address);
    return h.response({success: 1, data: result}).code(200);
  } catch (err) {
    ANAKIN_LOGGER.error({ function: "FetchAssetsOfUser", error: err });
    return h.response({success: 0, message: err.message}).code(400);
  }
}

export async function FetchPartnersInfo(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const user = request.auth.credentials.user as PlayerAuthCredentials;
  try {
    let result = await UsersDao.FetchAllPartnersInfo();
    return h.response({success: 1, data: result}).code(200);
  } catch (err) {
    ANAKIN_LOGGER.error({ function: "FetchPartnersInfo", error: err });
    return h.response({success: 0, message: err.message}).code(400);
  }
}

export async function FetchPriceOfAsset(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { asset_name } = request.params;
  try {
    if (asset_name === "brew") {
      return h.response({ price: 100000 }).code(200);
    }
    return h.response({ price: 0 }).code(200);
  } catch (err) {
    ANAKIN_LOGGER.error({
      function: "FetchPriceOfAsset",
      error: err,
    });
    return h.response({success: 0, message: err.message}).code(400);
  }
}


// export async function ConnectWSURL(request: Hapi.Request, h: Hapi.ResponseToolkit) {
//   const payload = request.payload || {};
//   const building_name = payload["building_name"];
  
//   return h.redirect("ws://localhost:3003");
// }
