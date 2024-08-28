import { SYSTEM_WALLETS } from "@config/system_wallets";
import BetDB from "@models/BetDB";
import BITFIGHTER_NFT_SPECS from "@models/bitfighter_nft_specs";
import CONSTANTS_DB from "@models/constants";
import FightsDB from "@models/fightsDB";
import STATS_DB from "@models/statsDB";
import SYSTEM_WALLET_DB from "@models/system_wallets";
import USER_ACTIVITY_TRACKING from "@models/user_activity_tracking";
import WALLET_DB from "@models/wallet";
import WALLET_LOGS from "@models/wallet_logs";
import WEEKLY_STATS from "@models/weekly_stats";
import { mapper } from "@services/db/connection";
import { ANAKIN_LOGGER } from "@services/logger";
import { RedClient } from "@services/redis";
import { FightStates } from "@utils/bitfighter_nft_specs";
import { GetFightInfoRedisKey } from "@utils/fights";
import { WALLET_LOGS_GROUP } from "@utils/wallet_logs";
import BigNumber from "bignumber.js";
import { isNullOrUndefined } from "util";
import { Web3Dao } from "../web3/dao";

export class FightDao {
  // static FIGHT_FULL_INFO: Map<string, FightsDB> = new Map();

  public static async EnterFightQueue(user_wallet_address: string, betFightAmount: string, identity = '') {
    try {
      if (identity == 'bot') {
        let data = await WALLET_DB.createWalletForUser(user_wallet_address)
        data.web2_balance = 1000 * 100;
        await mapper.update(data)
      }
      const data: WALLET_DB = await WALLET_DB.getWalletInfoOfUser(user_wallet_address);
      if (data.web2_balance < BigNumber(betFightAmount).toNumber()) {
        throw "LESS BALANCE"
      }
      console.log("EnterFightQueue -- ", new Date().getTime(), data.last_temp_bet_created_on, new Date().getTime() - data.last_temp_bet_created_on)
      console.log("EnterFightQueue -- ", data);
      data.web2_balance -= BigNumber(betFightAmount).toNumber();

      let promises_activity_tracking = [];
      let wallet_log_msg = `Bet ${Math.floor(BigNumber(betFightAmount).toNumber() / 100)} Bits.`
      promises_activity_tracking.push(WALLET_LOGS.addIntoWalletLogs(
        user_wallet_address, -Math.floor(BigNumber(betFightAmount).toNumber() / 100), WALLET_LOGS_GROUP.FIGHT_BET, wallet_log_msg
      ));
      promises_activity_tracking.push(USER_ACTIVITY_TRACKING.addDataIntoUserActivityLog(user_wallet_address, `Pressed Bet Button in Frontend.`, `Total Bet Amount of ${BigNumber(betFightAmount).toNumber()}. Deducted from main balance and added to temp balance.`))

      if (data.temp_bet_amount > 0) {
        data.web2_balance += data.temp_bet_amount;
        promises_activity_tracking.push(USER_ACTIVITY_TRACKING.addDataIntoUserActivityLog(user_wallet_address, `Temp Amount is greater than 0.`, `Total Temp Amount of ${data.temp_bet_amount}. Added back to main wallet.`))
      }
      data.temp_bet_amount = BigNumber(betFightAmount).toNumber();
      data.last_temp_bet_created_on = new Date().getTime()
      await mapper.update(data);
      await Promise.all(promises_activity_tracking);
    } catch (err) {
      ANAKIN_LOGGER.error({
        function: "EnterFightQueue",
        error: err,
      })
      throw err;
    }
  }

