// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { ABI, bitfighter_contract_adress } from './bitfighter_constants'
import { GameLogicABI } from './gamelogic_constants'
import { gamelogic_contract_address } from './gamelogic_constants'
import { USDC_ABI, USDC_ADDRESS, WBTC_ABI, WBTC_ADDRESS } from './wBTC_constant'
import { Moralis } from 'moralis'
import { PRESALE_ABI, PRESALE_CONTRACT_ADDRESS } from './presale_constants'
import { onek_club_contract_adress, ONEK_CLUB_CONTRACT_ABI } from './onek_club_nft_constants'
import { PRESALE_DRIP_ABI, PRESALE_DRIP_CONTRACT_V2 } from './presale_drip_constants'

const appId = process.env.REACT_APP_MORALIS_APP_ID
const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL

// Moralis.start({
//   serverUrl,
//   appId,
// })

// export async function getContractName() {
//   const options = {
//     chain: "bsc testnet",
//     address: contractAddress,
//     function_name: "name",
//     abi: ABI,
//   };
//   const _name = await Moralis.Web3API.native.runContractFunction(options);
//   console.log(_name)

//   return _name;
// }

// export async function getContractName() {
//   await Moralis.enableWeb3()
//   const sendOptions = {
//     contractAddress: bitfighter_contract_adress,
//     functionName: "name",
//     abi: ABI,
//   };
//   const _name = await Moralis.executeFunction(sendOptions);
//   console.log("name --> ", _name)

//   return _name;
// }

// export async function getBitFighterInfo(metamaskAddress) {
//   // const options = {
//   //   chain: "mumbai",
//   //   address: contractAddress,
//   //   function_name: "getTokensOfUser",
//   //   abi: ABI,
//   // params: {
//   //   _userAddress: metamaskAddress
//   // }
//   // };
//   await Moralis.enableWeb3()
//   const sendOptions = {
//     contractAddress: bitfighter_contract_adress,
//     functionName: "getTokensOfUser",
//     abi: ABI,
//     params: {
//       _userAddress: metamaskAddress
//     }
//   };
//   const _tokenIds = await Moralis.Web3API.native.runContractFunction(sendOptions);
//   console.log("--------------------------------");
//   console.log(_tokenIds)
//   return _tokenIds;
// }

// export async function getBitFighterTokenInfo(tokenId) {
//   console.log("------********-------", tokenId)
//   const opt = {
//     chain: "mumbai",
//     address: bitfighter_contract_adress,
//     function_name: "tokenURI",
//     abi: ABI,
//     params: {
//       tokenId
//     }
//   };
//   let val = await Moralis.Web3API.native.runContractFunction(opt);
//   console.log("--------------------------------");
//   console.log(val)
//   return val;
// }

// export async function createBitFighter(_tokenURI, referer_address, lucky_number, nick_name) {
//   await Moralis.enableWeb3()
//   const sendOptions = {
//     contractAddress: bitfighter_contract_adress,
//     functionName: "mintBitFighter",
//     abi: ABI,
//     params: {
//       _tokenURI,
//       referer_address,
//       lucky_number,
//       nick_name
//     },
//   };
//   console.log(referer_address, "----")
//   try {
//     const transaction = await Moralis.executeFunction(sendOptions);
//     console.log("--------------------------------");
//     console.log(transaction.hash);
//     console.log("--------------------------------");
//     // Wait until the transaction is confirmed
//     await transaction.wait();
//     console.log("--------------------------------");
//   } catch (err) {
//     console.log("err in createBitFighter ", err)
//     return false;
//   }
//   return true;
// }

// export async function approveWBTC(spender, amount) {

//   await Moralis.enableWeb3()
//   const sendOptions = {
//     contractAddress: WBTC_ADDRESS,
//     functionName: "approve",
//     abi: WBTC_ABI,
//     params: {
//       spender,
//       amount,
//     },
//   };
//   console.log("spender ", spender, amount, "----")
//   try {
//     const transaction = await Moralis.executeFunction(sendOptions);
//     console.log("--------------------------------");
//     console.log(transaction.hash);
//     console.log("--------------------------------");
//     // Wait until the transaction is confirmed
//     await transaction.wait();
//     console.log("--------------------------------");
//   } catch (err) {
//     console.log("err in approveWBTC ", err)
//     return false;
//   }
//   return true;
// }

