import { getItemFromConstantsDB } from "../db";

export interface IRatRewardInfo {
  prize: number;
  escapeTime: number;
  rat_uuid: string;
}

interface IRewardsRatsDropData {
  time: number;
  total_prize: number;
  rats_info: Array<IRatRewardInfo>
}

const sample_rat_data = [
  {
    "prize": 0.4049641489251064,
    "escapeTime": 500,
    "rat_uuid": "8926140a-f037-4637-8f19-ccb006d370b5"
  },
  {
    "prize": 3.6669647951618267,
    "escapeTime": 500,
    "rat_uuid": "2251a6de-fcd4-4a97-908a-8851a9cebbe2"
  },
  {
    "prize": 17.091398614195317,
    "escapeTime": 500,
    "rat_uuid": "fe9b7e49-b345-43b0-9b9e-fa24c1bd7eb9"
  },
  {
    "prize": 6.589325071977063,
    "escapeTime": 500,
    "rat_uuid": "60acc350-2175-4f04-b479-beadb145d44c"
  },
  {
    "prize": 32.72681311402379,
    "escapeTime": 500,
    "rat_uuid": "58b1e11f-eb22-4eae-9937-324ca06c98be"
  },
  {
    "prize": 50.2298375430405,
    "escapeTime": 500,
    "rat_uuid": "2e72fa89-a355-475c-8f07-82ecd1fda65d"
  }
]

export class RatsPPRewardPoolData {

  static RATS_GAME_PRIZE_DATA: Array<IRewardsRatsDropData> = []

  static async GetRatsPrizeData() {
    let rats_game_prize_data = await getItemFromConstantsDB("RATS_GAME_PRIZE_DATA");
    let rats_data = JSON.parse(rats_game_prize_data.json_string)
    // for (let i = 0; i < rats_data.length; i++) {
    //   console.log("--aaaaa-----", i, rats_data[i].rats_info)
    // }
    this.RATS_GAME_PRIZE_DATA = rats_data;
  }

  static checkLaunchState(): { start: boolean, rats_info: Array<IRatRewardInfo>, timeLeft: number, index: number } {
    console.log("in checkLaunchState")
    let result: {
      start: boolean,
      rats_info: Array<IRatRewardInfo>,
      timeLeft: number,
      index: number,
    } = {
      start: false,
      rats_info: [],
      timeLeft: 0,
      index: 0,
    }

    // let result: {
    //   start: boolean,
    //   rats_info: Array<IRatRewardInfo>,
    //   timeLeft: number,
    //   index: number,
    // } = {
    //   start: true,
    //   rats_info: this.RATS_GAME_PRIZE_DATA[58].rats_info,
    //   timeLeft: 0,
    //   index: 0,
    // }
    // return result;

    for (let i = 0; i < this.RATS_GAME_PRIZE_DATA.length; i++) {
      // console.log("--checking if launch rats--", i, this.RATS_GAME_PRIZE_DATA.length, new Date().getTime() - this.RATS_GAME_PRIZE_DATA[i].time, (new Date().getTime() - this.RATS_GAME_PRIZE_DATA[i].time) / (1000 * 60))
      if (Math.abs(new Date().getTime() - this.RATS_GAME_PRIZE_DATA[i].time) < 10 * 1000) {
        result.start = true;
        result.index = i;
        result.rats_info = this.RATS_GAME_PRIZE_DATA[i].rats_info
        result.timeLeft = (new Date().getTime() - this.RATS_GAME_PRIZE_DATA[i].time)
        return result;
      }
      if (new Date().getTime() - this.RATS_GAME_PRIZE_DATA[i].time < 0) {
        return result;
      }
    }
    return result;
  }
}
