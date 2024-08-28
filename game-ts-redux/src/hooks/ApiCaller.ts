// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { isNullOrUndefined } from "util";
import store from "../stores";
import { SetChangeInBalance, SetChangeInBalanceBool, SetChangeInCoin, SetChangesInBalanceInfo, SetWeb2CreditBalance } from "../stores/Web3StoreBalances";
import { SetAssetsInAssetManager } from "../stores/AssetStore";
import { SetP1, SetP1SelfBet, SetP1TotalBet, SetP1WinPot, SetP2, SetP2SelfBet, SetP2TotalBet, SetP2WinPot } from "../stores/FightsStore";
import { SetLeaderBoardData } from "../stores/WebsiteStateStore";

let REACT_APP_BASE_API_ANAKIN_URL = "";
console.log("----", process.env.REACT_APP_DEV_ENV)
if (process.env.REACT_APP_DEV_ENV === "production") {
  REACT_APP_BASE_API_ANAKIN_URL = process.env.REACT_APP_BASE_API_ANAKIN_PROD_URL ? process.env.REACT_APP_BASE_API_ANAKIN_PROD_URL : "http://localhost:3000";
} else if (process.env.REACT_APP_DEV_ENV === "development" || process.env.REACT_APP_DEV_ENV === "labs") {
  REACT_APP_BASE_API_ANAKIN_URL = process.env.REACT_APP_BASE_API_ANAKIN_DEV_URL ? process.env.REACT_APP_BASE_API_ANAKIN_DEV_URL : "http://localhost:3000";
} else {
  REACT_APP_BASE_API_ANAKIN_URL = "http://localhost:3000"
}
// REACT_APP_BASE_API_ANAKIN_URL = "http://localhost:3000"
// var REACT_APP_BASE_API_ANAKIN_URL = (process.env.REACT_APP_DEV_ENV === "production") ? process.env.REACT_APP_REACT_APP_BASE_API_ANAKIN_URL : "http://localhost:3000"

export const fetchNFTsFromDB = async (userAddress: string) => {
  console.log("fetchNFTsFromDB clicked..", userAddress)
  console.log("----", process.env.REACT_APP_DEV_ENV, REACT_APP_BASE_API_ANAKIN_URL)
  if (userAddress === "") {
    console.log("nill user address in fetchNFTsFromDB");
    return
  }
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/web3/fetch/bitfighters/${userAddress}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const output = await result.json();
  // console.log(output)
  return output;
}


export const updateNFTsInDB = async (userAddress: string) => {
  // console.log("updateNFTsInDB ..", userAddress)
  if (userAddress === "") {
    console.log("nill user address updateNFTsInDB");
    return
  }
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/web3/update/bitfighters/${userAddress}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
  })
  const output = await result.json();
  console.log(output)
  return output;
}

export const updateSingleBfInDB = async (userAddress: string, minted_id: number) => {
  if (userAddress === "") {
    console.log("nill user address updateSingleBfInDB");
    return
  }
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/web3/update/bitfighters/${userAddress}/${minted_id}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
  })
  const output = await result.json();
  console.log(output)
  return output;
}

export const updateOneKclubNFTs = async (userAddress: string) => {
  console.log("in_updateOneKclubNFTs ..", userAddress)
  if (userAddress === "") {
    console.log("nill user address updateNFTsInDB");
    return
  }
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/web3/update/one_k_card/${userAddress}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
  })
  const output = await result.json();
  return output;
}

export const randomGenarate = async (userAddress: string, referer: string, lucky_number: number, nick_name: string, user_type = 'web3') => {
  console.log("mint clicked..", userAddress)
  if (userAddress === "") {
    console.log("nill user address");
    return
  }
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/generator/create/bitfighter/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "user_wallet_address": userAddress,
      "referer_address": referer,
      "lucky_number": lucky_number,
      "nick_name": nick_name,
      'user_type': user_type,
    })
  })
  const output = await result.json();
  console.log("output in randm generate --", output)
  return output;
}

export const loginAndAuthenticateUser = async (userAddress: string) => {
  console.log("----", process.env.REACT_APP_DEV_ENV, REACT_APP_BASE_API_ANAKIN_URL)
  if (userAddress === "") {
    console.log("nil user address in loginAndAuthenticateUser");
    return
  }
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/auth/login/${userAddress}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const output = await result.json();
  return output.token;
}

