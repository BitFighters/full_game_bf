import USER_DETAILS from "@models/user_details";
import { signDataForAuth, signDataForPlayerAuth } from "@services/auth/signAndCreateHash";
import * as Hapi from "hapi";
import { UsersDao } from "../users/dao";
import BITFIGHTER_NFT_SPECS from "@models/bitfighter_nft_specs";
import { isNullOrUndefined } from "util";
import { mapper } from "@services/db/connection";

export async function HealthCheckAuthAPI(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  return h.response({ message: "Healthy Auth APIs" }).code(200);
}

export async function LoginUserAndAuthenticate(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { user_wallet_address } = request.params;
  // first task is to enter this user into user details db
  // if present increase the login counter
  let data = {};
  try {
    const user: USER_DETAILS = await UsersDao.loginUser(user_wallet_address);
    data["user_wallet_address"] = user.user_wallet_address;
    data["login_count"] = user.login_count;
    data["logged_in"] = true;
    const token = signDataForAuth(data);
    return h.response({
      token
    }).code(200);
  } catch (err) {
    console.log("error", err);
    const token = signDataForAuth({ user_wallet_address, logged_in: false });
    return h.response({
      token
    }).code(200);
  }
}

export async function CheckIfUserSignedMetamask(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { user_wallet_address } = request.params;
  try {
    const user: USER_DETAILS = await UsersDao.loginUser(user_wallet_address);

    return h.response({
      bool: user.metaMask_signed ? user.metaMask_signed : false
    }).code(200);
  } catch (err) {
    console.log("error", err);
    return h.response({
      message: "Error Occured",
      error: err,
    }).code(400);
  }
}

export async function SaveSignatureOfUser(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { user_wallet_address } = request.params;
  const payload = request.payload || {};
  const message = payload["message"];
  try {
    const user: USER_DETAILS = await UsersDao.loginUser(user_wallet_address);
    user.metaMask_signed = true;
    user.metamask_signature = message;
    await mapper.update(user);
    return h.response({
      success: 1
    }).code(200);
  } catch (err) {
    return h.response({
      message: "Error Occured",
      error: err,
    }).code(400);
  }
}

export async function LoginUserAndAuthenticateBitFighters(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { user_wallet_address } = request.params;
  const { minted_id } = request.params;
  let data = {};
  try {
    const nftData: BITFIGHTER_NFT_SPECS = await BITFIGHTER_NFT_SPECS.fetchParticularNftDetailOfUser(user_wallet_address, parseInt(minted_id));
    if (isNullOrUndefined(nftData)) {
      return h.response({ message: "Invalid User" }).code(400);
    }
    data["user_wallet_address"] = nftData.user_wallet_address;
    data["nftURL"] = nftData.nftURL;
    data['user_type'] = nftData.user_type;
    const token = signDataForPlayerAuth(data);
    return h.response({ token }).code(200);
  } catch (err) {
    console.log("error", err);
    const token = signDataForAuth({ user_wallet_address, logged_in: false });
    return h.response({
      token
    }).code(200);
  }
}