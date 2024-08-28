// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AssetsInterface } from '../utils/interface';


// "user_wallet_address": "0xb4c2d38ca5382b565cb9e8f849da42d8e441b59e",
//   "contract_address": "0x679FC84d0Dcd160a167bD1f52C5782A207d2e895",
//     "web3_balance": 1011000,
//       "web2_balance": 259659,
//         "web2_coins": 0,
//           "web2_balance_spent": 0,
//             "temp_bet_amount": 0,
//               "last_temp_bet_created_on": 1701885505222,
//                 "deposit_count": 3,
//                   "redeem_count": 0,
//                     "created_at": 1696951456773,
//                       "updated_at": 1696951456773


interface IUserBalanceInfo {
  web2_coins: number;
  web2_balance: number;
}

interface ICoinChangeInfo {
  amount: string;
  changed: boolean;
}

interface Web3BalanceStore {
  wbtcBalance: string,
  walletBalance: string,
  betBalance: string,
  decimals: string,

  // assets
  assetsInfo: Array<AssetsInterface>,

  web2CreditBalance: number,

  changeInBalance: string,
  changeBalanceShowBool: boolean,

  balanceInfoUser: IUserBalanceInfo,
  coin_changed: ICoinChangeInfo;
}

const initialState: Web3BalanceStore = {
  wbtcBalance: "",
  walletBalance: "",
  betBalance: "",
  decimals: "",

  // assets
  assetsInfo: [],

  web2CreditBalance: 0,

  changeInBalance: '',
  changeBalanceShowBool: false,

  balanceInfoUser: {
    web2_coins: 0,
    web2_balance: 0
  },
  coin_changed: {
    amount: "",
    changed: false
  }
}

export const web3StoreBalance = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    SetWbtcBalance: (state: { wbtcBalance: string; }, action: PayloadAction<string>) => {
      state.wbtcBalance = action.payload;
    },

    SetWalletBalance: (state: { walletBalance: string; }, action: PayloadAction<string>) => {
      state.walletBalance = action.payload;
    },

    SetBetBalance: (state: { betBalance: string; }, action: PayloadAction<string>) => {
      state.betBalance = action.payload;
    },

    SetDecimals: (state: { decimals: string; }, action: PayloadAction<string>) => {
      state.decimals = action.payload;
    },

    SetAssetsInfo: (state: { assetsInfo: Array<AssetsInterface>; }, action: PayloadAction<Array<AssetsInterface>>) => {
      state.assetsInfo = action.payload;
    },

    SetWeb2CreditBalance: (state: { web2CreditBalance: number; }, action: PayloadAction<number>) => {
      state.web2CreditBalance = action.payload;
    },

    SetChangeInBalanceBool: (state: { changeBalanceShowBool: boolean; }, action: PayloadAction<boolean>) => {
      state.changeBalanceShowBool = action.payload;
    },

    SetChangeInBalance: (state: { changeInBalance: string; }, action: PayloadAction<string>) => {
      state.changeInBalance = action.payload;
    },

    SetChangesInBalanceInfo: (state: { balanceInfoUser: IUserBalanceInfo; }, action: PayloadAction<IUserBalanceInfo>) => {
      console.log("debug_inventory", action.payload)
      state.balanceInfoUser = action.payload;
    },

    SetChangeInCoin: (state: { coin_changed: ICoinChangeInfo }, action: PayloadAction<ICoinChangeInfo>) => {
      state.coin_changed = action.payload;
    }
  },
})

export const { SetWbtcBalance, SetWalletBalance, SetBetBalance, SetChangeInCoin,
  SetDecimals, SetAssetsInfo, SetWeb2CreditBalance, SetChangeInBalance, SetChangeInBalanceBool, SetChangesInBalanceInfo } = web3StoreBalance.actions

export default web3StoreBalance.reducer
