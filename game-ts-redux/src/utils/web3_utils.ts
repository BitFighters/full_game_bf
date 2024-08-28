/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { BigNumber as BigNumberEthers } from "ethers";
import { checkWBTC_Balance, FetchInfoOfDripCardMintedByUser, getAssetCountOfPlayer, getBitfightersMintedCount, getBitfightersTotalCountForGen, getDripMintCardsMintedCouponsCount, getMintedDripPresaleCardsByUser, getMintedPresaleCardsByUser, getOneKMintedTotalCount, getPreSaleCountTotal, getPriceOfOneKCard, getTotalOneKClubCards } from "../contract";
import store from "../stores";
import { SetBetBalance, SetWalletBalance, SetWbtcBalance } from "../stores/Web3StoreBalances";
import BigNumber from "bignumber.js";
import { isNullOrUndefined } from "util";
import { DripFighterInfo, SetBitfightersNftMintedCount, SetCurrentPriceOfOnekCard, SetTotalBitfightersNftCount, SetTotalCountOfPresaleCarddsOwnedByUser, SetTotalDripPreSaleNFT, SetTotalInfoOfUserDripPresaleCards, SetTotalInfoOfUserDripPresaleCardsLoaded, SetTotalMintedOneKClubNF, SetTotalOneKClubNF, SetTotalPreSaleNFT } from "../stores/BitFighters";

export async function getBalances(currentUser: string) {
  console.log("in getbalances ", store.getState().web3store)
  if (!store.getState().web3store.web3Connected) {
    return
  }
  try {
    console.log("in_get_balance---", currentUser)
    // let currentUser = store.getState().web3store.userAddress;
    const wbtcBalance = await checkWBTC_Balance(currentUser);
    // const walletBalance = 0;
    // const betBalance = 0;
    // const walletBalance = await checkWalletBalance(currentUser);
    // const betBalance = await  checkBetBalance(currentUser);
    // const decimals = await getWBTCDecimals();

    // console.log("all balance --> ", walletBalance.toString(), wbtcBalance.toString());



    store.dispatch(SetWbtcBalance(wbtcBalance.toString()));
    // store.dispatch(SetBetBalance(betBalance.toString()));
    // store.dispatch(SetWalletBalance(walletBalance.toString()));
    // store.dispatch(SetDecimals(decimals.toString()));

    return {
      wbtcBalance,
      walletBalance: 0,
      betBalance: 0,
    }
  } catch (err) {
    return {
      wbtcBalance: 0,
      walletBalance: 0,
      betBalance: 0,
    }
  }

}

export async function updateAssetCountOfPlayers() {
  const numberOfBrews = await getAssetCountOfPlayer(store.getState().web3store.userAddress, "brew");
  // store.dispatch(SetNumberOfBrews(parseInt(numberOfBrews.toString())));
}

export function parseWBTCBalance(balance: string) {
  console.log("--balance--", balance, BigNumberEthers.from(balance).div(10 ** parseInt(store.getState().web3BalanceStore.decimals)).toString());
  return BigNumberEthers.from(balance).div(10 ** parseInt(store.getState().web3BalanceStore.decimals)).toString();
}


export function parseWBTCBalanceV2(balance: string) {
  // console.log("-----parseWBTCBalanceV2 ", balance)
  if (isNullOrUndefined(balance) || balance === "") {
    return "0"
  }
  const bn = new BigNumber(balance);
  // const z = new BigNumber(10**parseInt(store.getState().web3BalanceStore.decimals))
  // const x = new BigNumber(10**6)
  return bn.dividedBy(10 ** 2).toNumber().toLocaleString();
  // return bn.dividedBy(z).multipliedBy(x).toNumber().toLocaleString();
}

export function parseWBTCBalanceV3(balance: number | undefined) {
  // console.log("-----parseWBTCBalanceV3 ", balance)
  if (isNullOrUndefined(balance)) {
    return "0"
  }
  const bn = new BigNumber(balance);
  // console.log("-----parseWBTCBalanceV3 1 ", bn.toString())
  // const z = new BigNumber(10**parseInt(store.getState().web3BalanceStore.decimals))
  // console.log("-----parseWBTCBalanceV3 2 ", z.toString())
  // const x = new BigNumber(10**6)
  // console.log("-----parseWBTCBalanceV3 2 ", z.toString())
  return roundToNDecimalPlaces(Math.floor(bn.dividedBy(10 ** 2).toNumber())).toLocaleString();
  // return Math.floor(bn.dividedBy(z).multipliedBy(x).toNumber()).toLocaleString();
}

export function roundToNDecimalPlaces(num: number) {
  // return Math.round(num * 100) / 100
  // return 
  return Math.round((num + Number.EPSILON) * 1000) / 1000
}
export function parseWBTCBalanceV4(balance: number) {
  // console.log("-----parseWBTCBalanceV4 ", balance)
  if (isNullOrUndefined(balance)) {
    return 0
  }
  const bn = new BigNumber(balance);
  return roundToNDecimalPlaces(Math.floor(bn.dividedBy(10 ** 2).toNumber()));
}

// export function parseWBTCBalanceV4(balance: number) {
//   if typeof
//   const bn = new BigNumber(balance);
//   const z = new BigNumber(10**parseInt(store.getState().web3BalanceStore.decimals))
//   const x = new BigNumber(10**6)
//   return bn.dividedBy(z).multipliedBy(x).toNumber().toLocaleString();
// }

