// @ts-nocheck
import { ethers } from 'ethers';
import { ABI, bitfighter_contract_adress } from "./bitfighter_constants";
import store from '../stores';

export class WriterContractHandler {
  // static provider = new ethers.providers.JsonRpcProvider("https://empty-broken-uranium.bsc-testnet.discover.quiknode.pro/114eaaec141aa1d539f3a80bc1ad11edb7856686/")


  public static async createBitfighters(_tokenURI: any, referer_address: string, lucky_number: number, nick_name: string) {
    console.log("in_createBitfighters")
    await window.ethereum.enable();
    // let provider = new ethers.providers.JsonRpcProvider("https://empty-broken-uranium.bsc-testnet.discover.quiknode.pro/114eaaec141aa1d539f3a80bc1ad11edb7856686/")

    // let provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/bsc_testnet_chapel/87a9699a7587944dae8582a3999c71f8da7539eb18710b26fa781ffb1f48288d")
    // await window.ethereum.enable();
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    console.log("accounts --> ", store.getState().web3store.userAddress)
    const signer = provider.getSigner(store.getState().web3store.userAddress);
    const writeOnlyContract: ethers.Contract = new ethers.Contract(bitfighter_contract_adress, ABI, signer);

    const gasPriceBig = await provider.getGasPrice()
    const gasPrice = gasPriceBig.toNumber();
    console.log("gasPriceBig ", gasPriceBig.toNumber());
    console.log("signer --> ", signer)
    console.log("data --> ", _tokenURI, referer_address, lucky_number, nick_name)

    // await window.ethereum.enable();
    // const provider = new ethers.providers.Web3Provider(window.ethereum)
    // let accounts = await provider.send("eth_requestAccounts", []);
    // console.log("accnts ... ", accounts[0])
    try {
      const transaction = await writeOnlyContract.mintBitFighter(
        _tokenURI,
        referer_address,
        lucky_number,
        nick_name,
        // {
        //   gasPrice: 2 * gasPrice,
        // }
      );
      const result = await transaction.wait();
      console.log("--------------------------------", result);
      return true;
    } catch (err: any) {
      console.log("err in createBitFighter ", err)
      return false;
    }
  }
}
