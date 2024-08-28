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

@table(makeTableName(DB_CONFIG.TABLES.WEEKLY_STATS_DB))
export default class WEEKLY_STATS extends GlobalSecondaryIndex {
  @hashKey()
  user_wallet_address: string;

  @attribute()
  timeSpent: number;

  @attribute({ defaultProvider: () => 0 })
  fights_count: number;

  @attribute({ defaultProvider: () => 0 })
  wins_count: number;

  @attribute({ defaultProvider: () => 0 })
  loss_count: number;

  @attribute({ defaultProvider: () => 0 })
  totalMoneyWon: number;

  @attribute({ defaultProvider: () => 0 })
  totalMoneyLost: number;

  @attribute({ defaultProvider: () => 0 })
  totalMoneyBet: number;

  @attribute()
  player_alias: string;

  @attribute({ defaultProvider: () => new Date() })
  created_at: Date;

  @attribute({ defaultProvider: () => new Date() })
  updated_at: Date;

  public static global_secondary_indices = {} as PerIndexOptions;

  public static async addUserToStatsTable(
    user_wallet_address: string
  ) {
    return await mapper.put(Object.assign(new WEEKLY_STATS(),
      { user_wallet_address }));
  }

  public static async getItem(
    user_wallet_address: string,
  ) {
    try {
      let result = await mapper.get(
        Object.assign(new WEEKLY_STATS(), {
          user_wallet_address
        })
      );
      return result;
    } catch (err) {
      return null;
    }
  }

  // public static async getAllItem() {
  //   return mapper.scan(WEEKLY_STATS);
  // }
}
