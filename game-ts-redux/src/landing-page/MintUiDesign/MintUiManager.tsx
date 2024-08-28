// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { useState } from 'react'
import styled from 'styled-components'
import LinearProgress from '@mui/material/LinearProgress'
import { Box, Typography } from '@mui/material'
import phaserGame from '../../PhaserGame'
import Bootstrap from '../../game/scenes/Bootstrap'
import { useAppDispatch, useAppSelector } from '../../hooks'
import {
  approveUSDC,
  approveWBTC2,
  checkAllowanceGeneral,
  checkAllowanceOneKClub,
  checkAllowancePresale,
  mintOneKClubCard,
  mintPreSaleDripNFTV2,
  mintPreSaleNFTV2,
} from '../../contract'
import store from '../../stores'
import { ethers } from 'ethers'
import { randomGenarateDripPreSaleV2, randomGenaratePreSaleV2, updateOneKclubNFTs } from '../../hooks/ApiCaller'
import { PRESALE_CONTRACT_ADDRESS } from '../../contract/presale_constants'
import { parseUSDCBalance, updateDripPresaleMintedCount, updateOneKClubMintedCount, updatePresaleMintedCount } from '../../utils/web3_utils'
import Modal from '@mui/material/Modal'
import ReactPlayer from 'react-player'
import {
  SetFailureNotificationBool,
  SetFailureNotificationMessage,
  SetSuccessNotificationBool,
  SetSuccessNotificationMessage,
} from '../../stores/NotificationStore'
import NotificationMessageHelper from '../../game/Components/NotificationMessageHelper'
import { onek_club_contract_adress } from '../../contract/onek_club_nft_constants'
import { isNullOrUndefined } from 'util'
import { PRESALE_DRIP_CONTRACT_V2 } from '../../contract/presale_drip_constants'

const Wrapper = styled.div`
  padding: 30px;
  display: flex;
  flex_direction: row;
  justify-content: center;
`

const ModalWrapper = styled.div``

const BoxWrapper = styled(Box)`
  // background: #989ea4;
  border-left: 10px solid #74777b;
  width: 25%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  // mix-blend-mode: multiply;
  background-repeat: repeat;
  // pointer-events: none;
  background-image: url('/bitfgihter_assets/sample-image.png');
  h4 {
    font-family: 'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 46px;
    color: white;
    line-height: 75%;
    margin: 15px;
  }

  button {
    margin: 20px;
    border: 4px solid #000000;
    border-radius: 5px;
  }
`

const BoxWrapper2 = styled(Box)`
  border-left: 10px solid #74777b;
  width: 15%;
  max-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-repeat: repeat;
  background-image: url('/bitfgihter_assets/sample-image.png');

  h4 {
    font-family: 'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 20px;
    color: white;
    line-height: 75%;
  }

  button {
    margin: 10px;
    width: 150px;
    height: 70px;
    border: 4px solid #000000;
    border-radius: 5px;
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
    font-size: 72px;
    color: grey;
    line-height: 75%;
    padding-top: 20px;
  }
`

const Title = styled.h1`
  font-size: 24px;
  color: #eee;
  text-align: center;
`

const CustomBox = styled(Box)`
  width: 90%;
  overflow: auto;
  background: #2c2c2c;
  border: 15px solid #696969;
  display: flex;
  flex-direction: column;
  margin: 20px;
  padding: 15px;

  span {
    font-family: 'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 20px;
  }

  h1 {
    font-family: 'Cooper Black', sans-serif;
    font-weight: 400;
    font-size: 30px;
    color: white;
    line-height: 75%;
    padding: 10px;
    // letter-spacing: 1px;
  }

  h3 {
    font-family: 'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 30px;
    color: white;
    line-height: 75%;
    padding-top: 20px;
  }

  input {
    color: black;
  }
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
  width: 360px;
`

const MyDivider = styled.div`
  border: 15px solid #232121;
  border-bottom: 5px solid #494949;
  width: 85%;
  margin: 20px;
`

