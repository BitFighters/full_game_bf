// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface IGeoLocationInfo {
  country_name: string;
  country_code: string;
  continent_code: string;
  city: string;
}

interface IUsersInfo {
  geoInfo: IGeoLocationInfo,
}

const initialState: IUsersInfo = {
  geoInfo: {
    country_code: "",
    country_name: "",
    continent_code: "",
    city: ""
  }
}

export const UserGeoStore = createSlice({
  name: 'userpath',
  initialState,
  reducers: {
    ChangeGeoInfo: (state: { geoInfo: IGeoLocationInfo; }, action: PayloadAction<IGeoLocationInfo>) => {
      state.geoInfo = action.payload;
    },
  },
})

export const { ChangeGeoInfo } =
  UserGeoStore.actions

export default UserGeoStore.reducer