// export async function createBitFighter2(_tokenURI, referer_address, lucky_number, nick_name) {
//   const ethers = Moralis.web3Library; // get ethers.js library
//   const web3Provider = await Moralis.enableWeb3(); // Get ethers.js web3Provider
//   const gasPrice = await web3Provider.getGasPrice();
//   // console.log("ethers... ", ethers)
//   // console.log("web3Provider... ", web3Provider)
//   // console.log("gasPrice... ", gasPrice.toNumber())
//   const signer = web3Provider.getSigner();

//   const contract = new ethers.Contract(bitfighter_contract_adress, ABI, signer);

//   try {
//     const transaction = await contract.mintBitFighter(
//       _tokenURI,
//       referer_address,
//       lucky_number,
//       nick_name, {
//         gasPrice: 2 * gasPrice,
//       });
//     await transaction.wait();
//     console.log("--------------------------------");
//   } catch (err) {
//     console.log("err in createBitFighter2 ", err)
//     return false;
//   }
//   return true;
// }

export async function createBitFighter3(_tokenURI, referer_address, lucky_number, nick_name, _gen) {
  const ethers = Moralis.web3Library // get ethers.js library
  const web3Provider = await Moralis.enableWeb3() // Get ethers.js web3Provider
  const gasPrice = await web3Provider.getGasPrice()
  // console.log("ethers... ", ethers)
  // console.log("web3Provider... ", web3Provider)
  console.log('in_createBitFighter3 ', _tokenURI, referer_address, lucky_number, nick_name, _gen)
  console.log('gasPrice... ', gasPrice.toNumber())
  const signer = web3Provider.getSigner()

  const contract = new ethers.Contract(bitfighter_contract_adress, ABI, signer)

  try {
    const transaction = await contract.mintBitFighter(_tokenURI, referer_address, lucky_number, nick_name, _gen, '', {
      gasPrice: 2 * gasPrice,
    })
    await transaction.wait()
    console.log('--------------------------------')
  } catch (err) {
    console.log('err in createBitFighter3 ', err)
    return false
  }
  return true
}

export async function checkAllowance(owner) {
  // await Moralis.enableWeb3()
  const sendOptions = {
    contractAddress: WBTC_ADDRESS,
    functionName: 'allowance',
    abi: WBTC_ABI,
    params: {
      owner,
      spender: gamelogic_contract_address,
    },
  }
  const _allowance = await Moralis.executeFunction(sendOptions)
  console.log('debug_AddMoneyToWallet _allowance --> ', _allowance, gamelogic_contract_address, owner)
  return _allowance
}

export async function checkAllowancePresale(owner) {
  // await Moralis.enableWeb3()
  const sendOptions = {
    contractAddress: WBTC_ADDRESS,
    functionName: 'allowance',
    abi: WBTC_ABI,
    params: {
      owner,
      spender: PRESALE_CONTRACT_ADDRESS,
    },
  }
  const _allowance = await Moralis.executeFunction(sendOptions)
  console.log('_allowance --> ', _allowance, owner, WBTC_ADDRESS, PRESALE_CONTRACT_ADDRESS)
  return _allowance
}

export async function checkAllowanceGeneral(owner, spender) {
  // await Moralis.enableWeb3()
  const sendOptions = {
    contractAddress: WBTC_ADDRESS,
    functionName: 'allowance',
    abi: WBTC_ABI,
    params: {
      owner,
      spender,
    },
  }
  const _allowance = await Moralis.executeFunction(sendOptions)
  return _allowance
}

export async function checkAllowanceOneKClub(owner) {
  // console.debug("debug...", owner, USDC_ADDRESS, onek_club_contract_adress)
  // await Moralis.enableWeb3()
  const sendOptions = {
    contractAddress: USDC_ADDRESS,
    functionName: 'allowance',
    abi: USDC_ABI,
    params: {
      owner,
      spender: onek_club_contract_adress,
    },
  }
  const _allowance = await Moralis.executeFunction(sendOptions)
  console.log('_allowance --> ', _allowance, owner)
  return _allowance
}

