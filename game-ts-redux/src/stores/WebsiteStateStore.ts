// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ServersInfo {
  room_id: string;
  active_users: string;
  total_users: string;
  region: string;
}

export interface LeaderBoardData {
  user_wallet_address: string;
  web2_balance: number;
  num_fights: number;
}

interface IWebsiteStateStore {
  gameLoading: boolean;
  showGameServersList: boolean;
  serversInfo: Array<ServersInfo>;
  selected_roomId: string;
  selected_server_url: string;
  region: string;
  leaderboardOpen: boolean;
  leaderboardData: any;

  showing_jackpot_wheel: boolean;
  jackpot_wheel_target_value: number;

  money_win_screen_target_value: number;

  system_wallets_info: Array<{ index: string, value: number }>;
}

const initialState: IWebsiteStateStore = {
  gameLoading: false,
  showGameServersList: false,
  serversInfo: [],
  selected_roomId: "",
  selected_server_url: "",
  region: "Washington_DC",
  leaderboardOpen: false,
  leaderboardData: { data: [], tournament_data: [] },

  showing_jackpot_wheel: false,
  jackpot_wheel_target_value: 0,
  money_win_screen_target_value: 0,

  system_wallets_info: []
};

export const websiteStateInfoStore = createSlice({
  name: "websiteStateInfoStore",
  initialState,
  reducers: {
    SetGameLoadingState: (state: { gameLoading: boolean }, action: PayloadAction<boolean>) => {
      state.gameLoading = action.payload;
    },

    SetShowGameServersList: (state: { showGameServersList: boolean }, action: PayloadAction<boolean>) => {
      state.showGameServersList = action.payload;
    },

    SetGameServersData: (state: { serversInfo: Array<ServersInfo> }, action: PayloadAction<Array<ServersInfo>>) => {
      console.log("in_setting_game_server_data ", action.payload);
      state.serversInfo = action.payload;
    },

    SetSelectedRoomId: (state: { selected_roomId: string }, action: PayloadAction<string>) => {
      state.selected_roomId = action.payload;
    },

    SetSelectedGameServerURL: (state: { selected_server_url: string }, action: PayloadAction<string>) => {
      state.selected_server_url = action.payload;
    },

    SetSelectedRegionofGameServer: (state: { region: string }, action: PayloadAction<string>) => {
      state.region = action.payload;
    },

    SetLeaderBoardOpen: (state: { leaderboardOpen: boolean }, action: PayloadAction<boolean>) => {
      state.leaderboardOpen = action.payload;
    },

    SetLeaderBoardData: (state: { leaderboardData: Array<any> }, action: PayloadAction<Array<any>>) => {
      state.leaderboardData = action.payload;
    },

    SetShowingJackpotWheel: (state: { showing_jackpot_wheel: boolean }, action: PayloadAction<boolean>) => {
      state.showing_jackpot_wheel = action.payload;
    },

    SetJackpotWheelTargetValue: (state: { jackpot_wheel_target_value: number }, action: PayloadAction<number>) => {
      state.jackpot_wheel_target_value = action.payload;
    },

    SetBigWinScreenTargetValue: (state: { money_win_screen_target_value: number }, action: PayloadAction<number>) => {
      state.money_win_screen_target_value = action.payload;
    },

    SetSystemWalletsInfo: (state: { system_wallets_info: any }, action: PayloadAction<Array<{ index: string, value: number }>>) => {
      state.system_wallets_info = action.payload;
    },


  },
});

export const {
  SetGameLoadingState,
  SetShowGameServersList,
  SetSelectedRegionofGameServer,
  SetShowingJackpotWheel,
  SetJackpotWheelTargetValue,
  SetGameServersData,
  SetSelectedRoomId,
  SetSelectedGameServerURL,
  SetLeaderBoardOpen,
  SetLeaderBoardData,
  SetBigWinScreenTargetValue,
  SetSystemWalletsInfo
} = websiteStateInfoStore.actions;

export default websiteStateInfoStore.reducer;
