

export interface FRIEND_REQUEST_SENT {
  "user_wallet_address": string,
}

export interface FRIENDS {
  "user_wallet_address": string,
}

export interface PENDING_FRIENDS_REQUESTS {
  "user_wallet_address": string,
}

export interface BLOCKED_USERS {
  "user_wallet_address": string,
}

export const USER_DETAILS_ERRORS = {
  USER_NOT_FOUND_ERR: "User not found"
}

export enum USER_TYPE {
  WEB2= 'web2',
  WEB3= 'web3',
}

export function GetAssetInfoRedisKey(userWalletAddress: string) {
  let arr = [ `${process.env.NODE_ENV || "dev"}` , "asset_inf0", userWalletAddress ];
  return arr;
}

export function GetAllPartnerInfoRedisKey() {
  let arr = [ `${process.env.NODE_ENV || "dev"}` , "partner_info" ];
  return arr;
}