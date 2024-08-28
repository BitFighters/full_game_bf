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
import {
  PerIndexOptions,
  QueryIterator,
  ScanIterator,
  SecondaryIndexOptions,
} from "@aws/dynamodb-data-mapper";
import {
  BITFIGHTER_ATTRIBUTES,
  BITFIGHTER_MINTED,
} from "@utils/bitfighter_nft_specs";
import { mapper } from "@services/db/connection";
import { ANAKIN_LOGGER } from "@services/logger";
import { WEB_3_CONFIG } from "@config/web3_config";
import { USER_TYPE } from "@utils/user_details";

@table(makeTableName(DB_CONFIG.TABLES.BITFIGHTER_NFT_SPECS))
export default class BITFIGHTER_NFT_SPECS extends GlobalSecondaryIndex {
  @hashKey()
  user_wallet_address: string;

  @rangeKey()
  minted_id: number;

  @attribute()
  nftURL: string;

  @attribute()
  contract_address: string;

  @attribute()
  minted: BITFIGHTER_MINTED;

  @attribute()
  nick_name: string;

  @attribute()
  referer_address: string;

  // @attribute({ defaultProvider: () => 0})
  // minted_id: number;

  @attribute()
  lucky_number: number;

  @attribute()
  user_type: USER_TYPE;

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

  public static async putDataInTable(
    user_wallet_address: string,
    // dna: string,
    nftURL: string,
    contract_address: string,
    referer_address: string,
    lucky_number: number,
    nick_name: string,
    minted_id: number,
    // profile_image: string,
    user_type = USER_TYPE.WEB3
    // minted = BITFIGHTER_MINTED.NOT_MINTED,
  ) {
    // var minted_id = 0;
    try {
      // if (user_type === USER_TYPE.WEB2) {
      //   minted_id = Math.floor(1000000 + Math.random() * ( 1000000000))
      //   await mapper.put(Object.assign(new BITFIGHTER_NFT_SPECS(),
      //       { user_wallet_address, dna, nftURL, minted, referer_address, lucky_number, nick_name, contract_address, profile_image, user_type, minted_id }));
      // } else {
      //   await mapper.put(Object.assign(new BITFIGHTER_NFT_SPECS(),
      //       { user_wallet_address, dna, nftURL, minted, referer_address, lucky_number, nick_name, contract_address, profile_image, user_type }));
      // }

      await mapper.put(
        Object.assign(new BITFIGHTER_NFT_SPECS(), {
          user_wallet_address,
          nftURL,
          referer_address,
          lucky_number,
          nick_name,
          contract_address,
          minted_id,
          user_type,
        })
      );
    } catch (err) {
      console.log("error ", err);
      ANAKIN_LOGGER.error({ event: "putDataInTable", error: err });
    }

    // console.log("data added.. ", checkUpload);
  }

  public static async fetchNFTsOfUserAddress(
    user_wallet_address: string
  ): Promise<BITFIGHTER_NFT_SPECS[]> {
    let nftsList: Array<BITFIGHTER_NFT_SPECS> = [];
    try {
      const results: QueryIterator<BITFIGHTER_NFT_SPECS> = mapper.query({
        valueConstructor: BITFIGHTER_NFT_SPECS,
        keyCondition: { user_wallet_address },
      });
      for await (const item of results) {
        // console.log("=-----", item.minted_id)
        if (
          item.contract_address === WEB_3_CONFIG.CONTRACT_ADDRESS
          // && item.minted === BITFIGHTER_MINTED.MINTED
        )
          nftsList.push(item);
      }
      return nftsList;
    } catch (err) {
      ANAKIN_LOGGER.error("fetchNFTsOfUserAddress", {
        user_wallet_address,
        error: err,
      });
      return null;
    }
  }

  public static async fetchAllNamesOfBitfighters() {
    let nick_names: Array<string> = [];
    const scanIterator: ScanIterator<BITFIGHTER_NFT_SPECS> =
      mapper.scan(BITFIGHTER_NFT_SPECS);
    for await (const game of scanIterator) {
      if (game.contract_address === WEB_3_CONFIG.CONTRACT_ADDRESS) {
        nick_names.push(game.nick_name);
      }
    }
    return nick_names;
  }

  public static async fetchLeastMintedId() {
    let leastMintedId: number = 10000;
    const scanIterator: ScanIterator<BITFIGHTER_NFT_SPECS> =
      mapper.scan(BITFIGHTER_NFT_SPECS);
    for await (const bfInfo of scanIterator) {
      if (bfInfo.contract_address === WEB_3_CONFIG.CONTRACT_ADDRESS) {
        if (leastMintedId > bfInfo.minted_id) {
          leastMintedId = bfInfo.minted_id;
        }
      }
    }
    return leastMintedId;
  }

  public static async fetchParticularNftDetailOfUser(
    user_wallet_address: string,
    minted_id: number
  ): Promise<BITFIGHTER_NFT_SPECS> {
    let nftsList: Array<BITFIGHTER_NFT_SPECS> = [];
    try {
      const results: QueryIterator<BITFIGHTER_NFT_SPECS> = mapper.query({
        valueConstructor: BITFIGHTER_NFT_SPECS,
        keyCondition: { user_wallet_address },
      });
      for await (const item of results) {
        if (
          item.contract_address === WEB_3_CONFIG.CONTRACT_ADDRESS
          // && item.minted === BITFIGHTER_MINTED.MINTED
        )
          nftsList.push(item);
      }
      for (let i = 0; i < nftsList.length; i++) {
        if (nftsList[i].minted_id === minted_id) {
          return nftsList[i];
        }
      }
      return null;
    } catch (err) {
      ANAKIN_LOGGER.error({
        function: "fetchParticularNftDetailOfUser",
        user_wallet_address,
        error: err,
      });
      return null;
    }
  }

  public static async fetchParticularNftDetailOfUserV2(
    user_wallet_address: string,
    minted_id: number
  ): Promise<BITFIGHTER_NFT_SPECS> {
    try {
      const res = await mapper.get(
        Object.assign(new BITFIGHTER_NFT_SPECS(), {
          user_wallet_address,
          minted_id,
        })
      );
      return res;
    } catch (err) {
      ANAKIN_LOGGER.error({
        function: "fetchParticularNftDetailOfUser",
        user_wallet_address,
        error: err,
      });
      return null;
    }
  }
}