export function convertWBTCToBigIntWithDecimlas(balance: number) {
  // return BigNumber.from(balance).mul(10**parseInt(store.getState().web3BalanceStore.decimals)).toString();
  return balance * (10 ** (2));
}

export function parseWBTCBalanceinBITS(balance: string) {
  return BigNumberEthers.from(balance).div(BigNumberEthers.from(store.getState().web3BalanceStore.decimals)).div(BigNumberEthers.from(6)).toString()
}

export async function updatePresaleMintedCount() {
  try {
    const count = await getPreSaleCountTotal()
    console.log("presale minted ... ", count);
    store.dispatch(SetTotalPreSaleNFT(Number(count)))
  } catch (err) {
    console.log("error in updatepresale count total ", err);
    store.dispatch(SetTotalPreSaleNFT(0))
  }
}

export async function updateDripPresaleMintedCount() {
  try {
    const count = await getDripMintCardsMintedCouponsCount()
    console.log("presale minted ... ", count);
    store.dispatch(SetTotalDripPreSaleNFT(Number(count)))
  } catch (err) {
    console.log("error in updatepresale count total ", err);
    store.dispatch(SetTotalDripPreSaleNFT(0))
  }
}

export async function updateOneKClubMintedCount() {
  try {
    const minted_count = await getOneKMintedTotalCount()
    const count = await getTotalOneKClubCards()

    const price_of_oneK_card = await getPriceOfOneKCard()

    console.log("onek club minted ... ", count);
    store.dispatch(SetTotalOneKClubNF(Number(count)))
    store.dispatch(SetTotalMintedOneKClubNF(Number(minted_count)))
    store.dispatch(SetCurrentPriceOfOnekCard(Number(price_of_oneK_card)))
  } catch (err) {
    console.log("error in updateOneKClubMintedCount count total ", err);
    store.dispatch(SetTotalOneKClubNF(0))
    store.dispatch(SetTotalMintedOneKClubNF(0))
  }
}

export function parseUSDCBalance(balance: number | undefined) {
  console.log("-----parseUSDCBalance ", balance)
  if (isNullOrUndefined(balance)) {
    return "0"
  }
  const bn = new BigNumber(balance);
  return Math.floor(Math.round(bn.dividedBy(10 ** 6).toNumber() * 10) / 10).toLocaleString();
}


export async function updateBitfightersMintedCountAndTotal() {
  try {
    const count = await getBitfightersTotalCountForGen(0)
    console.log("updateBitfighters count Total ... ", count);
    store.dispatch(SetTotalBitfightersNftCount(Number(count)));

    const mintedCount = await getBitfightersMintedCount();
    console.log("updateBitfighters Minted Count ... ", mintedCount);
    store.dispatch(SetBitfightersNftMintedCount(Number(mintedCount)));
  } catch (err) {
    console.log("error in updateBitfightersMintedCountAndTotal count total ", err);
    store.dispatch(SetTotalBitfightersNftCount(0))
    store.dispatch(SetBitfightersNftMintedCount(0));
  }
}


export async function FetchDripPresaleInfoMintedByUser() {
  try {
    const dripPresaleMintedCouponsArr = await getMintedDripPresaleCardsByUser(store.getState().web3store.userAddress)
    console.log("debug FetchDripPresaleInfoMintedByUser minted ... ", dripPresaleMintedCouponsArr);
    const dripPresaleMintedCouponsRes = []
    for (let i = 0; i < dripPresaleMintedCouponsArr.length; i++) {
      const val = parseInt(dripPresaleMintedCouponsArr[i])
      console.log("debug FetchDripPresaleInfoMintedByUser minted ... ", val);
      const data = await FetchInfoOfDripCardMintedByUser(val)
      const ndata: DripFighterInfo = Object.assign({}, data);
      ndata['id'] = val;
      dripPresaleMintedCouponsRes.push(ndata);
    }
    console.log("debug .,. all info of drip presale cards. ", dripPresaleMintedCouponsRes)
    store.dispatch(SetTotalInfoOfUserDripPresaleCards(dripPresaleMintedCouponsRes))
    store.dispatch(SetTotalInfoOfUserDripPresaleCardsLoaded(true))
  } catch (err) {
    console.log("error in FetchDripPresaleInfoMintedByUser ", err);
    store.dispatch(SetTotalInfoOfUserDripPresaleCardsLoaded(true))
  }
}

export async function FetchPresaleInfoMintedByUser() {
  try {
    const PresaleMintedCouponsArr = await getMintedPresaleCardsByUser(store.getState().web3store.userAddress)
    console.log("debug FetchPresaleInfoMintedByUser minted ... ", PresaleMintedCouponsArr);
    store.dispatch(SetTotalCountOfPresaleCarddsOwnedByUser(PresaleMintedCouponsArr.length))
    store.dispatch(SetTotalInfoOfUserDripPresaleCardsLoaded(true))
  } catch (err) {
    console.log("error in FetchPresaleInfoMintedByUser ", err);
    store.dispatch(SetTotalInfoOfUserDripPresaleCardsLoaded(true))
  }
}

export const IsMetaMaskInstalled = () => {
  const { ethereum } = window;
  return Boolean(ethereum && ethereum.isMetaMask);
};