/* eslint no-unused-vars: 0 */
/* eslint camelcase: 0 */

import {
  table,
  attribute,
  rangeKey,
  hashKey,
} from "@aws/dynamodb-data-mapper-annotations";
import { makeTableName } from "@services/utils";
import { DB_CONFIG } from "@config/db_config";
import GlobalSecondaryIndex from "./global";
import { PerIndexOptions, QueryOptions, SecondaryIndexOptions } from "@aws/dynamodb-data-mapper";
import { mapper } from "@services/db/connection";
import {
  between, ConditionExpression,
} from "@aws/dynamodb-expressions";

@table(makeTableName(DB_CONFIG.TABLES.BET_DB))
export default class BetDB extends GlobalSecondaryIndex {
  @hashKey()
  user_wallet_address: string;

  @rangeKey({
    indexKeyConfigurations: {
      fight_id_index: "HASH",
    },
  })
  fight_id: string;

  @attribute()
  player_bet_on: string;
  
  @attribute()
  bet_amount: number;

  @attribute()
  final_bet_amount: number;

  @attribute()
  tip_percent: number;

  @attribute({ 
    defaultProvider: () => new Date().getTime(),
  })
  created_at: number;

  @attribute({ defaultProvider: () => new Date().getTime() })
  updated_at: number;

  public static global_secondary_indices = {
    fight_id_index: {
      writeCapacityUnits: 2,
      readCapacityUnits: 2,
      type: "global",
      projection: "all",
    } as SecondaryIndexOptions,
  } as PerIndexOptions;


  public static async getBetEntryOfUser(
    user_wallet_address: string,
    fight_id: string,
  ) {
    try {
      const result = await mapper.get(
        Object.assign(new BetDB(), {
          user_wallet_address,
          fight_id,
        })
      );
      return result;
    } catch (err) {
      return null;
    }
  }

  public static async getAllBetEntriesOfUser(
    user_wallet_address: string,
  ) {
    let result: Array<BetDB> = [];
    try {
      let iterator = await mapper.query(BetDB, {user_wallet_address});
      console.log("fetching .. bets of user .. ", iterator.count);
      for await (const entry of iterator) {
        // console.log("--- fetching - entries ", entry )
        result.push(entry);
      }
      return result;
    } catch(err) {
      throw err;
    }
  }

  public static async createBetEntryOfUser(
    user_wallet_address: string,
    fightId: string,
    bet_amount: number,
    player_bet_on: string,
    tip_percent: number,
  ) {
    try {
      const result = await mapper.put(
        Object.assign(new BetDB(), {
          user_wallet_address,
          fight_id: fightId,
          bet_amount,
          player_bet_on,
          tip_percent,
        })
      );
      return result;
    } catch (err) {
      throw err;
    }
  }

  public static async getAllBetsForFighId(
    fight_id: string,
  ) {
    let result: Array<BetDB> = [];
    try {
      const queryOptions: QueryOptions = {
        indexName: "fight_id_index",
        scanIndexForward: false,
      };
      const iterator = mapper.query(BetDB, {fight_id}, queryOptions );
      for await (const record of iterator) {
        result.push(record)
      }
      return result;
    } catch(err) {
      throw err;
    }
  }
}
