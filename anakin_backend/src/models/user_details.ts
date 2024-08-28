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

@table(makeTableName(DB_CONFIG.TABLES.USER_DETAILS))
export default class USER_DETAILS extends GlobalSecondaryIndex {
  @hashKey()
  user_wallet_address: string;

  @attribute()
  login_count: number;

  @attribute({ defaultProvider: () => new Date() })
  created_at: Date;

  @attribute({ defaultProvider: () => new Date() })
  updated_at: Date;

  @attribute()
  metaMask_signed: boolean;

  @attribute()
  metamask_signature: string;

  @attribute()
  user_type: string;

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
    login_count: number
  ) {
    return await mapper.put(Object.assign(new USER_DETAILS(),
          { user_wallet_address, login_count }));
  }

  public static async getItem(
    user_wallet_address: string,
  ) {
    return await mapper.get(
      Object.assign(new USER_DETAILS(), {
        user_wallet_address
      })
    );
  }

  public static async getAllItem() {
    const data: Array<USER_DETAILS>= [];
    for await (const item of mapper.scan(USER_DETAILS)) {
      data.push(item);
    }
    return data;
    // return mapper.scan(USER_DETAILS);
  }
}
