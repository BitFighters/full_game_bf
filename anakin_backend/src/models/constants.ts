import { ANAKIN_LOGGER } from '@services/logger';
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

@table(makeTableName(DB_CONFIG.TABLES.CONSTANTS_DB))
export default class CONSTANTS_DB extends GlobalSecondaryIndex {
  @hashKey()
  key: string;

  @attribute({ defaultProvider: () => 0 })
  value: number;

  @attribute({ defaultProvider: () => "" })
  value_string: string;

  @attribute({ defaultProvider: () => "" })
  json_string: string;

  @attribute({ defaultProvider: () => new Date().getTime() })
  updated_at: number;

  public static global_secondary_indices = {} as PerIndexOptions;

  public static async getConstantValue(
    key: string,
  ) {
    try {
      let result = await mapper.get(
        Object.assign(new CONSTANTS_DB(), {
          key
        })
      );
      return result.value;
    } catch (err) {
      return null;
    }
  }

  public static async GetConstantData(
    key: string,
  ) {
    try {
      let result = await mapper.get(
        Object.assign(new CONSTANTS_DB(), {
          key
        })
      );
      return result;
    } catch (err) {
      console.log("error in GetConstantData ", err)
      if (err.name === "ItemNotFoundException") {
        let result = await mapper.put(Object.assign(new CONSTANTS_DB(), { key }))
        return result;
      }
      return null;
    }
  }

  public static async updateConstantValue(
    key: string,
    val: number
  ) {
    try {
      let result = await mapper.get(
        Object.assign(new CONSTANTS_DB(), {
          key
        })
      );
      ANAKIN_LOGGER.info({
        event: "updateConstantValue",
        old: result,
        new: val,
        key
      });
      result.value = val;
      await mapper.update(result);
    } catch (err) {
      return null;
    }
  }
}
