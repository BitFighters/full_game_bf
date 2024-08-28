import BITFIGHTER_NFT_SPECS from "@models/bitfighter_nft_specs";
import QueueDB from "@models/queueDB";
import { mapper } from "@services/db/connection";
import { addCorsArray } from "@services/utils";
import { checkIfTokenUriIsSet, fetchBitFightersFromSC, fetchBitFightersFromSCV2, fetchOneKCardsOfUserFromSC } from "@services/web3";
import * as Hapi from "hapi";
import { isNullOrUndefined } from "util";
import { Web3Dao } from "./dao";
import { v4 as uuidv4 } from "uuid";
import { ANAKIN_LOGGER } from "@services/logger";

// export async function HandleBitfgihterUpdate(request: Hapi.Request, h: Hapi.ResponseToolkit) {
//   const { user_wallet_address } = request.params;
//   const start_time = Date.now();
//   const mapIdToUrl = await fetchBitFightersFromSC(user_wallet_address);
//   console.log(`fetchBitFightersFromSC_done_in  ${Date.now() - start_time} ms`)
//   if (isNullOrUndefined(mapIdToUrl)) {
//     return h.response({message: "failed to fetch nfts. "}).code(400);
//   }
//   console.log("---- HandleBitfgihterUpdate -- ", user_wallet_address);
//   if (mapIdToUrl.length > 0) {
//     try {
//       await Web3Dao.updateBitFighterMintedStatus(user_wallet_address, mapIdToUrl);
//     } catch (err) {
//       return h.response({message: "Error", error_message: err.message, user_wallet_address}).code(400);
//     }  
//   }
//   return h.response({message: "Success"}).code(200);
// }

export async function HandleBitfgihterUpdate(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { user_wallet_address } = request.params;
  const start_time = Date.now();
  try {
    console.log("--------------------in HandleBitfgihterUpdate-----------------", start_time)
    await Web3Dao.CheckAndUpdateBitfighters(user_wallet_address)
    console.log(`HandleBitfgihterUpdate took .. ${Date.now() - start_time } ms` )
    return h.response({message: "Success"}).code(200);
  } catch (err) {
    ANAKIN_LOGGER.error({
      event: "ERROR_CONTROLLER",
      function: "HandleBitfgihterUpdate",
      error: err
    })
    return h.response({message: "Error", error_message: err.message, user_wallet_address}).code(400);
  }
}

export async function HandleSingleBitfgihterUpdate(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { user_wallet_address, minted_id } = request.params;
  const mapIdToUrl = await fetchBitFightersFromSCV2(user_wallet_address, parseInt(minted_id) );
  console.log("------debug ---", mapIdToUrl)
  if (isNullOrUndefined(mapIdToUrl)) {
    return h.response({message: "failed to fetch nfts. "}).code(400);
  }
  if (mapIdToUrl.length > 0) {
    try {
      await Web3Dao.updateSingleBitFighterEntry(user_wallet_address, mapIdToUrl[0], parseInt(minted_id));
    } catch (err) {
      return h.response({message: "Error", error_message: err.message, user_wallet_address}).code(400);
    }  
  }
  return h.response({message: "Success"}).code(200);
}

export async function HandleOneKCardUpdate(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { user_wallet_address } = request.params;
  const onek_cards = await fetchOneKCardsOfUserFromSC(user_wallet_address);
  console.log("onek_cards ", onek_cards)
  if (isNullOrUndefined(onek_cards)) {
    return h.response({message: "failed to fetch nfts. "}).code(400);
  }
  let to_update_onek_cards = []
  for (let i =0 ; i < onek_cards.length; i++) {
    let check = await checkIfTokenUriIsSet(onek_cards[i]);
    if (!check) {
      to_update_onek_cards.push(onek_cards[i])
    }
  }
  console.log("onek_cards 2 ", to_update_onek_cards)
  // let to_update_onek_cards = onek_cards;
  if (onek_cards.length > 0) {
    await Web3Dao.updateTokenURIOfOneKCards(user_wallet_address, to_update_onek_cards);
  }
  return h.response({message: "Success"}).code(200);
}

export async function FetchBitFighters(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { user_wallet_address } = request.params;
  // const nftURLs : Array<BITFIGHTER_NFT_SPECS> = await BITFIGHTER_NFT_SPECS.fetchNFTsOfUserAddress(user_wallet_address);
  const nftURLs: Array<BITFIGHTER_NFT_SPECS> = await Web3Dao.fetchBitfightersOfUserWallet(user_wallet_address);
  // console.log("-----", nftURLs)
  if (isNullOrUndefined(nftURLs)) {
    let res = h.response({message: "failed to fetch nfts. "});
    const response = addCorsArray(res)
    return h.response(response).code(400);
  }
  let res = h.response({message: nftURLs});
  const response = addCorsArray(res)
  return h.response(response).code(200);
}

export async function AddUserToQueue(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const user_wallet_address = request.auth.credentials.user["user_wallet_address"];
  const { query } = request;
  const minted_id: string = String(query.minted_id);
  const nick_name: string = String(query.nick_name);
  const profile_image: string = String(query.profile_image)
  try {
    ANAKIN_LOGGER.info("AddUserToQueue", {user_wallet_address, minted_id, nick_name})
    await QueueDB.addUserToQueue(user_wallet_address, minted_id, nick_name, profile_image);
    return h.response({success : 1}).code(200);
  } catch (err) {
    return h.response({success : 0}).code(400);
  }
}

export async function DeleteUserFromQueue(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const user_wallet_address = request.auth.credentials.user["user_wallet_address"];
  try {
    const items: Array<QueueDB> = await QueueDB.getItemsFromQueueForUserAddress(user_wallet_address);
    await Promise.all(items.map(async item => {
      await QueueDB.deleteFromQueue(item);
    }))
    
    return h.response({success : 1}).code(200);
  } catch (err) {
    ANAKIN_LOGGER.err("DeleteUserFromQueue", err)
    return h.response({success : 0}).code(400);
  }
}

