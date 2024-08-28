/* eslint no-unused-vars: 0 */
/* eslint camelcase: 0 */

import {
  table,
  hashKey,
  rangeKey,
  attribute,
} from "@aws/dynamodb-data-mapper-annotations";
import { makeTableName } from "@services/utils";
import { DB_CONFIG } from "@config/db_config";
import GlobalSecondaryIndex from "./global";
import { PerIndexOptions, SecondaryIndexOptions } from "@aws/dynamodb-data-mapper";
import { mapper } from "@services/db/connection";
import { WEB_3_CONFIG } from "@config/web3_config";
import { ANAKIN_LOGGER } from "@services/logger";
import { PARTNER_WALLETS, SYSTEM_WALLETS } from "@config/system_wallets";

@table(makeTableName(DB_CONFIG.TABLES.SYSTEM_WALLETS_DB))
export default class SYSTEM_WALLET_DB extends GlobalSecondaryIndex {
  @hashKey()
  wallet_name: string;

  @attribute()
  web2_balance: number;

  @attribute()
  wallet_category: string;

  @attribute({ defaultProvider: () => new Date().getTime() })
  created_at: number;

  @attribute({ defaultProvider: () => new Date().getTime() })
  updated_at: number;

  public static global_secondary_indices = {} as PerIndexOptions;

  static async  initateWallets() {
    // const wallet_names = [
    //   "Treasury",
    //   "PP1", "PP2", "PP3", "PP4", "PP5", "PP6",
    //   "JP1", "JP2", "JP3", "JP4", "JP5", "JP6",
    //   "system"
    // ]
    const keys = Object.keys(SYSTEM_WALLETS);
    for (let i = 0; i < keys.length; i++) {
      let create = false;
      try{
        await SYSTEM_WALLET_DB.getWalletInfoOfUser(SYSTEM_WALLETS[keys[i]])
      } catch(err) {
        if (err.name === "ItemNotFoundException") {
          create = true
        }
      }
      if (create) {
        await SYSTEM_WALLET_DB.createWallet(SYSTEM_WALLETS[keys[i]], "system_category")
      }
    }
  }

  static async  initatePartnerWallets() {
    // const keys = Object.keys(PARTNER_WALLETS);
    // for (let i = 0; i < keys.length; i++) {
    //   await SYSTEM_WALLET_DB.createWallet(PARTNER_WALLETS[keys[i]], "partner_category")
    // }
  }

  public static async getWalletInfoOfUser(
    wallet_name: string,
  ) {
    try {
      const result = await mapper.get(
        Object.assign(new SYSTEM_WALLET_DB(), {
          wallet_name,
        })
      );
      return result;
    } catch (err) {
      // return null
      throw err;
    }
  }

  public static async updateWeb2Balance(
    wallet_name: string,
    addBalance: number,
  ) {
    console.log("updating system web2 balance ", wallet_name, addBalance)
    try {
      const result = await mapper.get(
        Object.assign(new SYSTEM_WALLET_DB(), {
          wallet_name,
        })
      );
      result.web2_balance += addBalance;
      await mapper.update(result);
      // console.log("updated ", wallet_name, addBalance)
    } catch (err) {
      ANAKIN_LOGGER.error({
        function: "updateWeb2Balance",
        wallet_name,
        addBalance,
      });
    }
  }

  public static async resetWeb2Balance(wallet_name: string) {
    try {
      const result = await mapper.get(
        Object.assign(new SYSTEM_WALLET_DB(), {
          wallet_name,
        })
      );
      result.web2_balance = 0;
      await mapper.update(result);
    } catch (err) {
      ANAKIN_LOGGER.error({
        function: "resetWeb2Balance",
        wallet_name
      });
    }
  }

  public static async createWallet(
    wallet_name: string,
    wallet_category: string
  ) {
    try {
      const result = await mapper.put(
        Object.assign(new SYSTEM_WALLET_DB(), {
          wallet_name,
          web2_balance: 0,
          wallet_category
        })
      );
      return result;
    } catch (err) {
      throw err;
    }
  }
}