export async function approveWBTC2(spender, amount) {
  const ethers = Moralis.web3Library // get ethers.js library
  const web3Provider = await Moralis.enableWeb3() // Get ethers.js web3Provider
  const gasPrice = await web3Provider.getGasPrice()
  // console.log("ethers... ", ethers)
  // console.log("web3Provider... ", web3Provider)
  // console.log("gasPrice... ", gasPrice.toNumber())
  const signer = web3Provider.getSigner()

  const contract = new ethers.Contract(WBTC_ADDRESS, WBTC_ABI, signer)

  try {
    const transaction = await contract.approve(spender, amount)
    await transaction.wait()
    console.log('--------------------------------')
  } catch (err) {
    console.log('err debug_AddMoneyToWallet in approve wbtc ', WBTC_ADDRESS, spender, amount, err)
    return false
  }
  return true
}

export async function approveUSDC(spender, amount) {
  const ethers = Moralis.web3Library // get ethers.js library
  const web3Provider = await Moralis.enableWeb3() // Get ethers.js web3Provider
  // const gasPrice = await web3Provider.getGasPrice();
  const signer = web3Provider.getSigner()

  const contract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, signer)

  try {
    const transaction = await contract.approve(spender, amount)
    await transaction.wait()
    console.log('--------------------------------')
  } catch (err) {
    console.log('err in approve wbtc ', err)
    return false
  }
  return true
}

// export async function getwBTCBalance(account) {
//   const options = {
//     chain: 'mumbai',
//     address: WBTC_ADDRESS,
//     function_name: 'balanceOf',
//     abi: WBTC_ABI,
//     params: {
//       account,
//     },
//   }

//   const options2 = {
//     chain: 'mumbai',
//     address: WBTC_ADDRESS,
//     function_name: 'decimals',
//     abi: WBTC_ABI,
//   }
//   const balanceP = Moralis.Web3API.native.runContractFunction(options)
//   const decimalsP = Moralis.Web3API.native.runContractFunction(options2)

//   const [balance, decimals] = await Promise.all([balanceP, decimalsP])
//   return {
//     balance,
//     decimals,
//   }
// }

// export async function depositFundForQueue() {
//   const ethers = Moralis.web3Library; // get ethers.js library
//   const web3Provider = await Moralis.enableWeb3(); // Get ethers.js web3Provider
//   const gasPrice = await web3Provider.getGasPrice();
//   const signer = web3Provider.getSigner();

//   const contract = new ethers.Contract(bitfighter_contract_adress, ABI, signer);

//   try {
//     const transaction = await contract.depositFundForGame({
//       gasPrice: 2 * gasPrice,
//     });
//     await transaction.wait();
//     console.log("--------------------------------");
//   } catch (err) {
//     console.log("err in depositFundForQueue ", err)
//     return false;
//   }
//   return true;
// }

// export async function leaveQueue() {
//   const ethers = Moralis.web3Library; // get ethers.js library
//   const web3Provider = await Moralis.enableWeb3(); // Get ethers.js web3Provider
//   const gasPrice = await web3Provider.getGasPrice();
//   const signer = web3Provider.getSigner();

//   const contract = new ethers.Contract(bitfighter_contract_adress, ABI, signer);

//   try {
//     const transaction = await contract.leaveQueueAndGetMoney({
//       gasPrice: 2 * gasPrice,
//     });
//     await transaction.wait();
//     console.log("--------------------------------");
//   } catch (err) {
//     console.log("err in  leaveQueueAndGetMoney ", err)
//     return false;
//   }
//   return true;
// }

// get balance of wbtc and other balances

export async function checkWBTC_Balance(account) {
  try {
    console.log("dfebug ")
    await Moralis.enableWeb3()
    const sendOptions = {
      contractAddress: WBTC_ADDRESS,
      functionName: 'balanceOf',
      abi: WBTC_ABI,
      params: {
        account,
      },
    }
    const balance = await Moralis.executeFunction(sendOptions)
    console.log('wbtc balance --> ', balance)
    return balance
  } catch (err) {
    console.log("error ehherhe ", err)
    return 0
  }
  
}

