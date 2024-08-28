// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface Web3Store {
  userAddress: string;
  loggedIn: boolean;
  web3Connected: boolean;
  web2EmailAddress: string;
  minted_id: number;
  player_id: string;
}

const initialState: Web3Store = {
  userAddress: "",
  loggedIn: false,
  web3Connected: false,
  web2EmailAddress: "",
  minted_id: 0,
  player_id: ""
}

export const web3StoreSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    Login: (state: { userAddress: string; loggedIn: boolean }, action: PayloadAction<string>) => {
      state.userAddress = action.payload;
      state.loggedIn = true;
    },

    SetMintedIdForGame: (state: { minted_id: number; }, action: PayloadAction<number>) => {
      state.minted_id = action.payload;
    },

    SetPlayerIdForGame: (state: { player_id: string; }, action: PayloadAction<string>) => {
      console.log("SetPlayerIdForGame--", action)
      state.player_id = action.payload;
    },

    LogOut: (state: { userAddress: string; loggedIn: boolean },) => {
      console.log("logging out ..")
      state.userAddress = "";
      state.loggedIn = false;
    },
    SetConnectedWeb3: (state: { web3Connected: boolean }, action: PayloadAction<boolean>) => {
      state.web3Connected = action.payload;
    },

    Web2Login: (state: { web2EmailAddress: string }, action: PayloadAction<string>) => {
      state.web2EmailAddress = action.payload;
    }
  },
})

export const { Login, LogOut, SetConnectedWeb3, Web2Login, SetMintedIdForGame, SetPlayerIdForGame, } =
  web3StoreSlice.actions

export default web3StoreSlice.reducer
