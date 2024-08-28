// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface EditorState {
  value: string
}

const initialState: EditorState = {
  value: "Abhishek"
}

export const textEditor = createSlice({
  name: 'textEditor',
  initialState,
  reducers: {
    Set: (state: { value: string; }, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
    Del: (state: { value: string; }) => {
      state.value = "";
    },
    Add: (state: { value: string; }, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
})

export const { Set, Del, Add } =
  textEditor.actions

export default textEditor.reducer
