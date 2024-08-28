// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Button from '@mui/material/Button'
import { useAppDispatch, useAppSelector } from '../hooks'
import { Alert, AlertTitle, LinearProgress, makeStyles, Snackbar, Tooltip, withStyles } from '@mui/material'
import { Link } from 'react-router-dom'

import MetaMaskOnboarding from '@metamask/onboarding'
import { Web3Login } from './Web3Login'
import { Login, SetConnectedWeb3 } from '../stores/Web3Store'
import { makeid, randomNickNameGenarate } from '../utils'
import { fetchNFTsFromDB, loginAndAuthenticateUser, randomGenarate, randomGenarateBitfightersV2 } from '../hooks/ApiCaller'
import { fetchAllNFTsFromDbEntries } from '../hooks/FetchNFT'
import { setNFTDetails, setNFTLoadedBool, setTotalNFTData } from '../stores/BitFighters'
import { isNullOrUndefined } from 'util'
import { ChangeAuthTOken, ChangeMaticBalance, ChangeValidUserState, ChangewbtcBalance } from '../stores/UserWebsiteStore'
import { ethers } from 'ethers'
import { Web2Login } from './Web2Login'
import { getSystemInfo, getSystemLandscapeInfo } from '../utils/systemInfo'
import { Container, Row, Col } from 'react-bootstrap'
import { useOrientation } from 'react-use'

const Content = styled.div({
  display: 'flex',
  height: '100%',
  flexDirection: 'column',
  margin: '0px',
  padding: '0px',
  gap: '10px',
  alignItems: 'center',
})

const Headline = styled.div`
  h2 {
    font-family: 'Cooper Black', sans-serif;
    // font-family: Monospace;
    font-style: bold;
    font-size: 32px;
    line-height: 75%;
    font-weight: 400;
    color: grey;
  }
`

const ButtonView = styled.button`
  span {
    color: #a7a5a5;
    // font-family: Monospace;
    font-style: bold;
    font-size: 14px;
    font-family: 'Cooper Black';
    text-transform: uppercase;
  }

  // background-color: #e60808;
  background-color: #9c341a;

  &:hover {
    background-color: #852d17;
  }

  width: 300px;
  height: 50px;
`

const ButtonnAndInfoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  // background-color: yellow;
`

const InfoButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  // background-color: red;
  align-items: center;
  padding-left: 10px;
`

const ProgressBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 20px;
  margin-bottom: 20px;

  h3 {
    color: #33ac96;
  }
`

const ProgressBar = styled(LinearProgress)`
  width: 360px;