export const fetchUserDetails = async () => {
  if (isNullOrUndefined(store.getState().playerDataStore.current_game_player_info.minted_id)) return;
  console.log("fetchUserDetails ->", store.getState().userPathStore.auth_token)
  try {
    const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/users/fetch/friends/${store.getState().playerDataStore.current_game_player_info.minted_id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': store.getState().userPathStore.auth_token
      },
    })
    console.log("in fetchUserDetails ", result.status)
    if (result.status !== 200) {
      return null;
    }
    const output = await result.json();
    console.log("in fetchUserDetails ", output)
    return output;
  } catch (err) {
    return null;
  }
}

export const sendFriendRequest = async (user_wallet_address: string, minted_id: number) => {
  const data = {
    others_wallet_address: user_wallet_address,
    others_minted_id: minted_id,
    requester_minted_id: store.getState().playerDataStore.current_game_player_info.minted_id,
  }
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/users/send/friend/request/${user_wallet_address}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': store.getState().userPathStore.auth_token
    },
    body: JSON.stringify(data)
  })
  const output = await result.json();
  console.log("in sendFriendRequest ", result.status, output)
  return output;
}

export const acceptFriendRequest = async (user_wallet_address: string, minted_id: number) => {
  const data = {
    others_wallet_address: user_wallet_address,
    others_minted_id: minted_id,
    requester_minted_id: store.getState().playerDataStore.current_game_player_info.minted_id,
  }
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/users/accept/friend/request/${user_wallet_address}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': store.getState().userPathStore.auth_token
    },
    body: JSON.stringify(data)
  })
  const output = await result.json();
  return output;
}

export const addUserToQueueDB = async (minted_id: string, nick_name: string, profile_image: string) => {
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/web3/user/add/queue/?minted_id=${minted_id}&nick_name=${nick_name}&profile_image=${profile_image}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': store.getState().userPathStore.auth_token
    },
  })
  if (result.status !== 200) {
    return null;
  }
  const output = await result.json();
  return output;
}

export const getUsersInQueue = async () => {
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/web3/users/get/queue/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': store.getState().userPathStore.auth_token
    },
  })
  const output = await result.json();
  return output;
}

export const deleteUserFromQueueDB = async () => {
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/web3/user/delete/queue/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': store.getState().userPathStore.auth_token
    },
  })
  if (result.status !== 200) {
    return null;
  }
  const output = await result.json();
  return output;
}

export const signUpWeb2User = async (email: string, password: string) => {
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/users/web2/user/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "user_wallet_address": "",
      "email": email,
      "password": password
    })
  })
  if (result.status !== 200) {
    return null;
  }
  const output = await result.json();
  return output;
}

export const loginWeb2User = async (email: string, password: string) => {
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/users/web2/user/login/${email}/${password}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const output = await result.json();
  if (result.status === 200) {
    return "success";
  } else if (result.status === 400) {
    return output.message;
  } else if (result.status === 500) {
    return "some error happened";
  }
}

export const assignBitfighterToEmail = async (user_wallet_address: string, email: string, nick_name: string) => {
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/generator/assign/bitfighter/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "user_wallet_address": user_wallet_address,
      "nick_name": nick_name,
      "new_user_wallet_address": email,
    })
  })
  if (result.status !== 200) {
    return null;
  }
  const output = await result.json();
  return output;
}

export const fetchWalletInfo = async (user_wallet_address: string) => {
  try {
    const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/wallet/fetch/${user_wallet_address}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (result.status !== 200) {
      return null;
    }
    const output = await result.json();
    return output;
  } catch (err) {
    //
  }
}

export const loginAndAuthenticatePlayer = async (userAddress: string, minted_id: number) => {
  console.log("----", process.env.REACT_APP_DEV_ENV, REACT_APP_BASE_API_ANAKIN_URL)
  if (userAddress === "") {
    console.log("nil user address in loginAndAuthenticatePlayer");
    return
  }
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/auth/login/player/${userAddress}/${minted_id}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (result.status !== 200) {
    return null;
  }
  const output = await result.json();
  return output.token;
}

