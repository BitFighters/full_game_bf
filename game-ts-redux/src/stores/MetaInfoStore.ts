// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface IMetaInfoStore {
  net_speed: string;
  meta_tag_description: string;
  total_connections: number;
}

const initialState: IMetaInfoStore = {
  net_speed: "",
  meta_tag_description: "",
  total_connections: 0
}

export const metaInfoStore = createSlice({
  name: 'metaInfoStore',
  initialState,
  reducers: {
    SetServerLatency: (state: { net_speed: string; }, action: PayloadAction<string>) => {
      state.net_speed = action.payload;
    },

    SetMetaTagDescription: (state: { meta_tag_description: string; }, action: PayloadAction<string>) => {
      state.meta_tag_description = action.payload;
    },

    SetTotalConnections: (state: { total_connections: number; }, action: PayloadAction<number>) => {
      state.total_connections = action.payload;
    },



  },
})

export const { SetServerLatency, SetMetaTagDescription, SetTotalConnections } =
  metaInfoStore.actions

export default metaInfoStore.reducer
