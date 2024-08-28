// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface DripFighterInfo {
  tag: boolean,
  tattoo: boolean,
  id: number,
}

interface BitFightersCollection {
  value: Array<string>
  nftData: Array<any>
  loaded: boolean
  totalNFTData: Array<any>
  preSaleNFTMintedCount: number,
  drip_preSaleNFTMintedCount: number,
  oneKClubMintedCards: number;
  totalOneKClubCards: number;
  currentPriceOfOneKClubCard: number;

  bitfightersNFTsMintedCount: number;
  totalBitfightersToMint: number;
  dripfightersNFTsMintedCount: number;
  totalDripFightersToMint: number;

  totalInfoOfUsersDripPresaleCards: Array<DripFighterInfo>
  totalInfoOfUsersDripPresaleCardsLoaded: boolean;

  totalCountOfPresaleMintCardForUser: number;
}

const initialState: BitFightersCollection = {
  value: [],
  nftData: [],
  loaded: false,
  totalNFTData: [],
  preSaleNFTMintedCount: 0,
  drip_preSaleNFTMintedCount: 0,
  oneKClubMintedCards: 0,
  totalOneKClubCards: 0,
  currentPriceOfOneKClubCard: 0,
  bitfightersNFTsMintedCount: 0,
  dripfightersNFTsMintedCount: 0,
  totalBitfightersToMint: 0,
  totalDripFightersToMint: 0,
  totalInfoOfUsersDripPresaleCards: [],
  totalInfoOfUsersDripPresaleCardsLoaded: false,
  totalCountOfPresaleMintCardForUser: 0
}

export const bitFightersCollection = createSlice({
  name: 'bitFightersCollection',
  initialState,
  reducers: {
    addIntoArray: (state: { value: Array<string>; }, action: PayloadAction<string>) => {
      state.value.push(action.payload);
    },
    clearArray: (state: { value: Array<string>; }) => {
      state.value = [];
    },
    setArray: (state: { value: Array<string>; }, action: PayloadAction<Array<string>>) => {
      // console.log("adding into set array -->", action.payload)
      state.value = action.payload;
    },
    setNFTDetails: (state: { nftData: Array<any>; }, action: PayloadAction<Array<any>>) => {
      // console.log("setting into set array -->", action.payload)
      state.nftData = action.payload;
    },

    setTotalNFTData: (state: { totalNFTData: Array<any>; }, action: PayloadAction<Array<any>>) => {
      state.totalNFTData = action.payload;
    },

    setNFTLoadedBool: (state: { loaded: boolean; }, action: PayloadAction<boolean>) => {
      state.loaded = action.payload;
    },

    SetTotalPreSaleNFT: (state: { preSaleNFTMintedCount: number; }, action: PayloadAction<number>) => {
      state.preSaleNFTMintedCount = action.payload;
    },

    SetTotalDripPreSaleNFT: (state: { drip_preSaleNFTMintedCount: number; }, action: PayloadAction<number>) => {
      state.drip_preSaleNFTMintedCount = action.payload;
    },

    SetTotalOneKClubNF: (state: { totalOneKClubCards: number; }, action: PayloadAction<number>) => {
      state.totalOneKClubCards = action.payload;
    },

    SetTotalMintedOneKClubNF: (state: { oneKClubMintedCards: number; }, action: PayloadAction<number>) => {
      state.oneKClubMintedCards = action.payload;
    },

    SetCurrentPriceOfOnekCard: (state: { currentPriceOfOneKClubCard: number; }, action: PayloadAction<number>) => {
      state.currentPriceOfOneKClubCard = action.payload;
    },


    SetBitfightersNftMintedCount: (state: { bitfightersNFTsMintedCount: number; }, action: PayloadAction<number>) => {
      state.bitfightersNFTsMintedCount = action.payload;
    },

    SetDripfightersNftMintedCount: (state: { bitfightersNFTsMintedCount: number; }, action: PayloadAction<number>) => {
      state.bitfightersNFTsMintedCount = action.payload;
    },

    SetTotalBitfightersNftCount: (state: { totalBitfightersToMint: number; }, action: PayloadAction<number>) => {
      state.totalBitfightersToMint = action.payload;
    },

    SetTotalDripfightersNftCount: (state: { totalDripFightersToMint: number; }, action: PayloadAction<number>) => {
      state.totalDripFightersToMint = action.payload;
    },


    SetTotalInfoOfUserDripPresaleCards: (state: { totalInfoOfUsersDripPresaleCards: Array<DripFighterInfo>; }, action: PayloadAction<Array<DripFighterInfo>>) => {
      state.totalInfoOfUsersDripPresaleCards = action.payload;
    },

    SetTotalInfoOfUserDripPresaleCardsLoaded: (state: { totalInfoOfUsersDripPresaleCardsLoaded: boolean; }, action: PayloadAction<boolean>) => {
      state.totalInfoOfUsersDripPresaleCardsLoaded = action.payload;
    },

    SetTotalCountOfPresaleCarddsOwnedByUser: (state: { totalCountOfPresaleMintCardForUser: number; }, action: PayloadAction<number>) => {
      state.totalCountOfPresaleMintCardForUser = action.payload;
    },

  },
})

export const { addIntoArray, clearArray, setArray,
  setNFTDetails, setNFTLoadedBool, setTotalNFTData, SetTotalPreSaleNFT,
  SetTotalOneKClubNF, SetTotalMintedOneKClubNF,
  SetCurrentPriceOfOnekCard, SetTotalDripPreSaleNFT,
  SetBitfightersNftMintedCount, SetDripfightersNftMintedCount,
  SetTotalBitfightersNftCount, SetTotalDripfightersNftCount, SetTotalInfoOfUserDripPresaleCards, SetTotalInfoOfUserDripPresaleCardsLoaded,
  SetTotalCountOfPresaleCarddsOwnedByUser
} =
  bitFightersCollection.actions

export default bitFightersCollection.reducer
