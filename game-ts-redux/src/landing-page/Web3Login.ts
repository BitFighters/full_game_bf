// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { fetchAllNFTsFromDbEntries } from "../hooks/FetchNFT";
import {
  setNFTDetails,
  setNFTLoadedBool,
  setTotalNFTData,
} from "../stores/BitFighters";
import { validation } from "../utils/Validation";
import { ethers } from "ethers";
import {
  ChangeAuthTOken,
  ChangeLoggerMessage,
  ChangeUserData,
  ChangeValidUserState,
  USER_DETAILS,
} from "../stores/UserWebsiteStore";
import {
  checkIfUserSignedMetamask,
  fetchNFTsFromDB,
  loginAndAuthenticateUser,
  postUserSignedMessage,
  updateNFTsInDB,
} from "../hooks/ApiCaller";
import store from "../stores";
import { Login, SetConnectedWeb3 } from "../stores/Web3Store";
import MetaMaskOnboarding from "@metamask/onboarding";
import detectEthereumProvider from "@metamask/detect-provider";
import {
  FetchDripPresaleInfoMintedByUser,
  FetchPresaleInfoMintedByUser,
  getBalances,
  updateBitfightersMintedCountAndTotal,
  updateDripPresaleMintedCount,
  updateOneKClubMintedCount,
  updatePresaleMintedCount,
} from "../utils/web3_utils";
import { setCardState } from "../stores/MintCardStateStore";
import { PageStates } from "./components/SidePanel/SidePanel";
import { Buffer } from "buffer";
import { ReaderFunctions } from "../contract/ReaderFunctions";

// import {
//   recoverPersonalSignature,
// } from '@metamask/eth-sig-util';

// import { SetWbtcBalance } from '../stores/Web3StoreBalances';
// import WalletConnectProvider from "@walletconnect/web3-provider";

//
// const from = accounts[0];
//       const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`;
//       const sign = personalSignResult.innerHTML;
//       const recoveredAddr = recoverPersonalSignature({
//         data: msg,
//         sig: sign,
//       });
//

// @ts-ignore: Ignore the TypeScript error for the next lines
declare global {
  interface Window {
    // @ts-ignore: Ignore the TypeScript error for the next lines
    ethereum?: any;
  }
}

const siweSign = async (accounts: Array<string>, siweMessage: string) => {
  console.log("in siweSign");
  try {
    const from = accounts[0];
    // const hashedMessage = Web3.utils.sha3(message);
    const msg = `0x${Buffer.from(siweMessage, "utf8").toString("hex")}`;
    // @ts-ignore: Ignore the TypeScript error for the next line
    const sign = await window.ethereum.request({
      method: "personal_sign",
      params: [msg, from],
    });
    console.log("in siweSign ", sign);
    return sign;
  } catch (err) {
    console.error("error in siweSign", err);
    return "Error";
  }
};

const SignatureMessage =
  "By interacting with this game you are acknowledging that you have read, understood, and agree to be bound by the terms and conditions found here: https://docs.bitfighters.club/terms-of-service Failure to comply with these terms and conditions may result in, but will not be limited to, disqualification from participation in the game and the forfeiture of your account and all associated game assets. Sign to confirm and continue.";