  public static async ExitFightQueue(user_wallet_address: string, fight_id: string) {
    try {
      let fight_entry_data = await FightsDB.getFightEntry(fight_id);
      console.log("--in_exitfightqueue--", fight_entry_data);
      if (fight_entry_data.player_count === 1) {
        let betDBInfo: BetDB = await BetDB.getBetEntryOfUser(user_wallet_address, fight_id);
        let walletDb: WALLET_DB = await WALLET_DB.getWalletInfoOfUser(user_wallet_address);
        walletDb.web2_balance += betDBInfo.bet_amount;

        let wallet_log_msg = `Refund ${Math.floor(betDBInfo.bet_amount / 100)} Bits.`
        let promises_activity_tracking = [];
        promises_activity_tracking.push(WALLET_LOGS.addIntoWalletLogs(
          user_wallet_address, Math.floor(betDBInfo.bet_amount / 100), WALLET_LOGS_GROUP.FIGHT_REFUND, wallet_log_msg
        ));

        promises_activity_tracking.push(USER_ACTIVITY_TRACKING.addDataIntoUserActivityLog(user_wallet_address, `Fund Transfer`, `User Exited the fight. he was alone. Refund of ${betDBInfo.bet_amount} `))
        await mapper.update(walletDb);
        await Promise.all(promises_activity_tracking);

      } else if (fight_entry_data.player_count === 2) {
        if (fight_entry_data.fight_state >= FightStates.STARTED) {
          return
        }
        let winner = ""
        let loser = ""
        let winners_total_bet = 0;
        let losers_total_bet = 0;
        // let winners_referer_address = "";
        if (fight_entry_data.player1 === user_wallet_address) {
          winner = fight_entry_data.player2;
          loser = fight_entry_data.player1;
          winners_total_bet = fight_entry_data.total_bet_p2;
          losers_total_bet = fight_entry_data.total_bet_p1;
          await WALLET_DB.updateUsersWeb2Balance(fight_entry_data.player1, fight_entry_data.self_bet_p1 - 5000)
          await WALLET_DB.updateUsersWeb2Balance(fight_entry_data.player2, fight_entry_data.self_bet_p2 + 5000)

          let promises_activity_tracking = [];

          let wallet_log_msg = `Refund ${fight_entry_data.self_bet_p1 - 5000} Bits.`
          promises_activity_tracking.push(WALLET_LOGS.addIntoWalletLogs(
            fight_entry_data.player1, fight_entry_data.self_bet_p1 - 5000, WALLET_LOGS_GROUP.BET_REFUND, wallet_log_msg
          ));

          wallet_log_msg = `Refund ${fight_entry_data.self_bet_p2 + 5000} Bits.`
          promises_activity_tracking.push(WALLET_LOGS.addIntoWalletLogs(
            fight_entry_data.player2, fight_entry_data.self_bet_p2 + 5000, WALLET_LOGS_GROUP.FIGHT_REFUND, wallet_log_msg
          ));

          promises_activity_tracking.push(USER_ACTIVITY_TRACKING.addDataIntoUserActivityLog(
            fight_entry_data.player1,
            `Fund Transfer`,
            `User was P1 and got refund of of ${fight_entry_data.self_bet_p1 - 5000}`
          ));
          promises_activity_tracking.push(USER_ACTIVITY_TRACKING.addDataIntoUserActivityLog(
            fight_entry_data.player2,
            `Fund Transfer`,
            `User was P2 and P1 exited the queue so got refund of of ${fight_entry_data.self_bet_p2 + 5000}`
          ));
          await Promise.all(promises_activity_tracking);

          // let walletDb: WALLET_DB = await WALLET_DB.getWalletInfoOfUser(fight_entry_data.player2);
          // walletDb.temp_bet_amount += fight_entry_data.self_bet_p2;
          // await mapper.update(walletDb);

          // winners_referer_address = await Web3Dao.fetchRefererAddress(fight_entry_data.player2, fight_entry_data.p2_minted_id);
        } else if (fight_entry_data.player2 === user_wallet_address) {
          winner = fight_entry_data.player1;
          loser = fight_entry_data.player2;
          winners_total_bet = fight_entry_data.total_bet_p1;
          losers_total_bet = fight_entry_data.total_bet_p2;
          await WALLET_DB.updateUsersWeb2Balance(fight_entry_data.player2, fight_entry_data.self_bet_p2 - 5000)
          await WALLET_DB.updateUsersWeb2Balance(fight_entry_data.player1, fight_entry_data.self_bet_p1 + 5000)

          let promises_activity_tracking = [];

          let wallet_log_msg = `Refund ${fight_entry_data.self_bet_p2 - 5000} Bits.`
          promises_activity_tracking.push(WALLET_LOGS.addIntoWalletLogs(
            fight_entry_data.player2, fight_entry_data.self_bet_p2 - 5000, WALLET_LOGS_GROUP.BET_REFUND, wallet_log_msg
          ));

          wallet_log_msg = `Refund ${fight_entry_data.self_bet_p1 + 5000} Bits.`
          promises_activity_tracking.push(WALLET_LOGS.addIntoWalletLogs(
            fight_entry_data.player1, fight_entry_data.self_bet_p1 + 5000, WALLET_LOGS_GROUP.FIGHT_REFUND, wallet_log_msg
          ));

          promises_activity_tracking.push(
            USER_ACTIVITY_TRACKING.addDataIntoUserActivityLog(
              fight_entry_data.player2,
              `Fund Transfer`, `User was P2 and got refund of of ${fight_entry_data.self_bet_p2 - 5000}`
            )
          )
          promises_activity_tracking.push(
            USER_ACTIVITY_TRACKING.addDataIntoUserActivityLog(
              fight_entry_data.player1,
              `Fund Transfer`, `User was P1 and P2 exited the queue so got refund of of ${fight_entry_data.self_bet_p1 + 5000}`
            )
          )
          await Promise.all(promises_activity_tracking);

          // let walletDb: WALLET_DB = await WALLET_DB.getWalletInfoOfUser(fight_entry_data.player1);
          // walletDb.temp_bet_amount += fight_entry_data.self_bet_p1;
          // await mapper.update(walletDb);
          // winners_referer_address = await Web3Dao.fetchRefererAddress(fight_entry_data.player1, fight_entry_data.p1_minted_id);
        } else {
          throw "Wrong User executing this."
        }
        console.log("--in_exitfightqueue--", winner, winners_total_bet);
        // let draw = false;
        // await FightDao.FightEndMoneyCirculationLogic(fight_id, winner, loser, fight_entry_data, draw, winners_total_bet, losers_total_bet, winners_referer_address);

        // we have to return the funds of these fighters
        // we have to return the funds of the betters
        let betsData = await BetDB.getAllBetsForFighId(fight_id);
        let arr = []
        for (let i = 0; i < betsData.length; i++) {
          if (winner === betsData[i].user_wallet_address || loser === betsData[i].user_wallet_address) {
            continue
          }
          arr.push(WALLET_DB.updateUsersWeb2Balance(betsData[i].user_wallet_address, betsData[i].bet_amount));
        }
        await Promise.all(arr);
      }
    } catch (err) {
      ANAKIN_LOGGER.error({
        function: "ExitFightQueue",
        error: err,
      })
      throw err;
    }
  }

  public static async FightEntryCreate(user_wallet_address: string, minted_id: string) {
    try {
      const wallet_data: WALLET_DB = await WALLET_DB.getWalletInfoOfUser(user_wallet_address);
      if (wallet_data.temp_bet_amount <= 0) {
        throw "NO TEMP BET AMOUNT OF THE PLAYER"
      }
      const fightEntry: FightsDB = await FightsDB.createFightEntryForUser(user_wallet_address);
      await BetDB.createBetEntryOfUser(user_wallet_address, fightEntry.fight_id, wallet_data.temp_bet_amount, user_wallet_address, 0);
      fightEntry.total_bet_p1 += 0;
      fightEntry.self_bet_p1 += wallet_data.temp_bet_amount;
      fightEntry.win_pot_p1 += wallet_data.temp_bet_amount;
      fightEntry.total_bet += 0;
      fightEntry.p1_minted_id = minted_id;
      // tracking
      let promises_activity_tracking = [];
      promises_activity_tracking.push(USER_ACTIVITY_TRACKING.addDataIntoUserActivityLog(user_wallet_address, `Create Fight_id for user.`, `Temp amount deducted temp balance. ${wallet_data.temp_bet_amount}`))
      wallet_data.temp_bet_amount = 0;

      await mapper.update(fightEntry);
      await mapper.update(wallet_data);
      await Promise.all(promises_activity_tracking);
      return fightEntry;
    } catch (err) {
      ANAKIN_LOGGER.error({
        function: "FightEntryCreate",
        error: err,
      })
      throw err;
    }
  }

  public static async FightEntryCreateAdmin(user_wallet_address: string, minted_id: string, amount: number) {
    try {
      const fightEntry: FightsDB = await FightsDB.createFightEntryForUser(user_wallet_address);
      await BetDB.createBetEntryOfUser(user_wallet_address, fightEntry.fight_id, amount, user_wallet_address, 0);
      fightEntry.total_bet_p1 += 0;
      fightEntry.self_bet_p1 += amount;
      fightEntry.win_pot_p1 += amount;
      fightEntry.total_bet += 0;
      fightEntry.p1_minted_id = minted_id;
      await mapper.update(fightEntry);
      // FightDao.FIGHT_FULL_INFO.set(fightEntry.fight_id, fightEntry);
      return fightEntry;
    } catch (err) {
      ANAKIN_LOGGER.error({
        function: "FightEntryCreate",
        error: err,
      })
      throw err;
    }
  }

  public static async FighQueuePooltExitV2(user_wallet_address: string) {
    try {
      let walletDb: WALLET_DB = await WALLET_DB.getWalletInfoOfUser(user_wallet_address);
      walletDb.web2_balance += walletDb.temp_bet_amount;
      walletDb.temp_bet_amount = 0
      await mapper.update(walletDb)
    } catch (err) {
      ANAKIN_LOGGER.error({
        function: "FighQueuePooltExitV2",
        error: err,
      })
      throw err;
    }
  }

