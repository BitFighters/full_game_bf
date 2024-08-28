// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export enum MessageType {
  Chat = 10,
  Announcement = 20,
  FightAnnouncement = 30
}

export interface IChatObject {
  walletAddress: string,
  message: string,
  nick_name: string,
  direction: string,
  type?: MessageType,
}

interface IMsgObject {
  chatMessage: Array<IChatObject>,
  chatUpdate: 0,
  walletAddress: string
}

const initialState: IMsgObject = {
  chatMessage: [],
  chatUpdate: 0,
  walletAddress: ""
}

export const chatMessageStore = createSlice({
  name: 'chatstore',
  initialState,
  reducers: {
    addToChatArray: (state: { chatMessage: Array<IChatObject>; chatUpdate: number }, action: PayloadAction<IChatObject>) => {
      console.log("adding ...", action.payload)
      state.chatMessage.push(action.payload);
      state.chatUpdate += 1;
    },

    AddInitialToChatArray: (state: { chatMessage: Array<IChatObject>; walletAddress: string }, action: PayloadAction<Array<IChatObject>>) => {
      // console.log("all_chats adding here")
      for (let i = 0; i < action.payload.length; i++) {
        state.chatMessage.push(action.payload[i]);
      }
    },
  },
})

export const { addToChatArray, AddInitialToChatArray } =
  chatMessageStore.actions

export default chatMessageStore.reducer
