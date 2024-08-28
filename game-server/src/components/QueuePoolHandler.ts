import { FightEntryAdd, FightEntryCreate, FightEntryCreateV2 } from "../services/ApiCaller";
import { isNullOrUndefined } from "util";
import { IFightEntry, NewQueueDB } from "../interfaces";
import { FightQueueHandler } from "./fightQueueHandler";
import { NotificationSender } from "./NotificationSender";

/**
 * 
 * 
  After a player places their bet in the fight menu, the player joins the bet pool with other 
  players that chose the same tier ante as them.
  the server will try to find them a matching opponent within 1 minute
  first 30 seconds tries to find within 5%
  next 15 seconds look for 15% or better
  final 15 seconds 30% or better
  If still cannot match then match with next available.
*/

const POOL_CONFIG = {
  // TIME_LIMIT_1: 30,
  // TIME_LIMIT_2: 45,
  // TIME_LIMIT_3: 60,

  TIME_LIMIT_1: 5,
  TIME_LIMIT_2: 10,
  TIME_LIMIT_3: 15,

  PERCENT_LIMIT_1: 0.95,
  PERCENT_LIMIT_2: 0.85,
  PERCENT_LIMIT_3: 0.70
}

export class QueuePoolHandler {
  static playersInQueuePool: Array<NewQueueDB> = []

  static addPlayerInfoToQueuePool(queueData: NewQueueDB) {
    queueData.entered_on = new Date().getTime()
    this.playersInQueuePool.push(queueData)
    NotificationSender.sendNotificationMessage(
      `Added to Queue Pool.\n Will be assigned a match in upto 1 minute.\n Please be patient.`, 
      queueData.user_wallet_address,
      "join",
      this.playersInQueuePool.length
    )
  }

  static checkIfUserExist(user_wallet_address: string) {
    let index = -1
    for(let i=0; i < this.playersInQueuePool.length; i++) {
      if (this.playersInQueuePool[i].user_wallet_address == user_wallet_address) {
        index = i;
      }
    }
    return index;
  }

  static removePlayerInfoFromQueuePool(user_wallet_address: string) {
    let index = -1
    for(let i=0; i < this.playersInQueuePool.length; i++) {
      if (this.playersInQueuePool[i].user_wallet_address == user_wallet_address) {
        index = i;
      }
    }
    if (index > -1) {
      console.log("removing player from queue pool ", user_wallet_address)
      this.playersInQueuePool.splice(index, 1)
      NotificationSender.sendNotificationMessage(
        "Added to Queue Pool.\n Will be assigned a match in upto 1 minute.\n Please be patient.", 
        user_wallet_address,
        "remove",0
      )
    }
    for (let i=0; i< this.playersInQueuePool.length; i++) {
      NotificationSender.sendNotificationMessage(
        ``, 
        this.playersInQueuePool[i].user_wallet_address,
        "",
        this.playersInQueuePool.length
      )
    }
  }

  // static eqSet(xs, ys) {
  //   console.log("debug --", xs)
  //   return xs.size === ys.size &&
  //   [...xs].every((x) => ys.has(x));
  // }

