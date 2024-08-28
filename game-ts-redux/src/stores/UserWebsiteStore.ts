// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */


import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BetData } from '../utils/fight_utils';

export interface FRIENDS {
  "user_wallet_address": string,
}

export interface USER_DETAILS {
  user_wallet_address: string,
  pending: Array<any>,
  friends: Array<any>,
  sent: Array<any>,
}

export interface QUEUE_DATA {
  user_wallet_address: string,
  current_position: number,
  nick_name: string,
  profile_image: string,
  assigned_fight_id?: string;
}

export interface IQueueCombined {
  fight_id: string;

  p1_wallet: string;
  p2_wallet: string;

  p1_nick_name: string;
  p2_nick_name: string;

  p1_profile_image: string;
  p2_profile_image: string;

  p1_total_bet: number;
  p2_total_bet: number;

  total_bet: number;

  your_bet_p1?: number;
  your_bet_p2?: number;

}

export interface IBetSelectedPlayer {
  fight_id: string;

  p1_wallet: string;
  p2_wallet: string;

  p1_nick_name: string;
  p2_nick_name: string;

  p1_profile_image: string;
  p2_profile_image: string;

  p1_total_bet: number;
  p2_total_bet: number;

  total_bet: number;
  selected_player: string;

}

interface UserWebsiteStore {
  path: string,
  auth_token: string,
  User_Data: USER_DETAILS
  QueueData: Array<QUEUE_DATA>

  CombinedQueueData: Array<IQueueCombined>

  GotNotificationFromServer: boolean
  NotificationMessageFromServer: string,

  GotFightAnnouncementFromServer: boolean,
  FightAnnouncementMessageFromServer: string,

  ShowQueueBox: boolean,
  ShowProfileWindow: boolean,
  ShowMenuBox: boolean,
  ShowLog: boolean
  ValidUser: boolean;
  maticBalance: string,
  wbtcBalance: string,
  bitsBalance: string,
  metaMaskInstalled: boolean,
  registerShowInGame: boolean,
  showControls: boolean,

  websocketConnectedTime: number,


  LoggerMessage: string,
  ShowGangView: boolean,

  ShowStatsView: boolean,
  OtherPlayerSelectedForStats: string,

  playersBetInfo: Array<BetData>;

  showWinnerCardAtFightEnd: boolean;

  movementAbilityPlayer: boolean;


  queueJoinedCounter: number,
  queuJoinedLastTime: number
}

const initialState: UserWebsiteStore = {
  path: "",
  auth_token: "",
  User_Data: {
    user_wallet_address: "",
    pending: [],
    friends: [],
    sent: [],
  },
  QueueData: [],
  CombinedQueueData: [],
  GotNotificationFromServer: false,
  NotificationMessageFromServer: "",
  ShowLog: false,
  ShowQueueBox: false,
  ShowMenuBox: false,
  ValidUser: true,
  maticBalance: "",
  wbtcBalance: "",
  bitsBalance: "",
  GotFightAnnouncementFromServer: false,
  FightAnnouncementMessageFromServer: "",
  metaMaskInstalled: false,
  registerShowInGame: false,
  showControls: false,

  websocketConnectedTime: 0,
  LoggerMessage: "",
  ShowProfileWindow: true,
  ShowGangView: false,

  playersBetInfo: [],
  showWinnerCardAtFightEnd: false,

  ShowStatsView: false,
  OtherPlayerSelectedForStats: "",
  movementAbilityPlayer: true,


  queueJoinedCounter: 0,
  queuJoinedLastTime: 0
}

