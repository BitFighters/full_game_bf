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
import { PerIndexOptions, QueryIterator, SecondaryIndexOptions } from "@aws/dynamodb-data-mapper";
import { BLOCKED_USERS, FRIENDS, FRIEND_REQUEST_SENT, PENDING_FRIENDS_REQUESTS, USER_DETAILS_ERRORS } from "@utils/user_details";
import { mapper } from "@services/db/connection";
import USER_DETAILS from "./user_details";
import { ANAKIN_LOGGER } from "@services/logger";

@table(makeTableName(DB_CONFIG.TABLES.QUEUE_DB))
export default class QueueDB extends GlobalSecondaryIndex {
  @hashKey()
  user_wallet_address: string; // 

  @rangeKey()
  minted_id: number;

  @attribute()
  nick_name: string;

  @attribute()
  current_position: number;

  @attribute()
  profile_image: string;

  @attribute({ defaultProvider: () => new Date().getTime() })
  created_at: number;

  @attribute({ defaultProvider: () => new Date().getTime() })
  updated_at: number;

  public static global_secondary_indices = {
    moderator_mapper: {
      writeCapacityUnits: 5,
      readCapacityUnits: 5,
      type: "global",
      projection: "all",
    } as SecondaryIndexOptions,

    // "current-position-index": {
    //   writeCapacityUnits: 5,
    //   readCapacityUnits: 5,
    //   type: "global",
    //   projection: "all",
    // } as SecondaryIndexOptions,

  } as PerIndexOptions;

  public static async addUserToQueue(
    user_wallet_address: string,
    minted_id: string,
    nick_name: string,
    profile_image: string,
  ) {
    try {
      var result: Array<QueueDB> = []
      var queueEntries = mapper.scan(QueueDB);
      for await (const card of queueEntries) {
        result.push(card);
      }
      for (var i = 0; i< result.length; i++) {
        if (result[i].user_wallet_address === user_wallet_address && result[i].minted_id === parseInt(minted_id)) {
          ANAKIN_LOGGER.error("AddUserToQueue_ADDRESS_MATCH", {user_wallet_address, minted_id, nick_name})
          return
        }
      }
      return await mapper.put(Object.assign(new QueueDB(),
            { user_wallet_address, minted_id, current_position: result.length + 1 , nick_name, profile_image}));
    } catch (err) {
      throw err;
    }
  }

  public static async getItemFromQueue(
    user_wallet_address: string,
  ) {
    return await mapper.get(
      Object.assign(new QueueDB(), {
        user_wallet_address
      })
    );
  }

  public static async getItemsFromQueueForUserAddress(
    user_wallet_address: string,
  ) {
    var result = []
    try {
      const results: QueryIterator<QueueDB> = mapper.query({
        valueConstructor: QueueDB, 
        keyCondition: { user_wallet_address }
      });
      for await (const item of results) {
        result.push(item);
      }
      return result;
    } catch (err) {
      ANAKIN_LOGGER.err("getItemsFromQueueForUserAddress", err)
      return [];
    }
  }

  public static async deleteFromQueue(
    item: QueueDB
  ) {
    try {
      await mapper.delete(item)
    } catch (err) {
      ANAKIN_LOGGER.error("FAILED_TO_DELETE_FROM_QUEUE", {error: err})
      return 0;
    }
    return 1;
  }
}
