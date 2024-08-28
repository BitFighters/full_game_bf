// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'


export interface IAssetsOfPlayer {
  asset_name: string,
  active_assets: 0,
  used_assets: 0,
}

interface IAssetStoreManager {
  assets: Array<IAssetsOfPlayer>,
  equippedBrewCount: number,
  in_hand_brew: boolean,
}

const initialState: IAssetStoreManager = {
  assets: [],
  equippedBrewCount: 0,
  in_hand_brew: false
}

export const AssetsManager = createSlice({
  name: 'assets_manager',
  initialState,
  reducers: {

    SetAssetsInAssetManager: (state: { assets: Array<IAssetsOfPlayer>; }, action: PayloadAction<Array<IAssetsOfPlayer>>) => {
      state.assets = action.payload;
    },

    SetEquippedBrewCount: (state: { equippedBrewCount: number; }, action: PayloadAction<number>) => {
      state.equippedBrewCount = action.payload;
    },
    SetInHandBrew: (state: { in_hand_brew: boolean; }, action: PayloadAction<boolean>) => {
      state.in_hand_brew = action.payload;
    },
  },
})

export const { SetAssetsInAssetManager, SetEquippedBrewCount, SetInHandBrew } = AssetsManager.actions

export default AssetsManager.reducer
