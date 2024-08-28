import { WEB_3_CONFIG } from "@config/web3_config";
import BITFIGHTER_NFT_SPECS from "@models/bitfighter_nft_specs";
import { mapper } from "@services/db/connection";
import { ANAKIN_LOGGER } from "@services/logger";
import { UpdateTokenUriOfOneKCards } from "@services/web3/writer";
import {
  GetBitfightersNameRedisKey,
  GetBitfightersRedisKey,
  GetBitfightersWeb2UserLastMintedIdRedisKey,
  IMapIdToURL,
} from "@utils/bitfighter_nft_specs";
import { GeneratorDao } from "../genarator/dao";
import { SYSTEM_WALLETS } from "@config/system_wallets";
import { isNullOrUndefined } from "util";
import {
  FetchInfoOfTokenIdsFromSC,
  FetchTokenIDsOfUserFromSC,
} from "@services/web3";
import { RedClient } from "@services/redis";
import { ethers } from "ethers";

export class Web3Dao {
  static async fetchBitfightersOfUserWalletFromRedis(
    user_wallet_address: string
  ) {
    const data = await RedClient.getOrSetThenGet(
      GetBitfightersRedisKey(user_wallet_address),
      async () => {
        const data: Array<BITFIGHTER_NFT_SPECS> =
          await BITFIGHTER_NFT_SPECS.fetchNFTsOfUserAddress(
            user_wallet_address
          );
        return JSON.stringify(data);
      },
      2 * 60
    );
    return JSON.parse(data);
  }

  static async fetchBitfightersNickNameFromRedis() {
    const data = await RedClient.getOrSetThenGet(
      GetBitfightersNameRedisKey(),
      async () => {
        const data = await BITFIGHTER_NFT_SPECS.fetchAllNamesOfBitfighters();
        return JSON.stringify(data);
      },
      2 * 60
    );
    return JSON.parse(data);
  }

  static async fetchBitfightersLeastWeb2EntryInRedis(): Promise<number> {
    const data = await RedClient.getOrSetThenGet(
      GetBitfightersNameRedisKey(),
      async () => {
        const data = await BITFIGHTER_NFT_SPECS.fetchLeastMintedId();
        return data;
      },
      5 * 60
    );
    return JSON.parse(data);
  }

  public static async CheckAndUpdateBitfighters(user_wallet_address: string) {
    // fetch entries in db -- minted ids
    // fetch minted ids in sc
    // find mismatch - if entries in db is more - then delete those entries in DB
    // if entries in db is less - then add entry in DB

    const tokenIDsFromSC = await FetchTokenIDsOfUserFromSC(user_wallet_address);
    console.log("----tokenIdsFromSC ", tokenIDsFromSC);

    const data: Array<BITFIGHTER_NFT_SPECS> =
      await BITFIGHTER_NFT_SPECS.fetchNFTsOfUserAddress(user_wallet_address);
    let mintedIDsFromDB = [];
    for (let i = 0; i < data.length; i++) {
      mintedIDsFromDB.push(data[i].minted_id);
    }
    console.log("----mintedIDsFromDB ", mintedIDsFromDB);

    // now look for mismatch
    // find which entry is the sc and not in db
    let entries_in_sc_not_in_db = [];
    for (let i = 0; i < tokenIDsFromSC.length; i++) {
      if (!mintedIDsFromDB.includes(tokenIDsFromSC[i])) {
        entries_in_sc_not_in_db.push(tokenIDsFromSC[i]);
      }
    }
    console.log("----entries_in_sc_not_in_db ", entries_in_sc_not_in_db);

    let entries_in_db_which_is_not_in_sc = [];
    for (let i = 0; i < mintedIDsFromDB.length; i++) {
      if (!tokenIDsFromSC.includes(mintedIDsFromDB[i])) {
        entries_in_db_which_is_not_in_sc.push(mintedIDsFromDB[i]);
      }
    }
    console.log(
      "----entries_in_db_which_is_not_in_sc ",
      entries_in_db_which_is_not_in_sc
    );

    // entry which is in SC and not in DB
    // fetch token Details from SC
    if (entries_in_sc_not_in_db.length > 0) {
      const bitfightersInfoMapping = await FetchInfoOfTokenIdsFromSC(
        entries_in_sc_not_in_db
      );
      if (bitfightersInfoMapping.length > 0) {
        try {
          await Web3Dao.updateBitFighterMintedStatus(
            user_wallet_address,
            bitfightersInfoMapping
          );
        } catch (err) {
          console.log("****error*****", err);
        }
      }
    }

    if (entries_in_db_which_is_not_in_sc.length > 0) {
      let arr = [];
      for (let i = 0; i < entries_in_db_which_is_not_in_sc.length; i++) {
        const info =
          await BITFIGHTER_NFT_SPECS.fetchParticularNftDetailOfUserV2(
            user_wallet_address,
            entries_in_db_which_is_not_in_sc[i]
          );
        arr.push(mapper.delete(info));
      }
      await Promise.all(arr);
    }
    await RedClient.deleteKey(GetBitfightersRedisKey(user_wallet_address));
  }

  public static async fetchBitfightersOfUserWallet(
    user_wallet_address: string
  ) {
    return this.fetchBitfightersOfUserWalletFromRedis(user_wallet_address);
  }