`

const vertical = 'top'

const horizontal = 'center'

declare global {
  interface Window {
    // @ts-ignore: Ignore the error for this specific line
    ethereum?: any
  }
}

function Home() {
  const [snackBarOpen, setSnackBarOpen] = useState(false)
  const [snackBarMessage, setSnackBarMessage] = useState('BitFighter Minted')
  const bitFighterNFTData = useAppSelector((state) => state.bitFighters.nftData)
  const nftDataLoaded = useAppSelector((state) => state.bitFighters.loaded)
  const userAddress = useAppSelector((state) => state.web3store.userAddress)
  const web3ConnectedUser = useAppSelector((state) => state.web3store.web3Connected)
  const metaMaskInstalledBool = useAppSelector((state) => state.userPathStore.metaMaskInstalled)
  // store.getState().playerDataStore.current_game_player_info.lucky_number;
  const dispatch = useAppDispatch()
  const [mintingBool, setMintingBool] = useState(false)
  const onboarding = new MetaMaskOnboarding()
  const isMobile = getSystemInfo()
  const { type } = useOrientation()
  const orientationType = type

  const handleClose = () => {
    setSnackBarOpen(false)
  }

  const connectButtonHandle = async () => {
    // if (getSystemInfo()) {
    //   // await PhoneWeb3Login()
    //   await Web3Login()
    // } else {
    if (!metaMaskInstalledBool) {
      onboarding.startOnboarding()
    } else if (metaMaskInstalledBool) {
      await Web3Login()
      // await PhoneWeb3Login()
    }
    // }
  }

  const joinAsGuest = async () => {
    const web2Address = localStorage.getItem('web2_wallet_address')
    console.log('debug_joinAsGuest as guest clicked.. ', web2Address)
    if (web2Address) {
      return Web2Login(web2Address)
    }
    // console.log("debug_joinAsGuest as guest clicked.. ");
    const web2Id = makeid(50)
    dispatch(Login(web2Id))
    dispatch(ChangeValidUserState(true))
    const auth_token: string = await loginAndAuthenticateUser(web2Id)
    dispatch(ChangeAuthTOken(auth_token))
    localStorage.setItem('web2_wallet_address', web2Id)
    setTimeout(async () => {
      const output = await randomGenarateBitfightersV2(web2Id, ethers.constants.AddressZero, 1, 'web2')
      console.log('--output .. ', output)
      if (!isNullOrUndefined(output)) {
        const result = await fetchNFTsFromDB(web2Id)
        const dataOfNFTS = await fetchAllNFTsFromDbEntries(result.message)
        dispatch(setTotalNFTData(result.message))
        dispatch(setNFTDetails(dataOfNFTS))
        dispatch(setNFTLoadedBool(true))
        dispatch(Login(web2Id))
        dispatch(SetConnectedWeb3(false))
        dispatch(ChangewbtcBalance('0'))
        dispatch(ChangeMaticBalance('0'))
        setMintingBool(false)
      }
    }, 1000)
  }

  // const joinWithEmailAddress = async () => {
  //   console.log(" ..join with email address clicked.. ");
  //   const web2Id = localStorage.getItem("web2_email_address");
  //   setTimeout(async () => {
  //     if (web2Id) {
  //       const output = await randomGenarate(
  //         web2Id,
  //         "",
  //         20,
  //         randomNickNameGenarate(),
  //         "web2"
  //       );
  //       console.log("--output .. ", output);
  //       if (!isNullOrUndefined(output)) {
  //         const result = await fetchNFTsFromDB(web2Id);
  //         const dataOfNFTS = await fetchAllNFTsFromDbEntries(result.message);
  //         dispatch(setTotalNFTData(result.message));
  //         dispatch(setNFTDetails(dataOfNFTS));
  //         dispatch(setNFTLoadedBool(true));
  //         dispatch(Login(web2Id));
  //         dispatch(SetConnectedWeb3(false));

  //         dispatch(ChangewbtcBalance("0"));
  //         dispatch(ChangeMaticBalance("0"));
  //       }
  //     }
  //   }, 1000);
  // };

  let View = null
  // if (!nftDataLoaded) {
  //   View = <>
  //   <ButtonnAndInfoWrapper>
  //     <Tooltip title="Connect web3 wallet">
  //     <ButtonView  color="error" onClick={() => connectButtonHandle() }>
  //       <span>
  //         Connect
  //       </span>
  //     </ButtonView>
  //     </Tooltip>
  //     {/* <Tooltip title="Go to Docs">
  //     <InfoButtonWrapper>
  //       <a href="https://docs.bitfighters.club/bit-fighters/the-game/get-started/connect-a-wallet" target="_blank">
  //       <InfoOutlined color='action' fontSize='medium' />
  //       </a>
  //     </InfoButtonWrapper>
  //     </Tooltip> */}
  //   </ButtonnAndInfoWrapper>
  //   </>
  // } else

  if (!nftDataLoaded && !web3ConnectedUser) {
    View =
      orientationType === 'portrait-primary' || orientationType === 'portrait-secondary' ? (
        <Row className='h-25 bg-transparent'>
          <Col className='center bg-transparent h-50'>
            <ButtonView color='info' onClick={() => connectButtonHandle()}>
              <span>Connect Web3 Wallet</span>
            </ButtonView>
          </Col>
          <Col className='center bg-transparent h-50'>
            <Link className='primary' to='/game'>
              <ButtonView onClick={() => joinAsGuest()}>
                <span>Play as Guest</span>
              </ButtonView>
            </Link>
          </Col>
        </Row>
      ) : (
        <Col className='w-50 bg-transparent'>
          <div className='center bg-transparent h-100 p-3'>
            <ButtonView color='info' onClick={() => connectButtonHandle()}>
              <span>Connect Web3 Wallet</span>
            </ButtonView>
          </div>
          <div className='center bg-transparent h-100 p-3'>
            <Link className='primary' to='/game'>
              <ButtonView onClick={() => joinAsGuest()}>
                <span>Play as Guest</span>
              </ButtonView>
            </Link>
          </div>
        </Col>
      )
  } else if (nftDataLoaded && !web3ConnectedUser && bitFighterNFTData.length === 0) {
    View =
      orientationType === 'portrait-primary' || orientationType === 'portrait-secondary' ? (
        <Row className='h-25 bg-transparent'>
          <Col className='center bg-transparent h-75'>
            <ButtonView color='info' onClick={() => connectButtonHandle()}>
              <span>Connect Web3 Wallet 1</span>
            </ButtonView>
          </Col>
        </Row>
      ) : (
        <Col className='w-50 bg-transparent'>
          <Row className='center bg-transparent h-100 p-3'>
            <ButtonView color='info' onClick={() => connectButtonHandle()}>
              <span>Connect Web3 Wallet 1</span>
            </ButtonView>
          </Row>
        </Col>
      )
  } else if (nftDataLoaded && bitFighterNFTData.length === 0) {
    View =
      orientationType === 'portrait-primary' || orientationType === 'portrait-secondary' ? (
        <Row className='h-25 bg-transparent'>
          <Col className='center bg-transparent h-75'>
            <Link className='primary' to='/mint'>
              <ButtonView color='inherit'>
                <span>Mint</span>
              </ButtonView>
            </Link>
          </Col>
        </Row>
      ) : (
        <Col className='w-50 bg-transparent'>
          <Row className='center bg-transparent h-100 p-3'>
            <Link className='primary' to='/mint'>
              <ButtonView color='inherit'>
                <span>Mint</span>
              </ButtonView>
            </Link>
          </Row>
        </Col>
      )
  } else if (nftDataLoaded && bitFighterNFTData.length > 0) {
    View =
      orientationType === 'portrait-primary' || orientationType === 'portrait-secondary' ? (
        <Row className='h-25 bg-transparent'>
          <Col className='center bg-transparent h-50'>
            <Link className='primary' to='/mint'>
              <ButtonView color='error'>
                <span>Mint</span>
              </ButtonView>
            </Link>
          </Col>
          <Col className='center bg-transparent h-50'>
            <Link className='primary' to='/game'>
              <ButtonView color='error'>
                <span>View Fighters</span>
              </ButtonView>
            </Link>
          </Col>
        </Row>
      ) : (
        <Col className='w-50 bg-transparent'>
          <div className='center bg-transparent h-100 p-3'>
            <Link className='primary' to='/mint'>
              <ButtonView color='error'>
                <span>Mint</span>
              </ButtonView>
            </Link>
          </div>
          <div className='center bg-transparent h-100 p-3'>
            <Link className='primary' to='/game'>
              <ButtonView color='error'>
                <span>View Fighters</span>
              </ButtonView>
            </Link>
          </div>
        </Col>
      )
  }

  // return (
  //   <div style={{ height: '100%' }}>
  //     <Snackbar anchorOrigin={{ vertical, horizontal }} open={snackBarOpen} autoHideDuration={6000} onClose={handleClose} key={vertical + horizontal}>
  //       <Alert onClose={handleClose} severity='success' sx={{ width: '100%' }}>
  //         <AlertTitle>Success</AlertTitle>
  //         {snackBarMessage} <strong>check it out! </strong>
  //       </Alert>
  //     </Snackbar>
  //     {orientationType === 'portrait-primary' || orientationType === 'portrait-secondary' ? (
  //       <>
  //         {/* <Container className="h-100 container-fluid">
  //                         <Row className="h-50 center bg-transparent">
  //                             <picture style={{display:"flex"}}>
  //                                 <source media="(min-width:750px)" srcSet="/bitfgihter_assets/websiteLogo.png" />
  //                                 <source media="(min-width:100px)" srcSet="/bitfgihter_assets/logo_small.png" />
  //                                 <img src="img_orange_flowers.jpg" alt="Flowers" style={{width:"80%", margin:"auto"}}/>
  //                             </picture>
  //                         </Row>
  //                         {View}
  //                     </Container> */}
  //       </>
  //     ) : (
  //       <>
  //         <Container className='w-100 h-75 bg-transparent center'>
  //           <Row className='center bg-transparent'>
  //             <Col className='w-50 center bg-transparent'>
  //               <picture>
  //                 <source media='(min-width:750px)' srcSet='/bitfgihter_assets/websiteLogo.png' />
  //                 <source media='(min-width:100px)' srcSet='/bitfgihter_assets/logo_small.png' />
  //                 <img src='img_orange_flowers.jpg' alt='Flowers' style={{ width: '100%', margin: 'auto' }} />
  //               </picture>
  //             </Col>
  //             {View}
  //           </Row>
  //         </Container>
  //       </>
  //     )}
  //     {/* <Headline>
  //                 <h2>
  //                     Bitfighter Pre-Sale Mint
  //                 </h2>
  //                 <h2>
  //                     Begins 5/6/2023
  //                 </h2>
  //                 <h2>
  //                     Only 100 will be available
  //                 </h2>
  //             </Headline> */}
  //   </div>
  // )

  return (
    <div className='container'>
      <div className='h1-wrapper'>
        <h1 className='text'>Ready to Play?</h1>

        <h1 className='text-stroke'>Ready to Play?</h1>

        <h1 className='text-shadow'>Ready to Play?</h1>
      </div>

      <div className='play-btns-wrapper'>
        {!nftDataLoaded && !web3ConnectedUser ? (
          <>
            <div onClick={() => connectButtonHandle()} className='primary-btn-component'>
              <span className='dot'></span>
              <span className='dot'></span>
              <span className='dot'></span>
              <span className='dot'></span>

              <div className='content'>
                <span>Connect Wallet</span>
              </div>
            </div>

            <Link to='/game' onClick={() => joinAsGuest()} className='primary-btn-component'>
              <span className='dot'></span>
              <span className='dot'></span>
              <span className='dot'></span>
              <span className='dot'></span>

              <div className='content'>
                <span>Play as Guest</span>
              </div>
            </Link>
          </>
        ) : nftDataLoaded && web3ConnectedUser && bitFighterNFTData.length === 0 ? (
          <>
            <Link to={'/mint'} className='primary-btn-component'>
              <span className='dot'></span>
              <span className='dot'></span>
              <span className='dot'></span>
              <span className='dot'></span>

              <div className='content'>
                <span>Mint</span>
              </div>
            </Link>

            <Link to='/game' onClick={() => joinAsGuest()} className='primary-btn-component'>
              <span className='dot'></span>
              <span className='dot'></span>
              <span className='dot'></span>
              <span className='dot'></span>

              <div className='content'>
                <span>Play as Guest</span>
              </div>
            </Link>
          </>
        ) : nftDataLoaded && web3ConnectedUser && bitFighterNFTData.length > 0 ? (
          <>
            <Link to='/game' className='primary-btn-component'>
              <span className='dot'></span>
              <span className='dot'></span>
              <span className='dot'></span>
              <span className='dot'></span>

              <div className='content'>
                <span>Play Now</span>
              </div>
            </Link>

            <Link to={'/mint'} className='primary-btn-component'>
              <span className='dot'></span>
              <span className='dot'></span>
              <span className='dot'></span>
              <span className='dot'></span>

              <div className='content'>
                <span>Mint</span>
              </div>
            </Link>
          </>
        ) : nftDataLoaded && !web3ConnectedUser && bitFighterNFTData.length === 0 ? (
          <>
            <div onClick={() => connectButtonHandle()} className='primary-btn-component'>
              <span className='dot'></span>
              <span className='dot'></span>
              <span className='dot'></span>
              <span className='dot'></span>

              <div className='content'>
                <span>Connect Wallet</span>
              </div>
            </div>

            <Link to='/game' onClick={() => joinAsGuest()} className='primary-btn-component'>
              <span className='dot'></span>
              <span className='dot'></span>
              <span className='dot'></span>
              <span className='dot'></span>

              <div className='content'>
                <span>Play as Guest</span>
              </div>
            </Link>
          </>
        ) : (
          <>
            <div onClick={() => connectButtonHandle()} className='primary-btn-component'>
              <span className='dot'></span>
              <span className='dot'></span>
              <span className='dot'></span>
              <span className='dot'></span>

              <div className='content'>
                <span>Connect Wallet</span>
              </div>
            </div>

            <Link to='/game' onClick={() => joinAsGuest()} className='primary-btn-component'>
              <span className='dot'></span>
              <span className='dot'></span>
              <span className='dot'></span>
              <span className='dot'></span>

              <div className='content'>
                <span>Play as Guest</span>
              </div>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
export default Home
