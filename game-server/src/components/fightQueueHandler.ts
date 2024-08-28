import { IFightEntry, IQueueCombined, NewQueueDB, QueueDB } from "../interfaces";
import { FightEntryAdd, FightEntryAddAdmin, FightEntryCreate, FightEntryCreateAdmin, FightQueueExitApi, QueuePoolExitApi } from "../services/ApiCaller";
import { MessageQueueHandler } from "./messageQueueHandler";
import { QueuePoolHandler } from "./QueuePoolHandler";


export class FightQueueHandler {
  
  static queueData: Array<QueueDB> = [];
  static combinedQueueData: Array<IQueueCombined> = [];
  static currentActiveFightIds: Array<string> = [];
  static currentFightingFightId: string = ""

  public static UpdateQueueInfo() {
    // console.log("brocasting queue info.... ", FightQueueHandler.combinedQueueData)
    let msgObj1 = {
      event: "queue_info",
      data: FightQueueHandler.combinedQueueData,
    }
    MessageQueueHandler.FillGameMessageQueue(msgObj1)
  }

  public static addUserToQueue(user_data: QueueDB) {
    let check_if_present = false;
    for (let i = 0 ; i < FightQueueHandler.queueData.length; i++) {
      if (FightQueueHandler.queueData[i].user_wallet_address === user_data.user_wallet_address) {
        check_if_present = true;
        break;
      }
    }
    if (!check_if_present) FightQueueHandler.queueData.push(user_data);
  }

  public static deleteUserFromQueue(user_wallet_address: string) {
    let required_index = 0;
    for (let i = 0 ; i < FightQueueHandler.queueData.length; i++) {
      if (FightQueueHandler.queueData[i].user_wallet_address === user_wallet_address) {
        required_index = i;
        break;
      }
    }
    this.queueData.splice(required_index, 1);
  }

  public static shiftToBottomOld(user_wallet_address: string) {
    let required_index = 0;
    for (let i = 0 ; i < this.queueData.length; i++) {
      if (this.queueData[i].user_wallet_address === user_wallet_address) {
        required_index = i;
        break;
      }
    }
    let queue_data = this.queueData[required_index];
    this.queueData.splice(required_index, 1);
    this.queueData.push(queue_data)
  }

  public static shiftToBottom(fight_id: string) {
    console.log("executing shift to bottom.")
    let required_index = -1;
    for(let i = 0; i < FightQueueHandler.combinedQueueData.length; i++) {
      if (FightQueueHandler.combinedQueueData[i].fight_id === fight_id) {
        required_index = i;
      }
    }
    if (required_index < 0) {
      return
    }
    console.log("executing shift to bottom.", required_index, FightQueueHandler.combinedQueueData)
    if (FightQueueHandler.combinedQueueData[FightQueueHandler.combinedQueueData.length-1].player_count === 2) {
      let combData = FightQueueHandler.combinedQueueData[required_index];
      this.combinedQueueData.splice(required_index, 1);
      this.combinedQueueData.push(combData);
    } else if (FightQueueHandler.combinedQueueData[FightQueueHandler.combinedQueueData.length-1].player_count === 1) {
      let combData = FightQueueHandler.combinedQueueData[required_index];
      this.combinedQueueData.splice(required_index, 1);
      this.combinedQueueData.splice(required_index, 0, combData);
    }
    
  }

  public static getUserPositionInQueue(user_wallet_address: string) {
    let required_index = -1;
    for (let i = 0 ; i < FightQueueHandler.queueData.length; i++) {
      if (FightQueueHandler.queueData[i].user_wallet_address === user_wallet_address) {
        required_index = i;
        break;
      }
    }
    return required_index;
  }

  public static getUserPositionInQueueV2() {
    if (FightQueueHandler.combinedQueueData.length === 0) {
      return {
        queue_index: 0,
        player_index: 0
      };
    }
    for (let i = 0; i < FightQueueHandler.combinedQueueData.length; i++) {
      if (FightQueueHandler.combinedQueueData[i].player_count === 1) {
        return {
          queue_index: i,
          player_index: 1
        };
      }
    }
    return {
      queue_index: FightQueueHandler.combinedQueueData.length,
      player_index: 0
    };
  }

  public static assignFightIdToPlayer(user_wallet_address: string, fight_id: string, p1_bet: number, p2_bet: number, total_bet: number, player_count: number) {
    for (let i = 0 ; i < FightQueueHandler.queueData.length; i++) {
      if (FightQueueHandler.queueData[i].user_wallet_address === user_wallet_address) {
        FightQueueHandler.queueData[i].assigned_fight_id = fight_id;
        FightQueueHandler.queueData[i].p1_total_bet = p1_bet;
        FightQueueHandler.queueData[i].p2_total_bet = p2_bet;
        FightQueueHandler.queueData[i].total_bet = total_bet;
        FightQueueHandler.queueData[i].player_count = player_count;
        break;
      }
    }
  }

