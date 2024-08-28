// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface IAuthStore {
  player_auth_token: string;
}

const initialState: IAuthStore = {
  player_auth_token: ""
}

export const authStoreCollection = createSlice({
  name: 'authStoreCollection',
  initialState,
  reducers: {
    setPlayerAuthToken: (state: { player_auth_token: string; }, action: PayloadAction<string>) => {
      state.player_auth_token = action.payload;
    },
  },
})

export const { setPlayerAuthToken } =
  authStoreCollection.actions

export default authStoreCollection.reducer