  public static async FightEntryCreateV2(
    p1_address: string,
    p1_minted_id: string,
    p2_address: string,
    p2_minted_id: string
  ) {
    try {
      const p1_wallet_data: WALLET_DB = await WALLET_DB.getWalletInfoOfUser(p1_address);
      if (p1_wallet_data.temp_bet_amount <= 0) {
        throw "NO TEMP BET AMOUNT OF THE PLAYER1"
      }
      const p2_wallet_data: WALLET_DB = await WALLET_DB.getWalletInfoOfUser(p2_address);
      if (p2_wallet_data.temp_bet_amount <= 0) {
        throw "NO TEMP BET AMOUNT OF THE PLAYER2"
      }
      const fightEntry: FightsDB = await FightsDB.createFightEntryForUserV2(p1_address, p2_address);
      fightEntry.total_bet_p1 += 0;
      fightEntry.self_bet_p1 += p1_wallet_data.temp_bet_amount;
      fightEntry.win_pot_p1 += p1_wallet_data.temp_bet_amount;
      fightEntry.total_bet += 0;
      fightEntry.p1_minted_id = p1_minted_id;

      let residual_amount = 0
      if (fightEntry.self_bet_p1 < p2_wallet_data.temp_bet_amount) {
        console.log("-- 111111-- ",);
        fightEntry.self_bet_p2 += fightEntry.self_bet_p1;
        residual_amount = Math.abs(p2_wallet_data.temp_bet_amount - fightEntry.self_bet_p1);
        p2_wallet_data.web2_balance += residual_amount;
      }
      if (fightEntry.self_bet_p1 > p2_wallet_data.temp_bet_amount) {
        // if p1 bet is lesser then return money to p1
        fightEntry.self_bet_p2 += p2_wallet_data.temp_bet_amount;
        residual_amount = Math.abs(fightEntry.self_bet_p1 - p2_wallet_data.temp_bet_amount);
        fightEntry.self_bet_p1 -= residual_amount;
        p1_wallet_data.web2_balance += residual_amount;
        console.log("-- 22222-- ", fightEntry.self_bet_p2, residual_amount);
      }
      if (fightEntry.self_bet_p1 === p2_wallet_data.temp_bet_amount) {
        console.log("-- 333-- ",);
        fightEntry.self_bet_p2 = p2_wallet_data.temp_bet_amount;
      }
      await BetDB.createBetEntryOfUser(p1_address, fightEntry.fight_id, p1_wallet_data.temp_bet_amount, p1_address, 0);
      await BetDB.createBetEntryOfUser(p2_address, fightEntry.fight_id, p1_wallet_data.temp_bet_amount, p2_address, 0);

      p1_wallet_data.temp_bet_amount = 0;
      p2_wallet_data.temp_bet_amount = 0;

      fightEntry.win_pot_p2 = 2 * fightEntry.self_bet_p2;
      fightEntry.win_pot_p1 = 2 * fightEntry.self_bet_p1;
      fightEntry.total_bet += 0;
      fightEntry.player_count = 2;
      fightEntry.p2_minted_id = p2_minted_id;

      await mapper.update(p1_wallet_data);
      await mapper.update(p2_wallet_data);
      await mapper.update(fightEntry);
      // FightDao.FIGHT_FULL_INFO.set(fightEntry.fight_id, fightEntry);
      return fightEntry;
    } catch (err) {
      ANAKIN_LOGGER.error({
        function: "FightEntryCreate",
        error: err,
      })
      throw err;
    }
  }

  public static async FightEntryAddSecondPlayer(p1_wallet: string, p2_wallet: string, minted_id: string) {
    try {
      const wallet_data: WALLET_DB = await WALLET_DB.getWalletInfoOfUser(p2_wallet);
      const wallet_data_other_player: WALLET_DB = await WALLET_DB.getWalletInfoOfUser(p1_wallet);
      if (wallet_data.temp_bet_amount <= 0) {
        throw "NO TEMP BET AMOUNT OF THE PLAYER"
      }

      const fightEntries: Array<FightsDB> = await FightsDB.getFightEntriesForPlayer(p1_wallet);
      const fightEntry: FightsDB = fightEntries[0]
      console.log("-- fight entries -- ", fightEntry, wallet_data, wallet_data_other_player);
      fightEntry.player2 = p2_wallet;

      let promises_activity_tracking = [];
      promises_activity_tracking.push(USER_ACTIVITY_TRACKING.addDataIntoUserActivityLog(p2_wallet, `User Added as second player.`, `With ${p1_wallet} and fight_if ${fightEntry.fight_id}`))

      await BetDB.createBetEntryOfUser(p2_wallet, fightEntry.fight_id, wallet_data.temp_bet_amount, p2_wallet, 0);
      fightEntry.total_bet_p2 += 0;
      let residual_amount = 0
      if (fightEntry.self_bet_p1 < wallet_data.temp_bet_amount) {
        console.log("-- 111111-- ",);
        // if p1 bet was lesser 
        // then take less money from p2
        fightEntry.self_bet_p2 += fightEntry.self_bet_p1;
        residual_amount = Math.abs(wallet_data.temp_bet_amount - fightEntry.self_bet_p1);
        wallet_data.web2_balance += residual_amount;

        let wallet_log_msg = `Refund ${residual_amount} Bits.`
        promises_activity_tracking.push(WALLET_LOGS.addIntoWalletLogs(
          p2_wallet, residual_amount, WALLET_LOGS_GROUP.FIGHT_DIFF_RETURN, wallet_log_msg
        ));

        promises_activity_tracking.push(USER_ACTIVITY_TRACKING.addDataIntoUserActivityLog(p2_wallet, `Bets Info. P1 bet is lesser`, `p1 bet ${fightEntry.self_bet_p1} and p2 bet ${wallet_data.temp_bet_amount}`))
        promises_activity_tracking.push(USER_ACTIVITY_TRACKING.addDataIntoUserActivityLog(p2_wallet, `Funds transfer`, `Added residual amount of ${residual_amount} to main wallet.`))
      }
      else if (fightEntry.self_bet_p1 > wallet_data.temp_bet_amount) {
        // if p1 bet is lesser 
        // then return money to p1
        fightEntry.self_bet_p2 += wallet_data.temp_bet_amount;
        residual_amount = Math.abs(fightEntry.self_bet_p1 - wallet_data.temp_bet_amount);
        fightEntry.self_bet_p1 -= residual_amount;
        wallet_data_other_player.web2_balance += residual_amount;
        console.log("-- 22222-- ", fightEntry.self_bet_p2, residual_amount);

        let wallet_log_msg = `Refund ${residual_amount} Bits.`
        promises_activity_tracking.push(WALLET_LOGS.addIntoWalletLogs(
          p1_wallet, residual_amount, WALLET_LOGS_GROUP.FIGHT_DIFF_RETURN, wallet_log_msg
        ));

        promises_activity_tracking.push(USER_ACTIVITY_TRACKING.addDataIntoUserActivityLog(p1_wallet, `Funds transfer`, `Added residual amount of ${residual_amount} to main wallet.`))
        promises_activity_tracking.push(USER_ACTIVITY_TRACKING.addDataIntoUserActivityLog(p2_wallet, `Bets Info. P1 bet is more`, `p1 bet ${fightEntry.self_bet_p1} and p2 bet ${wallet_data.temp_bet_amount}`))
      }
      else if (fightEntry.self_bet_p1 === wallet_data.temp_bet_amount) {
        console.log("-- 333-- ",);
        fightEntry.self_bet_p2 = wallet_data.temp_bet_amount;
        promises_activity_tracking.push(USER_ACTIVITY_TRACKING.addDataIntoUserActivityLog(p2_wallet, `Bets Info. P1 bet is equal.`, `p1 bet ${fightEntry.self_bet_p1} and p2 bet ${wallet_data.temp_bet_amount}`))
      }
      // fightEntry.win_pot_p2 = 2*fightEntry.self_bet_p2;
      // fightEntry.win_pot_p1 = 2*fightEntry.self_bet_p1;
      // fightEntry.total_bet += 0;
      fightEntry.player_count = 2;
      fightEntry.p2_minted_id = minted_id;
      wallet_data.temp_bet_amount = 0;
      await mapper.update(wallet_data);
      await mapper.update(fightEntry);
      await mapper.update(wallet_data_other_player);
      await Promise.all(promises_activity_tracking);
      // FightDao.FIGHT_FULL_INFO.set(fightEntry.fight_id, fightEntry);
      return fightEntry;
    } catch (err) {
      ANAKIN_LOGGER.error({
        function: "FightEntryAddSecondPlayer",
        error: err,
      })
      throw err;
    }
  }

