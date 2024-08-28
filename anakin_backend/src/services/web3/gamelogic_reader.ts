import { WEB_3_CONFIG } from "@config/web3_config";
import { ethers } from "ethers";
import { GameLogicABI } from "./gamelogic";
import { ANAKIN_LOGGER } from "@services/logger";



export async function fetchDepositInfo(userWalletAddress: string): Promise<{balance: string, count: string, redemptionCount: string}> {

  const provider = new ethers.providers.JsonRpcProvider(`${WEB_3_CONFIG.AVAX_WEB3_RPC_URL}`)
  const readOnlyContract: ethers.Contract = new ethers.Contract(WEB_3_CONFIG.GAMELOGIC_CONTRACT_ADDRESS, GameLogicABI, provider);
  try {
    // let depositBalance =  await readOnlyContract._deposits(userWalletAddress);
    // let depositCount = await readOnlyContract._depositCount(userWalletAddress);

    const [depositBalance, depositCount] = await Promise.all([
      readOnlyContract._deposits(userWalletAddress),
      readOnlyContract._depositCount(userWalletAddress)
    ]);
    // let depositCount = 0;
    // let redemptionCount = await readOnlyContract._redeemCount(userWalletAddress);
    console.log("--- balance , ", depositBalance.toString());
    console.log("deposit count -- ", depositCount.toString());
    return {
      balance: depositBalance.toString(),
      count: depositCount.toString(),
      redemptionCount: "",
    }
  } catch(err) {
    ANAKIN_LOGGER.error({
      event: "FAILED_IN_FETCHING_DEPOSITS", error: err,
    })
    throw "FAILED_IN_FETCHING_DEPOSITS";
  }
}