export const updateWalletBalanceWithWeb3 = async () => {
  console.log("debug_AddMoneyToWalletin--updateWalletBalanceWithWeb3--", process.env.REACT_APP_DEV_ENV, REACT_APP_BASE_API_ANAKIN_URL)
  if (store.getState().authStore.player_auth_token === "") {
    console.log("nil user auth token in updateWalletBalanceWithWeb3");
    return
  }
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/wallet/update/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': store.getState().authStore.player_auth_token
    },
  })
  if (result.status !== 200) {
    return false;
  }
  return true;
}

export const fetchPlayerWalletInfo = async (login = false, randomdata = "") => {
  // console.log("----", process.env.REACT_APP_DEV_ENV, REACT_APP_BASE_API_ANAKIN_URL)
  if (store.getState().authStore.player_auth_token === "") {
    console.log("nil user auth token in fetchPlayerWalletInfo");
    return
  }
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/wallet/fetch/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': store.getState().authStore.player_auth_token
    },
  })
  if (result.status !== 200) {
    return false;
  }
  const output = await result.json();
  console.log("--- fetchPlayerWalletInfo balance", randomdata);

  const currentBalance = store.getState().web3BalanceStore.web2CreditBalance;
  if (login) {
    store.dispatch(SetWeb2CreditBalance(output.data["web2_balance"]));
    store.dispatch(SetChangesInBalanceInfo(output.data))
    return true
  }
  let changedString = ""
  if (output.data["web2_balance"] - currentBalance > 0) {
    changedString = "+" + (output.data["web2_balance"] - currentBalance).toString()
    store.dispatch(SetChangeInBalance(changedString));
    store.dispatch(SetChangeInBalanceBool(true));
  } else if (output.data["web2_balance"] - currentBalance < 0) {
    changedString = "-" + Math.abs(output.data["web2_balance"] - currentBalance).toString()
    store.dispatch(SetChangeInBalance(changedString));
    store.dispatch(SetChangeInBalanceBool(true));
  }

  changedString = ""
  const currentCoins = store.getState().web3BalanceStore.balanceInfoUser.web2_coins;
  if (output.data["web2_coins"] - currentCoins > 0) {
    changedString = "+" + (output.data["web2_coins"] - currentCoins).toString()
    store.dispatch(SetChangeInCoin({ amount: changedString, changed: true }))
  } else if (output.data["web2_coins"] - currentCoins < 0) {
    changedString = "-" + Math.abs(output.data["web2_coins"] - currentCoins).toString()
    store.dispatch(SetChangeInCoin({ amount: changedString, changed: true }))
  }
  store.dispatch(SetChangesInBalanceInfo(output.data))
  setTimeout(() => {
    store.dispatch(SetChangeInBalanceBool(false));
    store.dispatch(SetChangeInCoin({ amount: "", changed: false }))
  }, 5000)
  // console.log("changed balance fetchPlayerWalletInfo --", changedString);
  store.dispatch(SetWeb2CreditBalance(output.data["web2_balance"]));
  return true;
}

export const redeemPlayerBalance = async (amount: string) => {
  // console.log("----", process.env.REACT_APP_DEV_ENV, REACT_APP_BASE_API_ANAKIN_URL)
  if (store.getState().authStore.player_auth_token === "") {
    console.log("nil user auth token in redeemPlayerBalance");
    return
  }
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/wallet/redeem/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': store.getState().authStore.player_auth_token
    },
    body: JSON.stringify({
      "redeem_amount": amount
    })
  })
  if (result.status !== 200) {
    const data = await result.json();
    console.log("debug_balance--", data)
    return {
      done: false,
      error: data.error
    };
  }
  // await fetchPlayerWalletInfo()
  return {
    done: true
  };
}

export const EnterFightQueueApi = async (amount: string) => {
  if (store.getState().authStore.player_auth_token === "") {
    console.log("nil user auth token in redeemPlayerBalance");
    return
  }
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/fight/queue/enter/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': store.getState().authStore.player_auth_token
    },
    body: JSON.stringify({
      "fight_bet_money": amount
    })
  })
  if (result.status !== 200) {
    return false;
  }
  return true;
}

