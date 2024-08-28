import { WEB_3_CONFIG } from "@config/web3_config";
import { ANAKIN_LOGGER } from "@services/logger";
import { ExtraInfoForNFTs, IMapIdToURL } from "@utils/bitfighter_nft_specs";
import { ethers } from "ethers";
import { ABI } from "./ABI";
import { ONEK_CLUB_CONTRACT_ABI } from "./ONEK_CARDS_ABI";

const abi = ABI;
let provider = new ethers.providers.JsonRpcProvider(`${WEB_3_CONFIG.AVAX_WEB3_RPC_URL}`)
const readOnlyContract: ethers.Contract = new ethers.Contract(WEB_3_CONFIG.CONTRACT_ADDRESS, abi, provider);

console.log(" contract_address ---> ", WEB_3_CONFIG.CONTRACT_ADDRESS)
// export async function fetchBitFightersFromSC(userWalletAddress: string) {
//   let res: string;
//   let tokenIdsOfUser: Array<any>;
//   let mapIdToUrl: Array<IMapIdToURL> = [];
//   try {
//     console.log(" contract_address fetchBitFightersFromSC ---> ", WEB_3_CONFIG.CONTRACT_ADDRESS)
//     tokenIdsOfUser = await readOnlyContract.getTokensOfUser(userWalletAddress);
//     console.log("token ids of user ", tokenIdsOfUser, parseInt(tokenIdsOfUser[0]));
//   } catch(err) {
//     console.log("error in getTokensOfUser --> ", err);
//     return null;
//   }
//   try {
//     // for (let i = 0; i < tokenIdsOfUser.length; i++) {
//     //   res = await readOnlyContract.tokenURI(parseInt(tokenIdsOfUser[i]));
//     //   // result.push(res);
//     //   let info = await readOnlyContract.getAllInfoOfBitfighter(parseInt(tokenIdsOfUser[i]));
//     //   // console.log("-----------", info)
//     //   mapIdToUrl.push({id: parseInt(tokenIdsOfUser[i]), url:  res, extra_info: info as ExtraInfoForNFTs}) 
//     // }

//     let results = []

//     for (let i = 0; i < tokenIdsOfUser.length; i++) {
//       res =  readOnlyContract.tokenURI(parseInt(tokenIdsOfUser[i]));
//       results.push(res);
//       // let info = await readOnlyContract.getAllInfoOfBitfighter(parseInt(tokenIdsOfUser[i]));
//       // // console.log("-----------", info)
//       // mapIdToUrl.push({id: parseInt(tokenIdsOfUser[i]), url:  res, extra_info: info as ExtraInfoForNFTs}) 
//     }

//     results = await Promise.all(results);
//     console.log("results ---> ", results);
//     let infoArr = []
//     for(let i =0; i < results.length; i++) {
//       let info = readOnlyContract.getAllInfoOfBitfighter(parseInt(tokenIdsOfUser[i]));
//       infoArr.push(info);
//     }
//     infoArr = await Promise.all(infoArr);

//     console.log("222222 ---> ",);

//     for(let i =0; i < infoArr.length; i++) {
//       let info = infoArr[i];
//       mapIdToUrl.push({id: parseInt(tokenIdsOfUser[i]), url:  results[i], extra_info: info as ExtraInfoForNFTs}) 
//     }
    

//   } catch (err) {
//     console.log("error in tokenURI fetchBitFightersFromSC --> ", err);
//     return null;
//   }
//   return mapIdToUrl;
// }

