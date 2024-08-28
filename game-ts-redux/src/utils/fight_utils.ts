/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { FetchAllBetsOfPlayer, FetchFightEntryInfo, FetchParticularBetOfPlayer } from "../hooks/ApiCaller";
import store from "../stores";
import { SetFightEntryInfo } from "../stores/QueueDetailedInfo";
// import { SetFightEntryInfo } from "../stores/QueueDetailedInfo";
import { AddPlayersBetInfo } from "../stores/UserWebsiteStore";
// import { QueueSingleEntry } from "./interface";


export interface BetData {
  fight_id: string;
  bet_amount: number;
  player_bet_on: string;
}

export async function updateBetInfOfPlayer() {
  const data = await FetchAllBetsOfPlayer()
  console.log("queue bets all - ", data.data)
  const result = data.data as Array<BetData>;
  // const info : Map<string, string> = new Map();
  const info: any = {}
  for (let i = 0; i < result.length; i++) {
    info[result[i].fight_id] = `${result[i].bet_amount}::${result[i].player_bet_on}`;
  }
  console.log("queue all data -- ", info)
  store.dispatch(AddPlayersBetInfo(result))
  // store.dispatch(ChangeCombinedQueueData(store.getState().userPathStore.CombinedQueueData))
}

export async function updateSingleBetInfOfPlayer(fight_id: string) {
  const data = await FetchParticularBetOfPlayer(fight_id)
  console.log("queue single bet - ", data.data)
  const result = data.data as BetData;
  const currBetsArray = store.getState().userPathStore.playersBetInfo;
  let found = false;
  for (let i = 0; i < currBetsArray.length; i++) {
    if (currBetsArray[i].fight_id === result.fight_id) {
      currBetsArray[i] = result;
      found = true
    }
  }
  if (!found) {
    currBetsArray.push(result)
  }
  store.dispatch(AddPlayersBetInfo(currBetsArray))
}

export async function LoopAllFightsAndUpdate() {
  // 

  const tempCombinedQueueData = store.getState().userPathStore.CombinedQueueData;
  console.log("in_LoopAllFightsAndUpdate*****", tempCombinedQueueData.length)
  tempCombinedQueueData.forEach(async (_temp, index) => {
    const result = await FetchFightEntryInfo(_temp.fight_id);
    if (result === "") {
      console.log("failed in LoopAllFightsAndUpdate--", _temp.fight_id)
    }
    if (index === 0) {
      const tempMap: any = store.getState().queueDetailedInfo.queue_to_fight_info_map;
      // console.log("LoopAllFightsAndUpdate**", result);
      const copyData = JSON.parse(JSON.stringify(tempMap));
      copyData[_temp.fight_id] = result;
      console.log("LoopAllFightsAndUpdate**", copyData);
      store.dispatch(SetFightEntryInfo(copyData))
    }
  })
}