  public static createNewEntryForCombinedQueue(queData: QueueDB, p1_wallet: string, fight_id: string, p1_bet: number, p2_bet: number, total_bet: number, player_count: number, fightEntry: IFightEntry) {
    FightQueueHandler.combinedQueueData.push({
      p1_wallet,
      p1_nick_name: queData.nick_name,
      p1_profile_image: queData.profile_image,
      p1_minted_id: queData.minted_id,
      p2_minted_id: 0,

      p2_wallet: "",
      p2_nick_name: "",
      p2_profile_image: "",

      fight_id,
      p1_total_bet: p1_bet,
      p2_total_bet: 0,
      total_bet: 0,
      player_count: 1,

      p1_self_bet: fightEntry.self_bet_p1,
      p2_self_bet: 0,
    })
  }

  public static addEntryForCombinedQueue(queData: QueueDB, p1_wallet: string, fight_id: string, p1_bet: number, p2_bet: number, total_bet: number, player_count: number, fightEntry: IFightEntry) {
    console.log("in add entry for combined queue")
    let combQueueData = FightQueueHandler.combinedQueueData[FightQueueHandler.combinedQueueData.length -1];
    combQueueData.p2_wallet = queData.user_wallet_address;
    combQueueData.p2_minted_id = queData.minted_id;
    combQueueData.p2_nick_name = queData.nick_name;
    combQueueData.p2_total_bet = p2_bet;
    combQueueData.total_bet = total_bet;
    combQueueData.player_count = player_count;
    combQueueData.p2_profile_image = queData.profile_image;
    combQueueData.p2_self_bet = fightEntry.self_bet_p2;
    this.combinedQueueData.splice(FightQueueHandler.combinedQueueData.length -1, 1);
    this.combinedQueueData.push(combQueueData)

    let obj1 = {
      event: "fetch_balance",
      user_wallet_address: p1_wallet,
    }
    MessageQueueHandler.FillGameMessageQueue(obj1)
    obj1 = {
      event: "fetch_balance",
      user_wallet_address: queData.user_wallet_address,
    }
    MessageQueueHandler.FillGameMessageQueue(obj1)
  }

  public static createNewEntryForCombinedQueueV2(queData: NewQueueDB, p1_wallet: string, fight_id: string, p1_bet: number) {
    // FightQueueHandler.combinedQueueData.push({
    //   p1_wallet,
    //   p1_nick_name: queData.nick_name,
    //   p1_profile_image: queData.profile_image,

    //   p2_wallet: "",
    //   p2_nick_name: "",
    //   p2_profile_image: "",

    //   fight_id,
    //   p1_total_bet: p1_bet,
    //   p2_total_bet: 0,
    //   total_bet: 0,
    //   player_count: 1,
    // })
  }

  public static addEntryForCombinedQueueV2(queData: NewQueueDB, p2_bet: number, total_bet: number, player_count: number) {
    console.log("in add entry for combined queue v2")
    let combQueueData = FightQueueHandler.combinedQueueData[FightQueueHandler.combinedQueueData.length -1];
    combQueueData.p2_wallet = queData.user_wallet_address;
    combQueueData.p2_nick_name = queData.nick_name;
    combQueueData.p2_total_bet = p2_bet;
    combQueueData.total_bet = total_bet;
    combQueueData.player_count = player_count;
    combQueueData.p2_profile_image = queData.profile_image;
    this.combinedQueueData.splice(FightQueueHandler.combinedQueueData.length -1, 1);
    this.combinedQueueData.push(combQueueData)
  }

  public static async UpdateTotalBetsInFights() {
    console.log(" in  --- UpdateTotalBetsInFights ---  ")
    // for (let i = 0 ; i < FightQueueHandler.currentActiveFightIds.length; i++) {
    //   let data = await GetFightInfo(FightQueueHandler.currentActiveFightIds[i]);
    //   // console.log("-- data --- ", data);
    //   if (data === null) {
    //     continue
    //   }
    //   const ndata = data.data as IFightInfoData;
    //   console.log(" here .. ", ndata)
    //   for (let j = 0 ; j < FightQueueHandler.queueData.length; j++) {
    //     if (ndata.fight_id === FightQueueHandler.queueData[j].assigned_fight_id) {
    //       FightQueueHandler.queueData[j].p1_total_bet = ndata.total_bet_p1;
    //       FightQueueHandler.queueData[j].total_bet = ndata.total_bet;
    //       FightQueueHandler.queueData[j].p2_total_bet = ndata.total_bet_p2;
    //     }
    //   }
    // }
    console.log("in_UpdateTotalBetsInFights ", FightQueueHandler.queueData)
  }