const FooterText = styled.div`
  margin-left: auto;
  h2 {
    color: #726d6d;
    padding: 5px;
    margin: 5px;
    font-family: 'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 20px;
    line-height: 75%;
  }
`

const FloaterBoxRight = styled.div`
  display: flex;
  margin-left: auto;
  // background-color: #363636;
  margin: 5px;
  padding: 5px;
  // padding: 5px 20px 5px 20px;
  justify-content: center;
  align-items: center;
  // border-radius: 20%;
  background: #2c2c2c;
  border: 5px solid #696969;
`

const TopRightBox = styled.div`
  display: flex;
  flex-direction: row;
  align-self: flex-end;
  justify-content: center;
  align-items: center;

  span {
    width: 20px;
    background-color: #00ff24;
    height: 20px;
    border-radius: 50%;
  }

  h2 {
    color: aliceblue;
    font-family: 'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 20px;
    height: 20px;
  }

  span.red {
    width: 20px;
    background-color: #ef3636;
    height: 20px;
    border-radius: 50%;
    margin-top: 5px;
    margin-right: 5px;
  }
`

enum PageStates {
  Presale = 'presale',
  OneKClub = 'oneKClub',
  DripPreSale = 'drip_presale',
}

// const ratio = 555/10000

export default function MintPage() {
  const loggedInUserWalletAddress = useAppSelector((state) => state.web3store.userAddress)
  const web3ConnectedUser = useAppSelector((state) => state.web3store.web3Connected)
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
  const [mintingState, setMintingState] = useState('')
  const [mintingBool, setMintingBool] = useState(false)
  const [snackBarOpen, setSnackBarOpen] = useState(false)
  const [errsnackBarOpen, setErrSnackBarOpen] = useState(false)
  const [errSnackBarMessage, setErrSnackBarMessage] = useState('')
  const userAddress = useAppSelector((state) => state.web3store.userAddress)
  const [openModal, setOpenModal] = useState(false)

  const [pageState, setPageState] = useState(PageStates.Presale)
  const [onekClubQuantity, setOnekClubQuantity] = useState(0)
  const [mintCardsQuantity, setmintCardsQuantity] = useState(0)
  const [refAddrMintCard, setRefAddrMintCard] = useState('')

  const [dripMintCardsQuantity, setdripMintCardsQuantity] = useState(0)
  const [driprefAddrMintCard, setdripRefAddrMintCard] = useState('')
  const [driptagMintCard, setdriptagMintCard] = useState(0)
  const [driptatooMintCard, setdriptatooMintCard] = useState(0)

  const totalPresaleCount = 100
  const preSaleMintedNFT = useAppSelector((state) => state.bitFighters.preSaleNFTMintedCount)

  const totalDripPresaleCount = 100
  const dripPresaleMintedNFT = useAppSelector((state) => state.bitFighters.drip_preSaleNFTMintedCount)

  const onekClubMintedNFT = useAppSelector((state) => state.bitFighters.oneKClubMintedCards)
  const totalOneKClubNFTs = useAppSelector((state) => state.bitFighters.totalOneKClubCards)
  const priceOfOneKCLubNFT = useAppSelector((state) => state.bitFighters.currentPriceOfOneKClubCard)
  // const onekClubMintedNFT = 1

  const dispatch = useAppDispatch()

  const preSaleMint = async () => {
    // if (!validateFields()) return;
    console.log('in_presalemint', mintCardsQuantity, refAddrMintCard, mintCardsQuantity < 1)

    if (mintCardsQuantity < 1) {
      setmintCardsQuantity(1)
      // console.log("in_presalemint2", mintCardsQuantity, refAddrMintCard, mintCardsQuantity <1)
      // store.dispatch(SetFailureNotificationBool(true))
      // store.dispatch(SetFailureNotificationMessage("Quantity should be greater than 0"))
      // return
    }

    let tempRefAddr = ''
    if (refAddrMintCard == '') {
      setRefAddrMintCard(ethers.constants.AddressZero)
      tempRefAddr = ethers.constants.AddressZero
    } else {
      tempRefAddr = refAddrMintCard
    }
    setMintingBool(true)
    setMintingState('Generating Your Mint Card')

    const allowance = await checkAllowancePresale(store.getState().web3store.userAddress)
    console.log('allowance -- >', allowance.toString())
    if (ethers.BigNumber.from('100000000000000').gte(ethers.BigNumber.from(allowance.toString()))) {
      console.log('less allowance')
      if (!(await approveWBTC2(PRESALE_CONTRACT_ADDRESS, ethers.BigNumber.from('10000000000000000000')))) {
        setMintingBool(false)
        setMintingState('')

        store.dispatch(SetFailureNotificationBool(true))
        store.dispatch(SetFailureNotificationMessage('Approval Failed'))
        bootstrap.play_err_sound()
        return
      }
    }

    const output = await randomGenaratePreSaleV2(store.getState().web3store.userAddress, mintCardsQuantity)
    console.log('---output ', output)

    setMintingState('Minting Your Mint Card')
    const minted = await mintPreSaleNFTV2(output.data, tempRefAddr)
    if (!minted) {
      bootstrap.play_err_sound()
      setMintingBool(false)
      setMintingState('')

      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage('Minting Failed'))
      return
    } else {
      bootstrap.play_dr_bits_success_sound()
      store.dispatch(SetSuccessNotificationBool(true))
      store.dispatch(SetSuccessNotificationMessage(`Success`))
      setTimeout(() => {
        handleModalOpen()
      }, 1000)
    }

    setMintingBool(false)
    setSnackBarOpen(true)

    updatePresaleMintedCount()
  }

  const preSaleMintDrip = async () => {
    console.log('in_presalemintDrip', dripMintCardsQuantity)

    if (dripMintCardsQuantity < 1) {
      setdripMintCardsQuantity(1)
    }

    let tempRefAddr = ''
    if (refAddrMintCard == '') {
      setRefAddrMintCard(ethers.constants.AddressZero)
      tempRefAddr = ethers.constants.AddressZero
    } else {
      tempRefAddr = refAddrMintCard
    }
    setMintingBool(true)
    setMintingState('Generating Your Mint Card')

    const allowance = await checkAllowanceGeneral(store.getState().web3store.userAddress, PRESALE_DRIP_CONTRACT_V2)
    console.log('allowance -- >', allowance.toString())
    if (ethers.BigNumber.from('100000000000').gte(ethers.BigNumber.from(allowance.toString()))) {
      console.log('less allowance')
      if (!(await approveWBTC2(PRESALE_DRIP_CONTRACT_V2, ethers.BigNumber.from('10000000000000000000')))) {
        setMintingBool(false)
        setMintingState('')

        store.dispatch(SetFailureNotificationBool(true))
        store.dispatch(SetFailureNotificationMessage('Approval Failed'))
        bootstrap.play_err_sound()
        return
      }
    }

    const output = await randomGenarateDripPreSaleV2(
      store.getState().web3store.userAddress,
      dripMintCardsQuantity,
      driptatooMintCard === 1 ? 'Yes' : 'No',
      driptagMintCard === 1 ? 'Yes' : 'No',
    )
    console.log('---output ', output)

    setMintingState('Minting Your Drip Mint Card')
    const minted = await mintPreSaleDripNFTV2(output.data, tempRefAddr, driptatooMintCard === 1 ? 1 : 0, driptagMintCard === 1 ? 1 : 0)
    if (!minted) {
      bootstrap.play_err_sound()
      setMintingBool(false)
      setMintingState('')

      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage('Minting Failed'))
      return
    } else {
      bootstrap.play_dr_bits_success_sound()
      store.dispatch(SetSuccessNotificationBool(true))
      store.dispatch(SetSuccessNotificationMessage(`Success`))
      setTimeout(() => {
        handleModalOpen()
      }, 1000)
    }

    setMintingBool(false)
    setSnackBarOpen(true)

    updatePresaleMintedCount()
    updateDripPresaleMintedCount()
  }

  const oneKClubMint = async () => {
    // if (!validateFields()) return;
    setMintingBool(true)
    setMintingState('Generating Your OneK Club Card')
    if (isNullOrUndefined(onekClubQuantity) || onekClubQuantity < 1) {
      setOnekClubQuantity(1)
    }

    const allowance = await checkAllowanceOneKClub(store.getState().web3store.userAddress)
    console.log('allowance -- >', allowance.toString())
    if (ethers.BigNumber.from('1000000000000000').gte(ethers.BigNumber.from(allowance.toString()))) {
      console.log('less allowance')
      if (!(await approveUSDC(onek_club_contract_adress, ethers.BigNumber.from('100000000000000000')))) {
        setMintingBool(false)
        setMintingState('')

        store.dispatch(SetFailureNotificationBool(true))
        store.dispatch(SetFailureNotificationMessage('Approval Failed'))
        bootstrap.play_err_sound()
        return
      }
    }

    // const output = await randomGenaratePreSale(store.getState().web3store.userAddress);
    // console.log("---output ", output)

    setMintingState('Minting Your Onek Club Card')
    let temp_quantity = 1
    if (isNullOrUndefined(onekClubQuantity) || onekClubQuantity < 1) {
      setOnekClubQuantity(1)
    } else {
      temp_quantity = onekClubQuantity
    }
    const minted = await mintOneKClubCard(temp_quantity)
    if (!minted) {
      bootstrap.play_err_sound()
      setMintingBool(false)
      setMintingState('')

      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage('Minting Failed'))
      return
    } else {
      bootstrap.play_dr_bits_success_sound()
      updateOneKclubNFTs(store.getState().web3store.userAddress)
      store.dispatch(SetSuccessNotificationBool(true))
      store.dispatch(SetSuccessNotificationMessage(`Success`))
    }

    setMintingBool(false)
    setSnackBarOpen(true)
    updateOneKClubMintedCount()
  }

  const handleModalClose = () => {
    setOpenModal(false)
  }

  const handleModalOpen = () => setOpenModal(true)

  let CustomUI
  const MySidePanel = (
    <BoxWrapper2>
      <button
        onClick={() => setPageState(PageStates.Presale)}
        style={{
          backgroundColor: '#ae0606',
        }}
      >
        <h4 className='cooper-black-tab'>Presale</h4>
      </button>

      <button
        onClick={() => setPageState(PageStates.DripPreSale)}
        style={{
          backgroundColor: '#ae0606',
        }}
      >
        <h4 className='cooper-black-tab'>Drip Presale</h4>
      </button>

      <button
        onClick={() => setPageState(PageStates.OneKClub)}
        style={{
          backgroundColor: '#ae0606',
        }}
      >
        <h4 className='cooper-black-tab'>1K Club</h4>
      </button>
    </BoxWrapper2>
  )
  if (pageState === PageStates.Presale) {
    CustomUI = (
      <Wrapper>
        <BoxWrapper className='mint_box_shadow'>
          <TopRightBox>
            {totalPresaleCount - preSaleMintedNFT > 0 ? (
              <>
                <span></span>
                <FloaterBoxRight>
                  <h2>Ready</h2>
                </FloaterBoxRight>
              </>
            ) : (
              <>
                <span className='red'></span>
              </>
            )}
          </TopRightBox>

          <CustomBox>
            <h1>Bit Fighter Mint Card</h1>

            <h1>{totalPresaleCount - preSaleMintedNFT} Remaining</h1>
          </CustomBox>

          <div>
            <label>Quantity:</label>
            <input
              type='number'
              placeholder='quantity'
              value={mintCardsQuantity}
              onChange={(e) => {
                setmintCardsQuantity(parseInt(e.target.value))
              }}
              style={{
                marginTop: '10px',
                width: '200px',
                marginBottom: '20px',
              }}
            ></input>
            <br />

            <label>Ref addres:</label>
            <input
              type='text'
              placeholder='refAddr'
              value={refAddrMintCard}
              onChange={(e) => {
                setRefAddrMintCard(e.target.value)
              }}
              style={{
                marginTop: '10px',
                width: '200px',
                marginBottom: '20px',
              }}
            ></input>
          </div>

          <div
            className='cooper-black-tab'
            style={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <h2>Price - {mintCardsQuantity * 0.001 ? mintCardsQuantity * 0.001 : 0} BTC.b</h2>

            <img
              height={30}
              width={30}
              src='bitfgihter_assets/avax.png'
              style={{
                margin: '10px',
              }}
            />
          </div>

          <div>
            {totalPresaleCount - preSaleMintedNFT > 0 ? (
              <button
                onClick={() => preSaleMint()}
                style={{
                  width: '150px',
                  backgroundColor: '#ae0606',
                  height: '80px',
                }}
              >
                <h4 className='cooper-black-tab'>Go!</h4>
              </button>
            ) : (
              <div
                style={{
                  height: '80px',
                }}
              ></div>
            )}
          </div>

          <MyDivider />

          <FooterText>
            <h2>M-o-M Inc.</h2>
          </FooterText>

          {mintingBool && (
            <ProgressBarWrapper
              style={{
                margin: '20px',
              }}
            >
              <h3> {mintingState} </h3>
              <ProgressBar
                style={{
                  backgroundColor: 'grey',
                }}
              />
            </ProgressBarWrapper>
          )}
        </BoxWrapper>

        {MySidePanel}
      </Wrapper>
    )
  } else if (pageState === PageStates.OneKClub) {
    CustomUI = (
      <Wrapper>
        <BoxWrapper className='mint_box_shadow'>
          <TopRightBox>
            {totalPresaleCount - preSaleMintedNFT > 0 ? (
              <>
                <span></span>
                <FloaterBoxRight>
                  <h2>Ready</h2>
                </FloaterBoxRight>
              </>
            ) : (
              <>
                <span className='red'></span>
              </>
            )}
          </TopRightBox>

          <CustomBox>
            <h1>OneK Club Cards</h1>

            <h1>{totalOneKClubNFTs - onekClubMintedNFT} Remaining</h1>
          </CustomBox>

          <div
            className='cooper-black-tab'
            style={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <h1> Price - {parseUSDCBalance(priceOfOneKCLubNFT)} USDC </h1>
            <img
              height={30}
              width={30}
              src='bitfgihter_assets/avax.png'
              style={{
                margin: '10px',
              }}
            />
          </div>

          <div>
            <input
              type='number'
              placeholder='quantity'
              value={onekClubQuantity}
              onChange={(e) => {
                setOnekClubQuantity(parseInt(e.target.value))
              }}
              style={{
                marginTop: '10px',
                width: '200px',
                marginBottom: '20px',
              }}
            ></input>
          </div>

          <div>
            {totalPresaleCount - preSaleMintedNFT > 0 ? (
              <button
                onClick={() => oneKClubMint()}
                style={{
                  width: '150px',
                  backgroundColor: '#ae0606',
                  height: '80px',
                }}
              >
                <h4 className='cooper-black-tab'>Go!</h4>
              </button>
            ) : (
              <div
                style={{
                  height: '80px',
                }}
              ></div>
            )}
          </div>

          <MyDivider />

          <FooterText>
            <h2>M-o-M Inc.</h2>
          </FooterText>

          {mintingBool && (
            <ProgressBarWrapper
              style={{
                margin: '20px',
              }}
            >
              <h3> {mintingState} </h3>
              <ProgressBar
                style={{
                  backgroundColor: 'grey',
                }}
              />
            </ProgressBarWrapper>
          )}
        </BoxWrapper>

        {MySidePanel}
      </Wrapper>
    )
  } else if (pageState === PageStates.DripPreSale) {
    CustomUI = (
      <Wrapper>
        <BoxWrapper className='mint_box_shadow'>
          <TopRightBox>
            {totalPresaleCount - preSaleMintedNFT > 0 ? (
              <>
                <span></span>
                <FloaterBoxRight>
                  <h2>Ready</h2>
                </FloaterBoxRight>
              </>
            ) : (
              <>
                <span className='red'></span>
              </>
            )}
          </TopRightBox>

          <CustomBox>
            <h1>Drip Fighter Mint Card</h1>

            <h1>{totalDripPresaleCount - dripPresaleMintedNFT} Remaining</h1>
          </CustomBox>

          <div>
            <label>Quantity:</label>
            <input
              type='number'
              placeholder='quantity'
              value={dripMintCardsQuantity}
              onChange={(e) => {
                setdripMintCardsQuantity(parseInt(e.target.value))
              }}
              style={{
                marginTop: '10px',
                width: '200px',
                marginBottom: '20px',
              }}
            ></input>
            <br />

            <label>Ref addres:</label>
            <input
              type='text'
              placeholder='refAddr'
              value={driprefAddrMintCard}
              onChange={(e) => {
                setdripRefAddrMintCard(e.target.value)
              }}
              style={{
                marginTop: '10px',
                width: '200px',
                marginBottom: '20px',
              }}
            ></input>
            <br />

            <label>Tag: 0.002 BTC.b</label>
            <input
              type='checkbox'
              // placeholder='refAddr'
              value={driptagMintCard}
              onChange={(e) => {
                setdriptagMintCard(e.target.checked ? 1 : 0)
              }}
              style={{
                marginTop: '10px',
                width: '200px',
                marginBottom: '20px',
              }}
            ></input>

            <label>Tatoo: 0.003 BTC.b</label>
            <input
              type='checkbox'
              // placeholder='refAddr'
              value={driptatooMintCard}
              onChange={(e) => {
                setdriptatooMintCard(e.target.checked ? 1 : 0)
              }}
              style={{
                marginTop: '10px',
                width: '200px',
                marginBottom: '20px',
              }}
            ></input>
          </div>

          <div
            className='cooper-black-tab'
            style={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <h2>
              Price -{' '}
              {dripMintCardsQuantity * (0.001 + 0.002 * driptagMintCard + 0.003 * driptatooMintCard)
                ? dripMintCardsQuantity * (0.001 + 0.002 * driptagMintCard + 0.003 * driptatooMintCard)
                : 0}{' '}
              BTC.b
            </h2>

            <img
              height={30}
              width={30}
              src='bitfgihter_assets/avax.png'
              style={{
                margin: '10px',
              }}
            />
          </div>

          <div>
            {totalPresaleCount - preSaleMintedNFT > 0 ? (
              <button
                onClick={() => preSaleMintDrip()}
                style={{
                  width: '150px',
                  backgroundColor: '#ae0606',
                  height: '80px',
                }}
              >
                <h4 className='cooper-black-tab'>Go!</h4>
              </button>
            ) : (
              <div
                style={{
                  height: '80px',
                }}
              ></div>
            )}
          </div>

          <MyDivider />

          <FooterText>
            <h2>M-o-M Inc.</h2>
          </FooterText>

          {mintingBool && (
            <ProgressBarWrapper
              style={{
                margin: '20px',
              }}
            >
              <h3> {mintingState} </h3>
              <ProgressBar
                style={{
                  backgroundColor: 'grey',
                }}
              />
            </ProgressBarWrapper>
          )}
        </BoxWrapper>

        {MySidePanel}
      </Wrapper>
    )
  }

  if (openModal) {
    CustomUI = (
      <ModalWrapper>
        <Modal open={openModal} onClose={handleModalClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
          <ModalBoxWrapper>
            <h2>Success!</h2>
            <Typography id='modal-modal-title' variant='h2' component='h2'></Typography>
            <ReactPlayer url='https://production-bitfighters.s3.ap-south-1.amazonaws.com/videos/mc.mp4' controls={true} loop playing={true} />
          </ModalBoxWrapper>
        </Modal>
      </ModalWrapper>
    )
  }

  return (
    <>
      <NotificationMessageHelper />
      {loggedInUserWalletAddress !== '' && web3ConnectedUser ? <div>{CustomUI}</div> : <Title>Loading...</Title>}
    </>
  )
}