  public static async FightEntryAddSecondPlayerAdmin(p1_wallet: string, p2_wallet: string, minted_id: string, amount: number) {
    try {
      const wallet_data: WALLET_DB = await WALLET_DB.getWalletInfoOfUser(p2_wallet);
      const wallet_data_other_player: WALLET_DB = await WALLET_DB.getWalletInfoOfUser(p1_wallet);
      const fightEntries: Array<FightsDB> = await FightsDB.getFightEntriesForPlayer(p1_wallet);
      const fightEntry: FightsDB = fightEntries[0]
      console.log("-- fight entries -- ", fightEntry, wallet_data_other_player);
      fightEntry.player2 = p2_wallet;
      await BetDB.createBetEntryOfUser(p2_wallet, fightEntry.fight_id, amount, p2_wallet, 0);
      fightEntry.total_bet_p2 += 0;
      let residual_amount = 0
      if (fightEntry.self_bet_p1 < amount) {
        fightEntry.self_bet_p2 += fightEntry.self_bet_p1;
        residual_amount = Math.abs(amount - fightEntry.self_bet_p1);
        wallet_data.web2_balance += residual_amount;
      }
      if (fightEntry.self_bet_p1 > amount) {
        fightEntry.self_bet_p2 += amount;
        residual_amount = Math.abs(fightEntry.self_bet_p1 - amount);
        fightEntry.self_bet_p1 -= residual_amount;
        wallet_data_other_player.web2_balance += residual_amount;
      }
      if (fightEntry.self_bet_p1 === amount) {
        fightEntry.self_bet_p2 = amount;
      }
      fightEntry.win_pot_p2 = 2 * fightEntry.self_bet_p2;
      fightEntry.win_pot_p1 = 2 * fightEntry.self_bet_p1;
      fightEntry.total_bet += 0;
      fightEntry.player_count = 2;
      fightEntry.p2_minted_id = minted_id;
      wallet_data.temp_bet_amount = 0;
      await mapper.update(wallet_data);
      await mapper.update(fightEntry);
      await mapper.update(wallet_data_other_player);
      // FightDao.FIGHT_FULL_INFO.set(fightEntry.fight_id, fightEntry);
      return fightEntry;
    } catch (err) {
      ANAKIN_LOGGER.error({
        function: "FightEntryAddSecondPlayer",
        error: err,
      })
      throw err;
    }
  }

  public static async BetIntoOthersFight(
    user_wallet_address: string,
    fight_id: string,
    player_betting_on: string,
    amount: string,
    tipPercent: number
  ) {
    console.log("in BetIntoOthersFight ", user_wallet_address, fight_id, player_betting_on, amount, tipPercent)
    try {
      const wallet_data: WALLET_DB = await WALLET_DB.getWalletInfoOfUser(user_wallet_address);
      if (wallet_data.web2_balance <= BigNumber(amount).toNumber()) {
        throw "NOT ENOUGH AMOUNT"
      }
      console.log("in BetIntoOthersFight 1")
      let fight_entry_data = await FightsDB.getFightEntry(fight_id);
      if (fight_entry_data.fight_state >= FightStates.STARTED) {
        throw "Not ALLOWED TO BET: Since Fight Started"
      }
      if (fight_entry_data.player1 === user_wallet_address || fight_entry_data.player2 === user_wallet_address) {
        throw "NOT ALLOWED TO BET IN YOUR FIGHT"
      }
      const betData = await BetDB.getBetEntryOfUser(user_wallet_address, fight_id);
      if (!isNullOrUndefined(betData)) {
        throw "You have Already Bet on this Fight"
      }
      if (fight_entry_data.player1 === player_betting_on) {
        fight_entry_data.total_rough_bet_p1 += BigNumber(amount).toNumber();
        // fight_entry_data.win_pot_p1 += (tipPercent/100) * BigNumber(amount).toNumber()
        // fight_entry_data.total_tip_p1 += (tipPercent/100) * BigNumber(amount).toNumber()
      } else {
        fight_entry_data.total_rough_bet_p2 += BigNumber(amount).toNumber();
        // fight_entry_data.win_pot_p2 += (tipPercent/100) * BigNumber(amount).toNumber()
        // fight_entry_data.total_tip_p2 += (tipPercent/100) * BigNumber(amount).toNumber()
      }
      // console.log("in BetIntoOthersFight 2")
      // fight_entry_data.total_bet += BigNumber(amount).toNumber();
      wallet_data.web2_balance -= BigNumber(amount).toNumber();

      await mapper.update(wallet_data);
      await mapper.update(fight_entry_data);
      // FightDao.FIGHT_FULL_INFO.set(fight_entry_data.fight_id, fight_entry_data);
      await BetDB.createBetEntryOfUser(
        user_wallet_address,
        fight_id,
        BigNumber(amount).toNumber(),
        player_betting_on,
        tipPercent,
      );
      await this.DeleteFightKeyInRedis(fight_id);

      let wallet_log_msg = `Refund ${Math.floor(BigNumber(amount).toNumber() / 100)} Bits.`
      let promises_activity_tracking = [];
      promises_activity_tracking.push(WALLET_LOGS.addIntoWalletLogs(
        user_wallet_address, Math.floor(BigNumber(amount).toNumber() / 100), WALLET_LOGS_GROUP.FIGHT_BET, wallet_log_msg
      ));
      await Promise.all(promises_activity_tracking)


      // console.log("in BetIntoOthersFight 5")
    } catch (err) {
      ANAKIN_LOGGER.error({
        function: "BetIntoOthersFight",
        error: err,
      })
      throw err;
    }
  }

