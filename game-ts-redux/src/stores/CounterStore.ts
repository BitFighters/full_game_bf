// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface CounterStore {
  value: number
}

const initialState: CounterStore = {
  value: 0
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state: { value: number; }) => {
      state.value += 1;
    },
    decrement: (state: { value: number; }) => {
      state.value -= 1;
    },
    incrementByAmount: (state: { value: number; }, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
})

export const { increment, decrement, incrementByAmount } =
  counterSlice.actions

export default counterSlice.reducer