export async function checkWalletBalance(account) {
  try {
    await Moralis.enableWeb3()
    const sendOptions = {
      contractAddress: gamelogic_contract_address,
      functionName: 'getWalletbalance',
      abi: GameLogicABI,
      params: {
        account,
      },
    }
    const walletBalance = await Moralis.executeFunction(sendOptions)
    console.log('wallet balance --> ', walletBalance)
    return walletBalance
  } catch (err) {
    console.log('error in checkWalletBalance--> ', err)
    return 0
  }
}


// export async function getWBTCDecimals(account) {
//   await Moralis.enableWeb3()
//   const sendOptions = {
//     contractAddress: WBTC_ADDRESS,
//     functionName: 'decimals',
//     abi: WBTC_ABI,
//   }
//   const betBalance = await Moralis.executeFunction(sendOptions)
//   console.log('decimals --> ', betBalance)
//   return betBalance
// }

export async function depositMoneyToWalletV2(_amount) {
  console.log('debug_AddMoneyToWalletin depositMoneyToWalletV2 ', _amount)
  const ethers = Moralis.web3Library // get ethers.js library
  const web3Provider = await Moralis.enableWeb3() // Get ethers.js web3Provider
  const gasPrice = await web3Provider.getGasPrice()
  const signer = web3Provider.getSigner()

  const contract = new ethers.Contract(gamelogic_contract_address, GameLogicABI, signer)

  try {
    const transaction = await contract.depositFundsToVault(_amount)
    await transaction.wait()
    console.log('debug_AddMoneyToWalletin--------------------------------')
  } catch (err) {
    console.log('debug_AddMoneyToWalletin err in depositMoneyToWalletV2 ', err)
    return false
  }
  return true
}

export async function removeFromWallet() {
  const ethers = Moralis.web3Library // get ethers.js library
  const web3Provider = await Moralis.enableWeb3() // Get ethers.js web3Provider
  const gasPrice = await web3Provider.getGasPrice()
  const signer = web3Provider.getSigner()

  const contract = new ethers.Contract(gamelogic_contract_address, GameLogicABI, signer)

  try {
    const transaction = await contract.redeemFundsFromAtm()
    await transaction.wait()
    console.log('--------------------------------')
  } catch (err) {
    console.log('err in removeFromWallet ', err)
    return false
  }
  return true
}

export async function BetMoneyInFight(_betInFightMoney) {
  console.log('bet moeny in fight -- ', _betInFightMoney)
  const ethers = Moralis.web3Library // get ethers.js library
  const web3Provider = await Moralis.enableWeb3() // Get ethers.js web3Provider
  const gasPrice = await web3Provider.getGasPrice()
  const signer = web3Provider.getSigner()

  const contract = new ethers.Contract(gamelogic_contract_address, GameLogicABI, signer)

  try {
    const transaction = await contract.betMoneyInFight(_betInFightMoney)
    await transaction.wait()
    console.log('--------------------------------')
  } catch (err) {
    console.log('err in betMoneyInFight ', err)
    return false
  }
  return true
}

export async function ExitFromFight() {
  const ethers = Moralis.web3Library // get ethers.js library
  const web3Provider = await Moralis.enableWeb3() // Get ethers.js web3Provider
  const gasPrice = await web3Provider.getGasPrice()
  const signer = web3Provider.getSigner()

  const contract = new ethers.Contract(gamelogic_contract_address, GameLogicABI, signer)

  try {
    const transaction = await contract.clearBetMoneyUser()
    await transaction.wait()
    console.log('--------------------------------')
  } catch (err) {
    console.log('err in ExitFromFight ', err)
    return false
  }
  return true
}

export async function BuyInGameAssets(quantity, item) {
  const ethers = Moralis.web3Library // get ethers.js library
  const web3Provider = await Moralis.enableWeb3() // Get ethers.js web3Provider
  const gasPrice = await web3Provider.getGasPrice()
  const signer = web3Provider.getSigner()

  const contract = new ethers.Contract(gamelogic_contract_address, GameLogicABI, signer)

  try {
    const transaction = await contract.buyAsset(quantity, item)
    await transaction.wait()
    console.log('--------------------------success in buyAsset------')
  } catch (err) {
    console.log('err in BuyInGameAssets ', err)
    return false
  }
  return true
}