export const UserWebsiteStoreSlice = createSlice({
  name: 'userpath',
  initialState,
  reducers: {
    ChangePath: (state: { path: string; }, action: PayloadAction<string>) => {
      console.log("changing current path -- ")
      state.path = action.payload;
    },
    ChangeAuthTOken: (state: { auth_token: string; }, action: PayloadAction<string>) => {
      state.auth_token = action.payload;
    },
    ChangeUserData: (state: { User_Data: USER_DETAILS; }, action: PayloadAction<USER_DETAILS>) => {
      state.User_Data = action.payload;
    },

    ChangeQueueData: (state: { QueueData: Array<QUEUE_DATA>; }, action: PayloadAction<Array<QUEUE_DATA>>) => {
      state.QueueData = action.payload;
    },

    ChangeCombinedQueueData: (state: { CombinedQueueData: Array<IQueueCombined>; }, action: PayloadAction<Array<IQueueCombined>>) => {
      state.CombinedQueueData = action.payload;
    },

    ChangeNotificationStateFromServer: (state: { GotNotificationFromServer: boolean; }, action: PayloadAction<boolean>) => {
      state.GotNotificationFromServer = action.payload;
    },
    ChangeNotificationMessageFromServer: (state: { NotificationMessageFromServer: string; }, action: PayloadAction<string>) => {
      state.NotificationMessageFromServer = action.payload;
    },

    ChangeFightAnnouncementStateFromServer: (state: { GotFightAnnouncementFromServer: boolean; }, action: PayloadAction<boolean>) => {
      // console.log("BroadcastingAnnouncement status", action.payload)
      state.GotFightAnnouncementFromServer = action.payload;
    },
    ChangeFightAnnouncementMessageFromServer: (state: { FightAnnouncementMessageFromServer: string; }, action: PayloadAction<string>) => {
      // console.log("BroadcastingAnnouncement message", action.payload)
      state.FightAnnouncementMessageFromServer = action.payload;
    },

    ChangeShowQueueBox: (state: { ShowQueueBox: boolean; }, action: PayloadAction<boolean>) => {
      state.ShowQueueBox = action.payload;
    },

    ChangeShowLog: (state: { ShowLog: boolean; }, action: PayloadAction<boolean>) => {
      state.ShowLog = action.payload;
    },

    ChangeShowGangView: (state: { ShowGangView: boolean; }, action: PayloadAction<boolean>) => {
      state.ShowGangView = action.payload;
    },

    ChangeShowStatsView: (state: { ShowStatsView: boolean; }, action: PayloadAction<boolean>) => {
      state.ShowStatsView = action.payload;
    },

    SelectOtherPlayerForStats: (state: { OtherPlayerSelectedForStats: string; }, action: PayloadAction<string>) => {
      state.OtherPlayerSelectedForStats = action.payload;
    },

    ChangeShowMenuBox: (state: { ShowMenuBox: boolean; }, action: PayloadAction<boolean>) => {
      //console.log("in ChangeShowMenuBox", action.payload)
      state.ShowMenuBox = action.payload;
    },

    ChangeValidUserState: (state: { ValidUser: boolean; }, action: PayloadAction<boolean>) => {
      state.ValidUser = action.payload;
    },

    ChangeMaticBalance: (state: { maticBalance: string; }, action: PayloadAction<string>) => {
      console.log("changing matic balance ..", action.payload)
      state.maticBalance = action.payload;
    },

    ChangewbtcBalance: (state: { wbtcBalance: string; }, action: PayloadAction<string>) => {
      console.log("changing wbtc balance ..", action.payload)
      state.wbtcBalance = action.payload;
    },

    ChangeBitsBalance: (state: { bitsBalance: string; }, action: PayloadAction<string>) => {
      console.log("changing bits balance ..", action.payload)
      state.bitsBalance = action.payload;
    },

    ChangeMetaMaskInstalled: (state: { metaMaskInstalled: boolean; }, action: PayloadAction<boolean>) => {
      state.metaMaskInstalled = action.payload;
    },

    ChangeRegisterShowInGame: (state: { registerShowInGame: boolean; }, action: PayloadAction<boolean>) => {
      state.registerShowInGame = action.payload;
    },

    ChangeShowControls: (state: { showControls: boolean; }, action: PayloadAction<boolean>) => {
      state.showControls = action.payload;
    },

    ChangeWebSocketConnectedTime: (state: { websocketConnectedTime: number; }, action: PayloadAction<number>) => {
      state.websocketConnectedTime = action.payload;
    },

    ChangeLoggerMessage: (state: { LoggerMessage: string; }, action: PayloadAction<string>) => {
      state.LoggerMessage = action.payload;
    },

    ChangeProfileWindowView: (state: { ShowProfileWindow: boolean; }, action: PayloadAction<boolean>) => {
      state.ShowProfileWindow = action.payload;
    },

    AddPlayersBetInfo: (state: { playersBetInfo: Array<BetData>; }, action: PayloadAction<Array<BetData>>) => {
      state.playersBetInfo = action.payload;
    },

    ShowWinnerCardAtFightEnd: (state: { showWinnerCardAtFightEnd: boolean; }, action: PayloadAction<boolean>) => {
      state.showWinnerCardAtFightEnd = action.payload;
    },


    SetMovementAbilityOfPlayer: (state: { movementAbilityPlayer: boolean; }, action: PayloadAction<boolean>) => {
      state.movementAbilityPlayer = action.payload;
    },


    SetQueueJoinedCount: (state: { movementAbilityPlayer: boolean; }, action: PayloadAction<boolean>) => {
      state.queueJoinedCounter = action.payload;
      state.queuJoinedLastTime = new Date().getTime()
    },


  },
})

export const { ChangePath, ChangeAuthTOken, ChangeUserData,
  ChangeQueueData,
  ChangeCombinedQueueData,
  ChangeNotificationStateFromServer,
  ChangeNotificationMessageFromServer,
  ChangeFightAnnouncementStateFromServer,
  ChangeFightAnnouncementMessageFromServer,
  ChangeShowQueueBox, ChangeShowMenuBox, ChangeShowLog,
  ChangeValidUserState, ChangeMaticBalance, ChangeBitsBalance,
  ChangewbtcBalance,
  ChangeMetaMaskInstalled, ChangeShowControls, ChangeWebSocketConnectedTime, ChangeLoggerMessage, ChangeShowGangView, ChangeShowStatsView, SelectOtherPlayerForStats,
  ChangeRegisterShowInGame, ChangeProfileWindowView, AddPlayersBetInfo, ShowWinnerCardAtFightEnd, SetMovementAbilityOfPlayer,

  SetQueueJoinedCount
} =
  UserWebsiteStoreSlice.actions

export default UserWebsiteStoreSlice.reducer
