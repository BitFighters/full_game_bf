// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface FightsData {
  current_fight_id: string,

  total_bet_p1: number,
  total_bet_p2: number,

  win_pot_p1: number,
  win_pot_p2: number,

  player1: string,
  player2: string,

  self_bet_p1: number,
  self_bet_p2: number,

  fight_winner: string,
}

const initialState: FightsData = {
  current_fight_id: "",
  total_bet_p1: 0,
  total_bet_p2: 0,
  self_bet_p1: 0,
  self_bet_p2: 0,
  fight_winner: "",

  win_pot_p1: 0,
  win_pot_p2: 0,

  player1: "",
  player2: "",
}

export const fightInfoCollectionStore = createSlice({
  name: 'fightInfoCollectionStore',
  initialState,
  reducers: {
    SetCurrentFightId: (state: { current_fight_id: string; }, action: PayloadAction<string>) => {
      state.current_fight_id = action.payload;
    },

    SetP1TotalBet: (state: { total_bet_p1: number; }, action: PayloadAction<number>) => {
      state.total_bet_p1 = action.payload;
    },

    SetP2TotalBet: (state: { total_bet_p2: number; }, action: PayloadAction<number>) => {
      state.total_bet_p2 = action.payload;
    },

    SetP1SelfBet: (state: { self_bet_p1: number; }, action: PayloadAction<number>) => {
      state.self_bet_p1 = action.payload;
    },

    SetP2SelfBet: (state: { self_bet_p2: number; }, action: PayloadAction<number>) => {
      state.self_bet_p2 = action.payload;
    },

    SetP1: (state: { player1: string; }, action: PayloadAction<string>) => {
      state.player1 = action.payload;
    },

    SetP2: (state: { player1: string; }, action: PayloadAction<string>) => {
      state.player1 = action.payload;
    },

    SetP1WinPot: (state: { win_pot_p1: number; }, action: PayloadAction<number>) => {
      state.win_pot_p1 = action.payload;
    },

    SetP2WinPot: (state: { win_pot_p2: number; }, action: PayloadAction<number>) => {
      state.win_pot_p2 = action.payload;
    },

    SetFightWinner: (state: { fight_winner: string; }, action: PayloadAction<string>) => {
      state.fight_winner = action.payload;
    },

  },
})

export const { SetCurrentFightId, SetP1TotalBet, SetP2TotalBet, SetP1SelfBet, SetP2SelfBet, SetFightWinner, SetP1, SetP2, SetP1WinPot, SetP2WinPot } =
  fightInfoCollectionStore.actions

export default fightInfoCollectionStore.reducer
