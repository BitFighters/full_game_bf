import { ServersInfoDao } from "@api/components/servers/dao";
import CONSTANTS_DB from "@models/constants";
import { mapper } from "@services/db/connection";
import { FetchAllOneKClubOwners } from "@services/web3";
import { Webhook, MessageBuilder } from "discord-webhook-node";
import { isNullOrUndefined } from "util";
import { PrizePurseGamesReward } from './PrizePoolDropLogic';
// const hook = new Webhook("https://discord.com/api/webhooks/1147821224777482360/F1zAYxS9G3ykp40Hvhz2zCvkuIlxxvQNXZjkcqn7ffsAQyn-tzT1V-E-lJZgONtVUG30");
const hook = new Webhook("https://discord.com/api/webhooks/1147606078075445279/RG9H9KIfFOVI7-i--jF-eg8PiNR7kpsS8CixIdAV2OXwiaw9UwenLICRTdDogyi7HABZ");
const qs = require("qs");

export class LoopWorker {
  static OneKUsersAddresses: Array<string> = [];

  public static async FetchOneKUsers() {
    let res = await FetchAllOneKClubOwners();
    console.log("all 1k members -- ", res);
    LoopWorker.OneKUsersAddresses = res;
    // LoopWorker.OneKUsersAddresses.push("0xB4c2D38ca5382b565cb9e8F849Da42d8E441B59e")

    let nres = [];
    for (let i = 0; i < LoopWorker.OneKUsersAddresses.length; i++) {
      nres.push(LoopWorker.OneKUsersAddresses[i].toLowerCase());
    }
    LoopWorker.OneKUsersAddresses = nres;
  }

  public static async CheckAndUpdateJackPotProbability() {
    let jackPotEntry = await CONSTANTS_DB.GetConstantData("JACKPOT_PROBABILITY_INFO");
    console.log("----jackpot data entry --- ", jackPotEntry);
    if (isNullOrUndefined(jackPotEntry)) {
      return;
    }
    if (jackPotEntry.value === 0) {
      jackPotEntry.value = 1 / 100;
    }
    if (new Date().getTime() - jackPotEntry.updated_at > 1000 * 60 * 60 * 24) {
      // 1day
      // if (new Date().getTime() - jackPotEntry.updated_at > 1000 * 60 ) { // min
      jackPotEntry.updated_at = new Date().getTime();
      jackPotEntry.value += jackPotEntry.value * 0.065;
    }
    // jackPotEntry.value = parse(jackPotEntry.value.toFixed(10))
    console.log("---- updated jackpot data entry --- ", jackPotEntry);
    await mapper.update(jackPotEntry);
  }

  public static async Looper1() {
    // this.FetchOneKUsers()
    this.CheckAndUpdateJackPotProbability();
    setTimeout(() => {
      this.Looper1();
    }, 1000 * 60 * 60);

    // setTimeout(() => {
    //   this.Looper1()
    // }, 1000 * 60);
  }

  static async sendServerInfo() {
    // console.log("in --- sendServerInfo")
    const keys = Object.keys(ServersInfoDao.SERVER_LIST);
    console.log("--- keys .. ", keys);
    let embed = new MessageBuilder().setTitle(`Server Info`);
    if (keys.length > 0) {
      for (let i = 0; i < keys.length; i++) {
        console.log("in --- sendServerInfo ", i, keys[i], ServersInfoDao.SERVER_LIST[keys[i]].length);
        for (let j = 0; j < ServersInfoDao.SERVER_LIST[keys[i]].length; j++) {
          console.log("in --- sendServerInfo ", i, keys[i], ServersInfoDao.SERVER_LIST[keys[i]][j]);
          if (ServersInfoDao.SERVER_LIST[keys[i]][j].region === keys[i]) {
            embed.addField("Server Location", ServersInfoDao.SERVER_NAME_TO_ALIAS_MAP[ServersInfoDao.SERVER_LIST[keys[i]][j].region]);
            embed.addField("HQ ID", ServersInfoDao.SERVER_LIST[keys[i]][j].room_id.slice(-5));
            embed.addField("Active Users", ServersInfoDao.SERVER_LIST[keys[i]][j].active_users);
            embed.addField("", "--------", true);
          }
        }
      }

      await hook.send(embed);
    }

    // console.log("---", embed)
  }

  public static async DiscordWebHookLoop() {
    // console.log("--- DiscordWebHookLoop")
    try {
      await this.sendServerInfo();
    } catch (err) {
      console.log("--- error occured in DiscordWebHookLoop ", err);
    }

    setTimeout(() => {
      this.DiscordWebHookLoop();
    }, 1000 * 60 * 2);
  }

  // public static async BitsDecayFunction() {
  //   console.log("in BitsDecayFunction ")
  //   let competition_start_time = parseInt(await CONSTANTS_DB.getConstantValue("COMPETITION_START_TIME"));
  //   let decay_count = parseInt(await CONSTANTS_DB.getConstantValue("DECAY_COUNT"));
  //   let bits_decay_rate = parseInt(await CONSTANTS_DB.getConstantValue("BITS_DECAY_RATE"));
  //   let delete_after = 1000 * 60 * 60 * 24;// this should be 24 hours
  //   let should_decay_now = new Date().getTime() - competition_start_time > decay_count * delete_after;
  //   console.log("-----BitsDecayFunction------", new Date().getTime() , competition_start_time,  decay_count * delete_after,  competition_start_time, decay_count, bits_decay_rate, delete_after, should_decay_now)
  //   if (!should_decay_now) {
  //     return
  //   }
  //   await CONSTANTS_DB.updateConstantValue("DECAY_COUNT", (decay_count+1).toString())
  //   for(let i=0; i < this.OneKUsersAddresses.length; i++) {
  //     let wallet_info = await WalletDAO.FetchUserWalletInfo(this.OneKUsersAddresses[i])
  //     console.log("******",  this.OneKUsersAddresses[i], wallet_info.web2_balance)
  //     wallet_info.web2_balance -= bits_decay_rate;
  //     await mapper.update(wallet_info);
  //   }
  // }

  // public static async DecayBitsLoop() {
  //   try {
  //     await this.BitsDecayFunction()
  //   } catch (err) {
  //     console.log("--- error occured in BitsDecayFunction ", err)
  //   }
  //   setTimeout(() => {
  //     this.DecayBitsLoop()
  //   }, 1000 * 60 * 60);
  // }

  public static async PrizePoolDropsLogicLooper() {
    PrizePurseGamesReward.looper()
    setTimeout(() => {
      this.PrizePoolDropsLogicLooper();
    }, 1000 * 60 * 20);
  }

  public static async Work() {
    this.Looper1();
    this.DiscordWebHookLoop();
    this.PrizePoolDropsLogicLooper()
  }
}
