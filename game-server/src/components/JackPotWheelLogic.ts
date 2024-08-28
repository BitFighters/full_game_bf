import { getItemFromConstantsDB } from "../db";
import { isNullOrUndefined } from "util";
import { MessageQueueHandler } from "./messageQueueHandler";
import { JackPotWinEventApi } from "../services/ApiCaller";

export class JackPotWheelLogic {
  static JACKPOT_PROBABILITY = 0.01;
  static JACKPOT_SHOW_USER_INFO_TEMP = {};

  static async GetJackPotConstantData() {
    let jackpotData = await getItemFromConstantsDB("JACKPOT_PROBABILITY_INFO");
    console.log("________jackpotData_________", jackpotData);
    if (isNullOrUndefined(jackpotData)) {
      return;
    }
    JackPotWheelLogic.JACKPOT_PROBABILITY = jackpotData.value;
    console.log("________updated_random_jackpot_prob_________", JackPotWheelLogic.JACKPOT_PROBABILITY);
  }

  static DecideIfShowJackPotWheel() {
    let randomValue = Math.random() * 100;
    console.log("decide if show jackpot --- ", randomValue, JackPotWheelLogic.JACKPOT_PROBABILITY)
    if (randomValue > JackPotWheelLogic.JACKPOT_PROBABILITY) {
      return {
        client_target: 0,
        show_jackpot_wheel: false,
      };
    } else {
      let randomNumber = Math.floor(Math.random() * 100 + 1);
      return {
        client_target: randomNumber,
        show_jackpot_wheel: true,
      };
    }
  }

  static async MakeApiCallWithTargetValue(target_value: number, user_wallet_address: string, minted_id: number) {
    let jackPotAmount = await JackPotWinEventApi(target_value, user_wallet_address, minted_id);
    return jackPotAmount;
  }
}
