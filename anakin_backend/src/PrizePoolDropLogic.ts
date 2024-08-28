import { SYSTEM_WALLETS } from '@config/system_wallets';
import { WalletDAO } from "@api/components/wallets/dao";
import SYSTEM_WALLET_DB from "@models/system_wallets";
import CONSTANTS_DB from '@models/constants';
import { mapper } from '@services/db/connection';
import { v4 as uuidv4 } from "uuid";
import { IRatRewardInfo, IRewardsRatsDropData } from '@utils/prizePoolRat';
import { ANAKIN_LOGGER } from '@services/logger';

export class PrizePurseGamesReward {
  private static hoursInDay = 6;
  prizePool = 0;

  private static async getPPData() {
    let data: Array<SYSTEM_WALLET_DB> = await WalletDAO.fetchSystemWalletsData();
    // console.log("prize pool drops looper ", data);
    let ppBalance = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].wallet_name === SYSTEM_WALLETS.PrizePool5) {
        ppBalance = data[i].web2_balance;
        break
      }
    }
    return ppBalance;
  }

  // private rebalancePurse(): void {
  //   this.prizePool *= 0.10;
  // }


  static async looper() {
    // get last updaste time.. - if updated in less than 24 hours.. do not proceed.

    // let distributionTime = 6

    let lastUpdatedPPDropAmount = await WalletDAO.fetchConstantValueFromRedis("PRIZE_DROP_LAST_UPDATED_AT");
    if (new Date().getTime() - lastUpdatedPPDropAmount.value < this.hoursInDay * 60 * 60 * 1000) {
      console.log(
        "prize pool drops looper returning early ",
        lastUpdatedPPDropAmount,
        new Date().getTime() - lastUpdatedPPDropAmount.value,
        new Date().getTime() - lastUpdatedPPDropAmount.value < this.hoursInDay * 60 * 60 * 1000
      );
      return
    }


    // get prize pool value
    // rebalance pp_reward_pool value to 10% of pp wallet
    // get current pp drop amt 
    // deduct ppRewardPool - val from ppBalance and put in ppRewardPool
    // allocate 0-50% of pp drop funds for each hour.

    let ppBalance = await this.getPPData();
    let ppRewardPool = Math.floor((0.01 * ppBalance) / 8);
    let currentPPAmount = await WalletDAO.fetchConstantValueFromRedis("PRIZE_DROP_AMOUNT");
    let amountToAddInPPRewardPool = ppRewardPool - currentPPAmount.value > 0 ? ppRewardPool - currentPPAmount.value : 0;
    await SYSTEM_WALLET_DB.updateWeb2Balance(SYSTEM_WALLETS.PrizePool5, -amountToAddInPPRewardPool)
    await CONSTANTS_DB.updateConstantValue("PRIZE_DROP_AMOUNT", currentPPAmount.value + amountToAddInPPRewardPool)

    console.log("prize pool drops looper ", ppBalance, ppRewardPool, currentPPAmount, amountToAddInPPRewardPool, ppBalance - amountToAddInPPRewardPool);



    ANAKIN_LOGGER.info({
      event: "rewardPoolUpdate",
      current_reward_pool_balance: currentPPAmount.value + amountToAddInPPRewardPool,
      proze_pool_balance: ppBalance - amountToAddInPPRewardPool,
      ppRewardPool,
      extra: currentPPAmount.value,
      amountToAddInPPRewardPool,
    });

    currentPPAmount = await CONSTANTS_DB.GetConstantData("PRIZE_DROP_AMOUNT");
    ANAKIN_LOGGER.info({
      event: "rewardPoolUpdate_2",
      extra: currentPPAmount.value,
    });

    let perHourDrop = this.allocateFundsHourlyV2(currentPPAmount.value);
    console.log("------debug", perHourDrop.length, perHourDrop)
    // save perHourDrop
    // update ppBalance = ppBalance- sum(perHourDrop);
    // update last updated time..

    // now lets make an array of per 15 minute drop.
    // let per15minDropWithTime = perHourDrop.flatMap((value) => [value / 12, value / 12, value / 12, value / 12, value / 12, value / 12, value / 12, value / 12, value / 12, value / 12, value / 12, value / 12]);
    let per15minDropWithTime = perHourDrop.flatMap((value) => [value / 12, value / 12, value / 12, value / 12, value / 12, value / 12, value / 12, value / 12, value / 12, value / 12, value / 12, value / 12]);
    // console.log("------debug", perHourDrop)
    console.log(per15minDropWithTime.length, per15minDropWithTime)
    // make a map epoch vs prize.

    /**
     * now create a json. which will have [
     * { 
     *  time:
     *  prize: 
     *  rats : [
     *    {
     *        prize: 
     *        escapeTime: 
     *     }
     * ]
     * }
     * , {...}, .....] 
    */
    let rats_data: Array<IRewardsRatsDropData> = [];
    for (let i = 0; i < per15minDropWithTime.length; i++) {
      let rats_count = Math.floor(Math.random() * 10 + 5);
      let per_15_min_rats_info: Array<IRatRewardInfo> = [];
      let totalAmountToDistributeIntoRats = per15minDropWithTime[i];
      let portions = this.generateRandomSplit(rats_count);
      for (let j = 0; j < rats_count; j++) {
        per_15_min_rats_info.push({
          prize: Math.floor(totalAmountToDistributeIntoRats * portions[j]),
          escapeTime: 500, // placeholder,
          rat_uuid: uuidv4(),
          killed: false,
        })
      }
      rats_data.push({
        time: new Date().getTime() + (i + 1) * 5 * 60 * 1000,
        total_prize: totalAmountToDistributeIntoRats,
        rats_info: per_15_min_rats_info,
      })
    }
    // console.log(rats_data.length, JSON.stringify(rats_data, null, 2));

    let data = await CONSTANTS_DB.GetConstantData("RATS_GAME_PRIZE_DATA");
    data.json_string = JSON.stringify(rats_data, null, 2);
    await mapper.update(data);
    await CONSTANTS_DB.updateConstantValue("PRIZE_DROP_LAST_UPDATED_AT", new Date().getTime());
  }

  private static allocateFundsHourly(totalAmount: number) {
    let sum = 0;
    let arr = [];
    for (let hour = 0; hour < this.hoursInDay; hour++) {
      const allocationPercentage = this.getRandomPercentage(10);
      let allocatedAmount = (allocationPercentage / 100) * totalAmount;

      if (sum + allocatedAmount >= totalAmount) {
        allocatedAmount = totalAmount - sum; // Adjust allocatedAmount to not exceed totalAmount
        sum = totalAmount; // Set sum to totalAmount to break out of the loop
      } else {
        sum += allocatedAmount;
      }

      console.log(`Hour ${hour + 1}: Allocated ${allocatedAmount}  sum is ${sum} , ${allocationPercentage} `);
      arr.push(allocatedAmount);
    }
    return arr;
  }

  private static allocateFundsHourlyV2(totalAmount: number) {
    let portions = this.generateRandomSplit(this.hoursInDay);
    let arr = [];
    for (let i = 0; i < portions.length; i++) {
      arr.push(portions[i] * totalAmount)
    }
    return arr;
  }

  private static generateRandomSplit(numberOfVariables: number) {
    const randomValues = Array.from({ length: numberOfVariables - 1 }, () => Math.random());
    randomValues.sort((a, b) => a - b);
    const portions = randomValues.map((value, index, array) => (index === 0 ? value : value - array[index - 1]));
    portions.push(1 - portions.reduce((sum, value) => sum + value, 0));
    return portions;
  }

  private static getRandomPercentage(multiplier = 50): number {
    return Math.random() * multiplier;
  }

}