  public static async fetchRefererAddress(
    user_wallet_address: string,
    minted_id: string
  ) {
    let bitfightesData = await this.fetchBitfightersOfUserWallet(
      user_wallet_address
    );
    let found = false;
    let required_data: BITFIGHTER_NFT_SPECS;
    console.log("fetched referer of user .... ", user_wallet_address);
    for (let i = 0; i < bitfightesData.length; i++) {
      let data = bitfightesData[i];
      if (data.minted_id === parseInt(minted_id)) {
        found = true;
        required_data = data;
        break;
      }
    }
    if (!found) {
      throw "Fake User";
    }
    // now get referer and check if he is legit
    let referer = required_data.referer_address;
    referer = ethers.utils.getAddress(referer);
    let refererBfs = await this.fetchBitfightersOfUserWallet(referer);
    if (refererBfs.length > 0) {
      console.log(
        "fetching referer of user i.e. some user.... ",
        user_wallet_address,
        referer
      );
      return referer;
    }
    console.log(
      "fetching referer of user i.e. system wallet.... ",
      user_wallet_address,
      SYSTEM_WALLETS.System
    );
    return SYSTEM_WALLETS.System;
  }

  public static async fetchBitfighterAlias(
    user_wallet_address: string,
    minted_id: string
  ) {
    let bitfightesData = await this.fetchBitfightersOfUserWallet(
      user_wallet_address
    );
    let found = false;
    let required_data: BITFIGHTER_NFT_SPECS;
    console.log("fetched referer of user .... ", user_wallet_address);
    for (let i = 0; i < bitfightesData.length; i++) {
      let data = bitfightesData[i];
      if (data.minted_id === parseInt(minted_id)) {
        found = true;
        required_data = data;
        break;
      }
    }
    if (!found) {
      throw "Fake User";
    }
    // now get referer and check if he is legit
    let name = required_data.nick_name;
    return name;
  }

  public static async updateBitFighterMintedStatus(
    user_wallet_address: string,
    mapIdToURL: Array<IMapIdToURL>
  ) {
    // console.log("debug --- ", this.LocalFightersInfo.get(user_wallet_address).length)
    // delete this.LocalFightersInfo[user_wallet_address];
    // this.LocalFightersInfo.set(user_wallet_address, [])
    // console.log("debug --- ", this.LocalFightersInfo.get(user_wallet_address).length)
    await RedClient.deleteKey(GetBitfightersRedisKey(user_wallet_address));
    try {
      const nftsOfUser = await BITFIGHTER_NFT_SPECS.fetchNFTsOfUserAddress(
        user_wallet_address
      );
      if (isNullOrUndefined(nftsOfUser)) {
        throw "UNABLE_TO_FETCH_BITFIGHTERS";
      }
      const in_db_nft_ids_of_user = [];
      nftsOfUser.map((nft) => {
        in_db_nft_ids_of_user.push(nft.minted_id);
      });

      let doesNotOwnNFTdId = [];
      let owned_nft_ids = [];

      await Promise.all(
        mapIdToURL.map(async (nftURL) => {
          owned_nft_ids.push(nftURL.id);
          let bitFighter: BITFIGHTER_NFT_SPECS;
          // if (in_db_nft_ids_of_user.includes(nftURL.id)) {
          //   return
          // }

          try {
            await BITFIGHTER_NFT_SPECS.putDataInTable(
              user_wallet_address,
              nftURL.url,
              WEB_3_CONFIG.CONTRACT_ADDRESS,
              nftURL.extra_info.Referer,
              nftURL.extra_info.LuckyNumber,
              nftURL.extra_info.NickName,
              nftURL.id
            );
          } catch (err) {
            ANAKIN_LOGGER.error("FAILED_TO_UPDATE_BITFIGHTER_TABLE", {
              error: err,
            });
          }
        })
      );
    } catch (err) {
      ANAKIN_LOGGER.error("FAILED_TO_UPDATE_BITFIGHTER", { error: err });
    }
  }

  public static async updateSingleBitFighterEntry(
    user_wallet_address: string,
    mapIdToURL: IMapIdToURL,
    minted_id: number
  ) {
    try {
      await RedClient.deleteKey(GetBitfightersRedisKey(user_wallet_address));
      const data = await BITFIGHTER_NFT_SPECS.fetchParticularNftDetailOfUserV2(
        user_wallet_address,
        minted_id
      );
      data.nick_name = mapIdToURL.extra_info.NickName;
      data.lucky_number = mapIdToURL.extra_info.LuckyNumber;
      data.nftURL = mapIdToURL.url;
      data.referer_address = mapIdToURL.extra_info.Referer;
      data.updated_at = new Date();
      await mapper.update(data);
      await RedClient.deleteKey(GetBitfightersNameRedisKey());
    } catch (err) {
      ANAKIN_LOGGER.error("FAILED_TO_UPDATE_BITFIGHTER", { error: err });
    }
  }

  public static async updateTokenURIOfOneKCards(
    user_wallet_address: string,
    onek_cards: number[]
  ) {
    try {
      for (let i = 0; i < onek_cards.length; i++) {
        let data = await GeneratorDao.GenerateOneK(
          user_wallet_address,
          onek_cards[i]
        );
        await UpdateTokenUriOfOneKCards(data, onek_cards[i]);
      }
    } catch (err) {
      ANAKIN_LOGGER.error("updateTokenURIOfOneKCards", { error: err });
    }
  }

  static checkIfElementInArray(arr: Array<string>, el: string) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === el) {
        return true;
      }
    }
    return false;
  }

  public static async CheckIfNickNameExist(nick_name: string) {
    try {
      const names = await this.fetchBitfightersNickNameFromRedis();
      return !this.checkIfElementInArray(names, nick_name);
    } catch (err) {
      ANAKIN_LOGGER.error("updateTokenURIOfOneKCards", { error: err });
    }
  }
}