  public static async FightResultUpdate(fight_id: string, p1_end_health: number, p2_end_health: number) {
    try {
      let fight_entry_data = await FightsDB.getFightEntry(fight_id);
      fight_entry_data.player1_end_health = p1_end_health;
      fight_entry_data.player2_end_health = p2_end_health;
      fight_entry_data.fight_state = FightStates.ENDED;
      await mapper.update(fight_entry_data);
      // FightDao.FIGHT_FULL_INFO.set(fight_entry_data.fight_id, fight_entry_data);
    } catch (err) {
      ANAKIN_LOGGER.error({
        event: "FightResultUpdate",
        error: err
      });
      throw err;
    }
  }

  // public static async FightEnds(fight_id: string) {
  //   try {
  //     let fight_entry_data: FightsDB = await FightsDB.getFightEntry(fight_id);
  //     let winner = "";
  //     let loser = "";
  //     let draw = false;
  //     let winners_total_bet = 0;
  //     let losers_total_bet = 0;
  //     let winners_win_pot = 0;

  //     let winners_referer_address = "";
  //     if (fight_entry_data.player1_end_health > fight_entry_data.player2_end_health) {
  //       winner = fight_entry_data.player1;
  //       loser = fight_entry_data.player2;
  //       winners_total_bet = fight_entry_data.total_bet_p1;
  //       winners_win_pot = fight_entry_data.win_pot_p1;

  //       losers_total_bet = fight_entry_data.total_bet_p2;

  //       // fetch referer address
  //       winners_referer_address = await Web3Dao.fetchRefererAddress(fight_entry_data.player1, fight_entry_data.p1_minted_id);
  //     }
  //     if (fight_entry_data.player1_end_health < fight_entry_data.player2_end_health) {
  //       winner = fight_entry_data.player2;
  //       loser = fight_entry_data.player1;
  //       winners_total_bet = fight_entry_data.total_bet_p2;
  //       winners_win_pot = fight_entry_data.win_pot_p2;

  //       losers_total_bet = fight_entry_data.total_bet_p1;
  //       winners_referer_address = await Web3Dao.fetchRefererAddress(fight_entry_data.player2, fight_entry_data.p2_minted_id);
  //     }

  //     console.log("-------------here-----------------------------")
  //     console.log(fight_id, winner, loser, winners_total_bet, losers_total_bet, winners_referer_address);
  //     console.log("------------------------------------------")

  //     await FightDao.FightEndMoneyCirculationLogic(fight_id, winner, loser, fight_entry_data, draw, winners_total_bet, losers_total_bet, winners_referer_address);
  //     await FightDao.AddIntoStats(winner, loser, fight_entry_data);
  //     return fight_entry_data;
  //   } catch (err) {
  //     ANAKIN_LOGGER.error({
  //       event: "FightEnds",
  //       error: err
  //     });
  //     throw err;
  //   }
  // }

  public static async AddIntoStats(
    winner: string,
    loser: string,
    fight_entry_data: FightsDB,
    winner_name: string,
    loser_name: string,
  ) {
    // console.log("***** in AddIntoStats --- ", winner)
    let winner_data = await STATS_DB.getItem(winner);
    // console.log("***** in AddIntoStats --- ", winner_data)
    if (isNullOrUndefined(winner_data)) {
      winner_data = await STATS_DB.addUserToStatsTable(winner)
    }
    // console.log("***** in AddIntoStats --- ", winner_data)
    winner_data.fights_count += 1
    winner_data.wins_count += 1
    winner_data.totalMoneyBet += fight_entry_data.self_bet_p1;
    winner_data.totalMoneyWon += fight_entry_data.self_bet_p1;
    winner_data.player_alias = winner_name;

    let loser_data = await STATS_DB.getItem(loser);
    if (isNullOrUndefined(loser_data)) {
      loser_data = await STATS_DB.addUserToStatsTable(loser)
    }
    // console.log("***** in AddIntoStats --- ", loser_data)

    loser_data.fights_count += 1
    loser_data.loss_count += 1
    loser_data.totalMoneyBet += fight_entry_data.self_bet_p1;
    loser_data.totalMoneyLost += fight_entry_data.self_bet_p1;
    loser_data.player_alias = loser_name;

    await mapper.update(loser_data)
    await mapper.update(winner_data)

    // await Promise.all([
    //   mapper.update(loser_data), mapper.update(winner_data)
    // ])
    return
  }

  public static async AddIntoWeeklyStats(
    winner: string,
    loser: string,
    fight_entry_data: FightsDB,
    winner_name: string,
    loser_name: string,
  ) {
    let winner_data = await WEEKLY_STATS.getItem(winner);
    if (isNullOrUndefined(winner_data)) {
      winner_data = await WEEKLY_STATS.addUserToStatsTable(winner)
    }
    winner_data.fights_count += 1
    winner_data.wins_count += 1
    winner_data.totalMoneyBet += fight_entry_data.self_bet_p1;
    winner_data.totalMoneyWon += fight_entry_data.self_bet_p1;
    winner_data.player_alias = winner_name;

    let loser_data = await WEEKLY_STATS.getItem(loser);
    if (isNullOrUndefined(loser_data)) {
      loser_data = await WEEKLY_STATS.addUserToStatsTable(loser)
    }

    loser_data.fights_count += 1
    loser_data.loss_count += 1
    loser_data.totalMoneyBet += fight_entry_data.self_bet_p1;
    loser_data.totalMoneyLost += fight_entry_data.self_bet_p1;
    loser_data.player_alias = loser_name;

    await mapper.update(loser_data)
    await mapper.update(winner_data)

    // await Promise.all([
    //   mapper.update(loser_data), mapper.update(winner_data)
    // ])
    return
  }

  // public static async FightEndMoneyCirculationLogic(
  //   fight_id: string,
  //   winner: string,
  //   loser: string,
  //   fight_entry_data: FightsDB,
  //   draw: boolean,
  //   _winners_total_bet: number,
  //   _losers_total_bet: number,
  //   _winners_referer: string,
  // ) {

  //   let betsData: Array<BetDB> = [];
  //   let winnerBettersShares: Map<string, number> = new Map();
  //   let winnerTipShares: Map<string, number> = new Map();
  //   let winnerBettersEarning: Map<string, number> = new Map();

  //   let losersBetterShares: Map<string, number> = new Map();
  //   if (!draw) {

  //     let total_money_betters = fight_entry_data.total_bet
  //     let final_total_bet = 0;
  //     let least_total_bet_in_players = 0;
  //     let residula_bet = 0;
  //     let return_to_side = "";
  //     console.log(" winers betters side and losers betters side ", _winners_total_bet, _losers_total_bet)
  //     if (_winners_total_bet < _losers_total_bet) {
  //       console.log(" gonig here ")
  //       final_total_bet = 2 * _winners_total_bet;
  //       least_total_bet_in_players = _winners_total_bet;
  //       residula_bet = Math.abs(_winners_total_bet - _losers_total_bet);
  //       return_to_side = "loser";
  //     }
  //     if (_winners_total_bet > _losers_total_bet) {
  //       console.log(" gonig here 2222")
  //       final_total_bet = 2 * _losers_total_bet;
  //       least_total_bet_in_players = _losers_total_bet;
  //       residula_bet = Math.abs(_losers_total_bet - _winners_total_bet);
  //       return_to_side = "winner";
  //     }
  //     console.log(" winers betters side and losers betters side 2 ", final_total_bet, least_total_bet_in_players, fight_entry_data)
  //     // first give the money tow winner along with the tips
  //     let promises_activity_tracking = [];
  //     if (winner === fight_entry_data.player1) {
  //       let tempWinnersAmt = await FightDao.circulateMoneyInSystemWallets(fight_entry_data.win_pot_p1, _winners_referer);
  //       await WALLET_DB.updateUsersWeb2Balance(winner, tempWinnersAmt);

