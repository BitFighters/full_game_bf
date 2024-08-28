import * as Hapi from "hapi";
import { PlayerAuthCredentials } from "@services/utils";
import { FightDao } from "./dao";
import { isNullOrUndefined } from "util";
import BetDB from "@models/BetDB";
import FightsDB from "@models/fightsDB";
import { ANAKIN_LOGGER } from "@services/logger";


export async function FightQueueEnter(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const user = request.auth.credentials.user as PlayerAuthCredentials;
  const payload = request.payload || {};
  const fight_money = payload["fight_bet_money"];
  if (isNullOrUndefined(fight_money) || fight_money === "") {
    return h.response({ error: "Missing fight money argument" }).code(400);
  }
  try {
    await FightDao.EnterFightQueue(user.user_wallet_address, fight_money)
    return h.response({ success: 1 }).code(200);
  } catch (err) {
    return h.response({ error: err }).code(400);
  }
}

export async function FightQueueEnterAdmin(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const payload = request.payload || {};
  const fight_money = payload["fight_bet_money"];
  const user_wallet_address = payload["user_wallet_address"];
  const identity = payload["identity"] || "";
  if (isNullOrUndefined(fight_money) || fight_money === "") {
    return h.response({ error: "Missing fight money argument" }).code(400);
  }
  try {
    await FightDao.EnterFightQueue(user_wallet_address, fight_money, identity)
    return h.response({ success: 1 }).code(200);
  } catch (err) {
    return h.response({ error: err }).code(400);
  }
}

export async function FightQueueExit(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const payload = request.payload || {};
  const user_wallet_address = payload["user_wallet_address"];
  const fight_id = payload["fight_id"];
  try {
    let data = await FightDao.ExitFightQueue(user_wallet_address, fight_id)
    return h.response({ success: 1 }).code(200);
  } catch (err) {
    return h.response({ error: err }).code(400);
  }
}

export async function FightQueuePoolExit(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const payload = request.payload || {};
  const user_wallet_address = payload["user_wallet_address"];
  try {
    let data = await FightDao.FighQueuePooltExitV2(user_wallet_address)
    return h.response({ success: 1 }).code(200);
  } catch (err) {
    return h.response({ error: err }).code(400);
  }
}

export async function FightEntryCreateV2(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const payload = request.payload || {};
  const p1_address = payload["p1_address"];
  const p1_minted_id = payload["p1_minted_id"];
  const p2_address = payload["p2_address"];
  const p2_minted_id = payload["p2_minted_id"];
  try {
    let fight_entry_data = await FightDao.FightEntryCreateV2(p1_address, p1_minted_id, p2_address, p2_minted_id);
    return h.response({ data: fight_entry_data }).code(200);
  } catch (err) {
    return h.response({ error: err }).code(400);
  }
}

export async function FightEntryCreate(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const payload = request.payload || {};
  const user_wallet_address = payload["user_wallet_address"];
  const minted_id = payload["minted_id"];
  try {
    let fight_entry_data = await FightDao.FightEntryCreate(user_wallet_address, minted_id);
    return h.response({ data: fight_entry_data }).code(200);
  } catch (err) {
    return h.response({ error: err }).code(400);
  }
}

export async function FightEntryCreateAdmin(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const payload = request.payload || {};
  const user_wallet_address = payload["user_wallet_address"];
  const minted_id = payload["minted_id"];
  const amount = payload["amount"];
  console.log("payload in FightEntryCreateAdmin ", payload);
  try {
    let fight_entry_data = await FightDao.FightEntryCreateAdmin(user_wallet_address, minted_id, amount);
    return h.response({ data: fight_entry_data }).code(200);
  } catch (err) {
    return h.response({ error: err }).code(400);
  }
}

export async function FightEntryAdd(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const payload = request.payload || {};
  const p1_wallet = payload["p1_wallet"];
  const p2_wallet = payload["p2_wallet"];
  const minted_id = payload["minted_id"];
  try {
    let fight_entry_data = await FightDao.FightEntryAddSecondPlayer(p1_wallet, p2_wallet, minted_id);
    return h.response({ data: fight_entry_data }).code(200);
  } catch (err) {
    return h.response({ error: err }).code(400);
  }
}

export async function FightEntryAddAdmin(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const payload = request.payload || {};
  const p1_wallet = payload["p1_wallet"];
  const p2_wallet = payload["p2_wallet"];
  const minted_id = payload["minted_id"];
  const amount = payload["amount"];
  console.log("payload in FightEntryAddAdmin ", payload);
  try {
    let fight_entry_data = await FightDao.FightEntryAddSecondPlayerAdmin(p1_wallet, p2_wallet, minted_id, amount);
    return h.response({ data: fight_entry_data }).code(200);
  } catch (err) {
    return h.response({ error: err }).code(400);
  }
}

export async function GetBetInfo(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const user = request.auth.credentials.user as PlayerAuthCredentials;
  const { fight_id } = request.params;
  try {
    let fight_entry_data = await BetDB.getBetEntryOfUser(user.user_wallet_address, fight_id)
    return h.response({ data: fight_entry_data }).code(200);
  } catch (err) {
    return h.response({ error: err }).code(400);
  }
}

