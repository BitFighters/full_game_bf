// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import SidePanel, { PageStates } from '../SidePanel/SidePanel'
import bfMark from '../../../assets/images/Mint_Panel__0001_BF_png.png'
import statusReady from '../../../assets/images/status-ready.png'
import non_statusReady from '../../../assets/images/non_status-ready.png'
import statusNotReady from '../../../assets/images/status-not-ready.png'
import non_statusNotReady from '../../../assets/images/non_status-not-ready.png'
import btcIcon from '../../../assets/images/btc-icon.png'
import usdcCoin from '../../../assets/images/work/usdc_32.png'
import pleaseConnect from '../../../assets/images/work/pleaseconnect.png'
import welcome from '../../../assets/images/work/welcome.png'
import makeselection from '../../../assets/images/work/makeselection.png'
import cardBlock from '../../../assets/images/card-block.png'
import { ethers } from 'ethers'
import './MintCard.scss'
import './MintCardForm.scss'
import phaserGame from '../../../PhaserGame'
import { useDispatch } from 'react-redux'
import { setCardState } from '../../../stores/MintCardStateStore'
import { useAppSelector } from '../../../hooks'
import { useEffect, useState } from 'react'
import store from '../../../stores'
import {
  SetFailureNotificationBool,
  SetFailureNotificationMessage,
  SetSuccessNotificationBool,
  SetSuccessNotificationMessage,
} from '../../../stores/NotificationStore'
import Bootstrap from '../../../game/scenes/Bootstrap'
import NotificationMessageHelper from '../../../game/Components/NotificationMessageHelper'
import {
  FetchDripPresaleInfoMintedByUser,
  parseUSDCBalance,
  updateBitfightersMintedCountAndTotal,
  updateDripPresaleMintedCount,
  updateOneKClubMintedCount,
  updatePresaleMintedCount,
} from '../../../utils/web3_utils'
import {
  approveUSDC,
  approveWBTC2,
  checkAllowance,
  checkAllowanceGeneral,
  checkAllowanceOneKClub,
  checkAllowancePresale,
  createBitFighterV4,
  createBitFighterV4WithDripPresaleCards,
  createBitFighterV4WithPreSaleCards,
  mintOneKClubCard,
  mintPreSaleDripNFTV2,
  mintPreSaleNFTV2,
} from '../../../contract'
import {
  fetchNFTsFromDB,
  randomGenarateBitfightersV2,
  randomGenarateDripBitfightersV2,
  randomGenarateDripPreSaleV2,
  randomGenaratePreSaleV2,
  updateNFTsInDB,
  updateOneKclubNFTs,
} from '../../../hooks/ApiCaller'
import { PRESALE_CONTRACT_ADDRESS } from '../../../contract/presale_constants'
import styled from 'styled-components'
import { Box, Button, CircularProgress, LinearProgress, Modal, Typography } from '@mui/material'
import { PRESALE_DRIP_CONTRACT_V2 } from '../../../contract/presale_drip_constants'
import { Web3Login } from '../../Web3Login'
import { onek_club_contract_adress } from '../../../contract/onek_club_nft_constants'
import { isNullOrUndefined } from 'util'
import ReactPlayer from 'react-player'
import { MiniProgressBar } from './MiniProgressbar'
import { gamelogic_contract_address } from '../../../contract/gamelogic_constants'
import { fetchAllNFTsFromDbEntries } from '../../../hooks/FetchNFT'
import { DripFighterInfo, setNFTDetails, setTotalNFTData } from '../../../stores/BitFighters'
import { SetMintGameQuantity, SetMintGameStarted } from '../../../stores/PlayerData'

const ModalWrapper = styled.div``

// const Dummy = styled.div`

//     padding: 200px,
//     // overflow: auto,

//     height: 100vh;
//     // overflow-y: auto;

//     @media only screen and  (orientation: portrait) {
//         padding-left: 400px,
//         margin-top: 300px;
//     }

// `

const Dummy = styled.div`
  //   height: 100vh;
  //   overflow-y: auto;

  @media only screen and (orientation: portrait) {
    // padding-left: 200px;
    // margin-top: 300px;
    // margin-left 200px;
    // padding: 100px;
  }

  @media only screen and (orientation: landscape) {
    // padding-left: 200px;
    // margin-top: 300px;
    // margin-left 200px;
    // padding: 100px;
  }
`

const ModalBoxWrapper = styled(Box)`
  background: #111b28;
  border: 10px solid #000000;
  border-radius: 10px;
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 50px;
  margin-left: 20%;
  margin-top: 10%;
  transform: 'translate(-50%, -50%)',
    // left: 50%;
    button {
    margin: 20px;
    border: 4px solid #000000;
    border-radius: 5px;
  }

  h2 {
    font-family: 'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 40px;
    color: aliceblue;
    line-height: 75%;
  }

  h3 {
    font-family: 'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 30px;
    color: grey;
    line-height: 75%;
    padding-bottom: 10px;
  }
`

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

const ButtonView = styled(Button)`
  span {
    color: aliceblue;
    // font-family: Monospace;
    font-style: bold;
    font-size: 20px;
    font-family: 'Cooper Black', sans-serif;
  }

  // background-color: #e60808;
  background-color: #9c341a;

  &:hover {
    background-color: #852d17;
  }

  width: 300px;
  height: 60px;
`

const Title = styled.h1`
  font-size: 28px;
  color: #eee;
  text-align: center;
  margin: 50px;
  // margin-top: 20px;

  font-family: 'Cooper Black', sans-serif;
`

const Content = styled.div`
  position: relative;
  // background-color:#2d2a2a;
  left: 50%;
  top: 50%;

  display: flex;
  flex-direction: column;
  // gap: 20px;
  // margin: 50px 0;
  align-items: center;
  justify-content: center;

  transform: translate(-50%, -50%);
`

const ProgressBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  h3 {
    color: grey;
  }
`

const ProgressBar = styled(LinearProgress)`
  width: 260px;
  height: 10px;
  border-radius: 5px;
  color: orange;
