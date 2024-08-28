/* eslint no-unused-vars: 0 */
/* eslint camelcase: 0 */

import {
  table,
  hashKey,
  attribute,
} from "@aws/dynamodb-data-mapper-annotations";
import { makeTableName } from "@services/utils";
import { DB_CONFIG } from "@config/db_config";
import GlobalSecondaryIndex from "./global";
import { PerIndexOptions } from "@aws/dynamodb-data-mapper";
import { mapper } from "@services/db/connection";
import { ANAKIN_LOGGER } from "@services/logger";
import { isNullOrUndefined } from "util";
import { AcceptablePartners } from "@utils/asset_manager";

@table(makeTableName(DB_CONFIG.TABLES.BREW_PARTNER_WALLETS_DB))
export default class BREW_PARTNER_WALLETS_DB extends GlobalSecondaryIndex {
  @hashKey()
  partner_id: string;

  @attribute({ defaultProvider: () => 0 })
  web2_balance: number;

  @attribute({ defaultProvider: () => 0 })
  quantity: number;

  @attribute()
  last_quantity_sold: number;

  @attribute({ defaultProvider: () => new Date().getTime() })
  created_at: number;

  public static global_secondary_indices = {} as PerIndexOptions;

  public static async CreatePartnerWalletsIfNotExist() {
    await Promise.all(AcceptablePartners.map(partner_id => {
      BREW_PARTNER_WALLETS_DB.getWalletInfoOfPartner(partner_id)
    }))
  }

  public static async getWalletInfoOfPartner(
    partner_id: string,
  ) {
    try {
      const result = await mapper.get(
        Object.assign(new BREW_PARTNER_WALLETS_DB(), {
          partner_id,
        })
      );
      return result;
    } catch (err) {
      console.log("-----getWalletInfoOfPartner-----", err)
      if (err.name === 'ItemNotFoundException') {
        return await BREW_PARTNER_WALLETS_DB.createWallet(partner_id)
      }
    }
  }

  public static async getAllEntries() {
    try{
      const result = [];
      const params = AcceptablePartners.map(partner_id => Object.assign(new BREW_PARTNER_WALLETS_DB(),
        { partner_id }));

      for await (const partner_info of mapper.batchGet(params)) {
        result.push(partner_info);
      }

      return result;

      // const games = mapper.scan(BREW_PARTNER_WALLETS_DB);
      // const result: Array<BREW_PARTNER_WALLETS_DB> = [];
      // for await (const game of games) {
      //   result.push(game);
      // }
      // return result;
    } catch(err) {
      return [];
    }
  }

  public static async updatePartnerBalanceAndItemSold(
    partner_id: string,
    addBalance: number,
    quantity: number,
  ) {
    try {
      const result = await BREW_PARTNER_WALLETS_DB.getWalletInfoOfPartner(partner_id);
      // console.log("______________", result, addBalance, quantity)
      result.web2_balance += addBalance;
      result.quantity += quantity
      await mapper.update(result);
      return result;
    } catch (err) {
      ANAKIN_LOGGER.error({
        function: "updatePartnerBalanceAndItemSold",
        partner_id,
        addBalance,
        error: err
      });
      return null;
    }
  }

  public static async resetPartnerDbEntry(partner_id: string) {
    try {
      const result = await mapper.get(
        Object.assign(new BREW_PARTNER_WALLETS_DB(), {
          partner_id,
        })
      );
      result.web2_balance = 0;
      await mapper.update(result);
    } catch (err) {
      ANAKIN_LOGGER.error({
        function: "resetPartnerDbEntry",
        partner_id
      });
    }
  }

  public static async createWallet(
    partner_id: string,
  ) {
    try {
      const result = await mapper.put(
        Object.assign(new BREW_PARTNER_WALLETS_DB(), {
          partner_id,
          web2_balance: 0
        })
      );
      return result;
    } catch (err) {
      throw err;
    }
  }
}