export async function fetchBitFightersFromSC(userWalletAddress: string) {
  let res: string;
  let tokenIdsOfUser: Array<any>;
  let mapIdToUrl: Array<IMapIdToURL> = [];
  try {
    console.log(" contract_address fetchBitFightersFromSC ---> ", WEB_3_CONFIG.CONTRACT_ADDRESS)
    tokenIdsOfUser = await readOnlyContract.getTokensOfUser(userWalletAddress);
    console.log("token ids of user ", tokenIdsOfUser, parseInt(tokenIdsOfUser[0]));
  } catch(err) {
    console.log("error in getTokensOfUser --> ", err);
    return null;
  }
  try {
    let results = []
    for (let i = 0; i < tokenIdsOfUser.length; i++) {
      res =  readOnlyContract.tokenURI(parseInt(tokenIdsOfUser[i]));
      results.push(res);
    }
    results = await Promise.all(results);
    console.log("results ---> ", results);
    let infoArr = []
    for(let i =0; i < results.length; i++) {
      let info = readOnlyContract.getAllInfoOfBitfighter(parseInt(tokenIdsOfUser[i]));
      infoArr.push(info);
    }
    infoArr = await Promise.all(infoArr);

    console.log("222222 ---> ",);

    for(let i =0; i < infoArr.length; i++) {
      let info = infoArr[i];
      mapIdToUrl.push({id: parseInt(tokenIdsOfUser[i]), url:  results[i], extra_info: info as ExtraInfoForNFTs}) 
    }
  } catch (err) {
    console.log("error in tokenURI fetchBitFightersFromSC --> ", err);
    return null;
  }
  return mapIdToUrl;
}

export async function FetchInfoOfTokenIdsFromSC(tokenIdsOfUser) {
  let mapIdToUrl: Array<IMapIdToURL> = [];
  try {
    let results = []
    for (let i = 0; i < tokenIdsOfUser.length; i++) {
      let res =  readOnlyContract.tokenURI(parseInt(tokenIdsOfUser[i]));
      results.push(res);
    }
    results = await Promise.all(results);
    let infoArr = []
    for(let i =0; i < results.length; i++) {
      let info = readOnlyContract.getAllInfoOfBitfighter(parseInt(tokenIdsOfUser[i]));
      infoArr.push(info);
    }
    infoArr = await Promise.all(infoArr);
    for(let i =0; i < infoArr.length; i++) {
      let info = infoArr[i];
      mapIdToUrl.push({id: parseInt(tokenIdsOfUser[i]), url:  results[i], extra_info: info as ExtraInfoForNFTs}) 
    }
    return mapIdToUrl;
  } catch (err) {
    console.log("error in tokenURI fetchBitFightersFromSC --> ", err);
    return null;
  }
}

export async function FetchTokenIDsOfUserFromSC(userWalletAddress: string) {
  let tokenIdsOfUser: Array<any>;
  let results = []
  try {
    tokenIdsOfUser = await readOnlyContract.getTokensOfUser(userWalletAddress);
    // console.log("token ids of user ", tokenIdsOfUser, parseInt(tokenIdsOfUser[0]));
    for (let i = 0; i < tokenIdsOfUser.length; i++) {
      results.push(parseInt(tokenIdsOfUser[i]));
    }
  } catch(err) {
    console.log("error in getTokensOfUser --> ", err);
    ANAKIN_LOGGER.error({
      event: "ERROR_IN_FETCHING_TOKEN_IDS_OF_USER",
      function : "FetchTokenIDsOfUserFromSC",
      error: err,
    })
    return null;
  }
  return results;
}

export async function fetchBitFightersFromSCV2(userWalletAddress: string, minted_id: number) {
  let res: string;
  let tokenIdsOfUser: Array<any>;
  let mapIdToUrl: Array<IMapIdToURL> = [];
  try {
    console.log(" contract_address fetchBitFightersFromSCV2---> ", WEB_3_CONFIG.CONTRACT_ADDRESS)
    tokenIdsOfUser = await readOnlyContract.getTokensOfUser(userWalletAddress);
    console.log("token ids of user ", tokenIdsOfUser, parseInt(tokenIdsOfUser[0]));
  } catch(err) {
    console.log("error in getTokensOfUser --> ", err);
    return null;
  }
  try {
    for (let i = 0; i < tokenIdsOfUser.length; i++) {
      if (parseInt(tokenIdsOfUser[i]) !== minted_id) {
        continue
      }
      res = await readOnlyContract.tokenURI(parseInt(tokenIdsOfUser[i]));
      console.log("res --", res)
      let info = await readOnlyContract.getAllInfoOfBitfighter(parseInt(tokenIdsOfUser[i]));
      console.log("-----------", info)
      mapIdToUrl.push({id: parseInt(tokenIdsOfUser[i]), url:  res, extra_info: info as ExtraInfoForNFTs}) 
    }
  } catch (err) {
    console.log("error in tokenURI --> ", err);
    return null;
  }
  return mapIdToUrl;
}