  //       promises_activity_tracking.push(USER_ACTIVITY_TRACKING.addDataIntoUserActivityLog(
  //         winner,
  //         `Fight Result: Winner P1. Fund Transfer`,
  //         `Amount: ${tempWinnersAmt}`,
  //       ))

  //     }
  //     if (winner === fight_entry_data.player2) {
  //       let tempWinnersAmt = await FightDao.circulateMoneyInSystemWallets(fight_entry_data.win_pot_p2, _winners_referer)
  //       await WALLET_DB.updateUsersWeb2Balance(winner, tempWinnersAmt);
  //       promises_activity_tracking.push(USER_ACTIVITY_TRACKING.addDataIntoUserActivityLog(
  //         winner,
  //         `Fight Result: Winner P2. Fund Transfer`,
  //         `Amount: ${tempWinnersAmt}`,
  //       ))
  //     }
  //     console.log(" before distributing in system wallets ", total_money_betters, final_total_bet, residula_bet, return_to_side)

  //     // reduce the winning amount to circulate
  //     if (winner === fight_entry_data.player1) {
  //       final_total_bet -= (fight_entry_data.total_tip_p1)
  //     }
  //     if (winner === fight_entry_data.player2) {
  //       final_total_bet -= (fight_entry_data.total_tip_p2)
  //     }
  //     if (final_total_bet <= 0) {
  //       final_total_bet = 0
  //     }

  //     // final_total_bet += residual_pot_after_deducting_from_winner;

  //     // final_total_bet = 2 * final_total_bet;
  //     console.log(" before distributing in system wallets 2 ", total_money_betters, final_total_bet, residula_bet, return_to_side)
  //     let newFightPotMoney = await FightDao.circulateMoneyInSystemWallets(final_total_bet, _winners_referer)
  //     console.log(" after distributing in system wallets ", newFightPotMoney)
  //     betsData = await BetDB.getAllBetsForFighId(fight_id);
  //     // console.log(" see all bets ", betsData);
  //     for (let i = 0; i < betsData.length; i++) {
  //       if (winner === betsData[i].user_wallet_address || loser === betsData[i].user_wallet_address) {
  //         continue
  //       }
  //       if (winner === betsData[i].player_bet_on) {
  //         winnerBettersShares.set(betsData[i].user_wallet_address, betsData[i].bet_amount / _winners_total_bet);
  //         winnerTipShares.set(betsData[i].user_wallet_address, betsData[i].tip_percent)
  //       }
  //       if (loser === betsData[i].player_bet_on) {
  //         losersBetterShares.set(betsData[i].user_wallet_address, betsData[i].bet_amount / _losers_total_bet);
  //       }
  //     }

  //     console.log(" winner betters shares --- ", winnerBettersShares, _winners_total_bet, return_to_side)
  //     console.log(" loser betters shares --- ", losersBetterShares, _losers_total_bet, return_to_side)
  //     console.log("---**--", winner, fight_entry_data.player1, fight_entry_data.player2)

  //     // distribute total bet to user earning.. 
  //     let tempArrKeys = Array.from(winnerBettersShares.keys());
  //     // let winnerTipsEarning = 0
  //     for (let i = 0; i < tempArrKeys.length; i++) {
  //       let tempEarning = Math.floor(newFightPotMoney * winnerBettersShares.get(tempArrKeys[i]));
  //       winnerBettersEarning.set(tempArrKeys[i], tempEarning);
  //     }
  //     console.log(" winner betters earning --- ", winnerBettersEarning)

  //     // update db of their updated balance
  //     let tempArrKeys1 = Array.from(winnerBettersEarning.keys());
  //     for (let i = 0; i < tempArrKeys1.length; i++) {
  //       let profitBalance = winnerBettersEarning.get(tempArrKeys1[i]);
  //       console.log(" giving to winner --- ", tempArrKeys1[i], profitBalance)
  //       await WALLET_DB.updateUsersWeb2Balance(tempArrKeys1[i], profitBalance);
  //     }

  //     if (return_to_side === "winner") {
  //       let tempArrKeys2 = Array.from(winnerBettersEarning.keys());
  //       for (let i = 0; i < tempArrKeys2.length; i++) {
  //         let temp = residula_bet * winnerBettersShares.get(tempArrKeys2[i]);
  //         console.log(" returning to winner side --- ", tempArrKeys2[i], temp)
  //         await WALLET_DB.updateUsersWeb2Balance(tempArrKeys2[i], temp);
  //       }
  //     }

  //     if (return_to_side === "loser") {
  //       let tempArrKeys2 = Array.from(losersBetterShares.keys());
  //       for (let i = 0; i < tempArrKeys2.length; i++) {
  //         let temp = residula_bet * losersBetterShares.get(tempArrKeys2[i]);
  //         console.log(" returning to loser side --- ", tempArrKeys2[i], temp)
  //         await WALLET_DB.updateUsersWeb2Balance(tempArrKeys2[i], temp);
  //       }
  //     }

  //     await Promise.all(promises_activity_tracking)
  //   }
  // }

  public static async circulateMoneyInSystemWallets(winners_total_bet: number, _winners_referer: string) {
    // pay to bldg owner
    // pay to gang leader
    // pay to system
    // pay to treasury
    // pay to prize pool
    // pay to jackpot

    console.log("in circulate money --- ", winners_total_bet, _winners_referer, Math.round((2 / 100) * winners_total_bet))

    if (winners_total_bet === 0) {
      return 0
    }

    // if bldg is hq -> pay to system wallet
    let bldgShare = Math.round((2 / 100) * winners_total_bet)
    await SYSTEM_WALLET_DB.updateWeb2Balance(SYSTEM_WALLETS.System, bldgShare);


    let gangLeaderShare = Math.round((2 / 100) * winners_total_bet)
    if (_winners_referer === SYSTEM_WALLETS.System) {
      await SYSTEM_WALLET_DB.updateWeb2Balance(SYSTEM_WALLETS.System, gangLeaderShare);
    } else {
      await WALLET_DB.updateUsersWeb2Balance(_winners_referer, gangLeaderShare);
      let promises_activity_tracking = [];
      let wallet_log_msg = `Won ${Math.floor(gangLeaderShare / 100)} Gang`
      promises_activity_tracking.push(WALLET_LOGS.addIntoWalletLogs(
        _winners_referer, Math.floor(gangLeaderShare / 100), WALLET_LOGS_GROUP.GANG, wallet_log_msg
      ));
      await Promise.all(promises_activity_tracking)
    }



    let systemShare = Math.round((2 / 100) * winners_total_bet);
    await SYSTEM_WALLET_DB.updateWeb2Balance(SYSTEM_WALLETS.System, systemShare);


    let treasuryShare = Math.round((2 / 100) * winners_total_bet)
    await SYSTEM_WALLET_DB.updateWeb2Balance(SYSTEM_WALLETS.Treasury, treasuryShare);


    let ppShare = Math.round((1 / 100) * winners_total_bet)
    await SYSTEM_WALLET_DB.updateWeb2Balance(SYSTEM_WALLETS.PrizePool5, ppShare);


    let jpShare = Math.round((1 / 100) * winners_total_bet)
    await SYSTEM_WALLET_DB.updateWeb2Balance(SYSTEM_WALLETS.JackPot5, jpShare);

    winners_total_bet -= jpShare;
    winners_total_bet -= bldgShare;
    winners_total_bet -= gangLeaderShare;
    winners_total_bet -= systemShare;
    winners_total_bet -= treasuryShare;
    winners_total_bet -= ppShare;


    return Math.floor(winners_total_bet);
  }

