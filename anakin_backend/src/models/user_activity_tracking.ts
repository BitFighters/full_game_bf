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
import { PerIndexOptions, QueryOptions, SecondaryIndexOptions } from "@aws/dynamodb-data-mapper";
import { mapper } from "@services/db/connection";
import { ANAKIN_LOGGER } from "@services/logger";

@table(makeTableName(DB_CONFIG.TABLES.USER_ACTIVITY_TRACKING))
export default class USER_ACTIVITY_TRACKING extends GlobalSecondaryIndex {

  @hashKey()
  user_wallet_address: string;

  @rangeKey({ defaultProvider: () => new Date().getTime() })
  created_at: number;

  @attribute()
  group: string;

  @attribute()
  message: string;


  public static global_secondary_indices = {
    moderator_mapper: {
      writeCapacityUnits: 5,
      readCapacityUnits: 5,
      type: "global",
      projection: "all",
    } as SecondaryIndexOptions,
  } as PerIndexOptions;


  public static async addDataIntoUserActivityLog(user_wallet_address: string,  group: string, message: string) {
    try {
      await mapper.put(
        Object.assign(new USER_ACTIVITY_TRACKING(), {
          user_wallet_address,
          group,
          message
        })
      );
    } catch(err) {
      ANAKIN_LOGGER.error({
        function: "addDataIntoUserActivityLog",
        user_wallet_address,
        error: err
      });
    }
  }

  // public static async FetchWalletLogsOfUser(
  //   user_wallet_address: string,
  // ) {
  //   const queryOptions2: QueryOptions = {
  //     limit: 50,
  //     scanIndexForward: false,
  //   };
  //   let result: Array<WALLET_LOGS> = []
  //   try {
  //     const iterator2 = mapper.query(WALLET_LOGS, {user_wallet_address}, queryOptions2 );
  //     for await (const record of iterator2) {
  //       result.push(record)
  //     }
  //     return result;
  //   } catch (err) {
  //     throw err;
  //   }
  // }

}