export const BetOnOtherPlayerAndFightId = async (amount: number, fight_id: string, player_wallet: string, tip: number): Promise<{ success: boolean, data: any }> => {
  if (store.getState().authStore.player_auth_token === "") {
    console.log("nil user auth token in redeemPlayerBalance");
    return {
      success: false,
      data: "AUTH ERROR"
    }
  }
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/fight/bet/add/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': store.getState().authStore.player_auth_token
    },
    body: JSON.stringify({
      "fight_id": fight_id,
      "player_wallet": player_wallet,
      "amount": amount.toString(),
      "betPercent": tip,
    })
  })
  const data = await result.json();
  console.log(" queue bet -- response --- ", data)
  if (result.status !== 200) {
    return {
      success: false,
      data: data.error
    };
  }
  return {
    success: true,
    data: "success"
  };
}

export const FetchAllBetsOfPlayer = async () => {
  if (store.getState().authStore.player_auth_token === "") {
    console.log("nil user auth token in redeemPlayerBalance");
    return
  }
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/fight/bets/fetch/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': store.getState().authStore.player_auth_token
    },
  })
  if (result.status !== 200) {
    return null;
  }
  return await result.json();
}

export const FetchParticularBetOfPlayer = async (fight_id: string) => {
  if (store.getState().authStore.player_auth_token === "") {
    console.log("nil user auth token in redeemPlayerBalance");
    return
  }
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/fight/bet/fetch/${fight_id}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': store.getState().authStore.player_auth_token
    },
  })
  if (result.status !== 200) {
    return null;
  }
  return await result.json();
}

export const fetchPlayerAssets = async () => {
  console.log("fetching assets --- ")
  // console.log("----", process.env.REACT_APP_DEV_ENV, REACT_APP_BASE_API_ANAKIN_URL)
  if (store.getState().authStore.player_auth_token === "") {
    console.log("nil user auth token in fetchPlayerWalletInfo");
    return
  }
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/users/assets/fetch/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': store.getState().authStore.player_auth_token
    },
  })
  if (result.status !== 200) {
    return false;
  }
  const output = await result.json();
  console.log("--- fetchPlayerAssets ", output.data);

  store.dispatch(SetAssetsInAssetManager(output.data));
  return true;
}

export const purchaseAssets = async (quantity: number, asset_name: string, partner_id: string) => {
  console.log("fetching assets --- ")
  // console.log("----", process.env.REACT_APP_DEV_ENV, REACT_APP_BASE_API_ANAKIN_URL)
  if (store.getState().authStore.player_auth_token === "") {
    console.log("nil user auth token in fetchPlayerWalletInfo");
    return
  }
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/users/assets/add/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': store.getState().authStore.player_auth_token
    },
    body: JSON.stringify({
      "asset_name": asset_name,
      "quantity": quantity,
      "user_wallet_address": store.getState().web3store.userAddress,
      "partner_id": partner_id,
    })
  })
  const output = await result.json();
  if (result.status !== 200) {
    console.log("error in adding assets ", output)
    return {
      success: false,
      error: output.error
    };
  }
  await fetchPlayerAssets()
  // const output = await result.json();
  console.log("--- fetchPlayerAssets ", output);


  // store.dispatch(SetAssetsInAssetManager(output.data));
  return {
    success: true,
    error: ""
  };
}

export const useAssetsApi = async (asset_name: string) => {
  if (store.getState().authStore.player_auth_token === "") {
    console.log("nil user auth token in fetchPlayerWalletInfo");
    return
  }
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/users/assets/discard/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': store.getState().authStore.player_auth_token
    },
    body: JSON.stringify({
      "asset_name": asset_name,
    })
  })
  const output = await result.json();
  if (result.status !== 200) {
    console.log("error in using assets ", output)
    return false;
  }
  fetchPlayerAssets()
  return true;
}


// export const FetchFightInfo = async (fight_id: string) => {
//   // console.log("----", process.env.REACT_APP_DEV_ENV, REACT_APP_BASE_API_ANAKIN_URL)
//   if (store.getState().authStore.player_auth_token === "") {
//     console.log("nil user auth token in FetchFightInfo");
//     return
//   }
//   if (fight_id === "") {
//     console.log("empty fight id in FetchFightInfo");
//     return
//   }
//   const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/fight/info/fetch/${fight_id}/`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': store.getState().authStore.player_auth_token
//     },
//   })
//   if (result.status !== 200) {
//     return false;
//   }
//   const output = await result.json();
//   console.log("--- FetchFightInfo ", output.data);
//   store.dispatch(SetP1TotalBet(output.data.total_bet_p1))
//   store.dispatch(SetP2TotalBet(output.data.total_bet_p2))
//   store.dispatch(SetP1WinPot(output.data.win_pot_p1))
//   store.dispatch(SetP2WinPot(output.data.win_pot_p2))