export async function getAssetCountOfPlayer(_user, _assetName) {
  await Moralis.enableWeb3()
  const sendOptions = {
    contractAddress: gamelogic_contract_address,
    functionName: 'getAssetsOfUser',
    abi: GameLogicABI,
    params: {
      _user,
      _assetName,
    },
  }
  const betBalance = await Moralis.executeFunction(sendOptions)
  console.log('decimals --> ', betBalance)
  return betBalance
}

export async function mintPreSaleNFT(_tokenURI) {
  const ethers = Moralis.web3Library // get ethers.js library
  const web3Provider = await Moralis.enableWeb3() // Get ethers.js web3Provider
  const gasPrice = await web3Provider.getGasPrice()
  console.log('in mintPreSaleNFT ', _tokenURI)
  console.log('gasPrice... ', gasPrice.toNumber())
  const signer = web3Provider.getSigner()

  const contract = new ethers.Contract(PRESALE_CONTRACT_ADDRESS, PRESALE_ABI, signer)

  try {
    const transaction = await contract.mintPreSaleBitfighterCard(_tokenURI, {
      gasPrice: 2 * gasPrice,
    })
    await transaction.wait()
    console.log('--------------------------------')
  } catch (err) {
    console.log('err in mintPreSaleNFT ', err)
    return false
  }
  return true
}

export async function mintOneKClubCard(quantity) {
  const ethers = Moralis.web3Library // get ethers.js library
  const web3Provider = await Moralis.enableWeb3() // Get ethers.js web3Provider
  // const gasPrice = await web3Provider.getGasPrice();
  console.log('in mintOneKClubCard ', quantity)
  const signer = web3Provider.getSigner()

  const contract = new ethers.Contract(onek_club_contract_adress, ONEK_CLUB_CONTRACT_ABI, signer)

  try {
    const transaction = await contract.mintMultiOnekClubNFTFighters(quantity)
    await transaction.wait()
    console.log('--------------------------------')
    return {
      message: 'Success',
      error: 0,
    }
  } catch (err) {
    console.log('err in mintOneKClubCard ', err)
    // return err.message;
    return {
      message: err.message,
      error_data: err.data,
      error: 1,
    }
  }
  // return true;
}

export async function getPreSaleCountTotal() {
  await Moralis.enableWeb3()
  const sendOptions = {
    contractAddress: PRESALE_CONTRACT_ADDRESS,
    functionName: 'getMintedCouponsCount',
    abi: PRESALE_ABI,
  }
  const presaleMintedCount = await Moralis.executeFunction(sendOptions)
  console.log('----- presalemintedcount ', presaleMintedCount)
  return presaleMintedCount
}

export async function getDripMintCardsMintedCouponsCount() {
  await Moralis.enableWeb3()
  const sendOptions = {
    contractAddress: PRESALE_DRIP_CONTRACT_V2,
    functionName: 'getMintedCouponsCount',
    abi: PRESALE_DRIP_ABI,
  }
  const presaleMintedCount = await Moralis.executeFunction(sendOptions)
  console.log('----- getMintedCouponsCount ', presaleMintedCount)
  return presaleMintedCount
}

export async function getOneKMintedTotalCount() {
  await Moralis.enableWeb3()
  const sendOptions = {
    contractAddress: onek_club_contract_adress,
    functionName: 'getMintedCardsCount',
    abi: ONEK_CLUB_CONTRACT_ABI,
  }
  const oneK_nfts_mintedCount = await Moralis.executeFunction(sendOptions)
  console.log('----- oneK_Club_minted_count ', oneK_nfts_mintedCount)
  return oneK_nfts_mintedCount
}

export async function getTotalOneKClubCards() {
  await Moralis.enableWeb3()
  const sendOptions = {
    contractAddress: onek_club_contract_adress,
    functionName: 'totalOneKClubNFTCards',
    abi: ONEK_CLUB_CONTRACT_ABI,
  }
  const oneK_nfts_mintedCount = await Moralis.executeFunction(sendOptions)
  console.log('----- oneK_Club_total_Count ', oneK_nfts_mintedCount)
  return oneK_nfts_mintedCount
}