  public static async FightStateUpdate(fight_id: string, state: FightStates) {
    try {
      let fight_entry_data = await FightsDB.getFightEntry(fight_id);
      fight_entry_data.fight_state = FightStates.STARTED;
      await mapper.update(fight_entry_data);
      // FightDao.FIGHT_FULL_INFO.set(fight_entry_data.fight_id, fight_entry_data);
      this.FightStartMoneyCirculationLogic(fight_id);
    } catch (err) {
      ANAKIN_LOGGER.error({
        event: "FightResultUpdate",
        error: err
      });
      throw err;
    }
  }

  public static async FightStartMoneyCirculationLogic(fight_id: string) {
    let betsData: Array<BetDB> = await BetDB.getAllBetsForFighId(fight_id);
    let fight_entry_data: FightsDB = await FightsDB.getFightEntry(fight_id);
    // console.log("betsdata -- ", betsData)
    // let player1BettersShares: Map<string, number> = new Map();
    // let player2BetterShares: Map<string, number> = new Map();
    let player1TotalBet = 0;
    let player2TotalBet = 0;
    let returnAmount = 0;
    let returnTo = "";
    let p1TipAmount = 0;
    let p2TipAmount = 0;

    for (let i = 0; i < betsData.length; i++) {
      if (fight_entry_data.player1 === betsData[i].user_wallet_address || fight_entry_data.player2 === betsData[i].user_wallet_address) {
        continue
      }
      if (fight_entry_data.player1 === betsData[i].player_bet_on) {
        player1TotalBet += betsData[i].bet_amount;
      }
      if (fight_entry_data.player2 === betsData[i].player_bet_on) {
        player2TotalBet += betsData[i].bet_amount;
      }
    }

    returnAmount = player1TotalBet - player2TotalBet;
    if (returnAmount > 0) {
      returnTo = "p1_side";
    } else if (returnAmount < 0) {
      returnTo = "p2_side";
    }
    returnAmount = Math.abs(returnAmount);

    ANAKIN_LOGGER.info({
      function: "FightStartMoneyCirculationLogic",
      player1TotalBet,
      player2TotalBet,
      returnAmount,
      returnTo,
    });

    for (let i = 0; i < betsData.length; i++) {
      if (fight_entry_data.player1 === betsData[i].user_wallet_address || fight_entry_data.player2 === betsData[i].user_wallet_address) {
        continue
      }
      if (fight_entry_data.player1 === betsData[i].player_bet_on) {
        let returnAmtForBetter = 0;
        if (returnTo === "p1_side") {
          returnAmtForBetter = Math.floor(returnAmount * betsData[i].bet_amount / player1TotalBet);
          console.log("return to p1 side in FightStartMoneyCirculationLogic ", returnAmtForBetter)
          await WALLET_DB.updateUsersWeb2Balance(betsData[i].user_wallet_address, returnAmtForBetter)
        }
        betsData[i].final_bet_amount = Math.floor(betsData[i].bet_amount - returnAmtForBetter);
        p1TipAmount += Math.floor(betsData[i].final_bet_amount * betsData[i].tip_percent / 100);
      }
      if (fight_entry_data.player2 === betsData[i].player_bet_on) {
        let returnAmtForBetter = 0;
        if (returnTo === "p2_side") {
          returnAmtForBetter = Math.floor(returnAmount * betsData[i].bet_amount / player2TotalBet);
          console.log("return to p2 side in FightStartMoneyCirculationLogic ", returnAmtForBetter)
          await WALLET_DB.updateUsersWeb2Balance(betsData[i].user_wallet_address, returnAmtForBetter)
        }
        betsData[i].final_bet_amount = Math.floor(betsData[i].bet_amount - returnAmtForBetter);
        p2TipAmount += Math.floor(betsData[i].final_bet_amount * betsData[i].tip_percent / 100);
      }
      await mapper.update(betsData[i]);
    }
    if (returnTo === "p1_side") {
      fight_entry_data.total_bet_p1 = player1TotalBet - returnAmount;
      fight_entry_data.total_bet_p2 = player2TotalBet;
    } else if (returnTo === "p2_side") {
      fight_entry_data.total_bet_p2 = player2TotalBet - returnAmount;
      fight_entry_data.total_bet_p1 = player1TotalBet;
    } else {
      fight_entry_data.total_bet_p2 = player2TotalBet;
      fight_entry_data.total_bet_p1 = player1TotalBet;
    }
    fight_entry_data.total_tip_p1 = p1TipAmount;
    fight_entry_data.total_tip_p2 = p2TipAmount;

    fight_entry_data.win_pot_p1 = 2 * fight_entry_data.self_bet_p1 + fight_entry_data.total_tip_p1;
    fight_entry_data.win_pot_p2 = 2 * fight_entry_data.self_bet_p2 + fight_entry_data.total_tip_p2;

    ANAKIN_LOGGER.info({
      function: "FightStartMoneyCirculationLogic",
      fight_entry_data
    });
    await mapper.update(fight_entry_data);
    await this.DeleteFightKeyInRedis(fight_id);
  }