  static async RunLoop() {
    console.log("runloop executing.. total players in pool ----", this.playersInQueuePool.length)
    let matches: Array<Array<NewQueueDB>> = []
    for (let i=0; i< this.playersInQueuePool.length; i++) {
      NotificationSender.sendNotificationMessage(
        ``, 
        this.playersInQueuePool[i].user_wallet_address,
        "",
        this.playersInQueuePool.length
      )
      console.log("checking for player ----", i,  this.playersInQueuePool.length)
      let entry: NewQueueDB;
      if (new Date().getTime() - this.playersInQueuePool[i].entered_on < POOL_CONFIG.TIME_LIMIT_1 * 1000) {
        entry = this.searchForOtherUsersWithinLimit(this.playersInQueuePool[i], POOL_CONFIG.PERCENT_LIMIT_1 * this.playersInQueuePool[i].betAmount)
      } else if (new Date().getTime() - this.playersInQueuePool[i].entered_on < POOL_CONFIG.TIME_LIMIT_2 * 1000) {
        entry = this.searchForOtherUsersWithinLimit(this.playersInQueuePool[i], POOL_CONFIG.PERCENT_LIMIT_2 * this.playersInQueuePool[i].betAmount)
      } else if (new Date().getTime() - this.playersInQueuePool[i].entered_on < POOL_CONFIG.TIME_LIMIT_3 * 1000) {
        entry = this.searchForOtherUsersWithinLimit(this.playersInQueuePool[i], POOL_CONFIG.PERCENT_LIMIT_3 * this.playersInQueuePool[i].betAmount)
      } else {
        entry = this.searchForOtherUsersWithinLimit(this.playersInQueuePool[i], 0)
      }
      if (!isNullOrUndefined(entry)) {
        let tempMatch: Array<NewQueueDB> = []
        tempMatch.push(this.playersInQueuePool[i]);
        tempMatch.push(entry);

        let add1 = tempMatch[0].user_wallet_address;
        let add2 = tempMatch[1].user_wallet_address;

        let check = true;
        let check_count = 0
        for (let j=0 ; j < matches.length; j++) {
          let add3 = matches[j][0].user_wallet_address;
          let add4 = matches[j][1].user_wallet_address;
          if ((add1 === add3 || add1 === add4) && (add2 === add3 || add2 === add4)) {
            // console.log("debug -- ", add1, add2, add3, add4)
            check = false;
            break
          }
        }
        if (check) {
          matches.push(tempMatch)
          // console.log("adding in v1 -- ", tempMatch.map((tm: NewQueueDB) =>  tm.user_wallet_address))
        }
      }
    }
    // console.log("---v1----", matches)
    // TODO: add one more check:
    // if player exists in multiple matches at together.
    // select the match whose sum is greater.
    let matchesLvl2: Array<Array<NewQueueDB>> = []
    for (let i=0 ; i< matches.length; i++) {
      let add1 = matches[i][0].user_wallet_address;
      let add2 = matches[i][1].user_wallet_address;
      let repeat_check = false;
      let selectionMatch: Array<NewQueueDB> = [];
      for (let j=i; j<matches.length; j++) {
        if (i == j) {
          continue
        }
        let add3 = matches[j][0].user_wallet_address;
        let add4 = matches[j][1].user_wallet_address;
        if (add1 === add3 || add1 === add4 || add2 === add3 || add2 === add4) {
          repeat_check = true;
          // repeating user
          if (matches[i][0].betAmount + matches[i][1].betAmount >= matches[j][0].betAmount + matches[j][0].betAmount) {
            selectionMatch = matches[i]
          } else {
            selectionMatch = matches[j]
          }
          break
        }
      }
      // check if similar entry exists

      // update lvl2 array here
      if (repeat_check && selectionMatch.length > 0) {
        let check = true
        let add1 = selectionMatch[0].user_wallet_address;
        let add2 = selectionMatch[1].user_wallet_address;
        // console.log("doing repeast check ------ ", add1, add2)
        for (let j=0 ; j < matchesLvl2.length; j++) {
          let add3 = matchesLvl2[j][0].user_wallet_address;
          let add4 = matchesLvl2[j][1].user_wallet_address;
          // console.log("doing repeast check *******------ ", add1, add2, add3, add4)
          if ((add1 === add3 || add1 === add4) && (add2 === add3 || add2 === add4)) {
            check = false;
            break
          }
        }
        if (check) {
          matchesLvl2.push(selectionMatch)
        }
      } 
      if (matchesLvl2.length == 0) {
        matchesLvl2.push(matches[i])
      }
    }
    // console.log("---v2----", matchesLvl2)
    /////////////////////////////////////////////////////
    // let match_created = []
    for(let i=0 ; i< matchesLvl2.length; i++) {

      if (FightQueueHandler.combinedQueueData.length % 2 === 0) {
        console.log("************************************ creating db entry of queue *********************")
        //@TODO: make a v2 api. which can create an entry with both fighters info together.
        let data = await FightEntryCreateV2(
          matchesLvl2[i][0].user_wallet_address, 
          matchesLvl2[i][0].minted_id.toString(),
          matchesLvl2[i][1].user_wallet_address, 
          matchesLvl2[i][1].minted_id.toString(),
        )
        if (data.resultBool) {
          let fightEntryInfo: IFightEntry = data.data.data
          FightQueueHandler.createNewEntryForCombinedQueueV2(
            matchesLvl2[i][0],
            fightEntryInfo.player1, 
            fightEntryInfo.fight_id, 
            fightEntryInfo.total_bet_p1
          )
          FightQueueHandler.addEntryForCombinedQueueV2(
            matchesLvl2[i][1],
            fightEntryInfo.total_bet_p2,
            fightEntryInfo.total_bet,
            fightEntryInfo.player_count,
          )
          this.removePlayerInfoFromQueuePool(matchesLvl2[i][0].user_wallet_address)
          this.removePlayerInfoFromQueuePool(matchesLvl2[i][1].user_wallet_address)
        }
      }
      
      // this.removePlayerInfoFromQueuePool(matchesLvl2[i][0].user_wallet_address)
      // this.removePlayerInfoFromQueuePool(matchesLvl2[i][1].user_wallet_address)
    }

    FightQueueHandler.UpdateQueueInfo()

    // console.log("---v2 matched ----", match_created)
  }