export async function getPriceOfOneKCard() {
  await Moralis.enableWeb3()
  const sendOptions = {
    contractAddress: onek_club_contract_adress,
    functionName: 'priceOf1kClubNFT',
    abi: ONEK_CLUB_CONTRACT_ABI,
  }
  const oneK_nfts_mintedCount = await Moralis.executeFunction(sendOptions)
  console.log('----- oneK_Club_price ', oneK_nfts_mintedCount)
  return oneK_nfts_mintedCount
}

export async function mintPreSaleNFTV2(_tokenURIs, _referrerAddress) {
  const ethers = Moralis.web3Library // get ethers.js library
  const web3Provider = await Moralis.enableWeb3() // Get ethers.js web3Provider
  const gasPrice = await web3Provider.getGasPrice()
  // console.log("in mintPreSaleNFTV2 ", _tokenURIs)
  console.log('in mintPreSaleNFTV2 gasPrice... ', gasPrice.toNumber())
  const signer = web3Provider.getSigner()
  console.log('---', _tokenURIs, _referrerAddress, PRESALE_CONTRACT_ADDRESS, await signer.getAddress())

  const contract = new ethers.Contract(PRESALE_CONTRACT_ADDRESS, PRESALE_ABI, signer)

  try {
    const transaction = await contract.mintMultiPresaleBitfighterCard(_tokenURIs, _referrerAddress, {
      gasPrice: 5 * gasPrice,
    })
    await transaction.wait()
    console.log('--------------------------------')
    return {
      message: 'Success',
      error: 0,
    }
  } catch (err) {
    console.log('err in mintPreSaleNFT ', err)
    return {
      message: err.message,
      error_data: err.data,
      error: 1,
    }
  }
}

export async function mintPreSaleDripNFTV2(_tokenURIs, _referrerAddress, tattoo, tag) {
  const ethers = Moralis.web3Library // get ethers.js library
  const web3Provider = await Moralis.enableWeb3() // Get ethers.js web3Provider
  const gasPrice = await web3Provider.getGasPrice()
  console.log('in mintPreSaleDripNFTV2 gasPrice... ', gasPrice.toNumber(), _tokenURIs, _referrerAddress, tattoo, tag)
  const signer = web3Provider.getSigner()

  const contract = new ethers.Contract(PRESALE_DRIP_CONTRACT_V2, PRESALE_DRIP_ABI, signer)

  try {
    const transaction = await contract.mintMultiPresaleDripBitfighterCard(_tokenURIs, _referrerAddress, tattoo, tag, {
      gasPrice: 2 * gasPrice,
    })
    await transaction.wait()
    console.log('--------------------------------')
    return {
      message: 'Success',
      error: 0,
    }
  } catch (err) {
    console.log('err in mintPreSaleNFT ', err)
    // return false;
    return {
      message: err.message,
      error_data: err.data,
      error: 1,
    }
  }
  // return true;
}

// export async function getPreSaleCountTotal() {
//   const ethers = Moralis.web3Library; // get ethers.js library
//   const web3Provider = await Moralis.enableWeb3(); // Get ethers.js web3Provider
//   const gasPrice = await web3Provider.getGasPrice();
//   // console.log("in mintPreSaleNFT ", _tokenURI)
//   // console.log("gasPrice... ", gasPrice.toNumber())
//   const signer = web3Provider.getSigner();

//   const contract = new ethers.Contract(PRESALE_CONTRACT_ADDRESS, PRESALE_ABI, signer);

//   try {
//     const transaction = await contract.getMintedCouponsCount();
//     await transaction.wait();
//     console.log("--------------------------------");
//   } catch (err) {
//     console.log("err in mintPreSaleNFT ", err)
//   }
// }

export async function getBitfightersTotalCountForGen(_gen) {
  await Moralis.enableWeb3()
  const sendOptions = {
    contractAddress: bitfighter_contract_adress,
    functionName: 'getNFTsLimitCountForGenN',
    abi: ABI,
    params: {
      _gen,
    },
  }
  const presaleMintedCount = await Moralis.executeFunction(sendOptions)
  console.log('----- getBitfightersTotalCountForGen ', presaleMintedCount)
  return presaleMintedCount
}