  public static async FightEndsV2(fight_id: string) {
    let fight_entry_data: FightsDB = await FightsDB.getFightEntry(fight_id);
    console.log(" ------------- in FightEndsV2 ---------- fight entry data ----------- ", fight_entry_data)

    let winner = "";
    let loser = "";
    let winners_referer_address = "";
    let winners_total_bet = 0;

    if (fight_entry_data.player1_end_health > fight_entry_data.player2_end_health) {
      winner = fight_entry_data.player1;
      loser = fight_entry_data.player2;
      winners_total_bet = fight_entry_data.total_bet_p1;
      winners_referer_address = await Web3Dao.fetchRefererAddress(fight_entry_data.player1, fight_entry_data.p1_minted_id);
    } else if (fight_entry_data.player1_end_health < fight_entry_data.player2_end_health) {
      winner = fight_entry_data.player2;
      loser = fight_entry_data.player1;
      winners_total_bet = fight_entry_data.total_bet_p2;
      winners_referer_address = await Web3Dao.fetchRefererAddress(fight_entry_data.player2, fight_entry_data.p2_minted_id);
    } else {
      ANAKIN_LOGGER.info({
        function: "FightEndsV2",
        event: "RESULT_DRAW",
      });
      return
    }

    console.log(" ------------- in FightEndsV2 ----------winner refer address----------- ", winners_referer_address)

    let tempAmt = await FightDao.circulateMoneyInSystemWallets(
      fight_entry_data.self_bet_p1 + fight_entry_data.self_bet_p2,
      winners_referer_address
    );
    await WALLET_DB.updateUsersWeb2Balance(winner, tempAmt);

    let promises_activity_tracking = [];

    let wallet_log_msg = `Won ${Math.floor(tempAmt / 100)} Bits in Fight`
    promises_activity_tracking.push(WALLET_LOGS.addIntoWalletLogs(
      winner, Math.floor(tempAmt / 100), WALLET_LOGS_GROUP.FIGHT_WIN, wallet_log_msg
    ));



    // now move to betters
    let tempAmt1 = await FightDao.circulateMoneyInSystemWallets(
      fight_entry_data.total_bet_p1 + fight_entry_data.total_bet_p2,
      winners_referer_address
    );
    console.log(" ------------- in FightEndsV2 ----------after distribution of total bets---------- ", tempAmt1)

    let betsData: Array<BetDB> = await BetDB.getAllBetsForFighId(fight_id);
    let total_tip_to_winner = 0;
    for (let i = 0; i < betsData.length; i++) {
      if (fight_entry_data.player1 === betsData[i].user_wallet_address || fight_entry_data.player2 === betsData[i].user_wallet_address) {
        continue
      }
      if (winner === betsData[i].player_bet_on) {
        let tip_to_winner = Math.floor(betsData[i].final_bet_amount * betsData[i].tip_percent / 100);
        total_tip_to_winner += tip_to_winner;
        let total_winning_of_better = tempAmt1 * betsData[i].final_bet_amount / winners_total_bet;
        let winning_after_tax_and_tip = Math.floor(total_winning_of_better - tip_to_winner);
        console.log("better i ", i, tip_to_winner, total_winning_of_better, winning_after_tax_and_tip)
        await WALLET_DB.updateUsersWeb2Balance(betsData[i].user_wallet_address, Math.floor(winning_after_tax_and_tip))

        let wallet_log_msg = `Won ${Math.floor(winning_after_tax_and_tip / 100)} Bits.`
        promises_activity_tracking.push(WALLET_LOGS.addIntoWalletLogs(
          betsData[i].user_wallet_address, Math.floor(winning_after_tax_and_tip / 100), WALLET_LOGS_GROUP.FIGHT_BET_WIN, wallet_log_msg
        ));
      }
    }
    await WALLET_DB.updateUsersWeb2Balance(winner, Math.floor(total_tip_to_winner));

    total_tip_to_winner = Math.floor(total_tip_to_winner / 100);
    wallet_log_msg = `Won ${total_tip_to_winner} Bits.`
    promises_activity_tracking.push(WALLET_LOGS.addIntoWalletLogs(
      winner, total_tip_to_winner, WALLET_LOGS_GROUP.FIGHT_BET_WIN, wallet_log_msg
    ));
    await Promise.all(promises_activity_tracking)

    let winners_name = ''
    let losers_name = ''
    if (winner === fight_entry_data.player1) {
      winners_name = await Web3Dao.fetchBitfighterAlias(winner, fight_entry_data.p1_minted_id)
      losers_name = await Web3Dao.fetchBitfighterAlias(loser, fight_entry_data.p2_minted_id)
    } else {
      losers_name = await Web3Dao.fetchBitfighterAlias(winner, fight_entry_data.p1_minted_id)
      winners_name = await Web3Dao.fetchBitfighterAlias(loser, fight_entry_data.p2_minted_id)
    }
    await FightDao.AddIntoStats(winner, loser, fight_entry_data, winners_name, losers_name);
    FightDao.AddIntoWeeklyStats(winner, loser, fight_entry_data, winners_name, losers_name);
  }

  static async FetchFightInfoFromRedis(fight_id: string) {
    const data = await RedClient.getOrSetThenGet(GetFightInfoRedisKey(fight_id),
      async () => {
        let fight_entry_data: FightsDB = await FightsDB.getFightEntry(fight_id);
        return JSON.stringify(fight_entry_data);
      },
      20
    );
    return JSON.parse(data);
  }

  static async DeleteFightKeyInRedis(fight_id: string) {
    try {
      await RedClient.deleteKey(GetFightInfoRedisKey(fight_id));
    } catch (err) {
      console.log("erorr in deleteing redis key.")
      return null
    }

  }

  static async FetchFightInfo(fight_id: string) {
    return this.FetchFightInfoFromRedis(fight_id);
  }

  public static async JackPotWinEvent(target_number: number, user_wallet_address: string, minted_id: number) {
    // get jackpot balance 
    try {
      const jackpotWaletInfo = await SYSTEM_WALLET_DB.getWalletInfoOfUser(SYSTEM_WALLETS.JackPot5);
      const bitfighters_info = await BITFIGHTER_NFT_SPECS.fetchParticularNftDetailOfUserV2(user_wallet_address, minted_id);
      const lucky_number = bitfighters_info.lucky_number;
      if (target_number !== lucky_number) {
        throw "TARGET NOT EQUAL TO LUCKY NUMBER"
      }
      let winners_referer_address = await Web3Dao.fetchRefererAddress(user_wallet_address, minted_id.toString());
      console.log(" ------------- in JackPotWinEvent --------------------- ", user_wallet_address, winners_referer_address, jackpotWaletInfo)

      // later remember to convert these to transactions
      let tempAmt = await FightDao.circulateMoneyInSystemWallets(
        jackpotWaletInfo.web2_balance,
        user_wallet_address
      );
      await WALLET_DB.updateUsersWeb2Balance(user_wallet_address, tempAmt);
      await SYSTEM_WALLET_DB.resetWeb2Balance(SYSTEM_WALLETS.JackPot5);
      await CONSTANTS_DB.updateConstantValue("JACKPOT_PROBABILITY_INFO", 0);
      let promises_activity_tracking = [];
      let wallet_log_msg = `Won ${Math.floor(tempAmt / 100)} Jackpot`
      promises_activity_tracking.push(WALLET_LOGS.addIntoWalletLogs(
        user_wallet_address, Math.floor(tempAmt / 100), WALLET_LOGS_GROUP.JACKPOT_WIN, wallet_log_msg
      ));
      await Promise.all(promises_activity_tracking);
      return jackpotWaletInfo.web2_balance;
    } catch (err) {
      console.log('error -------', err);
      throw err;
    }
  }
}