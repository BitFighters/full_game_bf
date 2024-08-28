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
import { FRIENDS_STATUS } from "@utils/friends";

@table(makeTableName(DB_CONFIG.TABLES.FRIENDS_DB))
export default class FRIENDS_DB extends GlobalSecondaryIndex {
  @hashKey()
  user_wallet_address: string; // this string will be user_wallet_address + ":" + mint_id

  @rangeKey()
  other_user_address: string; // this string will be user_wallet_address + ":" + mint_id

  @attribute()
  friends_status: FRIENDS_STATUS;

  @attribute()
  contract_address: string;

  @attribute({ defaultProvider: () => new Date() })
  created_at: Date;

  @attribute({ defaultProvider: () => new Date() })
  updated_at: Date;

  public static global_secondary_indices = {
    moderator_mapper: {
      writeCapacityUnits: 2,
      readCapacityUnits: 2,
      type: "global",
      projection: "all",
    } as SecondaryIndexOptions,

  } as PerIndexOptions;

  public static async addUserToTable(
    user_wallet_address: string,
    other_user_address: string,
    friends_status: FRIENDS_STATUS
  ) {
    return await mapper.put(Object.assign(new FRIENDS_DB(),
          { user_wallet_address, other_user_address, friends_status }));
  }

  public static async getItem(
    user_wallet_address: string,
    other_user_address: string,
  ) {
    try {
      let data = await mapper.get(
        Object.assign(new FRIENDS_DB(), {
          user_wallet_address,
          other_user_address,
        })
      );
      return data;
    } catch(err) {
      return null;
    }
  }

  public static async getAllFriendsForUser(user_wallet_address: string) {
    let result: Array<FRIENDS_DB> = [];
    try {
      let data = await mapper.query(FRIENDS_DB, {user_wallet_address});
      for await (const recipe of data) {
        result.push(recipe);
      }
      return result;
    } catch(err) {
      return null;
    }
  }
}
