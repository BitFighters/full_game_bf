import { PARTNER_WALLETS, PARTNER_WALLETS_MAPPING_WEB3, SYSTEM_WALLETS, SYSTEM_WALLETS_MAPPING_TO_WEB3 } from "@config/system_wallets"
import { WEB_3_CONFIG } from "@config/web3_config";
import BREW_PARTNER_WALLETS_DB from "@models/partner_wallets";
import SYSTEM_WALLET_DB from "@models/system_wallets";
import { mapper } from "@services/db/connection";
import { SendWBTC_To_SYSTEM_WALLETS_WITH_GAMELOGIC } from "@services/web3/writer"



export class CronJobManager {
  static async  runCronJobForTranferMoneyToWallets() {
    console.log(
      "-------------", 
      SYSTEM_WALLETS_MAPPING_TO_WEB3.Treasury, 
      SYSTEM_WALLETS_MAPPING_TO_WEB3.System1, 
      SYSTEM_WALLETS_MAPPING_TO_WEB3.System2, 
      PARTNER_WALLETS_MAPPING_WEB3.DRIP,
      WEB_3_CONFIG.GAME_LOGIC_AND_BITFIGHTERS_OWNER
    )
    // return

    // treasury     
    try {
      let treasuryWalletData = await SYSTEM_WALLET_DB.getWalletInfoOfUser(SYSTEM_WALLETS.Treasury);
      await SendWBTC_To_SYSTEM_WALLETS_WITH_GAMELOGIC(SYSTEM_WALLETS_MAPPING_TO_WEB3.Treasury, treasuryWalletData.web2_balance);
      console.log("money transfferred to treasury..")
      await SYSTEM_WALLET_DB.resetWeb2Balance(SYSTEM_WALLETS.Treasury);
    } catch (err) {
      console.log("error in treasury settle --- ", err)
    }


    // system1 and system2    
    try {
      let systemWalletData = await SYSTEM_WALLET_DB.getWalletInfoOfUser(SYSTEM_WALLETS.System);
      await SendWBTC_To_SYSTEM_WALLETS_WITH_GAMELOGIC(SYSTEM_WALLETS_MAPPING_TO_WEB3.System1, Math.floor(systemWalletData.web2_balance/2));
      console.log("money transfferred to system1.")
      await SendWBTC_To_SYSTEM_WALLETS_WITH_GAMELOGIC(SYSTEM_WALLETS_MAPPING_TO_WEB3.System2, Math.floor(systemWalletData.web2_balance/2));
      console.log("money transfferred to system 2..")
      await SYSTEM_WALLET_DB.resetWeb2Balance(SYSTEM_WALLETS.System);
    } catch (err) {
      console.log("error in treasury settle --- ", err)
    }

    // partner - drip
    try {
      let dripWalletData = await SYSTEM_WALLET_DB.getWalletInfoOfUser(PARTNER_WALLETS.DRIP);
      await SendWBTC_To_SYSTEM_WALLETS_WITH_GAMELOGIC(PARTNER_WALLETS_MAPPING_WEB3.DRIP, Math.floor(dripWalletData.web2_balance));
      console.log("money transfferred to drip wallet..")
      await SYSTEM_WALLET_DB.resetWeb2Balance(PARTNER_WALLETS.DRIP);
    } catch (err) {
      console.log("error in treasury settle --- ", err)
    }
    
  }

  static async RankAllPartners() {
    let all_assets_info: Array<BREW_PARTNER_WALLETS_DB> = await BREW_PARTNER_WALLETS_DB.getAllEntries()
    for(let i=0; i < all_assets_info.length; i++) {
      let partner = all_assets_info[i];
      partner.last_quantity_sold = partner.quantity;
      partner.quantity = 0;
      await mapper.update(partner);
    }
  }
}