export async function fetchOneKCardsOfUserFromSC(userWalletAddress: string) {
  // let res: string;
  let tokenIdsOfUser: Array<any>;
  let result = []
  // let result : Array<string> = [];
  // let mapIdToUrl: Array<IMapIdToURL> = [];
  let readOnlyOneKContract: ethers.Contract = new ethers.Contract(WEB_3_CONFIG.Onek_CARDS_CONTRACTS_ADDRESS, ONEK_CLUB_CONTRACT_ABI, provider);
  try {
    console.log(" contract_address ---> ", WEB_3_CONFIG.Onek_CARDS_CONTRACTS_ADDRESS)
    tokenIdsOfUser = await readOnlyOneKContract.fetchOneKCardsForUser(userWalletAddress);
    // console.log("token ids of user ", tokenIdsOfUser, parseInt(tokenIdsOfUser[0]));
    for (let i = 0 ; i < tokenIdsOfUser.length; i++) {
      result.push(parseInt(tokenIdsOfUser[i]))
    }
  } catch(err) {
    console.log("error in fetchOneKCardsForUser --> ", err);
    return null;
  }
  return result;
  // try {
  //   for (var i = 0; i < tokenIdsOfUser.length; i++) {
  //     res = await readOnlyContract.tokenURI(parseInt(tokenIdsOfUser[i]));
  //     result.push(res);
  //     mapIdToUrl.push({id: parseInt(tokenIdsOfUser[i]), url:  res}) 
  //   }
  // } catch (err) {
  //   console.log("error in tokenURI --> ", err);
  //   return null;
  // }
  // return mapIdToUrl;
}

export async function checkIfTokenUriIsSet(tokenId: number) {
  // let res: string;
  let tokenUriOfCard: string= "";
  let readOnlyOneKContract: ethers.Contract = new ethers.Contract(WEB_3_CONFIG.Onek_CARDS_CONTRACTS_ADDRESS, ONEK_CLUB_CONTRACT_ABI, provider);
  try {
    console.log(" contract_address ---> ", WEB_3_CONFIG.Onek_CARDS_CONTRACTS_ADDRESS)
    tokenUriOfCard = await readOnlyOneKContract.tokenURI(tokenId);
    console.log(" tokenUI ---> ", tokenId, tokenUriOfCard)
    if (tokenUriOfCard === "") {
      return false;
    }
    return true;
  } catch(err) {
    console.log("error in checkIfTokenUriIsSet --> ", err);
    return false;
  }
}


export async function FetchAllOneKClubOwners() {
  let required_onek_club_address = "0xD72e26baF7598C86D0CFC8f569838436f6EB98a1"
  let provider = new ethers.providers.JsonRpcProvider("https://api.avax.network/ext/bc/C/rpc")
  let readOnlyOneKContract: ethers.Contract = new ethers.Contract(required_onek_club_address, ONEK_CLUB_CONTRACT_ABI, provider);
  // console.log("contract -- ", readOnlyOneKContract)
  let result = []
  try {
    // console.log(" contract_address ---> ", required_onek_club_address)
    let totalSoldTokens = await readOnlyOneKContract.getMintedCardsCount();
    console.log("---- total onek club tokens sold ---", required_onek_club_address, parseInt(totalSoldTokens));
    for (let i = 1 ; i <= parseInt(totalSoldTokens); i++) {
      let _owner = readOnlyOneKContract.ownerOf(i);
      result.push(_owner)
      // console.log("owner of i ", i , _owner, result.length)
    }
    result = await Promise.all(result);
    let set = new Set(result)
    result = Array.from(set);
  } catch(err) {
    console.log("error in fetchAllOneKClubOwners --> ", err);
    return null;
  }
  return result;
}