export async function getBitfightersMintedCount() {
  await Moralis.enableWeb3()
  const sendOptions = {
    contractAddress: bitfighter_contract_adress,
    functionName: 'getMintedBFsCount',
    abi: ABI,
  }
  const presaleMintedCount = await Moralis.executeFunction(sendOptions)
  console.log('----- getBitfightersMintedCount ', presaleMintedCount)
  return presaleMintedCount
}

export async function createBitFighterV4(_tokenURIs, referer_address, _gen, _partner, tatoo, tag) {
  const ethers = Moralis.web3Library // get ethers.js library
  const web3Provider = await Moralis.enableWeb3() // Get ethers.js web3Provider
  const gasPrice = await web3Provider.getGasPrice()
  // console.log("ethers... ", ethers)
  // console.log("web3Provider... ", web3Provider)
  console.log('in_createBitFighterV4 ', _tokenURIs, referer_address, _gen, tatoo, tag)
  console.log('gasPrice... ', gasPrice.toNumber())
  const signer = web3Provider.getSigner()
  const _support = tatoo || tag

  const contract = new ethers.Contract(bitfighter_contract_adress, ABI, signer)

  try {
    const transaction = await contract.mintMultiBitfighter(_tokenURIs, referer_address, _gen, _partner, _support, {
      gasPrice: 2 * gasPrice,
    })
    await transaction.wait()
    console.log('--------------------------------')
    return {
      message: 'Success',
      error: 0,
    }
  } catch (err) {
    console.log('err in createBitFighterV4 ', err)
    return {
      message: err.message,
      error_data: err.data,
      error: 1,
    }
  }
}

export async function createBitFighterV4WithDripPresaleCards(_tokenURIs, _tokenIDs) {
  const ethers = Moralis.web3Library // get ethers.js library
  const web3Provider = await Moralis.enableWeb3() // Get ethers.js web3Provider
  const gasPrice = await web3Provider.getGasPrice()
  const signer = web3Provider.getSigner()
  const _gen = 0
  const contract = new ethers.Contract(bitfighter_contract_adress, ABI, signer)

  try {
    const transaction = await contract.mintDripBitFighterMitCard(_tokenURIs, _tokenIDs, _gen, {
      gasPrice: 2 * gasPrice,
    })
    await transaction.wait()
    console.log('--------------------------------')
    return {
      message: 'Success',
      error: 0,
    }
  } catch (err) {
    console.log('err in createBitFighterV4WithDripPresaleCards ', err)
    return {
      message: err.message,
      error_data: err.data,
      error: 1,
    }
  }
}

export async function createBitFighterV4WithPreSaleCards(_tokenURIs, _gen, _partner, tatoo, tag) {
  const ethers = Moralis.web3Library // get ethers.js library
  const web3Provider = await Moralis.enableWeb3() // Get ethers.js web3Provider
  const gasPrice = await web3Provider.getGasPrice()
  console.log('in_createBitFighterV4WithPreSaleCards ', _tokenURIs, _gen, tatoo, tag)
  const signer = web3Provider.getSigner()
  const contract = new ethers.Contract(bitfighter_contract_adress, ABI, signer)
  try {
    const transaction = await contract.mintBitFighterWithMitCard(_tokenURIs, _gen, {
      gasPrice: 1 * gasPrice,
    })
    await transaction.wait()
    console.log('--------------------------------')
    return {
      message: 'Success',
      error: 0,
    }
  } catch (err) {
    console.log('err in createBitFighterV4WithPreSaleCards ', err)
    return {
      message: err.message,
      error_data: err.data,
      error: 1,
    }
  }
}

export async function registerBitfighter(_name, lucky_number, _tokenID) {
  const ethers = Moralis.web3Library // get ethers.js library
  const web3Provider = await Moralis.enableWeb3() // Get ethers.js web3Provider
  const gasPrice = await web3Provider.getGasPrice()
  console.log('in registerBitfighter gasPrice... ', bitfighter_contract_adress, gasPrice.toNumber(), _name, lucky_number, _tokenID)
  const signer = web3Provider.getSigner()

  const contract = new ethers.Contract(bitfighter_contract_adress, ABI, signer)

  try {
    const transaction = await contract.registerBitfighter(_name, lucky_number, _tokenID)
    await transaction.wait()
    console.log('--------------------------------')
    return {
      message: 'Success',
      error: 0,
    }
  } catch (err) {
    console.log('err in registerBitfighter ', err)
    return {
      message: err.message,
      error_data: err.data,
      error: 1,
    }
  }
}