export async function Web3Login() {
  console.log("in web3login ", window.ethereum);
  const onboarding = new MetaMaskOnboarding();

  if (!store.getState().userPathStore.metaMaskInstalled) {
    onboarding.startOnboarding();
    return;
  }
  console.log("in web3login ....(*******", process.env.REACT_APP_DEV_ENV);
  // @ts-ignore: Ignore the TypeScript error for the next lines
  await window.ethereum.enable();
  // @ts-ignore: Ignore TypeScript errors for the entire file
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const network = await provider.getNetwork();
  if (process.env.REACT_APP_DEV_ENV === "production") {
    const SUPPORTED_CHAINIDS = [43114];
    const SUPPORTED_NETWORK_LONG = "Avalanche Network";
    console.log("in web3login ....*******", network.name, process.env.NODE_ENV);
    if (SUPPORTED_CHAINIDS.indexOf(network.chainId) === -1) {
      if (
        window.confirm(
          `Only ${SUPPORTED_NETWORK_LONG} is currently supported. Would you like to switch to ${SUPPORTED_NETWORK_LONG} now?`
        ) == true
      ) {
        // @ts-ignore: Ignore TypeScript errors for the entire file
        const check = await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0xA86A",
              rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
              chainName: "Avalanche Network",
              nativeCurrency: {
                name: "AVAX",
                symbol: "AVAX",
                decimals: 18,
              },
              blockExplorerUrls: ["https://snowtrace.io/"],
            },
          ],
        });
        console.log("check..", check);
      } else {
        return;
      }
    }
  } else {
    const SUPPORTED_CHAINIDS = [808813];
    const SUPPORTED_NETWORK_LONG = "BOB Testnet";
    console.log(
      "in web3login ....(*******",
      network.name,
      network.chainId,
      process.env.NODE_ENV
    );
    if (SUPPORTED_CHAINIDS.indexOf(network.chainId) === -1) {
      if (
        window.confirm(
          `Only ${SUPPORTED_NETWORK_LONG} is currently supported. Would you like to switch to ${SUPPORTED_NETWORK_LONG} now?`
        ) == true
      ) {
        // @ts-ignore: Ignore more errors as needed
        // const check = await window.ethereum.request({
        //   method: "wallet_addEthereumChain",
        //   params: [
        //     {
        //       chainId: "0xA869",
        //       rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
        //       chainName: "Avalanche Testnet C-Chain",
        //       nativeCurrency: {
        //         name: "AVAX",
        //         symbol: "AVAX",
        //         decimals: 18,
        //       },
        //       blockExplorerUrls: ["https://testnet.snowtrace.io/"],
        //     },
        //   ],
        // });

        const check = await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0xc576d",
              rpcUrls: ["https://bob-sepolia.rpc.gobob.xyz"],
              chainName: "BOB Testnet",
              nativeCurrency: {
                name: "ETH",
                symbol: "ETH",
                decimals: 18,
              },
              // blockExplorerUrls: ["https://testnet.snowtrace.io/"],
            },
          ],
        });
        console.log("check..", check);
      } else {
        return;
      }
    }
  }
  console.log("here debug ")
  const accounts = await provider.send("eth_requestAccounts", []);

  // check if signature exist in DB
  const userMetamaskSigned = await checkIfUserSignedMetamask(accounts[0]);
  console.log("Validation before siweSign -- ", userMetamaskSigned);
  if (!userMetamaskSigned) {
    const signedRes = await siweSign(accounts, SignatureMessage);
    if (signedRes === "Error") {
      window.alert("Failed Metamask signature. Without that you cannot play.");
      return;
    }
    // post data to db
    postUserSignedMessage(accounts[0], signedRes);
    // verifyMetamaskSignature(accounts[0], SignatureMessage, signedRes)
  }

  localStorage.setItem("connected_matic_network", "10");
  localStorage.setItem("last_web3_login_time", (new Date()).toISOString())
  // const timestamp = new Date().toISOString();
  console.log("-------accounts---- .");
  console.log(accounts[0]);
  console.log("----------- .");
  if (!validation(accounts[0])) {
    store.dispatch(ChangeValidUserState(false));
    return;
  }
  store.dispatch(Login(accounts[0]));
  store.dispatch(setCardState(PageStates.ProgressState));
  store.dispatch(ChangeValidUserState(true));

  // check if user owns 1k club card - prod

  const auth_token: string = await loginAndAuthenticateUser(accounts[0]);
  store.dispatch(ChangeAuthTOken(auth_token));

  const rc = new ReaderFunctions();
  const fetchTokensOfUserFromSC = await rc.fetchTokenOfUserFromSC();

  // const fetchTokensOfUserFromSC =
  //   await ReaderFunctions.fetchTokenOfUserFromSC();
  let result = await fetchNFTsFromDB(accounts[0]);
  console.log("______debug_tokenIds____web2__ ", result.message.length);
  // if mismatch. then call. the update function.
  if (result.message.length !== fetchTokensOfUserFromSC.length) {
    if (
      !(
        store.getState().web3store.userAddress === "0x49d318a4f85936fe49d86c0c5a0633bc27ec480c"
        || store.getState().web3store.userAddress === "0x583f89d1d1777c475877919c616f562c2830d57a"
      )
    ) {
      await updateNFTsInDB(accounts[0]);
    }
  }
  result = await fetchNFTsFromDB(accounts[0]);

  const dataOfNFTS = await fetchAllNFTsFromDbEntries(result.message);
  store.dispatch(setTotalNFTData(result.message));
  store.dispatch(setNFTDetails(dataOfNFTS));
  store.dispatch(setNFTLoadedBool(true));
  store.dispatch(Login(accounts[0]));
  store.dispatch(SetConnectedWeb3(true));

  await getBalances(store.getState().web3store.userAddress);

  // update nfts infos
  await updateBitfightersMintedCountAndTotal();
  await updatePresaleMintedCount();
  await updateOneKClubMintedCount();
  await FetchPresaleInfoMintedByUser();
}

function handleEthereum() {
  const { ethereum } = window;
  if (ethereum && ethereum.isMetaMask) {
    console.log("Ethereum successfully detected!");
    store.dispatch(ChangeLoggerMessage("Ethereum successfully detected!"));
    // Access the decentralized web!
  } else {
    console.log("Please install MetaMask!");
    store.dispatch(ChangeLoggerMessage("Please install MetaMask!"));
  }
}

export async function PhoneWeb3Login() {
  console.log("in web3login in phone ....(*******");
  // 8e5879b2c1feba071144472125c9ff8f

  // const provider = new ethers.providers.Web3Provider(walletConnectprovider)
  //  Enable session (triggers QR Code modal)
  // await provider.enable();

  // // Create a connector
  // const connector = new WalletConnect({
  //   bridge: "https://bridge.walletconnect.org", // Required
  //   qrcodeModal: QRCodeModal,
  // });
  // // Check if connection is already established
  // if (!connector.connected) {
  //   // create new session
  //   connector.createSession(
  //     {chainId: 80001}
  //   );
  // }

  // // Subscribe to connection events
  // connector.on("connect", (error, payload) => {
  //   console.log("payload ", payload)
  //   if (error) {
  //     throw error;
  //   }

  //   // Get provided accounts and chainId
  //   const { accounts, chainId } = payload.params[0];
  // });

  const provider = await detectEthereumProvider();

  if (provider) {
    console.log("Ethereum successfully detected!");
    store.dispatch(ChangeLoggerMessage("Ethereum successfully detected!"));

    /// Legacy providers may only have ethereum.sendAsync
    // const chainId = await provider.request({
    //   method: 'eth_chainId'
    // })
  } else {
    // if the provider is not detected, detectEthereumProvider resolves to null
    console.error("Please install MetaMask!");
    store.dispatch(ChangeLoggerMessage("Please install MetaMask!"));
  }

}
