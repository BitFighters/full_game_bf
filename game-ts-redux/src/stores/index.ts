// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { enableMapSet } from 'immer'
import { configureStore } from '@reduxjs/toolkit'
// import userReducer from './UserStore'
// import computerReducer from './ComputerStore'
// import whiteboardReducer from './WhiteboardStore'
// import chatReducer from './ChatStore'
// import roomReducer from './RoomStore'

import counterReducer from './CounterStore'
import textEditorReducer from './TextStore'
import web3storeReducer from './Web3Store'
import bitfighterReducer from './BitFighters'
import chatMessageStore from './ChatStore'
import userpathStore from './UserWebsiteStore'
import playerDataStore from './PlayerData'
import userActionsDataStore from './UserActions'
import web3StoreBalance from './Web3StoreBalances'
import userGeoStore from './UserGeoStore'
import AuthStore from './AuthStore'
import NotificationStore from './NotificationStore'
import AssetStore from './AssetStore'
import MetaInfoStore from './MetaInfoStore'
import FightInfoStore from './FightsStore'
import QueueDetailedInfo from './QueueDetailedInfo'
import MintCardStateStore from './MintCardStateStore'
import WebsiteStateStore from './WebsiteStateStore'

enableMapSet()

const store = configureStore({
  reducer: {
    counter: counterReducer,
    editor: textEditorReducer,
    web3store: web3storeReducer,
    bitFighters: bitfighterReducer,
    chatStore: chatMessageStore,
    userPathStore: userpathStore,
    playerDataStore: playerDataStore,
    userActionsDataStore: userActionsDataStore,
    web3BalanceStore: web3StoreBalance,
    geoStore: userGeoStore,
    authStore: AuthStore,
    notificatinoStore: NotificationStore,
    assetStore: AssetStore,
    metaInfoStore: MetaInfoStore,
    fightInfoStore: FightInfoStore,
    queueDetailedInfo: QueueDetailedInfo,
    mintCardStateStore: MintCardStateStore,
    websiteStateStore: WebsiteStateStore,
  },
  // Temporary disable serialize check for redux as we store MediaStream in ComputerStore.
  // https://stackoverflow.com/a/63244831
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store