export async function GetAllUsersFromQueueDB(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  var result: Array<QueueDB> = []
  try {
    var queueEntries = mapper.scan(QueueDB);
    for await (const card of queueEntries) {
      result.push(card); 
    }
    // ANAKIN_LOGGER.info("GetAllUsersFromQueueDB", result)
  } catch (err) {
    ANAKIN_LOGGER.err("GetAllUsersFromQueueDB", err)
    return h.response({success : 0}).code(400);
  }
  return h.response(result).code(200);
}

// export async function TransferFromQueueToFightDB(request: Hapi.Request, h: Hapi.ResponseToolkit) {
//   // this should only be called when there are atleast 2 players.. 
//   // const player1 = await Web3Dao.GetFighterInPlace(1)
//   // const player2 = await Web3Dao.GetFighterInPlace(2);

//   // const [player1, player2] = await Promise.all([
//   //   Web3Dao.GetFighterInPlace(1),
//   //   Web3Dao.GetFighterInPlace(2),
//   // ])
//   var result: Array<QueueDB> = []
//   var player1: QueueDB;
//   var player2: QueueDB;
//   try {
//     var queueEntries = mapper.scan(QueueDB);
//     for await (const card of queueEntries) {
//       if (card.current_position === 1) player1= card;
//       else if( card.current_position === 2) player2 = card;
//       else result.push(card);
//     }
//   } catch (err) {
//     return h.response({message: "Some error happened1."}).code(400);
//   }
//   const fightId = uuidv4()
//   let v1 = 0;
//   let v2 = 0;
//   let count = 0;
//   if (player1 && player2) {
//     count = 2;
//     await Promise.all([
//       Web3Dao.TransactionAddInFightAndDeleteInQueue(player1.minted_id.toString(), player1.nick_name, player1.user_wallet_address, player1.current_position.toString(), fightId),
//       Web3Dao.TransactionAddInFightAndDeleteInQueue(player2.minted_id.toString(), player2.nick_name, player2.user_wallet_address, player2.current_position.toString(), fightId)
//     ])
//   } else if (player1 && !player2) {
//     count = 1;
//     await Web3Dao.TransactionAddInFightAndDeleteInQueue(player1.minted_id.toString(), player1.nick_name, player1.user_wallet_address, player1.current_position.toString(), fightId)
//   } else if (!player1 && player2) {
//     count = 1;
//     await Web3Dao.TransactionAddInFightAndDeleteInQueue(player2.minted_id.toString(), player2.nick_name, player2.user_wallet_address, player2.current_position.toString(), fightId)
//   }
//   // if (!player1 || !player2) {
//   //   return h.response({message: "Some error happened2"}).code(400);
//   // }
  
//   // console.log("vals --", val1, val2)
//   // if (!val1 || !val2) {
//   //   return h.response({message: "Some error happened3", val1, val2}).code(400);
//   // }
//   try {
//     await Web3Dao.updateAllOtherPlayersPosition(result, count)
//     return h.response({success: 1}).code(200);
//   } catch (err) {
//     return h.response({success: 0}).code(400);
//   }
// }

// export async function TransferFromStartToEndofQueue(request: Hapi.Request, h: Hapi.ResponseToolkit) {
//   const { user_wallet_address } = request.params;
//   if (user_wallet_address === "") {
//     return h.response({message: "empty user wallet"}).code(400);
//   }
//   var result: Array<QueueDB> = []
//   try {
//     var queueEntries = mapper.scan(QueueDB);
//     for await (const card of queueEntries) {
//       result.push(card);
//     }
//   } catch (err) {
//     return h.response({message: "Some error happened1."}).code(400);
//   }
//   // console.log(result);
//   var movedDown = false;
//   for (var i = 0; i< result.length; i++) {
//     var data = result[i];
//     if (data.user_wallet_address === user_wallet_address && data.current_position <= 2) {
//       data.current_position = result.length + 1;
//       await mapper.update(data);
//       result[i] = data;
//       movedDown = true;
//       break
//     }
//   }
//   // console.log(result);
//   if (movedDown) {
//     try {
//       await Web3Dao.updateAllOtherPlayersPosition(result, 1)
//       return h.response({success: 1}).code(200);
//     } catch (err) {
//       return h.response({success: 0}).code(400);
//     }
//   }
//   return h.response({success: 1}).code(200);
// }

// export async function ExecuteFightEnd(request: Hapi.Request, h: Hapi.ResponseToolkit) {
//   const payload = request.payload || {};
//   const _winner = payload["winner"] || "";
//   const _loser = payload["loser"] || "";
//   const _draw: boolean = payload["draw"] || false;
//   let result: boolean = false;
//   try {
//     result = await FightEnds(_winner, _loser);
//     if (!result) {
//       throw "Failed";
//     }
//   } catch (err) {
//     ANAKIN_LOGGER.err({ event: "ExecuteFightEnd",  error: err })
//     return h.response({message: "Failed", error: err}).code(400);
//   }
//   return h.response({success: 1}).code(200);
// }

export async function CheckIfNickNameExist(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { nick_name } = request.params;
  try {
    const bool = await Web3Dao.CheckIfNickNameExist(nick_name);
    return h.response({data: bool}).code(200);
  } catch (err) {
    ANAKIN_LOGGER.err({ event: "CheckIfNickNameExist",  error: err })
    return h.response({message: "Failed", error: err}).code(400);
  }
}

export async function MoralisGetPluginSpec(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  return h.response({data: []}).code(200);
}