export async function GetBetsInfo(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const user = request.auth.credentials.user as PlayerAuthCredentials;
  try {
    let fight_entries_data = await BetDB.getAllBetEntriesOfUser(user.user_wallet_address)
    return h.response({ data: fight_entries_data }).code(200);
  } catch (err) {
    return h.response({ error: err }).code(400);
  }
}

export async function BetIntoFight(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const user = request.auth.credentials.user as PlayerAuthCredentials;
  const payload = request.payload || {};
  const fightId = payload["fight_id"];
  const playerWallet = payload["player_wallet"];
  const amount = payload["amount"];
  const betPercent = Number(payload["betPercent"]) || 0;
  if (betPercent < 0 || betPercent > 100) {
    return h.response({ error: "Wrong bet amount" }).code(400);
  }
  try {
    await FightDao.BetIntoOthersFight(user.user_wallet_address, fightId, playerWallet, amount, betPercent);
    return h.response({ success: 1 }).code(200);
  } catch (err) {
    return h.response({ error: err }).code(400);
  }
}

export async function BetIntoFightAdmin(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  // const user = request.auth.credentials.user as PlayerAuthCredentials;
  const payload = request.payload || {};
  const fightId = payload["fight_id"];
  const playerWallet = payload["player_wallet"];
  const amount = payload["amount"];
  const betPercent = Number(payload["betPercent"]) || 0;
  const user_wallet_address = payload["wallet_address"];

  if (betPercent < 0 || betPercent > 100) {
    return h.response({ error: "Wrong bet amount" }).code(400);
  }
  try {
    await FightDao.BetIntoOthersFight(user_wallet_address, fightId, playerWallet, amount, betPercent);
    return h.response({ success: 1 }).code(200);
  } catch (err) {
    return h.response({ error: err }).code(400);
  }
}

export async function GetFightEntryInfo(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const user = request.auth.credentials.user as PlayerAuthCredentials;
  const { fight_id } = request.params;
  try {
    // if (FightDao.FIGHT_FULL_INFO.has(fight_id)) {
    //   // console.log("using map to return data ... ", FightDao.FIGHT_FULL_INFO.get(fight_id))
    //   return h.response({ 
    //     data: FightDao.FIGHT_FULL_INFO.get(fight_id)
    //   }).code(200);
    // }
    // let fight_entry_data = await FightsDB.getFightEntry(fight_id);
    let fight_entry_data = await FightDao.FetchFightInfo(fight_id);
    return h.response({ data: fight_entry_data }).code(200).header("cache-control", "max-age=5");;
  } catch (err) {
    return h.response({ error: err }).code(400);
  }
}

// export async function GetFightEntryInfoClient(request: Hapi.Request, h: Hapi.ResponseToolkit) {
//   // const user = request.auth.credentials.user as PlayerAuthCredentials;
//   const { fight_id } = request.params;
//   try {
//     let fight_entry_data = await FightsDB.getFightEntry(fight_id);
//     return h.response({ data: fight_entry_data }).code(200);
//   } catch ( err ) {
//     return h.response({ error: err }).code(400);
//   }
// }

export async function FightEnds(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const payload = request.payload || {};
  const fight_id = payload["fight_id"];
  // const p2_wallet = payload["p2_wallet"];
  try {
    // let fight_entry_data = await FightDao.FightEnds(fight_id)
    let fight_entry_data = await FightDao.FightEndsV2(fight_id)
    return h.response({ data: fight_entry_data }).code(200);
  } catch (err) {
    return h.response({ error: err }).code(400);
  }
}

export async function FightResultUpdate(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const payload = request.payload || {};
  const fight_id = payload["fight_id"];
  const p1_end_health = payload["p1_end_health"];
  const p2_end_health = payload["p2_end_health"];
  try {
    await FightDao.FightResultUpdate(fight_id, p1_end_health, p2_end_health)
    return h.response({ data: 1 }).code(200);
  } catch (err) {
    return h.response({ error: err }).code(400);
  }
}

export async function FightStateUpdate(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const payload = request.payload || {};
  const fight_id = payload["fight_id"];
  const state = payload["state"];
  try {
    console.log("--- in FightStateUpdate ", fight_id)
    await FightDao.FightStateUpdate(fight_id, state)
    return h.response({ data: 1 }).code(200);
  } catch (err) {
    return h.response({ error: err }).code(400);
  }
}

export async function JackPotWinEvent(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const payload = request.payload || {};
  const target_number = payload["target_number"];
  const user_wallet_address = payload["user_wallet_address"];
  const minted_id = payload["minted_id"];
  try {
    let jackpotBalance = await FightDao.JackPotWinEvent(target_number, user_wallet_address, minted_id)
    return h.response({ success: true, data: jackpotBalance }).code(200);
  } catch (err) {
    ANAKIN_LOGGER.error({
      event: "ERROR_IN_JACKPOT",
      error: err,
    })
    return h.response({ success: false, error: err }).code(400);
  }
}
