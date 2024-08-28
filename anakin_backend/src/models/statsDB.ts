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
import { BLOCKED_USERS, FRIENDS, FRIEND_REQUEST_SENT, PENDING_FRIENDS_REQUESTS, USER_DETAILS_ERRORS } from "@utils/user_details";
import { mapper } from "@services/db/connection";

@table(makeTableName(DB_CONFIG.TABLES.STATS_DB))
export default class STATS_DB extends GlobalSecondaryIndex {
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
    return await mapper.put(Object.assign(new STATS_DB(),
      { user_wallet_address }));
  }

  public static async getItem(
    user_wallet_address: string,
  ) {
    try {
      let result = await mapper.get(
        Object.assign(new STATS_DB(), {
          user_wallet_address
        })
      );
      return result;
    } catch (err) {
      return null;
    }
  }

  // public static async getAllItem() {
  //   return mapper.scan(STATS_DB);
  // }
}
