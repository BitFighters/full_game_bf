// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles'
import store from './stores'
import App from './App';
import reportWebVitals from './reportWebVitals';
import muiTheme from './MuiTheme'
import { Web3ReactProvider } from '@web3-react/core'
import { ExternalProvider, JsonRpcFetchFunc, Web3Provider } from "@ethersproject/providers";
// import { init } from '@amplitude/analytics-node';
import './index.scss';
import './PhaserGame'

import { Moralis } from "moralis";
// import Moralis from 'moralis/dist/moralis.min.js';

const appId = process.env.REACT_APP_MORALIS_APP_ID
const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL
console.log("&&&&&&&&&&&&&&&&&& server url -- ", serverUrl)

// Moralis.start({
//   serverUrl,
//   appId
// });

// init('435f55938ef09712f694d625bd938c2a');
const container = document.getElementById('root')!;
const root = createRoot(container);

function getLibrary(provider: ExternalProvider | JsonRpcFetchFunc) {
  return new Web3Provider(provider);
}

root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <ThemeProvider theme={muiTheme}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <App />
      </Web3ReactProvider>
    </ThemeProvider>
  </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
