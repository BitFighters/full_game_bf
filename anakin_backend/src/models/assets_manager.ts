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
import { mapper } from "@services/db/connection";
import { AssetsName } from "@utils/asset_manager";
import { isNullOrUndefined } from "util";

@table(makeTableName(DB_CONFIG.TABLES.ASSETS_MANAGER))
export default class ASSETS_MANAGER extends GlobalSecondaryIndex {
  @hashKey()
  user_wallet_address: string;

  @rangeKey()
  asset_name: AssetsName;

  @attribute()
  active_assets: number;

  @attribute()
  used_assets: number;

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

  public static async addAssetIntoTable(
    user_wallet_address: string, 
    asset_name: AssetsName, 
    quantity: number,
  ) {
    let currentAssets = await ASSETS_MANAGER.getCurrentAsset(user_wallet_address, asset_name);
    if (isNullOrUndefined(currentAssets)) {
      try {
        let result = await mapper.put(Object.assign(new ASSETS_MANAGER(), {
          user_wallet_address, asset_name, active_assets: quantity, used_assets: 0,
        }))
        return result;
      } catch (error) {
        throw "FAILED_TO_ADD";
      }
    }
    if (currentAssets.active_assets + quantity >9) {
      throw "MAX cap of LVL 1 Bag is 9."
    } else {
      currentAssets.active_assets += quantity;
    }
    await mapper.update(currentAssets);
  }

  public static async discardAsset(
    user_wallet_address: string, 
    asset_name: AssetsName, 
  ) {
    let currentAssets = await ASSETS_MANAGER.getCurrentAsset(user_wallet_address, asset_name);
    if (isNullOrUndefined(currentAssets) || currentAssets.active_assets <= 0) {
      throw "NO_ASSET_EXIST";
    }
    console.log("-------", currentAssets)
    if (currentAssets.active_assets > 0) {
      currentAssets.used_assets += 1;
      currentAssets.active_assets -= 1;
      await mapper.update(currentAssets);
    }
  }

  public static async getCurrentAsset(user_wallet_address: string, asset_name: AssetsName): Promise<ASSETS_MANAGER> {
    try {
      let result = await mapper.get(
        Object.assign(new ASSETS_MANAGER(), {
          user_wallet_address,
          asset_name,
        })
      )
      return result;
    } catch (error) {
      return null;
    }
  }


  static createEmptyAssets(user_wallet_address: string) {
    let assetsName = Object.values(AssetsName);
    console.log("assets name ", assetsName)
    let tempAssetsInfo: Array<ASSETS_MANAGER> = [];
    for (let i = 0; i < assetsName.length; i++) {
      tempAssetsInfo.push({
        user_wallet_address,
        active_assets: 0,
        used_assets: 0,
        asset_name: assetsName[i],
        created_at: new Date(),
        updated_at: new Date(),
      })
    }
    return tempAssetsInfo;
   }


  public static async getAllAssetsOfUser(user_wallet_address: string) {
    let result = [];
    try {
      const results: QueryIterator<ASSETS_MANAGER> = mapper.query({
        valueConstructor: ASSETS_MANAGER, 
        keyCondition: { user_wallet_address }
      });
      for await (const item of results) {
        result.push(item);
      }
      if (result.length === 0) {
        return this.createEmptyAssets(user_wallet_address);
      }
      return result;
    } catch (error) {
      return this.createEmptyAssets(user_wallet_address);
    }
  }
}
