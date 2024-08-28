// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PageStates } from "../landing-page/components/SidePanel/SidePanel";
// import { RootState } from ".";

// interface MintCardState {
//   cardType: "big_info" | "small_info" | "sold_out";
// }

interface MintCardState {
  state_selected: string;
  global_ref_code: string;
}

const initialState: MintCardState = {
  state_selected: PageStates.NotConnectedState,
  global_ref_code: "",
};

export const MintCardStateSlice = createSlice({
  name: "mintCardState",
  initialState,
  reducers: {
    setCardState: (state: { state_selected: string; }, action: PayloadAction<string>) => {
      // console.log("sidepanel clicked.. ", action.payload)
      state.state_selected = action.payload;
    },

    SetGlobalRefCode: (state: { global_ref_code: string; }, action: PayloadAction<string>) => {
      state.global_ref_code = action.payload;
    },
  },
});

export const { setCardState, SetGlobalRefCode } = MintCardStateSlice.actions;

// export const selectMintCardState = (state: RootState) =>
//   state.mintCardStateStore.cardType;

export default MintCardStateSlice.reducer;