  public static async ValidateAndRemoveUser(user_wallet_address: string) {
    console.log("in_ValidateAndRemoveUser", user_wallet_address);
    let required_index = -1;
    let found = false
    let second_user_address_if_exist = "";
    let second_player_index = 0;
    for(let i = 0 ; i< FightQueueHandler.combinedQueueData.length; i++) {
      if (
        FightQueueHandler.combinedQueueData[i].p1_wallet === user_wallet_address
      ) {
        required_index = i;
        console.log("in_ValidateAndRemoveUser -- deleting", required_index,FightQueueHandler.combinedQueueData[i].player_count )
        if (FightQueueHandler.combinedQueueData[i].player_count === 2) {
          second_user_address_if_exist = FightQueueHandler.combinedQueueData[i].p2_wallet
          second_player_index = 2;
        }
        found = true
        FightQueueExitApi(FightQueueHandler.combinedQueueData[i].fight_id, user_wallet_address, FightQueueHandler.combinedQueueData[i].p2_wallet);
        break
      }
      if (FightQueueHandler.combinedQueueData[i].p2_wallet === user_wallet_address) {
        required_index = i;
        found = true
        console.log("in_ValidateAndRemoveUser -- deleting", required_index, FightQueueHandler.combinedQueueData[i].player_count)
        if (FightQueueHandler.combinedQueueData[i].player_count === 2) {
          second_user_address_if_exist = FightQueueHandler.combinedQueueData[i].p1_wallet
          second_player_index = 1;
        }
        FightQueueExitApi(FightQueueHandler.combinedQueueData[i].fight_id, user_wallet_address, FightQueueHandler.combinedQueueData[i].p1_wallet);
        break
      }
    }
    if (found) {
      // since we are aboput to remove this fight info.
      let required_info = this.combinedQueueData[required_index];
      this.combinedQueueData.splice(required_index, 1);
      console.log("in_ValidateAndRemoveUser -- debug 1 ", this.combinedQueueData.length, required_info)
      let obj1 = {
        event: "fetch_balance",
        user_wallet_address: required_info.p1_wallet,
      }
      let obj2 = {
        event: "fetch_balance",
        user_wallet_address: required_info.p2_wallet,
      }
      setTimeout(() => {
        MessageQueueHandler.FillGameMessageQueue(obj1)
        MessageQueueHandler.FillGameMessageQueue(obj2)
      }, 2000)
      if (required_info.player_count < 2) {
        return
      }
      return

      let required_user_address = ""
      let required_minted_id = 0
      let required_amount = 0
      let required_nick_name = ""
      let required_profile_image = ""
      if (second_player_index === 1) {
        required_user_address = required_info.p1_wallet
        required_minted_id= required_info.p1_minted_id
        required_amount = required_info.p1_self_bet
        required_nick_name = required_info.p1_nick_name
        required_profile_image = required_info.p1_profile_image
      } else {
        required_user_address = required_info.p2_wallet
        required_minted_id= required_info.p2_minted_id
        required_amount = required_info.p2_self_bet
        required_nick_name = required_info.p2_nick_name
        required_profile_image = required_info.p2_profile_image
      }
      console.log("in_ValidateAndRemoveUser -- debug 2.. ", this.combinedQueueData.length %2)
      // Since this fight id is cleared. I need to create another fight id for the user who was left alone.
      if (this.combinedQueueData.length %2 === 0) {
        let data = await FightEntryCreateAdmin(required_user_address, required_minted_id.toString(), required_amount)
        console.log("--- calling FightEntryCreate ", data);
        if (data.resultBool) {
          let fightEntryInfo: IFightEntry = data.data.data;
          FightQueueHandler.createNewEntryForCombinedQueue(
            {
              nick_name: required_nick_name,
              profile_image: required_profile_image,
              minted_id: required_minted_id,
              user_wallet_address: required_user_address,
              current_position: 0,
              player_count: 0
            },
            fightEntryInfo.player1, 
            fightEntryInfo.fight_id, 
            fightEntryInfo.total_bet_p1, 
            fightEntryInfo.total_bet_p2,
            fightEntryInfo.total_bet,
            fightEntryInfo.player_count,
            fightEntryInfo,
          )
        }
      } else {
        let data = await FightEntryAddAdmin(FightQueueHandler.combinedQueueData[FightQueueHandler.combinedQueueData.length -1].p1_wallet, required_user_address, required_minted_id.toString(), required_amount);
        if (data.resultBool) {
          let fightEntryInfo: IFightEntry = data.data.data;
          console.log("fight entry info 1--- ", fightEntryInfo);
          FightQueueHandler.addEntryForCombinedQueue(
            {
              nick_name: required_nick_name,
              profile_image: required_profile_image,
              minted_id: required_minted_id,
              user_wallet_address: required_user_address,
              current_position: 0,
              player_count: 0
            },
            fightEntryInfo.player1, 
            fightEntryInfo.fight_id, 
            fightEntryInfo.total_bet_p1, 
            fightEntryInfo.total_bet_p2,
            fightEntryInfo.total_bet,
            fightEntryInfo.player_count,
            fightEntryInfo,
          )
        }
      }
    } else {
      // not in final queue
      // check in queue pool 
      let index = QueuePoolHandler.checkIfUserExist(user_wallet_address)
      console.log("in_ValidateAndRemoveUser -- debug 2 ", required_index, index)
      if (index > -1) {
        QueuePoolExitApi(user_wallet_address)
      }
    }
  }

  public static async RemoveFirstFightIndex() {
    console.log("remiving first fight index")
    this.combinedQueueData.splice(0, 1);
  }
}