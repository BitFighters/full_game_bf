// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { QueueSingleEntry } from '../utils/interface';


interface QueueDetaildInfo {
  queue_to_fight_info_map: any;
  // bet_queue_view_map: any;

  added_to_queue_pool: boolean;
  queuePoolMessage: string;
  queueCount: number;
}

const initialState: QueueDetaildInfo = {
  queue_to_fight_info_map: {},
  // bet_queue_view_map: {},

  added_to_queue_pool: false,
  queuePoolMessage: "",
  queueCount: 0
}

export const queueInfoStore = createSlice({
  name: 'queueInfoStore',
  initialState,
  reducers: {

    SetFightEntryInfo: (state: { queue_to_fight_info_map: any; }, action: PayloadAction<any>) => {
      state.queue_to_fight_info_map = action.payload;
    },

    SetQueuePoolState: (state: { added_to_queue_pool: boolean; }, action: PayloadAction<boolean>) => {
      state.added_to_queue_pool = action.payload;
    },

    SetQueueCount: (state: { queueCount: number; }, action: PayloadAction<number>) => {
      state.queueCount = action.payload;
    },

    // SetBetQueueMap: (state: { bet_queue_view_map: any; }, action: PayloadAction<any>) => {
    //   state.bet_queue_view_map = action.payload;
    // },

  },
})

export const { SetFightEntryInfo, SetQueuePoolState, SetQueueCount } =
  queueInfoStore.actions

export default queueInfoStore.reducer