//   store.dispatch(SetP1SelfBet(output.data.self_bet_p1))
//   store.dispatch(SetP2SelfBet(output.data.self_bet_p2))

//   store.dispatch(SetP1(output.data.player1))
//   store.dispatch(SetP2(output.data.player2))
//   return true;
// }


export const FetchFightEntryInfo = async (fight_id: string) => {
  // console.log("----", process.env.REACT_APP_DEV_ENV, REACT_APP_BASE_API_ANAKIN_URL)
  if (store.getState().authStore.player_auth_token === "") {
    console.log("nil user auth token in FetchFightInfo");
    return
  }
  if (fight_id === "") {
    console.log("empty fight id in FetchFightInfo");
    return
  }
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/fight/info/fetch/${fight_id}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': store.getState().authStore.player_auth_token
    },
  })
  if (result.status !== 200) {
    return "";
  }
  const output = await result.json();
  console.log("--- FetchFightEntryInfo ", output.data);
  // store.dispatch(SetP1TotalBet(output.data.total_bet_p1))
  // store.dispatch(SetP2TotalBet(output.data.total_bet_p2))
  // store.dispatch(SetP1WinPot(output.data.win_pot_p1))
  // store.dispatch(SetP2WinPot(output.data.win_pot_p2))

  // store.dispatch(SetP1SelfBet(output.data.self_bet_p1))
  // store.dispatch(SetP2SelfBet(output.data.self_bet_p2))

  // store.dispatch(SetP1(output.data.player1))
  // store.dispatch(SetP2(output.data.player2))
  return output.data;
}

export const randomGenaratePreSale = async (userAddress: string) => {
  console.log("randomGenaratePreSale clicked..", userAddress)
  if (userAddress === "") {
    console.log("nill user address");
    return
  }
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/generator/create/preSaleNFT/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "user_wallet_address": userAddress
    })
  })
  const output = await result.json();
  console.log("output in randomGenaratePreSale --", output)
  return output;
}

export const randomGenaratePreSaleV2 = async (userAddress: string, quantity: number) => {
  console.log("randomGenaratePreSaleV2 clicked..", userAddress)
  if (userAddress === "") {
    console.log("nill user address");
    return
  }
  if (quantity === 0) {
    quantity = 1
  }
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v2/generator/create/preSaleNFT/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "user_wallet_address": userAddress,
      "quantity": quantity
    })
  })
  const output = await result.json();
  console.log("output in randomGenaratePreSale --", output)
  return output;
}

export const randomGenarateDripPreSaleV2 = async (userAddress: string, quantity: number, tatoo: string, tag: string) => {
  console.log("randomGenarateDripPreSaleV2 clicked..", userAddress)
  if (userAddress === "") {
    console.log("nill user address");
    return
  }
  if (quantity === 0) {
    quantity = 1
  }
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v2/generator/create/drip/preSaleNFT/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "user_wallet_address": userAddress,
      "quantity": quantity,
      "tatoo": tatoo,
      "tag": tag
    })
  })
  const output = await result.json();
  console.log("output in randomGenarateDripPreSaleV2 --", output)
  return output;
}


export const ListGameServersApiCall = async (userAddress: string, region: string, create = "create") => {
  // console.log("ListGameServersApiCall clicked..", userAddress)
  if (userAddress === "") {
    console.log("nill user address");
    return
  }
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/server/list/${region}/${create}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': store.getState().authStore.player_auth_token
    },
  })
  const output = await result.json();
  console.log("output in ListGameServersApiCall --", output)
  return output;
}

export const FetchGameServerConnectionURL = async (userAddress: string, room_id: string) => {
  console.log("FetchGameServerConnectionURL clicked..", userAddress)
  if (userAddress === "") {
    console.log("nill user address");
    return
  }
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/server/fetch/${room_id}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': store.getState().authStore.player_auth_token
    },
  })
  const output = await result.json();
  if (result.status !== 200) {
    return "false"
  }
  console.log("output in FetchGameServerConnectionURL --", output)
  return output;
}