export async function getMintedDripPresaleCardsByUser(_userAddress) {
  // await Moralis.enableWeb3()
  // const sendOptions = {
  //   contractAddress: PRESALE_DRIP_CONTRACT_V2,
  //   functionName: "fetchPreSaleCardsOfUser",
  //   abi: PRESALE_DRIP_ABI,
  //   params: {
  //     _userAddress,
  //   }
  // };
  // const dripPresaleMintedCountArr = await Moralis.executeFunction(sendOptions);
  // console.log("----- fetchPreSaleCardsOfUser ", dripPresaleMintedCountArr);
  // return dripPresaleMintedCountArr;

  const ethers = Moralis.web3Library // get ethers.js library
  const web3Provider = await Moralis.enableWeb3() // Get ethers.js web3Provider
  const gasPrice = await web3Provider.getGasPrice()
  console.log('fetchPreSaleCardsOfUser fetchInfoOfDripCardMintedByUser ', _userAddress)
  const signer = web3Provider.getSigner()
  const contract = new ethers.Contract(PRESALE_DRIP_CONTRACT_V2, PRESALE_DRIP_ABI, signer)
  try {
    const data = await contract.fetchPreSaleCardsOfUser(_userAddress)
    // await transaction.wait();
    return data
  } catch (err) {
    console.log('err in fetchPreSaleCardsOfUser getMintedDripPresaleCardsByUser ', err)
    return []
  }
}

export async function getMintedPresaleCardsByUser(_userAddress) {
  const ethers = Moralis.web3Library // get ethers.js library
  const web3Provider = await Moralis.enableWeb3() // Get ethers.js web3Provider
  const gasPrice = await web3Provider.getGasPrice()
  console.log('fetchPreSaleCardsOfUser getMintedPresaleCardsByUser ', _userAddress)
  const signer = web3Provider.getSigner()
  const contract = new ethers.Contract(PRESALE_CONTRACT_ADDRESS, PRESALE_ABI, signer)
  try {
    const data = await contract.fetchPreSaleCardsOfUser(_userAddress)
    // await transaction.wait();
    return data
  } catch (err) {
    console.log('err in fetchPreSaleCardsOfUser getMintedDripPresaleCardsByUser ', err)
    return []
  }
}

export async function FetchInfoOfDripCardMintedByUser(tokenId) {
  // await Moralis.enableWeb3()
  // const sendOptions = {
  //   contractAddress: PRESALE_DRIP_CONTRACT_V2,
  //   functionName: "fetchTagInfoOfCard",
  //   abi: PRESALE_DRIP_ABI,
  //   params: {
  //     tokenId,
  //   }
  // };
  // const tagBool = await Moralis.executeFunction(sendOptions);
  // const sendOptions1 = {
  //   contractAddress: PRESALE_DRIP_CONTRACT_V2,
  //   functionName: "fetchTattooInfoOfCard",
  //   abi: PRESALE_DRIP_ABI,
  //   params: {
  //     tokenId,
  //   }
  // };
  // const tattooBool = await Moralis.executeFunction(sendOptions1);
  // console.log("----- fetchPreSaleCardsOfUser fetchTattooInfoOfCard ", tattooBool, tagBool);

  // return {
  //   tagBool,
  //   tattooBool
  // };

  const ethers = Moralis.web3Library // get ethers.js library
  const web3Provider = await Moralis.enableWeb3() // Get ethers.js web3Provider
  console.log('fetchPreSaleCardsOfUser fetchInfoOfDripCardMintedByUser ', tokenId)
  const signer = web3Provider.getSigner()
  const contract = new ethers.Contract(PRESALE_DRIP_CONTRACT_V2, PRESALE_DRIP_ABI, signer)
  try {
    const data = await contract.nftIdToExtraInfoMapping(tokenId)
    return data
  } catch (err) {
    console.log('err in fetchPreSaleCardsOfUser fetchInfoOfDripCardMintedByUser ', err)
  }
}