  /**
   * 
   * @param myEntry - just pass the players info
   * @param lmiit - just pass min limit of money to search from. 
   * can pass 0. if just want to match with the highest available
  */
  static searchForOtherUsersWithinLimit(myEntry: NewQueueDB, limit: number): NewQueueDB {

    /////////////////////////////////////////////////////
    let matches: Array<NewQueueDB> = []
    for (let i=0; i < this.playersInQueuePool.length; i++) {
      let player = this.playersInQueuePool[i];
      if (player.user_wallet_address === myEntry.user_wallet_address) {
        continue
      }
      if (player.betAmount >= limit) {
        matches.push(player)
      }
    }
    console.log("matches lvl1 --- ",myEntry.betAmount, matches.length, matches.map((m: NewQueueDB) => {return m.betAmount}));
    //////////////////////////////////////////////////////
    let matchesLevel2: Array<NewQueueDB> =[]
    for (let i=0; i < matches.length; i++) {
      let player = matches[i];
      // console.log("debug -- ", new Date().getTime() - matches[i].entered_on)
      if (new Date().getTime() - matches[i].entered_on < POOL_CONFIG.TIME_LIMIT_1 * 1000) {
        if (player.betAmount * POOL_CONFIG.PERCENT_LIMIT_1 <= myEntry.betAmount) {
          matchesLevel2.push(player)
        }
      } else if (new Date().getTime() - matches[i].entered_on < POOL_CONFIG.TIME_LIMIT_2 * 1000) {
        if (player.betAmount * POOL_CONFIG.PERCENT_LIMIT_2 <= myEntry.betAmount) {
          matchesLevel2.push(player)
        }
      } else if (new Date().getTime() - matches[i].entered_on < POOL_CONFIG.TIME_LIMIT_3 * 1000) {
        if (player.betAmount * POOL_CONFIG.PERCENT_LIMIT_3 <= myEntry.betAmount) {
          matchesLevel2.push(player)
        }
      } else {
        matchesLevel2.push(player)
      }
    }
    console.log("matches lvl2 --- ", myEntry.betAmount,  matchesLevel2.length, matchesLevel2.map((m: NewQueueDB) => {return m.betAmount}));
    /////////////////////////////////////////////////////
    let max = -9999;
    let maxi = -1;
    for (let i=0; i < matchesLevel2.length; i++) {
      if (matchesLevel2[i].betAmount > max) {
        max = matchesLevel2[i].betAmount;
        maxi = i
      }
    }
    console.log("final match for player --- ", maxi)
    if (maxi >= 0) {
      return matchesLevel2[maxi];
    }
    return null
  }
}