export const randomGenarateBitfightersV2 = async (userAddress: string, referer: string, quantity: number, user_type = 'web3') => {
  console.log("mint clicked..", userAddress)
  if (userAddress === "") {
    console.log("nill user address");
    return
  }
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v2/generator/create/bitfighter/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "user_wallet_address": userAddress,
      "referer_address": referer,
      'user_type': user_type,
      "quantity": quantity
    })
  })
  const output = await result.json();
  console.log("output in randm generate --", output)
  return output;
}


export const randomGenarateDripBitfightersV2 = async (userAddress: string, referer: string, quantity: number, is_drip_tattoo: boolean, user_type = 'web3') => {
  console.log("mint clicked..", userAddress)
  if (userAddress === "") {
    console.log("nill user address");
    return
  }
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v2/generator/create/bitfighter/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "user_wallet_address": userAddress,
      "referer_address": referer,
      'user_type': user_type,
      "quantity": quantity,
      "partner_name": "Drip Fighter",
      "is_drip_tattoo": is_drip_tattoo
    })
  })
  if (result.status === 200) {
    const output = await result.json();
    console.log("output in randm generate --", output)
    return output;
  } else {
    console.log("output in randm generate --", [])
    throw "Error in Creating DripFighter"
  }

}

export const checkIfUserSignedMetamask = async (userAddress: string) => {
  if (userAddress === "") {
    console.log("nil user address in checkIfUserSignedMetamask");
    return
  }
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/auth/check/signed/${userAddress}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (result.status !== 200) {
    return null;
  }
  const output = await result.json();
  return output.bool;
}


export const postUserSignedMessage = async (userAddress: string, message: string) => {
  console.log("in postUserSignedMessage", userAddress)
  if (userAddress === "") {
    console.log("nill user address");
    return
  }
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/auth/save/signature/${userAddress}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "message": message,
    })
  });
  if (result.status === 200) {
    const output = await result.json();
    console.log("output in randm generate --", output)
    return output;
  } else {
    console.log("output in randm generate --", [])
    throw "Error in Posting Signature"
  }

}


export const FetchLeaderBoard = async () => {
  try {
    const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/leaderboard/fetch/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (result.status !== 200) {
      console.log("fetch leaderboard -- not 200")
      return null;
    }
    const output = await result.json();
    console.log("fetch leaderboard -- ", output)
    store.dispatch(SetLeaderBoardData(output))
  } catch (err) {
    console.log("error in FetchLeaderBoard ", err)
  }
}

export const CheckIfAcceptableNickName = async (nick_name: string) => {
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/users/${nick_name}/acceptable/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (result.status !== 200) {
    console.log("fetch CheckIfAcceptableNickName -- not 200")
    return null;
  }
  const output = await result.json();
  console.log("fetch CheckIfAcceptableNickName -- ", output)
  return output.data;
  // store.dispatch(SetLeaderBoardData(output.data))
  // return output.data;
}

export const FetchWalletLog = async () => {
  if (store.getState().authStore.player_auth_token === "") {
    console.log("nill user address");
    return null;
  }
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/wallet/logs/fetch/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': store.getState().authStore.player_auth_token
    },
  })
  const output = await result.json();
  if (result.status !== 200) {
    return "false"
  }
  console.log("output in FetchWalletLog --", output)
  return output;
}

export const FetchPartnerInfo = async () => {
  if (store.getState().authStore.player_auth_token === "") {
    console.log("nill user address");
    return
  }
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/users/partners/fetch/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': store.getState().authStore.player_auth_token
    },
  })
  const output = await result.json();
  if (result.status !== 200) {
    return []
  }
  console.log("output in FetchPartnerInfo --", output)
  return output;
}

export const FetchSystemWalletsInfo = async () => {
  if (store.getState().authStore.player_auth_token === "") {
    console.log("nill user address");
    return
  }
  const result = await fetch(`${REACT_APP_BASE_API_ANAKIN_URL}/v1/wallet/system/fetch/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': store.getState().authStore.player_auth_token
    },
  })
  const output = await result.json();
  if (result.status !== 200) {
    return []
  }
  console.log("output in FetchSystemWalletsInfo --", output.data)
  return output.data;
}
