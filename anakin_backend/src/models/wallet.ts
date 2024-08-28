import { isNullOrUndefined } from 'util';
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

@table(makeTableName(DB_CONFIG.TABLES.WALLET_DB))
export default class WALLET_DB extends GlobalSecondaryIndex {
  @hashKey()
  user_wallet_address: string;

  @rangeKey()
  contract_address: string;

  @attribute({ defaultProvider: () => 0 })
  web3_balance: number;

  @attribute({ defaultProvider: () => 0 })
  web2_balance: number;

  @attribute({ defaultProvider: () => 0 })
  web2_coins: number;

  @attribute({ defaultProvider: () => 0 })
  web2_balance_spent: number;

  @attribute()
  temp_bet_amount: number;

  @attribute()
  last_temp_bet_created_on: number;

  @attribute({ defaultProvider: () => 0 })
  deposit_count: number;

  @attribute({ defaultProvider: () => 0 })
  redeem_count: number;

  @attribute({ defaultProvider: () => new Date().getTime() })
  created_at: number;

  @attribute({ defaultProvider: () => new Date().getTime() })
  updated_at: number;

  @attribute()
  last_redeemed_at: number;

  public static global_secondary_indices = {
    moderator_mapper: {
      writeCapacityUnits: 5,
      readCapacityUnits: 5,
      type: "global",
      projection: "all",
    } as SecondaryIndexOptions,
  } as PerIndexOptions;

  public static async getWalletInfoOfUser(
    user_wallet_address: string,
  ) {
    let contract_address = WEB_3_CONFIG.GAMELOGIC_CONTRACT_ADDRESS;
    try {
      const result = await mapper.get(
        Object.assign(new WALLET_DB(), {
          user_wallet_address,
          contract_address,
        })
      );
      if (isNullOrUndefined(result.web2_coins)) {
        result.web2_coins = 0;
        mapper.update(result)
      }
      return result;
    } catch (err) {
      throw err;
    }
  }

  public static async createWalletForUser(
    user_wallet_address: string,
  ) {
    return await mapper.put(
      Object.assign(new WALLET_DB(), {
        user_wallet_address,
        contract_address: WEB_3_CONFIG.GAMELOGIC_CONTRACT_ADDRESS,
      })
    );
  }

  public static async updateUsersWeb2Balance(
    user_wallet_address: string,
    addBalance: number,
  ) {
    console.log("-----in_updateUsersWeb2Balance------", user_wallet_address, addBalance);
    // ANAKIN_LOGGER.info({
    //   function: "updateUsersWeb2Balance",
    //   user_wallet_address,
    //   addBalance
    // });
    if (addBalance === 0) {
      return
    }
    try {
      const result = await mapper.get(
        Object.assign(new WALLET_DB(), {
          user_wallet_address,
          contract_address: WEB_3_CONFIG.GAMELOGIC_CONTRACT_ADDRESS,
        })
      );
      result.web2_balance += addBalance;
      await mapper.update(result);
    } catch (err) {
      ANAKIN_LOGGER.error({
        function: "updateUsersWeb2Balance",
        user_wallet_address,
        addBalance,
      });
    }
  }
}
