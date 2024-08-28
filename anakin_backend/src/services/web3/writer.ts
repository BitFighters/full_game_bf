import { ethers } from "ethers";
import { GameLogicABI } from "./gamelogic";
import { WEB_3_CONFIG } from "@config/web3_config";
import { ANAKIN_LOGGER } from "@services/logger";
import { ONEK_CLUB_CONTRACT_ABI } from "./ONEK_CARDS_ABI";
import { WBTC_ABI } from "@config/wbtc_contract";


export async function RedeemMoneyForUser(user_wallet_address: string, amount: string): Promise<boolean> {
  console.log(" redeem balance --- ")
  // let provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/bsc_testnet_chapel/87a9699a7587944dae8582a3999c71f8da7539eb18710b26fa781ffb1f48288d")
  let provider = new ethers.providers.JsonRpcProvider(`${WEB_3_CONFIG.AVAX_WEB3_RPC_URL}`)
  let signer = new ethers.Wallet(WEB_3_CONFIG.GAME_LOGIC_AND_BITFIGHTERS_OWNER, provider);

  let writeOnlyContract: ethers.Contract = new ethers.Contract(WEB_3_CONFIG.GAMELOGIC_CONTRACT_ADDRESS, GameLogicABI, signer);
  let gasFees = await provider.getGasPrice()
  console.log(" get gas fees -- ", gasFees.toString());
  try {
    let transaction = await writeOnlyContract.redeemFundsFromAtm(user_wallet_address, amount);
    await transaction.wait()
    return true;
  } catch(err) {
    ANAKIN_LOGGER.error({
      function: "RedeemMoneyForUser",
      error: err,
    })
    throw err;
  }
}

export async function UpdateWalletBalanceForUser(user_wallet_address: string, amount: string): Promise<boolean> {
  console.log(" updating balance --- ", user_wallet_address, amount)
  let provider = new ethers.providers.JsonRpcProvider(WEB_3_CONFIG.AVAX_WEB3_RPC_URL)
  let signer = new ethers.Wallet(WEB_3_CONFIG.GAME_LOGIC_AND_BITFIGHTERS_OWNER, provider);

  let writeOnlyContract: ethers.Contract = new ethers.Contract(WEB_3_CONFIG.GAMELOGIC_CONTRACT_ADDRESS, GameLogicABI, signer);
  let gasFees = await provider.getGasPrice()
  console.log(" get gas fees -- ", gasFees.toString());
  try {
    let transaction = await writeOnlyContract.updateFundsInAtm(user_wallet_address, amount);
    await transaction.wait()
    return true;
  } catch(err) {
    ANAKIN_LOGGER.error({
      function: "UpdateWalletBalanceForUser",
      error: err,
    })
    throw err;
  }
}

export async function SendWBTC_To_SYSTEM_WALLETS_WITH_GAMELOGIC(to_address: string, amount: number): Promise<boolean> {
  console.log(" SendWBTC_To_SYSTEM_WALLETS --- ", to_address, amount)
  let provider = new ethers.providers.JsonRpcProvider(WEB_3_CONFIG.AVAX_WEB3_RPC_URL)
  let signer = new ethers.Wallet(WEB_3_CONFIG.GAME_LOGIC_AND_BITFIGHTERS_OWNER, provider);

  let writeOnlyContract: ethers.Contract = new ethers.Contract(WEB_3_CONFIG.GAMELOGIC_CONTRACT_ADDRESS, GameLogicABI, signer);
  try {
    // let transaction = await writeOnlyContract.TransferMoneyToSystemWalletsFromVault(amount, to_address);
    let transaction = await writeOnlyContract.TransferFundsToSystemWalletsFromVault(amount, to_address);
    await transaction.wait()
    return true;
  } catch(err) {
    ANAKIN_LOGGER.error({
      function: "SendWBTC_To_SYSTEM_WALLETS",
      error: err,
    })
    throw err;
  }
}


export async function UpdateTokenUriOfOneKCards(tokenURI: string, tokenId: number): Promise<boolean> {
  console.log(" in_UpdateTokenUriOfOneKCards --- ", tokenId, tokenURI)
  let provider = new ethers.providers.JsonRpcProvider(WEB_3_CONFIG.AVAX_WEB3_RPC_URL)

  let private_key = WEB_3_CONFIG.ONEK_CLUB_OWNER;
  let signer = new ethers.Wallet(private_key, provider);

  let writeOnlyContract: ethers.Contract = new ethers.Contract(WEB_3_CONFIG.Onek_CARDS_CONTRACTS_ADDRESS, ONEK_CLUB_CONTRACT_ABI, signer);
  try {
    let transaction = await writeOnlyContract.changeTokenURI(tokenURI, tokenId);
    await transaction.wait()
    return true;
  } catch(err) {
    ANAKIN_LOGGER.error({
      function: "UpdateTokenUriOfOneKCards",
      error: err,
    })
    throw err;
  }
}