`

function MintCard() {
  const dispatch = useDispatch()

  // const bitFighterNFTData = useAppSelector((state) => state.bitFighters.nftData)
  // const bitFightersTotalData = useAppSelector((state) => state.bitFighters.totalNFTData)
  // const bitfightersLoadedBool = useAppSelector((state) => state.bitFighters.loaded)
  // const loggedInUserWalletAddress = useAppSelector((state) => state.web3store.userAddress)

  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
  const presaleMintVideoURL = 'https://production-bitfighters.s3.ap-south-1.amazonaws.com/videos/mc.mp4'
  const dripPresaleMintVideoURL = 'https://production-bitfighters.s3.ap-south-1.amazonaws.com/presaleData/Drip_Fighter_Pre_Sale_Mint_Card.mp4'
  const oneKMintVideoURL = [
    'https://production-bitfighters.s3.ap-south-1.amazonaws.com/videos/mint01.mp4',
    'https://production-bitfighters.s3.ap-south-1.amazonaws.com/videos/mint02.mp4',
    'https://production-bitfighters.s3.ap-south-1.amazonaws.com/videos/mint03.mp4',
  ]

  const totalInfoOfUsersDripPresaleCards = useAppSelector((state) => state.bitFighters.totalInfoOfUsersDripPresaleCards)
  const totalInfoOfUsersDripPresaleCardsLoaded = useAppSelector((state) => state.bitFighters.totalInfoOfUsersDripPresaleCardsLoaded)
  const totalCountOfPresaleMintCardForUser = useAppSelector((state) => state.bitFighters.totalCountOfPresaleMintCardForUser)

  const onlyTattooCards: Array<DripFighterInfo> = []
  const onlyTagCards: Array<DripFighterInfo> = []
  const tagAndTattooCards: Array<DripFighterInfo> = []
  const noTagOrTattooCards: Array<DripFighterInfo> = []
  for (let i = 0; i < totalInfoOfUsersDripPresaleCards.length; i++) {
    if (totalInfoOfUsersDripPresaleCards[i].tag && totalInfoOfUsersDripPresaleCards[i].tattoo) {
      tagAndTattooCards.push(totalInfoOfUsersDripPresaleCards[i])
    } else if (totalInfoOfUsersDripPresaleCards[i].tag) {
      onlyTagCards.push(totalInfoOfUsersDripPresaleCards[i])
    } else if (totalInfoOfUsersDripPresaleCards[i].tattoo) {
      onlyTattooCards.push(totalInfoOfUsersDripPresaleCards[i])
    } else {
      noTagOrTattooCards.push(totalInfoOfUsersDripPresaleCards[i])
    }
  }

  const [videoToPlay, setVideoToPlay] = useState(presaleMintVideoURL)
  const [openModal, setOpenModal] = useState(false)

  const mintGameStarted = useAppSelector((state) => state.playerDataStore.mintGameStarted)

  const global_ref_code = useAppSelector((state) => state.mintCardStateStore.global_ref_code)
  const web3ConnectedUser = useAppSelector((state) => state.web3store.web3Connected)

  const totalPresaleCount = 2000
  const preSaleMintedNFT = useAppSelector((state) => state.bitFighters.preSaleNFTMintedCount)

  const totalBitfightersCount = useAppSelector((state) => state.bitFighters.totalBitfightersToMint)
  const bitfightersMintedCount = useAppSelector((state) => state.bitFighters.bitfightersNFTsMintedCount)

  const totalDripfightersCount = 1000
  const dripfightersMintedCount = useAppSelector((state) => state.bitFighters.dripfightersNFTsMintedCount)

  const totalDripPresaleCount = 2000
  const dripPresaleMintedNFT = useAppSelector((state) => state.bitFighters.drip_preSaleNFTMintedCount)

  const onekClubMintedNFT = useAppSelector((state) => state.bitFighters.oneKClubMintedCards)
  const totalOneKClubNFTs = useAppSelector((state) => state.bitFighters.totalOneKClubCards)
  const priceOfOneKCLubNFT = useAppSelector((state) => state.bitFighters.currentPriceOfOneKClubCard)

  const [onekClubQuantity, setOnekClubQuantity] = useState(1)

  const [mintCardsQuantity, setmintCardsQuantity] = useState(1)
  const [refAddrMintCard, setRefAddrMintCard] = useState('')
  const [refBoxMintCard, setRefBoxMintCard] = useState(0)

  const [mintingBool, setMintingBool] = useState(false)
  const [mintingState, setMintingState] = useState('')

  const [dripMintCardsQuantity, setdripMintCardsQuantity] = useState(1)
  const [driprefAddrMintCard, setdripRefAddrMintCard] = useState('')
  // const [driptagMintCard, setdriptagMintCard] = useState(0);
  // const [driptatooMintCard, setdriptatooMintCard] = useState(0);
  const [dripRefBoxMintCard, setDripRefBoxMintCard] = useState(0)
  const [isRefCode, setIsRefCode] = useState(false)
  const [isDrip, setIsDrip] = useState(0)

  const [bitfightersRefAddr, setBitfightersRefAdd] = useState('')
  const [bitfightersRefBoxMintCard, setBitfightersRefBoxMintCard] = useState(0)
  const [bitFightersMintQuantity, setBitFightersMintQuantity] = useState(10)
  const [bitfighterUseMintCardCheckBox, setBitfighterUseMintCardCheckBox] = useState(false)

  const [dripfightersRefAddr, setDripfightersRefAdd] = useState('')
  const [dripFightersRefBoxMintCard, setDripFightersRefBoxMintCard] = useState(0)
  const [dripFightersMintQuantity, setDripFightersMintQuantity] = useState(1)
  const [dripfighterUseMintCardCheckBox, setDripfighterUseMintCardCheckBox] = useState(false)

  const [notagOrTattooCardsPick, setNotagOrTattooCardsPick] = useState(0)
  const [onlyTagCardPick, setOnlyTagCardPick] = useState(0)
  const [onlyTattooCardsPick, setOnlyTattooCardsPick] = useState(0)
  const [tagAndTattooCardsPick, setTagAndTattooCardsPick] = useState(0)

  const [onlyTag, setOnlyTag] = useState(false)
  const [onlyTaoo, setOnlyTatoo] = useState(false)
  const [tagAndTatoo, setTagAndTatoo] = useState(false)

  const [onlyTagFighter, setOnlyTagFighter] = useState(false)
  const [onlyTaooFighter, setOnlyTatooFighter] = useState(false)
  const [tagAndTatooFighter, setTagAndTatooFighter] = useState(false)

  const [errorState, setErrorState] = useState('')

  const [onbutton, setOnButton] = useState(false)

  const ondrip1 = () => {
    if (onlyTag === false) {
      if (onlyTaoo === true) {
        setOnlyTag(false)
        setOnlyTatoo(false)
        setTagAndTatoo(true)
      } else {
        setOnlyTag(true)
        setTagAndTatoo(false)
      }
    } else {
      setOnlyTag(false)
    }
  }

  const ondrip2 = () => {
    if (onlyTaoo === false) {
      if (onlyTag === true) {
        setOnlyTag(false)
        setOnlyTatoo(false)
        setTagAndTatoo(true)
      } else {
        setTagAndTatoo(false)
        setOnlyTatoo(true)
      }
    } else {
      setOnlyTatoo(false)
    }
  }

  const ondrip3 = () => {
    if (tagAndTatoo === false) {
      setOnlyTag(false)
      setOnlyTatoo(false)
      setTagAndTatoo(true)
    } else {
      setTagAndTatoo(false)
    }
  }

  const ondrip1Fighter = () => {
    console.log('ondrip1Fighter ', onlyTagFighter, onlyTaooFighter)
    if (onlyTagFighter === false) {
      if (onlyTaooFighter === true) {
        setOnlyTagFighter(false)
        setOnlyTatooFighter(false)
        setTagAndTatooFighter(true)
      } else {
        setOnlyTagFighter(true)
        setTagAndTatooFighter(false)
      }
    } else {
      setOnlyTagFighter(false)
    }
  }

  const ondrip2Fighter = () => {
    if (onlyTaooFighter === false) {
      if (onlyTagFighter === true) {
        setOnlyTagFighter(false)
        setOnlyTatooFighter(false)
        setTagAndTatooFighter(true)
      } else {
        setTagAndTatooFighter(false)
        setOnlyTatooFighter(true)
      }
    } else {
      setOnlyTatooFighter(false)
    }
  }

  const ondrip3Fighter = () => {
    if (tagAndTatooFighter === false) {
      setOnlyTagFighter(false)
      setOnlyTatooFighter(false)
      setTagAndTatooFighter(true)
    } else {
      setTagAndTatooFighter(false)
    }
  }

  const cardState = useAppSelector((state) => state.mintCardStateStore.state_selected)
  // const cardState = PageStates.NotConnectedState;
  console.log('cardState ', cardState)

  const initializePreMintVars = () => {
    console.log('initializing pre mint vars')
    setRefAddrMintCard('')
    setRefBoxMintCard(0)
    setmintCardsQuantity(1)
  }

  const initializeBitfightersMintVars = () => {
    console.log('initializing bitfighters mint vars')
    setBitfightersRefAdd('')
    setBitfightersRefBoxMintCard(0)
    setBitFightersMintQuantity(5)
  }

  const initializeDripBitfightersMintVars = () => {
    console.log('initializing drip bitfighters mint vars')
    setDripfightersRefAdd('')
    setDripFightersRefBoxMintCard(0)
    setDripFightersMintQuantity(1)
    setDripfighterUseMintCardCheckBox(false)
  }

  const initializeDripPreMintVars = () => {
    console.log('initializing drip pre mint vars')
    setdripRefAddrMintCard('')
    setDripRefBoxMintCard(0)
    setdripMintCardsQuantity(1)

    setOnlyTag(false)
    setOnlyTatoo(false)
    setTagAndTatoo(false)

    // setdriptatooMintCard(0);
    // setdriptagMintCard(0);
  }

  const initializeOneKVars = () => {
    console.log('initializing onek vars ')
    setOnekClubQuantity(1)
  }

  useEffect(() => {
    // initializeOneKVars()
    // initializeDripPreMintVars()
    // initializePreMintVars()
    console.log('debug_global_ref_code', global_ref_code)

    if (global_ref_code !== '') {
      setRefAddrMintCard(global_ref_code)
      setdripRefAddrMintCard(global_ref_code)

      setBitfightersRefAdd(global_ref_code)
    }
  }, [])

  const preSaleMint = async () => {
    console.log('in_presalemint', mintCardsQuantity, refAddrMintCard, mintCardsQuantity < 1)

    setMintingState('')

    if (mintCardsQuantity < 1) {
      setMintingState('')
      initializePreMintVars()
      setErrorState('Quantity should be greater than 0')
      dispatch(setCardState(PageStates.FailedState))
      bootstrap.play_err_sound()
      return
    }

    if (refAddrMintCard === '') {
      setMintingState('')
      initializePreMintVars()
      setErrorState(`Please enter a ref code. \n If you do not have one, select "I dont have one"`)
      dispatch(setCardState(PageStates.FailedState))
      bootstrap.play_err_sound()
      return
    }
    dispatch(setCardState(PageStates.Minting))
    setMintingState('Initiating Transaction')

    let tempRefAddr = ''
    if (refAddrMintCard === '' || refBoxMintCard === 1) {
      setRefAddrMintCard(ethers.constants.AddressZero)
      tempRefAddr = ethers.constants.AddressZero
    } else {
      try {
        tempRefAddr = ethers.utils.getAddress(refAddrMintCard)
      } catch (err) {
        console.log(' error in getting proper address from this .. ', err)
        tempRefAddr = ethers.constants.AddressZero
        setRefAddrMintCard(ethers.constants.AddressZero)
      }
    }

    const allowance = await checkAllowancePresale(store.getState().web3store.userAddress)
    console.log('allowance -- >', allowance.toString())
    if (ethers.BigNumber.from('100000000000').gte(ethers.BigNumber.from(allowance.toString()))) {
      console.log('less allowance')
      setMintingState('Approval in Progress')
      if (!(await approveWBTC2(PRESALE_CONTRACT_ADDRESS, ethers.BigNumber.from('1000000000000')))) {
        setErrorState('Approval Failed')
        dispatch(setCardState(PageStates.FailedState))
        bootstrap.play_err_sound()
        initializePreMintVars()
        // dispatch(setCardState(PageStates.DripPreSale))
        return
      }
    }

    setMintingState('Minting in Progress')

    const output = await randomGenaratePreSaleV2(store.getState().web3store.userAddress, mintCardsQuantity)
    console.log('---output ', output)

    const minted = await mintPreSaleNFTV2(output.data, tempRefAddr)
    if (minted.error === 1) {
      bootstrap.play_err_sound()
      setErrorState(minted.message + '\n' + minted.error_data.message)
      dispatch(setCardState(PageStates.FailedState))
      initializePreMintVars()
      // dispatch(setCardState(PageStates.DripPreSale))
      return
    } else {
      bootstrap.play_dr_bits_success_sound()
      store.dispatch(SetSuccessNotificationBool(true))
      store.dispatch(SetSuccessNotificationMessage(`Success`))
      // initializePreMintVars();
      dispatch(setCardState(PageStates.DripPreSale))
      setTimeout(() => {
        setVideoToPlay(presaleMintVideoURL)
        handleModalOpen()
      }, 1000)
    }

    updatePresaleMintedCount()
    setTimeout(() => {
      dispatch(setCardState(PageStates.DripPreSale))
    }, 1000)
  }

  const bitfightersMint = async () => {
    console.log('bitfightersMint', bitfightersRefAddr, bitFightersMintQuantity, bitfightersRefBoxMintCard)

    // store.dispatch(SetMintGameStarted(true))
    // store.dispatch(SetMintGameQuantity(2))
    // bootstrap.launchMintingGame({
    //   quantity: 10
    // })
    // return

    setMintingState('')

    if (bitFightersMintQuantity < 1) {
      setMintingState('')
      initializeBitfightersMintVars()
      setErrorState('Quantity should be greater than 0')
      dispatch(setCardState(PageStates.FailedState))
      bootstrap.play_err_sound()
      return
    }

    if (!bitfighterUseMintCardCheckBox && bitfightersRefAddr === '') {
      setMintingState('')
      initializeBitfightersMintVars()
      setErrorState(`Please enter a ref code. \n If you do not have one, select "I dont have one"`)
      dispatch(setCardState(PageStates.FailedState))
      bootstrap.play_err_sound()
      return
    }
    dispatch(setCardState(PageStates.Minting))
    setMintingState('Initiating Transaction')

    let tempRefAddr = ''
    if (bitfightersRefAddr === '' || bitfightersRefBoxMintCard === 1) {
      setBitfightersRefAdd(ethers.constants.AddressZero)
      tempRefAddr = ethers.constants.AddressZero
    } else {
      try {
        tempRefAddr = ethers.utils.getAddress(bitfightersRefAddr)
      } catch (err) {
        console.log(' error in getting proper address from this .. ', err)
        tempRefAddr = ethers.constants.AddressZero
        setBitfightersRefAdd(ethers.constants.AddressZero)
      }
    }

    if (tempRefAddr === ethers.utils.getAddress(store.getState().web3store.userAddress)) {
      setMintingState('')
      initializeBitfightersMintVars()
      setErrorState(`Ref. Code cannot be your address. \n If you do not have one, select "I dont have one"`)
      dispatch(setCardState(PageStates.FailedState))
      bootstrap.play_err_sound()
      return
    }

    if (!bitfighterUseMintCardCheckBox) {
      const allowance = await checkAllowance(store.getState().web3store.userAddress)
      console.log('allowance -- >', allowance.toString())
      if (ethers.BigNumber.from('10000000').gte(ethers.BigNumber.from(allowance.toString()))) {
        console.log('less allowance')
        setMintingState('Approval in Progress')
        if (!(await approveWBTC2(gamelogic_contract_address, ethers.BigNumber.from('100000000')))) {
          setErrorState('Approval Failed')
          dispatch(setCardState(PageStates.FailedState))
          bootstrap.play_err_sound()
          initializeBitfightersMintVars()
          return
        }
      }
    }

    setMintingState('Generating Bit Fighters')

    const output = await randomGenarateBitfightersV2(store.getState().web3store.userAddress, bitfightersRefAddr, bitFightersMintQuantity)
    console.log('---output ', output)

    setMintingState('Minting in Progress')

    if (!bitfighterUseMintCardCheckBox) {
      const minted = await createBitFighterV4(output.data, tempRefAddr, 0, '', false, false)
      if (minted.error === 1) {
        bootstrap.play_err_sound()
        setErrorState(minted.message + '\n' + minted.error_data.message)
        dispatch(setCardState(PageStates.FailedState))
        initializeBitfightersMintVars()
        return
      } else {
        await updateNFTsInDB(store.getState().web3store.userAddress)
        const result = await fetchNFTsFromDB(store.getState().web3store.userAddress)
        console.log('-------dataofnfts--*******-- .', result)

        const dataOfNFTS = await fetchAllNFTsFromDbEntries(result.message)
        console.log('dataofnfts -- ', dataOfNFTS)

        store.dispatch(setTotalNFTData(result.message))
        store.dispatch(setNFTDetails(dataOfNFTS))

        bootstrap.play_dr_bits_success_sound()
        store.dispatch(SetSuccessNotificationBool(true))
        store.dispatch(SetSuccessNotificationMessage(`Success`))
        dispatch(setCardState(PageStates.Bitfighter))

        store.dispatch(SetMintGameStarted(true))
        store.dispatch(SetMintGameQuantity(bitFightersMintQuantity))

        // bootstrap.launchMintingGame({
        //   quantity: bitFightersMintQuantity
        // })

        bootstrap.launchMintingGame({
          quantity: bitFightersMintQuantity,
        })
      }
    } else {
      const minted = await createBitFighterV4WithPreSaleCards(output.data, 0, '', false, false)
      if (minted.error === 1) {
        bootstrap.play_err_sound()
        setErrorState(minted.message + '\n' + minted.error_data.message)
        dispatch(setCardState(PageStates.FailedState))
        initializeBitfightersMintVars()
        setMintingState('')
        return
      } else {
        await updateNFTsInDB(store.getState().web3store.userAddress)
        const result = await fetchNFTsFromDB(store.getState().web3store.userAddress)
        console.log('-------dataofnfts--*******-- .', result)

        const dataOfNFTS = await fetchAllNFTsFromDbEntries(result.message)
        console.log('dataofnfts -- ', dataOfNFTS)

        store.dispatch(setTotalNFTData(result.message))
        store.dispatch(setNFTDetails(dataOfNFTS))

        bootstrap.play_dr_bits_success_sound()
        store.dispatch(SetSuccessNotificationBool(true))
        store.dispatch(SetSuccessNotificationMessage(`Success`))
        dispatch(setCardState(PageStates.Bitfighter))

        store.dispatch(SetMintGameStarted(true))
        store.dispatch(SetMintGameQuantity(bitFightersMintQuantity))

        bootstrap.launchMintingGame({
          quantity: bitFightersMintQuantity,
        })
      }
    }

    // updatePresaleMintedCount();
    updateBitfightersMintedCountAndTotal()
    setTimeout(() => {
      dispatch(setCardState(PageStates.Bitfighter))
      initializeBitfightersMintVars()
    }, 1000)
    setMintingState('')
  }

  const DripBitfightersMint = async () => {
    console.log('DripBitfightersMint---', dripFightersMintQuantity, dripFightersRefBoxMintCard, dripfightersRefAddr)

    setMintingState('')

    if (dripFightersMintQuantity < 1) {
      setMintingState('')
      initializeDripBitfightersMintVars()
      setErrorState('Quantity should be greater than 0')
      dispatch(setCardState(PageStates.FailedState))
      bootstrap.play_err_sound()
      return
    }

    if (!dripfighterUseMintCardCheckBox && dripfightersRefAddr === '') {
      setMintingState('')
      initializeDripBitfightersMintVars()
      setErrorState(`Please enter a ref code. \n If you do not have one, select "I dont have one"`)
      dispatch(setCardState(PageStates.FailedState))
      bootstrap.play_err_sound()
      return
    }
    dispatch(setCardState(PageStates.Minting))
    setMintingState('Initiating Transaction')

    let tempRefAddr = ''
    if (dripfightersRefAddr === '' || dripFightersRefBoxMintCard === 1) {
      setDripfightersRefAdd(ethers.constants.AddressZero)
      tempRefAddr = ethers.constants.AddressZero
    } else {
      try {
        tempRefAddr = ethers.utils.getAddress(dripfightersRefAddr)
      } catch (err) {
        console.log(' error in getting proper address from this .. ', err)
        tempRefAddr = ethers.constants.AddressZero
        setDripfightersRefAdd(ethers.constants.AddressZero)
      }
    }

    const allowance = await checkAllowance(store.getState().web3store.userAddress)
    console.log('allowance -- >', allowance.toString())
    if (ethers.BigNumber.from('10000000000').gte(ethers.BigNumber.from(allowance.toString()))) {
      console.log('less allowance')
      setMintingState('Approval in Progress')
      if (!(await approveWBTC2(gamelogic_contract_address, ethers.BigNumber.from('10000000000')))) {
        setErrorState('Approval Failed')
        dispatch(setCardState(PageStates.FailedState))
        bootstrap.play_err_sound()
        initializeDripBitfightersMintVars()
        return
      }
    }

    setMintingState('Generating Bit Fighters')
    console.log('---- debug ,,,', onlyTaooFighter || tagAndTatooFighter)

    const output = await randomGenarateDripBitfightersV2(
      store.getState().web3store.userAddress,
      dripfightersRefAddr,
      dripFightersMintQuantity,
      onlyTaooFighter || tagAndTatooFighter,
    )
    console.log('---output ', output)

    setMintingState('Minting in Progress')

    if (!dripfighterUseMintCardCheckBox) {
      const minted = await createBitFighterV4(output.data, tempRefAddr, 0, 'drip', onlyTaooFighter || tagAndTatooFighter, onlyTagFighter || tagAndTatooFighter)
      if (minted.error === 1) {
        bootstrap.play_err_sound()
        setErrorState(minted.message + '\n' + minted.error_data.message)
        dispatch(setCardState(PageStates.FailedState))
        initializeDripBitfightersMintVars()
        return
      } else {
        await updateNFTsInDB(store.getState().web3store.userAddress)
        const result = await fetchNFTsFromDB(store.getState().web3store.userAddress)
        console.log('-------dataofnfts--*******-- .', result)

        const dataOfNFTS = await fetchAllNFTsFromDbEntries(result.message)
        console.log('dataofnfts -- ', dataOfNFTS)

        store.dispatch(setTotalNFTData(result.message))
        store.dispatch(setNFTDetails(dataOfNFTS))

        bootstrap.play_dr_bits_success_sound()
        store.dispatch(SetSuccessNotificationBool(true))
        store.dispatch(SetSuccessNotificationMessage(`Success`))
        dispatch(setCardState(PageStates.Bitfighter))

        store.dispatch(SetMintGameStarted(true))
        store.dispatch(SetMintGameQuantity(dripFightersMintQuantity))

        bootstrap.launchMintingGame({
          quantity: dripFightersMintQuantity,
        })
      }
    } else {
      // const minted = await createBitFighterV4WithPreSaleCards(output.data, 0, "", false, false);
      // if (minted.error === 1) {
      //   bootstrap.play_err_sound();
      //   setErrorState(minted.message + "\n" + minted.error_data.message)
      //   dispatch(setCardState(PageStates.FailedState))
      //   initializeBitfightersMintVars();
      //   return;
      // } else {
      //   await updateNFTsInDB(store.getState().web3store.userAddress);
      //   const result = await fetchNFTsFromDB(store.getState().web3store.userAddress);
      //   console.log("-------dataofnfts--*******-- .", result);
      //   const dataOfNFTS = await fetchAllNFTsFromDbEntries(result.message)
      //   console.log("dataofnfts -- ", dataOfNFTS )
      //   store.dispatch(setTotalNFTData(result.message))
      //   store.dispatch(setNFTDetails(dataOfNFTS))
      //   bootstrap.play_dr_bits_success_sound();
      //   store.dispatch(SetSuccessNotificationBool(true));
      //   store.dispatch(SetSuccessNotificationMessage(`Success`));
      //   dispatch(setCardState(PageStates.Bitfighter))
      //   store.dispatch(SetMintGameStarted(true))
      //   store.dispatch(SetMintGameQuantity(bitFightersMintQuantity))
      //   // bootstrap.launchMintingGame({
      //   //   quantity: bitFightersMintQuantity
      //   // })
      //   bootstrap.launchMintingGame({
      //     quantity: bitFightersMintQuantity
      //   })
      // }
    }

    // updatePresaleMintedCount();
    updateBitfightersMintedCountAndTotal()
    setTimeout(() => {
      dispatch(setCardState(PageStates.DripFighter))
      initializeDripBitfightersMintVars()
    }, 1000)
  }

  const DripFightersMintUsingMintCard = async () => {
    console.log('------ DripFightersMintUsingMintCard -- ', notagOrTattooCardsPick, tagAndTattooCardsPick, onlyTagCardPick, onlyTattooCardsPick)

    setMintingState('')
    const totalQuantity = notagOrTattooCardsPick + tagAndTattooCardsPick + onlyTagCardPick + onlyTattooCardsPick

    if (totalQuantity < 1) {
      setMintingState('')
      initializeDripBitfightersMintVars()
      setErrorState('Quantity should be greater than 0')
      dispatch(setCardState(PageStates.FailedState))
      bootstrap.play_err_sound()
      return
    }

    if (
      notagOrTattooCardsPick > noTagOrTattooCards.length ||
      onlyTagCardPick > onlyTagCards.length ||
      onlyTattooCardsPick > onlyTattooCards.length ||
      tagAndTattooCardsPick > tagAndTattooCards.length
    ) {
      setMintingState('')
      initializeDripBitfightersMintVars()
      setErrorState('Quantity is more than max amount')
      dispatch(setCardState(PageStates.FailedState))
      bootstrap.play_err_sound()
      return
    }

    setMintingState('Generating Bit Fighters')
    console.log('---- debug ,,,', onlyTaooFighter || tagAndTatooFighter)
    const allowance = await checkAllowance(store.getState().web3store.userAddress)
    console.log('allowance -- >', allowance.toString())
    if (ethers.BigNumber.from('10000000000').gte(ethers.BigNumber.from(allowance.toString()))) {
      console.log('less allowance')
      setMintingState('Approval in Progress')
      if (!(await approveWBTC2(gamelogic_contract_address, ethers.BigNumber.from('10000000000')))) {
        setErrorState('Approval Failed')
        dispatch(setCardState(PageStates.FailedState))
        bootstrap.play_err_sound()
        initializeDripBitfightersMintVars()
        return
      }
    }

    //

    let tokenURIs: any[] = []
    const tokenIDs = []
    if (notagOrTattooCardsPick > 0) {
      const output: any = await randomGenarateDripBitfightersV2(store.getState().web3store.userAddress, dripfightersRefAddr, notagOrTattooCardsPick, false)
      tokenURIs = tokenURIs.concat(output.data)
      for (let i = 0; i < notagOrTattooCardsPick; i++) {
        //
        tokenIDs.push(noTagOrTattooCards[i].id)
      }

      console.log('---debug notagOrTattooCardsPick output ', output, tokenURIs.length, tokenIDs.length)
    }
    if (onlyTagCardPick > 0) {
      const output: any = await randomGenarateDripBitfightersV2(store.getState().web3store.userAddress, dripfightersRefAddr, onlyTagCardPick, false)
      tokenURIs = tokenURIs.concat(output.data)
      for (let i = 0; i < onlyTagCardPick; i++) {
        //
        tokenIDs.push(onlyTagCards[i].id)
      }
      console.log('---debug onlyTagCardPick output ', output, tokenURIs.length, tokenIDs.length)
    }
    if (onlyTattooCardsPick > 0) {
      const output: any = await randomGenarateDripBitfightersV2(store.getState().web3store.userAddress, dripfightersRefAddr, onlyTattooCardsPick, true)
      tokenURIs = tokenURIs.concat(output.data)
      for (let i = 0; i < onlyTattooCardsPick; i++) {
        //
        tokenIDs.push(onlyTattooCards[i].id)
      }
      console.log('---debug onlyTattooCardsPick output ', output, tokenURIs.length, tokenIDs.length)
    }
    if (tagAndTattooCardsPick > 0) {
      const output: any = await randomGenarateDripBitfightersV2(store.getState().web3store.userAddress, dripfightersRefAddr, tagAndTattooCardsPick, true)
      tokenURIs = tokenURIs.concat(output.data)
      for (let i = 0; i < tagAndTattooCardsPick; i++) {
        //
        tokenIDs.push(tagAndTattooCards[i].id)
      }
      console.log('---debug tagAndTattooCardsPick output ', output, tokenURIs.length, tokenIDs.length)
    }

    console.log('----- debug important -- ', tokenURIs, tokenIDs, tokenURIs.length, totalQuantity, tokenIDs.length)
    //
    if (tokenURIs.length !== totalQuantity || tokenURIs.length !== tokenIDs.length) {
      setMintingState('')
      initializeDripBitfightersMintVars()
      setErrorState('Unknown Error happened while generating')
      dispatch(setCardState(PageStates.FailedState))
      bootstrap.play_err_sound()
      return
    }

    const minted = await createBitFighterV4WithDripPresaleCards(tokenURIs, tokenIDs)

    if (minted.error === 1) {
      bootstrap.play_err_sound()
      setErrorState(minted.message + '\n' + minted.error_data.message)
      dispatch(setCardState(PageStates.FailedState))
      initializeDripBitfightersMintVars()
      return
    } else {
      await updateNFTsInDB(store.getState().web3store.userAddress)
      const result = await fetchNFTsFromDB(store.getState().web3store.userAddress)
      console.log('-------dataofnfts--*******-- .', result)

      const dataOfNFTS = await fetchAllNFTsFromDbEntries(result.message)
      console.log('dataofnfts -- ', dataOfNFTS)

      store.dispatch(setTotalNFTData(result.message))
      store.dispatch(setNFTDetails(dataOfNFTS))

      bootstrap.play_dr_bits_success_sound()
      store.dispatch(SetSuccessNotificationBool(true))
      store.dispatch(SetSuccessNotificationMessage(`Success`))
      dispatch(setCardState(PageStates.Bitfighter))

      store.dispatch(SetMintGameStarted(true))
      store.dispatch(SetMintGameQuantity(totalQuantity))

      FetchDripPresaleInfoMintedByUser()

      bootstrap.launchMintingGame({
        quantity: totalQuantity,
      })
    }

    // updatePresaleMintedCount();
    updateBitfightersMintedCountAndTotal()
    setTimeout(() => {
      // dispatch(setCardState(PageStates.DripFighter))
      initializeDripBitfightersMintVars()
    }, 1000)
  }

  const preSaleMintDrip = async () => {
    console.log('in_presalemintDrip', dripMintCardsQuantity)

    if (dripMintCardsQuantity < 1) {
      initializeDripPreMintVars()
      setErrorState('Quantity should be greater than 0')
      dispatch(setCardState(PageStates.FailedState))
      bootstrap.play_err_sound()
      return
    }

    if (driprefAddrMintCard === '') {
      setMintingState('')
      initializeDripPreMintVars()
      setErrorState(`Please enter a ref code. \n If you do not have one, select "I dont have one"`)
      dispatch(setCardState(PageStates.FailedState))
      bootstrap.play_err_sound()
      return
    }

    dispatch(setCardState(PageStates.Minting))
    setMintingState('Initiating Transaction')

    let tempRefAddr = ''
    if (driprefAddrMintCard == '' || dripRefBoxMintCard === 1) {
      setdripRefAddrMintCard(ethers.constants.AddressZero)
      tempRefAddr = ethers.constants.AddressZero
    } else {
      try {
        tempRefAddr = ethers.utils.getAddress(refAddrMintCard)
      } catch (err) {
        console.log(' error in getting proper address from this .. ', err)
        tempRefAddr = ethers.constants.AddressZero
        setdripRefAddrMintCard(ethers.constants.AddressZero)
      }
    }
    // setMintingBool(true);
    // setMintingState("Generating Drip Mint Card");

    const allowance = await checkAllowanceGeneral(store.getState().web3store.userAddress, PRESALE_DRIP_CONTRACT_V2)
    console.log('allowance -- >', allowance.toString())
    if (ethers.BigNumber.from('100000000000').gte(ethers.BigNumber.from(allowance.toString()))) {
      console.log('less allowance')
      setMintingState('Initiating Approval')
      if (!(await approveWBTC2(PRESALE_DRIP_CONTRACT_V2, ethers.BigNumber.from('10000000000000000')))) {
        setErrorState('Approval Failed')
        dispatch(setCardState(PageStates.FailedState))
        bootstrap.play_err_sound()
        initializeDripPreMintVars()
        return
      }
    }

    // setMintingState("Initiating Transaction");
    setMintingState('Minting in Progress')

    let tempTatoo = false
    let tempTag = false

    if (onlyTag || tagAndTatoo) {
      tempTag = true
    }
    if (onlyTaoo || tagAndTatoo) {
      tempTatoo = true
    }

    const output = await randomGenarateDripPreSaleV2(
      store.getState().web3store.userAddress,
      dripMintCardsQuantity,
      tempTatoo ? 'Yes' : 'No',
      tempTag ? 'Yes' : 'No',
    )
    console.log('---output ', output)

    // setMintingState("Minting Drip Mint Card");
    const minted = await mintPreSaleDripNFTV2(output.data, tempRefAddr, tempTatoo ? 1 : 0, tempTag ? 1 : 0)
    if (minted.error === 1) {
      bootstrap.play_err_sound()
      setErrorState(minted.message + ' \n ' + minted.error_data.message)
      dispatch(setCardState(PageStates.FailedState))

      initializeDripPreMintVars()
      return
    } else if (minted.error === 0) {
      bootstrap.play_dr_bits_success_sound()
      store.dispatch(SetSuccessNotificationBool(true))
      store.dispatch(SetSuccessNotificationMessage(`Success`))

      initializeDripPreMintVars()
      dispatch(setCardState(PageStates.Presale))
      setTimeout(() => {
        setVideoToPlay(dripPresaleMintVideoURL)
        handleModalOpen()
      }, 1000)
    }

    updatePresaleMintedCount()
    updateDripPresaleMintedCount()
    setTimeout(() => {
      dispatch(setCardState(PageStates.Presale))
    }, 1000)
  }

  const oneKClubMint = async () => {
    console.log('in onek club mint - ', onek_club_contract_adress)
    if (onekClubQuantity < 1) {
      console.log('here .........')
      initializeOneKVars()
      setErrorState('Quantity should be greater than 0')
      dispatch(setCardState(PageStates.FailedState))
      bootstrap.play_err_sound()
      return
    }
    dispatch(setCardState(PageStates.Minting))
    setMintingState('Initiating Transaction')

    const allowance = await checkAllowanceOneKClub(store.getState().web3store.userAddress)
    console.log('allowance -- >', allowance.toString())
    if (ethers.BigNumber.from('1000000000000000').gte(ethers.BigNumber.from(allowance.toString()))) {
      console.log('less allowance')
      if (!(await approveUSDC(onek_club_contract_adress, ethers.BigNumber.from('100000000000000000')))) {
        initializeOneKVars()
        setErrorState('Approval Failed')
        dispatch(setCardState(PageStates.FailedState))
        bootstrap.play_err_sound()
        return
      }
    }

    setMintingState('Minting in Progress')
    const minted = await mintOneKClubCard(onekClubQuantity)
    console.log('-------minted ------', minted)
    if (minted.error === 1) {
      bootstrap.play_err_sound()
      initializeOneKVars()

      setErrorState(minted.message + ' \n ' + minted.error_data.message)
      dispatch(setCardState(PageStates.FailedState))

      return
    } else {
      bootstrap.play_dr_bits_success_sound()
      updateOneKclubNFTs(store.getState().web3store.userAddress)
      dispatch(setCardState(PageStates.OneKClub))
      setTimeout(() => {
        setVideoToPlay(oneKMintVideoURL[Math.floor(Math.random() * oneKMintVideoURL.length)])
        // setVideoToPlay(oneKMintVideoURL[0])
        handleModalOpen()
      }, 1000)
    }
    updateOneKClubMintedCount()
  }

  let titleState = ''
  if (cardState === PageStates.NotConnectedState) titleState = 'Offline'
  else if (cardState === PageStates.Minting) titleState = 'Minting'
  else titleState = 'Ready'

  let photoState = <></>
  if (cardState === PageStates.NotConnectedState || cardState === PageStates.Minting) {
    photoState = (
      <>
        <img src={totalPresaleCount - preSaleMintedNFT < 0 ? statusNotReady : statusNotReady} alt='status-photo' className='mint-card-base__status__photo' />
        <img src={totalPresaleCount - preSaleMintedNFT < 0 ? statusNotReady : non_statusReady} alt='status-photo' className='mint-card-base__status__photo' />
      </>
    )
  } else if (cardState === PageStates.FailedState) {
    photoState = (
      <>
        <img src={statusNotReady} alt='status-photo' className='mint-card-base__status__photo' />
        <img src={non_statusReady} alt='status-photo' className='mint-card-base__status__photo' />
      </>
    )
  } else {
    photoState = (
      <>
        <img
          src={totalPresaleCount - preSaleMintedNFT < 0 ? statusNotReady : non_statusNotReady}
          alt='status-photo'
          className='mint-card-base__status__photo'
        />
        <img src={totalPresaleCount - preSaleMintedNFT < 0 ? statusNotReady : statusReady} alt='status-photo' className='mint-card-base__status__photo' />
      </>
    )
  }

  let displayInnerPart = <></>
  if (cardState === PageStates.NotConnectedState) {
    displayInnerPart = <img src={pleaseConnect} alt='please-connect-img' />
  } else if (cardState === PageStates.Minting) {
    displayInnerPart = (
      <>
        <h5>{localStorage.getItem('state')}</h5>
        <p>
          {localStorage.getItem('state') === 'Bit Fighter Mint Card'
            ? `${preSaleMintedNFT} of ${totalPresaleCount.toLocaleString()}`
            : localStorage.getItem('state') === 'The 1K Club'
            ? `${onekClubMintedNFT} of ${totalOneKClubNFTs.toLocaleString()}`
            : localStorage.getItem('state') === 'Bit Fighters'
            ? `${bitfightersMintedCount.toLocaleString()} Minted`
            : localStorage.getItem('state') === 'DripFighters'
            ? `${bitfightersMintedCount.toLocaleString()} of ${totalBitfightersCount.toLocaleString()}`
            : `${dripPresaleMintedNFT} of ${totalDripPresaleCount.toLocaleString()}`}
          {/* <br></br> Minted */}
        </p>
      </>
    )
  } else if (cardState === PageStates.Presale) {
    displayInnerPart = (
      <>
        <h5>Drip Fighter Mint Card</h5>
        <p>
          {`${dripPresaleMintedNFT} of ${totalDripPresaleCount.toLocaleString()}`}
          <br></br> Minted
        </p>
      </>
    )
  } else if (cardState === PageStates.DripPreSale) {
    displayInnerPart = (
      <>
        <h5>Bit Fighter Mint Card</h5>
        <p>
          {`${preSaleMintedNFT} of ${totalPresaleCount.toLocaleString()}`}
          <br></br> Minted
        </p>
      </>
    )
  } else if (cardState === PageStates.OneKClub) {
    displayInnerPart = (
      <>
        <h5>The 1K Club</h5>
        <p>
          {`${onekClubMintedNFT} of ${totalOneKClubNFTs.toLocaleString()}`}
          <br></br> Minted
        </p>
      </>
    )
  } else if (cardState === PageStates.Bitfighter) {
    displayInnerPart = (
      <>
        <h5>Bit Fighters</h5>
        <p>
          {`${bitfightersMintedCount.toLocaleString()}`} Minted
          {/* <br></br> Minted */}
        </p>
      </>
    )
  } else if (cardState === PageStates.DripFighter) {
    displayInnerPart = (
      <>
        <h5>Drip Fighters</h5>
        <p>
          {`${bitfightersMintedCount.toLocaleString()} of ${totalBitfightersCount.toLocaleString()}`}
          {/* {`${dripfightersMintedCount.toLocaleString()} of ${totalDripfightersCount.toLocaleString()}`} */}
          <br></br> Minted
        </p>
      </>
    )
  } else if (cardState === PageStates.FailedState) {
    displayInnerPart = (
      <>
        <h5>{localStorage.getItem('state')}</h5>
        <p>
          {localStorage.getItem('state') === 'Bit Fighter Mint Card'
            ? `${preSaleMintedNFT} of ${totalPresaleCount}`
            : localStorage.getItem('state') === 'The 1K Club'
            ? `${onekClubMintedNFT} of ${totalOneKClubNFTs}`
            : `${dripPresaleMintedNFT} of ${totalDripPresaleCount}`}
          <br></br> Minted
        </p>
      </>
    )
  } else {
    displayInnerPart = <img src={welcome} alt='welcome-img' />
  }

  let displayFooterPart = <></>
  if (cardState === PageStates.NotConnectedState) {
    displayFooterPart = (
      <div
        onClick={async () => {
          Web3Login()
          bootstrap.play_button_down_sound()
        }}
        className='btn-mint--red btn-mint--big footer-connect'
      ></div>
    )
  } else if (cardState === PageStates.Minting) displayFooterPart = <div className='btn-mint--grey btn-mint--big footer-connect custom-disabled'></div>
  else if (cardState === PageStates.Presale)
    displayFooterPart = (
      <div
        onClick={() => {
          preSaleMintDrip()
        }}
        // onClick={() => dispatch(setCardState(PageStates.Minting))}
        className='btn-mint--red btn-mint--big footer-go'
      ></div>
    )
  else if (cardState === PageStates.DripPreSale)
    displayFooterPart = (
      <div
        onClick={() => {
          preSaleMint()
        }}
        // onClick={() => dispatch(setCardState(PageStates.Minting))}
        className='btn-mint--red btn-mint--big footer-go'
      ></div>
    )
  else if (cardState === PageStates.OneKClub)
    displayFooterPart = (
      <div
        className='btn-mint--red btn-mint--big footer-go'
        onClick={() => {
          oneKClubMint()
        }}
      ></div>
    )
  else if (cardState === PageStates.Bitfighter) {
    displayFooterPart = (
      <div
        className='btn-mint--red btn-mint--big footer-go'
        onClick={() => {
          // oneKClubMint()
          bitfightersMint()
        }}
      ></div>
    )
  } else if (cardState === PageStates.DripFighter) {
    displayFooterPart = (
      <div
        className='btn-mint--red btn-mint--big footer-go'
        onClick={() => {
          if (dripfighterUseMintCardCheckBox) {
            DripFightersMintUsingMintCard()
          } else {
            DripBitfightersMint()
          }
        }}
      ></div>
    )
  } else displayFooterPart = <div className='btn-mint--grey btn-mint--big footer-connect custom-disabled'></div>

  let displayInfoPart = <></>
  if (cardState === PageStates.NotConnectedState) displayInfoPart = <img src={bfMark} alt='status-photo' className='mint-card-base__status__photo' />
  else if (cardState === PageStates.Minting)
    displayInfoPart = (
      <>
        {/* <h3 style={{ marginTop: "30px" }}> {mintingState} </h3> */}
        <div className='progress-info--bar'>
          <p>{mintingState}</p>
          <MiniProgressBar />
        </div>
        <div className='mint-card-base__info__btc'>
          {localStorage.getItem('state') === 'The 1K Club' ? <img src={usdcCoin} alt='btc-info' /> : <img src={btcIcon} alt='btc-info' />}
        </div>
      </>
    )
  else if (cardState === PageStates.Presale) {
    if (totalDripPresaleCount - dripPresaleMintedNFT < 0) {
      displayInfoPart = <h2 className='mint-card-base__info__sold'>Sold Out</h2>
    } else {
      displayInfoPart = (
        <>
          <div className='mint-card__form'>
            <div className='mint-card__form__item mint-card__form__item--radio'>
              <label htmlFor='code'>Ref. Code:</label>
              <input
                id='code'
                type='text'
                value={driprefAddrMintCard}
                disabled={global_ref_code !== ''}
                onChange={(e) => {
                  setdripRefAddrMintCard(e.target.value)
                }}
                required
              />
            </div>
            {global_ref_code === '' ? (
              <div className='mint-card__form__item mint-card__form__item--radio'>
                <div className='haveone-select'>
                  <label htmlFor='radio'>I don&#39;t have one</label>
                  {dripRefBoxMintCard ? (
                    <>
                      <div
                        onClick={() => {
                          console.log('1---------')
                          setDripRefBoxMintCard(dripRefBoxMintCard === 1 ? 0 : 1)
                          setdripRefAddrMintCard('')
                        }}
                        className='radio_dripTag_selected'
                      ></div>
                    </>
                  ) : (
                    <>
                      <div
                        onClick={() => {
                          console.log('2----------')
                          setDripRefBoxMintCard(dripRefBoxMintCard === 1 ? 0 : 1)
                          setdripRefAddrMintCard(ethers.constants.AddressZero)
                        }}
                        className='radio_dripTag'
                      ></div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <></>
            )}
            <div className='mint-card__form__item'>
              <p className='red'>100% of Addons goes to Drip Vault</p>
            </div>

            <div className='mint-card__form__item mint-card__form__item--radio'>
              <div className='driptag-select'>
                <label htmlFor='radio'>Add Drip Tag: 0.002BTC.b</label>
                <div onClick={() => ondrip1()} className={onlyTag ? 'radio_dripTag_selected' : 'radio_dripTag'}></div>
              </div>
            </div>
            <div className='mint-card__form__item mint-card__form__item--radio'>
              <div className='driptatoo-select'>
                <label htmlFor='radio'>Add Drip Tattoo: 0.002BTC.b</label>
                <div onClick={() => ondrip2()} className={onlyTaoo ? 'radio_dripTag_selected' : 'radio_dripTag'}></div>
              </div>
            </div>
            <div className='mint-card__form__item mint-card__form__item--radio'>
              <div className='addboth-select'>
                <label htmlFor='radio'>Add Both: 0.003BTC.b</label>
                <div onClick={() => ondrip3()} className={tagAndTatoo ? 'radio_dripTag_selected' : 'radio_dripTag'}></div>
              </div>
            </div>
            <div className='mint-card__form__item mint-card__form__item--radio'>
              <label htmlFor='quantity'>Quantity:</label>
              <input
                id='quantity'
                type='number'
                value={dripMintCardsQuantity}
                onChange={(e) => {
                  // setdripMintCardsQuantity(parseInt(e.target.value));

                  if (isNullOrUndefined(e.target.value) || parseInt(e.target.value) < 1) {
                    setdripMintCardsQuantity(1)
                  } else {
                    setdripMintCardsQuantity(parseInt(e.target.value))
                  }
                }}
                style={{
                  outline: 'None',
                }}
                required
              />
            </div>
          </div>
          <div className='mint-card-base__info__btc'>
            <span>
              {(dripMintCardsQuantity > 0
                ? tagAndTatoo
                  ? dripMintCardsQuantity * (0.003 + 0.0002)
                  : dripMintCardsQuantity * (0.0002 + 0.002 * (onlyTag || tagAndTatoo ? 1 : 0) + 0.002 * (onlyTaoo || tagAndTatoo ? 1 : 0))
                : 0
              ).toFixed(4)}{' '}
              BTC.b
            </span>
            <img src={btcIcon} alt='btc-info' />
          </div>
        </>
      )
    }
  } else if (cardState === PageStates.DripPreSale)
    if (totalPresaleCount - preSaleMintedNFT < 0) {
      // this is the bitfighter mint card code
      displayInfoPart = <h2 className='mint-card-base__info__sold'>Sold Out</h2>
    } else
      displayInfoPart = (
        <>
          <div className='mint-card__form'>
            <div className='mint-card__form__item mint-card__form__item--radio'>
              <label htmlFor='code'>Ref. Code:</label>
              <input
                id='code'
                type='text'
                value={refAddrMintCard}
                disabled={global_ref_code !== ''}
                onChange={(e) => {
                  setRefAddrMintCard(e.target.value)
                }}
              />
            </div>
            {global_ref_code === '' ? (
              <div className='mint-card__form__item mint-card__form__item--radio'>
                <div className='haveone-select'>
                  <label htmlFor='radio'>I don&#39;t have one</label>
                  {refBoxMintCard ? (
                    <>
                      <div
                        onClick={() => {
                          console.log('1---------', refBoxMintCard)
                          setRefBoxMintCard(refBoxMintCard === 1 ? 0 : 1)
                          setRefAddrMintCard('')
                        }}
                        className='radio_dripTag_selected'
                      ></div>
                    </>
                  ) : (
                    <>
                      <div
                        onClick={() => {
                          console.log('2----------', refBoxMintCard)
                          setRefBoxMintCard(refBoxMintCard === 1 ? 0 : 1)
                          setRefAddrMintCard(ethers.constants.AddressZero)
                        }}
                        className='radio_dripTag'
                      ></div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <></>
            )}
            <div className='mint-card__form__item mint-card__form__item--radio'>
              <label htmlFor='quantity'>Quantity:</label>
              <input
                id='quantity'
                type='number'
                value={mintCardsQuantity}
                onChange={(e) => {
                  // setmintCardsQuantity(parseInt(e.target.value));
                  if (isNullOrUndefined(e.target.value) || parseInt(e.target.value) < 1) {
                    setmintCardsQuantity(1)
                  } else {
                    setmintCardsQuantity(parseInt(e.target.value))
                  }
                }}
                style={{
                  outline: 'None',
                }}
              />
            </div>
          </div>
          <div className='mint-card-base__info__btc'>
            <span>{(mintCardsQuantity * 0.0002 ? mintCardsQuantity * 0.0002 : 0).toFixed(4)} BTC.b</span>
            <img src={btcIcon} alt='btc-info' />
          </div>
        </>
      )
  else if (cardState === PageStates.Bitfighter) {
    // this is the bitfighter mint card code
    if (totalBitfightersCount - bitfightersMintedCount < 0) {
      displayInfoPart = <h2 className='mint-card-base__info__sold'>Sold Out</h2>
    } else {
      displayInfoPart = (
        <>
          <div className='mint-card__form'>
            {!bitfighterUseMintCardCheckBox ? (
              <>
                <div className='mint-card__form__item mint-card__form__item--radio'>
                  <label htmlFor='code'>Ref. Code:</label>
                  <input
                    id='code'
                    type='text'
                    value={bitfightersRefAddr}
                    disabled={global_ref_code !== ''}
                    onChange={(e) => {
                      setBitfightersRefAdd(e.target.value)
                    }}
                    required
                  />
                </div>
                {global_ref_code === '' ? (
                  <div className='mint-card__form__item mint-card__form__item--radio'>
                    <div className='haveone-select'>
                      <label htmlFor='radio'>I don&#39;t have one</label>
                      {bitfightersRefBoxMintCard ? (
                        <>
                          <div
                            onClick={() => {
                              setBitfightersRefBoxMintCard(bitfightersRefBoxMintCard === 1 ? 0 : 1)
                              setBitfightersRefAdd('')
                            }}
                            className='radio_dripTag_selected'
                          ></div>
                        </>
                      ) : (
                        <>
                          <div
                            onClick={() => {
                              setBitfightersRefBoxMintCard(bitfightersRefBoxMintCard === 1 ? 0 : 1)
                              setBitfightersRefAdd(ethers.constants.AddressZero)
                            }}
                            className='radio_dripTag'
                          ></div>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <>
                <div className='mint-card__form__item mint-card__form__item--radio'>
                  <div className='haveone-select'>
                    {totalInfoOfUsersDripPresaleCardsLoaded ? (
                      <label>You own {totalCountOfPresaleMintCardForUser} Mint Cards </label>
                    ) : (
                      <div className='mint-card__form__item mint-card__form__item--center'>
                        <CircularProgress />
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {!bitfighterUseMintCardCheckBox ? (
              <>
                <div className='mint-card__form__item mint-card__form__item--radio'>
                  <label htmlFor='quantity'>Quantity:</label>
                  <select
                    name='quantity'
                    id='quantity'
                    value={bitFightersMintQuantity}
                    onChange={(e) => {
                      if (isNullOrUndefined(e.target.value) || parseInt(e.target.value) < 1) {
                        setBitFightersMintQuantity(1)
                      } else {
                        setBitFightersMintQuantity(parseInt(e.target.value))
                      }
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>
              </>
            ) : (
              <div className='mint-card__form__item mint-card__form__item--radio'>
                <label htmlFor='quantity'>Quantity:</label>
                <input
                  id='quantity'
                  type='number'
                  value={bitFightersMintQuantity}
                  onChange={(e) => {
                    if (isNullOrUndefined(e.target.value) || parseInt(e.target.value) < 1) {
                      setBitFightersMintQuantity(1)
                    } else {
                      setBitFightersMintQuantity(parseInt(e.target.value))
                    }
                  }}
                  style={{
                    outline: 'None',
                  }}
                  required
                />
              </div>
            )}
          </div>

          <div className='mint-card-base__info__btc2'>
            <span>
              {(bitfighterUseMintCardCheckBox
                ? 0
                : bitFightersMintQuantity === 5
                ? 0.0015
                : bitFightersMintQuantity === 10
                ? 0.0025
                : bitFightersMintQuantity === 20
                ? 0.004
                : 0
              ).toFixed(4)}
              BTC.b
            </span>
            <img src={btcIcon} alt='btc-info' />

            <div className='mint-card__form__item mint-card__form__item--checkbox-circle'>
              <label htmlFor='mint-card-checkbox'>
                <p>Use Mint Card:</p>
              </label>
              <input
                type='checkbox'
                id='mint-card-checkbox'
                checked={bitfighterUseMintCardCheckBox}
                onChange={() => {
                  console.log('debug pressed checkbox ', bitfighterUseMintCardCheckBox)
                  if (!bitfighterUseMintCardCheckBox) {
                    setBitFightersMintQuantity(totalCountOfPresaleMintCardForUser)
                  } else {
                    setBitFightersMintQuantity(5)
                  }
                  setBitfighterUseMintCardCheckBox(!bitfighterUseMintCardCheckBox)
                }}
              />
            </div>
          </div>
        </>
      )
    }
  } else if (cardState === PageStates.DripFighter) {
    if (totalDripfightersCount - dripfightersMintedCount < 0) {
      displayInfoPart = <h2 className='mint-card-base__info__sold'>Sold Out</h2>
    } else {
      displayInfoPart = (
        <>
          {!dripfighterUseMintCardCheckBox ? (
            <div className='mint-card__form'>
              <div className='mint-card__form__item mint-card__form__item--radio'>
                <label htmlFor='code'>Ref. Code:</label>
                <input
                  id='code'
                  type='text'
                  value={dripfightersRefAddr}
                  disabled={global_ref_code !== ''}
                  onChange={(e) => {
                    setDripfightersRefAdd(e.target.value)
                  }}
                  required
                />
              </div>
              {global_ref_code === '' ? (
                <div className='mint-card__form__item mint-card__form__item--radio'>
                  <div className='haveone-select'>
                    <label htmlFor='radio'>I don&#39;t have one</label>
                    {dripFightersRefBoxMintCard ? (
                      <>
                        <div
                          onClick={() => {
                            setDripFightersRefBoxMintCard(dripFightersRefBoxMintCard === 1 ? 0 : 1)
                            setDripfightersRefAdd('')
                          }}
                          className='radio_dripTag_selected'
                        ></div>
                      </>
                    ) : (
                      <>
                        <div
                          onClick={() => {
                            setDripFightersRefBoxMintCard(dripFightersRefBoxMintCard === 1 ? 0 : 1)
                            setDripfightersRefAdd(ethers.constants.AddressZero)
                          }}
                          className='radio_dripTag'
                        ></div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <></>
              )}
              <div className='mint-card__form__item'>
                <p className='red'>100% of Addons goes to Drip Vault</p>
              </div>

              <div className='mint-card__form__item mint-card__form__item--radio'>
                <div className='driptag-select'>
                  <label htmlFor='radio'>Add Drip Tag: 0.002BTC.b</label>
                  <div onClick={() => ondrip1Fighter()} className={onlyTagFighter ? 'radio_dripTag_selected' : 'radio_dripTag'}></div>
                </div>
              </div>
              <div className='mint-card__form__item mint-card__form__item--radio'>
                <div className='driptatoo-select'>
                  <label htmlFor='radio'>Add Drip Tattoo: 0.002BTC.b</label>
                  <div onClick={() => ondrip2Fighter()} className={onlyTaooFighter ? 'radio_dripTag_selected' : 'radio_dripTag'}></div>
                </div>
              </div>
              <div className='mint-card__form__item mint-card__form__item--radio'>
                <div className='addboth-select'>
                  <label htmlFor='radio'>Add Both: 0.003BTC.b</label>
                  <div onClick={() => ondrip3Fighter()} className={tagAndTatooFighter ? 'radio_dripTag_selected' : 'radio_dripTag'}></div>
                </div>
              </div>
              <div className='mint-card__form__item mint-card__form__item--radio'>
                <label htmlFor='quantity'>Quantity:</label>
                <input
                  id='quantity'
                  type='number'
                  value={dripFightersMintQuantity}
                  onChange={(e) => {
                    if (isNullOrUndefined(e.target.value) || parseInt(e.target.value) < 1) {
                      setDripFightersMintQuantity(1)
                    } else {
                      setDripFightersMintQuantity(parseInt(e.target.value))
                    }
                  }}
                  style={{
                    outline: 'None',
                  }}
                  required
                />
              </div>
            </div>
          ) : (
            <div className='mint-card__form'>
              {totalInfoOfUsersDripPresaleCardsLoaded ? (
                <>
                  <div className='mint-card__form__item mint-card__form__item--radio'>
                    <label htmlFor='code'>No tag or tattoo:</label>
                    <input
                      id='code'
                      type='number'
                      value={notagOrTattooCardsPick}
                      onChange={(e) => {
                        if (isNullOrUndefined(e.target.value) || parseInt(e.target.value) <= 0) {
                          setNotagOrTattooCardsPick(0)
                        } else {
                          setNotagOrTattooCardsPick(parseInt(e.target.value))
                        }
                      }}
                      required
                    />{' '}
                    /{noTagOrTattooCards.length}
                  </div>

                  <div className='mint-card__form__item mint-card__form__item--radio'>
                    <label htmlFor='code'>Only Tag Cards:</label>
                    <input
                      id='code'
                      type='number'
                      value={onlyTagCardPick}
                      onChange={(e) => {
                        if (isNullOrUndefined(e.target.value) || parseInt(e.target.value) <= 0) {
                          setOnlyTagCardPick(0)
                        } else {
                          setOnlyTagCardPick(parseInt(e.target.value))
                        }
                      }}
                      required
                    />{' '}
                    /{onlyTagCards.length}
                  </div>

                  <div className='mint-card__form__item mint-card__form__item--radio'>
                    <label htmlFor='code'>Only Tattoo Cards:</label>
                    <input
                      id='code'
                      type='number'
                      value={onlyTattooCardsPick}
                      onChange={(e) => {
                        if (isNullOrUndefined(e.target.value) || parseInt(e.target.value) <= 0) {
                          setOnlyTattooCardsPick(0)
                        } else {
                          setOnlyTattooCardsPick(parseInt(e.target.value))
                        }
                      }}
                      required
                    />{' '}
                    /{onlyTattooCards.length}
                  </div>

                  <div className='mint-card__form__item mint-card__form__item--radio'>
                    <label htmlFor='code'>Tag And Tattoo Cards:</label>
                    <input
                      id='code'
                      type='number'
                      value={tagAndTattooCardsPick}
                      onChange={(e) => {
                        if (isNullOrUndefined(e.target.value) || parseInt(e.target.value) < 1) {
                          setTagAndTattooCardsPick(0)
                        } else {
                          setTagAndTattooCardsPick(parseInt(e.target.value))
                        }
                      }}
                      required
                    />{' '}
                    /{tagAndTattooCards.length}
                  </div>

                  <div className='mint-card__form__item mint-card__form__item--radio'>
                    <label htmlFor='quantity' className='slightly_smaller_label'>
                      Total Quantity:
                    </label>
                    <input
                      id='quantity'
                      type='number'
                      value={notagOrTattooCardsPick + onlyTagCardPick + onlyTattooCardsPick + tagAndTattooCardsPick}
                      disabled={true}
                      style={{
                        outline: 'None',
                      }}
                    />
                  </div>
                </>
              ) : (
                <div className='mint-card__form__item mint-card__form__item--center'>
                  <CircularProgress />
                </div>
              )}
            </div>
          )}

          <div className='mint-card-base__info__btc2'>
            <span>
              {(dripMintCardsQuantity > 0
                ? dripfighterUseMintCardCheckBox
                  ? 0
                  : tagAndTatoo
                  ? dripMintCardsQuantity * (0.003 + 0.0002)
                  : dripMintCardsQuantity * (0.0003 + 0.002 * (onlyTag || tagAndTatoo ? 1 : 0) + 0.002 * (onlyTaoo || tagAndTatoo ? 1 : 0))
                : 0
              ).toFixed(4)}{' '}
              BTC.b
            </span>
            <img src={btcIcon} alt='btc-info' />

            <div className='mint-card__form__item mint-card__form__item--checkbox-circle'>
              <label htmlFor='mint-card-checkbox'>
                <p>Use Mint Card:</p>
              </label>
              <input
                type='checkbox'
                id='mint-card-checkbox'
                checked={dripfighterUseMintCardCheckBox}
                onChange={() => {
                  console.log('debug pressed checkbox ', dripfighterUseMintCardCheckBox)
                  setDripfighterUseMintCardCheckBox(!dripfighterUseMintCardCheckBox)
                }}
              />
            </div>
          </div>
        </>
      )
    }
  } else if (cardState === PageStates.OneKClub)
    if (totalOneKClubNFTs - onekClubMintedNFT < 0) {
      displayInfoPart = <h2 className='mint-card-base__info__sold'>Sold Out</h2>
    } else
      displayInfoPart = (
        <>
          <div className='mint-card__form'>
            <div className='mint-card__form__item mint-card__form__item--radio' style={{ marginTop: '5px' }}>
              {/* <h5> */}
              <label htmlFor='quantity' className='slightly_bigger_label'>
                Card #: {onekClubMintedNFT + 1}
              </label>
              {/* </h5> */}
            </div>
            <div className='mint-card__form__item mint-card__form__item--radio'>
              {/* <h5> */}
              <label htmlFor='price' className='slightly_bigger_label'>
                Price: ${parseUSDCBalance(priceOfOneKCLubNFT)}
              </label>
              {/* </h5> */}
            </div>
            <div className='mint-card__form__item mint-card__form__item--radio'>
              <label htmlFor='quantity' className='slightly_bigger_label'>
                Quantity:
              </label>
              <input
                id='quantity'
                type='number'
                value={onekClubQuantity}
                onChange={(e) => {
                  if (isNullOrUndefined(e.target.value) || parseInt(e.target.value) < 1) {
                    setOnekClubQuantity(1)
                  } else {
                    setOnekClubQuantity(parseInt(e.target.value))
                  }
                }}
                style={{
                  outline: 'None',
                  // width: "50px",
                }}
              />
            </div>
          </div>
          <div className='mint-card-base__info__btc'>
            <span>{onekClubQuantity > 0 ? parseUSDCBalance((priceOfOneKCLubNFT * (1 - Math.pow(1.00555, onekClubQuantity))) / -0.00555) : 0} USDC</span>
            <img src={usdcCoin} alt='btc-info' />
          </div>
        </>
      )
  else if (cardState === PageStates.FailedState) {
    displayInfoPart = (
      <>
        <div className='mint-card__form__item mint-card__form__item--radio' style={{ marginTop: '30px' }}>
          <h5>
            <label htmlFor='quantity' style={{ fontSize: '1.25rem' }}>
              Error Occured
            </label>
          </h5>
        </div>
        <div className='mint-card__form__item' style={{ marginTop: '20px' }}>
          <p className='red'>{errorState}</p>
        </div>
        {/* <h5>{errorState}</h5> */}
      </>
    )
  } else
    displayInfoPart = (
      <>
        <img src={makeselection} alt='makeselection-img' className='makeselection-img' />
      </>
    )

  let CustomUI = (
    <div className='mint-card-base__wrapper'>
      <article className='mint-card-base'>
        <div className='mint-card-base__layer'>
          <div className='mint-card-base__inner'>
            <div className='mint-card-base__status'>
              <div className='mint-card-base__status__title'>{totalPresaleCount - preSaleMintedNFT < 0 ? ' ' : <p>{titleState}</p>}</div>
              <>{photoState}</>
            </div>
            <div className='mint-card-base__display'>
              <div className='mint-card-base__display__inner'>{displayInnerPart}</div>
            </div>
            <div className='mint-card-base__info'>
              <div className='mint-card-base__info__inner'>{displayInfoPart}</div>
            </div>
            <div
              className='mint-card-base__footer'
              onMouseOver={() => {
                if (!onbutton) {
                  setOnButton(true)
                  bootstrap.play_button_hover_sound()
                }
              }}
              onMouseOut={() => {
                setOnButton(false)
              }}
            >
              {!mintingBool ? (
                <>{displayFooterPart}</>
              ) : (
                <ProgressBarWrapper
                  style={{
                    margin: '20px',
                    padding: '10px',
                  }}
                ></ProgressBarWrapper>
              )}
              <img src={cardBlock} alt='card-block' />
              <h3>M-o-M Inc.</h3>
            </div>
          </div>
        </div>
      </article>
      <SidePanel />
    </div>
  )

  const handleModalClose = () => {
    setOpenModal(false)
    initializeDripPreMintVars()
    initializeOneKVars()
    initializePreMintVars()
  }

  const handleModalOpen = () => {
    // console.log("debug..... ", cardState)
    setOpenModal(true)
  }

  if (openModal) {
    CustomUI = (
      <ModalWrapper>
        <Modal open={openModal} onClose={handleModalClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
          <ModalBoxWrapper>
            <h2 className='text_shadows_success_text_modal'>Success!</h2>
            {
              cardState === PageStates.DripPreSale ? (
                <div>
                  {mintCardsQuantity > 1 ? (
                    <h3>Get {mintCardsQuantity} Bit Fighter Pre-Launch Cards!</h3>
                  ) : (
                    <h3>Get {mintCardsQuantity} Bit Fighter Pre-Launch Card!</h3>
                  )}
                </div>
              ) : cardState === PageStates.OneKClub ? (
                <div>{onekClubQuantity > 1 ? <h3>Get {onekClubQuantity} 1k Club Cards!</h3> : <h3>Get {onekClubQuantity} 1k Club Card!</h3>}</div>
              ) : (
                <div>
                  {dripMintCardsQuantity > 1 ? (
                    <h3>Get {dripMintCardsQuantity} Drip Fighter Pre-Launch Cards!</h3>
                  ) : (
                    <h3>Get {dripMintCardsQuantity} Drip Fighter Pre-Launch Card!</h3>
                  )}
                </div>
              )
              // <h3>Get {dripMintCardsQuantity} Drip Fighter Pre-Launch Cards!</h3>
            }
            <Typography id='modal-modal-title' variant='h2' component='h2'></Typography>
            {cardState === PageStates.DripPreSale ? (
              <ReactPlayer url={presaleMintVideoURL} controls={true} loop playing={true} />
            ) : cardState === PageStates.OneKClub ? (
              <ReactPlayer url={oneKMintVideoURL[Math.floor(Math.random() * oneKMintVideoURL.length)]} controls={true} loop playing={true} />
            ) : (
              <ReactPlayer url={dripPresaleMintVideoURL} controls={true} loop playing={true} />
            )}
            {/* <ReactPlayer url={videoToPlay} controls={true} loop playing={true} /> */}
          </ModalBoxWrapper>
        </Modal>
      </ModalWrapper>
    )
  }

  if (mintGameStarted) {
    CustomUI = <></>
  }

  return (
    <Dummy
      style={
        {
          // paddingLeft: '400px'
        }
      }
    >
      <NotificationMessageHelper />
      {CustomUI}
    </Dummy>
  )
}

export default MintCard
