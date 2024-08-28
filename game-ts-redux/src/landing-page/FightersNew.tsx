// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import React, { useEffect, useState } from 'react'
import { LoadingButton } from '@mui/lab'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '../hooks'
import {
  Box,
  Button,
  CircularProgress,
  Fab,
  FormControl,
  Grid,
  ImageList,
  ImageListItem,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Snackbar,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
} from '@mui/material'
import phaserGame from '../PhaserGame'
import Bootstrap from '../game/scenes/Bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import Chat from '../game/Components/Chat'
import { v4 as uuidv4 } from 'uuid'
import { SetCurrentGamePlayer, setNickName } from '../stores/PlayerData'
import { IPlayerData } from '../game/characters/IPlayer'
import { PlayersInfo } from '../game/Components/PlayersInfo'
import { SendingFriendRequest } from '../game/Components/SendingFriendRequest'
import { QueueAddInfoWindow } from '../game/Components/QueueAddInfoWindow'
import { BroadcastingAnnouncement } from '../game/Components/BroadcastingInfo/BroadcastingAnnouncement'
import { BroadCastCombiner2 } from '../game/Components/BroadCastInfo2/BroadcastCombiner'
import { ControlsInfo } from '../game/Components/ControlsInfo'
import { isNullOrUndefined } from 'util'
import { ATMView } from '../game/Components/ATMView'
import NewMenuSideBar from '../game/Components/NewMenuSideBar'
import { InventoryView } from '../game/Components/InventoryView/InventoryView'
import InGameAssetPurchase from '../game/Components/MenuComponents/InGameAsssetPurchase'
import { CheckIfAcceptableNickName, fetchNFTsFromDB, loginAndAuthenticatePlayer, updateNFTsInDB, updateSingleBfInDB } from '../hooks/ApiCaller'
import store from '../stores'
import { setPlayerAuthToken } from '../stores/AuthStore'
import NotificationMessageHelper from '../game/Components/NotificationMessageHelper'
import { EquipView } from '../game/Components/InventoryView/EquipView'
import { Loader } from './components/Loader/Loader'
import { SetGameLoadingState, SetSelectedGameServerURL, SetShowGameServersList } from '../stores/WebsiteStateStore'
import { ListGameServers } from '../utils/game_server_utils'
import { ServerListWindow } from '../game/Components/MenuComponents/ServerList/ServerListWindow'
import { SetFailureNotificationBool, SetFailureNotificationMessage } from '../stores/NotificationStore'
import { registerBitfighter } from '../contract'
import { fetchAllNFTsFromDbEntries } from '../hooks/FetchNFT'
import { setTotalNFTData, setNFTDetails } from '../stores/BitFighters'
import Footer from './Footer'
import NewWinnersReceipt from '../game/Components/MenuComponents/NewWinnersReceipt'
// import TextView from '../game/Components/TextView';
// import { MyInfoIcon } from '../game/Components/InfoIcon';

import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import { ChangeShowMenuBox, ChangeShowQueueBox } from '../stores/UserWebsiteStore'

const Title = styled.h1`
  font-size: 28px;
  // color: #eee;
  color: #d2d2d2;
  text-align: center;
  margin: 10vw;
  margin-top: 10vh;
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

const ButtonView = styled(Button)`
  span {
    color: #a7a5a5;
    font-style: bold;
    font-size: 20px;
    font-family: 'Cooper Black', sans-serif;
  }
  border-radius: 20px;
  background-color: #9c341a;

  &:hover {
    background-color: #852d17;
  }

  width: 300px;
  height: 60px;
`

const ButtonView2 = styled(Button)`
  span {
    color: #a7a5a5;
    font-style: bold;
    font-size: 20px;
    font-family: 'Cooper Black', sans-serif;
  }
  border-radius: 20px;
  background-color: #9c341a;
  &:hover {
    background-color: #852d17;
  }
  width: 200px;
  height: 30px;
  margin: 10px;
`

const FixedForm = styled.div`
  position: absolute;
  position: relative;
  // margin: 50%;
  // transform: translate(-50%, -50%);

  // margin: 10%;

  background: #d2d3e1;
  width: 300px;
  // height: 35vh;

  border: 5px solid #000000;
  border-radius: 10px;
  padding: 20px;

  opacity: 0.9;

  border-radius: 20px;

  label {
    font-size: 20px;
    font-family: 'Cooper Black', sans-serif;
    letter-spacing: 0.5px;
    margin-left: 5px;
  }

  input[type='text'] {
    padding: 0;
    padding-left: 3px;
    background-color: transparent;
    outline: 0;
    border: 0;
    border-bottom: 3px solid #363636;
    max-width: 200px;
    text-align: center;
    font-family: 'Cooper Black';
    font-size: 16px;
    color: #363636;
  }

  input[type='number'] {
    padding: 0;
    padding-left: 3px;
    background-color: transparent;
    outline: 0;
    border: 0;
    border-bottom: 3px solid #363636;
    max-width: 40px;
    text-align: center;
    font-family: 'Cooper Black';
    font-size: 16px;
    color: #363636;
  }
`

const BoxWrapper2 = styled(Box)`
  overflow-y: auto;
  width: 25vw;
  max-height: 90vh;
  position: relative;

  display: flex;
  flex-direction: column;

  h2 {
    font-family: 'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 20px;
    color: black;
    line-height: 75%;
    margin: 10px;
    margin-top: 10px;
  }
`

const BoxWrapper = styled(Box)`
  overflow: auto;
  position: relative;

  background-color: #2d2a2a;

  width: 40vw;
  margin-left: 0.5%;
  color: white;

  margin-top: 0px;
  border-radius: 20px;
`

const ImageView = styled.div`
  display: flex;
  flex-direction: column;
  width: auto;
  align-items: center;
  h1 {
    font-family: 'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 2.5vw;
    color: aliceblue;
    line-height: 75%;
  }

  img {
    margin-top: 5px;
  }
`

const ListImageView = styled.div`
  display: flex;
  flex-direction: column;
  width: auto;
  align-items: center;
  h1 {
    font-family: 'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 0.6rem;
    color: aliceblue;
    padding-top: 10%;
  }
  img {
    margin: 1px 1px 1px 1px;
  }
`

const AttributeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  img {
    width: 24px;
    height: 24px;
  }

  h5 {
    font-family: 'Press Start 2P', sans-serif;
    font-size: 8px;
    text-transform: uppercase;
  }
`

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => <Tooltip {...props} classes={{ popper: className }} placement='top' arrow />)(
  ({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      paddingTop: '10px',
      paddingRight: '15px',
      border: '1px solid #dadde9',
      backgroundColor: '#f5f5f9',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      color: 'rgba(0, 0, 0, 0.87)',
    },
    [`& .${tooltipClasses.arrow}`]: {
      '&:before': {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
      },
    },
  }),
)

function NewFighters() {
  const bitFighterNFTData = useAppSelector((state) => state.bitFighters.nftData)
  const bitFightersTotalData = useAppSelector((state) => state.bitFighters.totalNFTData)
  const bitfightersLoadedBool = useAppSelector((state) => state.bitFighters.loaded)
  const loggedInUserWalletAddress = useAppSelector((state) => state.web3store.userAddress)
  const userAddress = useAppSelector((state) => state.web3store.userAddress)

  const gameServerReginoSelected = useAppSelector((state) => state.websiteStateStore.region)
  console.log('--------total_data-------', bitFightersTotalData)

  const selectedPlayer = useAppSelector((state) => state.playerDataStore.current_game_player_info)

  console.log('debug_selected_player_in_fightersNew', selectedPlayer)
  const ProfilemenuClicked = useAppSelector((state) => state.userPathStore.ShowMenuBox)
  const gameStarted = useAppSelector((state) => state.playerDataStore.gameStarted)
  const showing_jackpot_wheel = useAppSelector((state) => state.websiteStateStore.showing_jackpot_wheel)
  const [formNickNameame, setFormNickName] = useState('')
  const [formLuckyNumber, setFormLuckyNumber] = useState(1)

  const [registerProcessRunning, setRegisterProcessRunning] = useState(false)

  const [playerSelectedBool, setPlayerSelectedBool] = useState(false)
  const [playerSelected, setPlayerSelected] = useState<IPlayerData>()
  const [cardSelected, setCardSelected] = useState('')
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap

  const handlePlayerSelection = async (data: IPlayerData) => {
    console.log('--player selected.. data ', data)
    setPlayerSelected(data)
    setPlayerSelectedBool(true)

    store.dispatch(SetShowGameServersList(true))
    store.dispatch(SetCurrentGamePlayer(data))
    store.dispatch(setNickName(data.nick_name))

    setCardSelected(data.data.image)
    bootstrap.play_select_sound()

    console.log('--player selected.. calling login ')
    const playerAuthToken = await loginAndAuthenticatePlayer(data.user_wallet_address, data.minted_id)
    if (!isNullOrUndefined(playerAuthToken)) {
      store.dispatch(setPlayerAuthToken(playerAuthToken))
      ListGameServers(gameServerReginoSelected)
    }
  }

  const registerFormValidate = async () => {
    setRegisterProcessRunning(true)

    console.log('in ---- register fn... ', formLuckyNumber, formNickNameame, playerSelected?.minted_id)

    if (!(formLuckyNumber > 0 && formLuckyNumber < 100)) {
      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage('Lucky Number should be 0-100'))
      setRegisterProcessRunning(false)
      return
    }

    if (!(formNickNameame.length > 0 && formNickNameame.length < 13)) {
      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage('Nick name should be of length 1-12'))
      setRegisterProcessRunning(false)
      return
    }

    if (playerSelected && playerSelected?.minted_id === 0) {
      return
    }

    if (!playerSelected) {
      return
    }

    // check if acceptable nick name
    const data = await CheckIfAcceptableNickName(formNickNameame)
    console.log('---debug_nick_name_validate---', data)
    if (!data) {
      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage('Choose other Nick Name. This one is taken'))
      setRegisterProcessRunning(false)
      return
    }

    // update in smart contract. and then update the db
    // then fetch data from db
    // and udate the UI

    const registered = await registerBitfighter(formNickNameame, formLuckyNumber, playerSelected?.minted_id)
    if (registered.error === 1) {
      //
      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage(registered.message + '\n' + registered.error_data))
    } else {
      //
      await updateSingleBfInDB(store.getState().web3store.userAddress, playerSelected.minted_id)
      const result = await fetchNFTsFromDB(store.getState().web3store.userAddress)
      console.log('-------dataofnfts--*******-- .', result)

      const dataOfNFTS = await fetchAllNFTsFromDbEntries(result.message)
      console.log('dataofnfts -- ', dataOfNFTS)

      store.dispatch(setTotalNFTData(result.message))
      store.dispatch(setNFTDetails(dataOfNFTS))

      console.log('--dataofnfts-', playerSelected.minted_id)

      for (let i = 0; i < result.message.length; i++) {
        console.log('--dataofnfts-', playerSelected.minted_id, result.message[i].minted_id)
        if (playerSelected.minted_id === result.message[i].minted_id) {
          store.dispatch(SetCurrentGamePlayer(result.message[i]))
        }
      }
    }

    setRegisterProcessRunning(false)
  }

  useEffect(() => {
    const handleContextmenu = (e) => {
      e.preventDefault()
    }

    document.addEventListener('contextmenu', handleContextmenu)

    return function cleanup() {
      document.removeEventListener('contextmenu', handleContextmenu)
    }
  }, [])

  useEffect(() => {
    if (bitFighterNFTData.length > 0) {
      // store.dispatch(SetShowGameServersList(true));
    }

    if (!gameStarted && userAddress !== '') {
      setTimeout(() => {
        store.dispatch(SetShowGameServersList(true))
      }, 1000)
    } else {
      store.dispatch(SetShowGameServersList(false))
    }

    // console.log("--------- in fightersnew -- ", selectedPlayer)
    // if (selectedPlayer)

    window.addEventListener('beforeunload', beforeUnloadFun)
    function beforeUnloadFun() {
      localStorage.setItem('last_logged_out', new Date().getTime().toString())
    }

    return () => {
      // beforeUnloadFun()
      window.removeEventListener('beforeunload', beforeUnloadFun)
    }
  }, [])

  const ShowMenuBoxRedux = useAppSelector((state) => state.userPathStore.ShowMenuBox)

  return gameStarted ? (
    <>
      <div style={{ height: '100%', display: 'flex' }}>
        <NotificationMessageHelper />
        <Loader />

        <>
          <NotificationMessageHelper />
          <>{ProfilemenuClicked && <NewMenuSideBar />}</>
          <ControlsInfo />
          <InventoryView />
          <EquipView />
          <BroadCastCombiner2 />
          <ATMView />
          <InGameAssetPurchase />
          <BroadcastingAnnouncement />
          <Chat />
          <PlayersInfo />
          <QueueAddInfoWindow />
          <NewWinnersReceipt />
          <SendingFriendRequest />
          <Footer />

          <Box>
            <Fab
              size='small'
              sx={{
                position: 'absolute',
                top: ShowMenuBoxRedux ? 50 : 10,
                right: 10,
                // width: '40px',
                // height: '30px'
              }}
              color={'red'}
            >
              {ShowMenuBoxRedux ? (
                <ChevronRightIcon
                  onClick={() => {
                    store.dispatch(ChangeShowMenuBox(false))
                    // store.dispatch(ChangeShowQueueBox(false));
                  }}
                />
              ) : (
                <KeyboardArrowLeftIcon
                  onClick={() => {
                    store.dispatch(ChangeShowMenuBox(true))
                    // store.dispatch(ChangeShowQueueBox(false));
                  }}
                />
              )}
            </Fab>
          </Box>
        </>
      </div>
    </>
  ) : (
    <>
      <NotificationMessageHelper />
      <Loader />
      <div className='container'>
        <div className='game-player-selection-component'>
          {cardSelected !== '' ? (
            <div className='selected-player-box'>
              <div className='floating-content'>
                <img src={cardSelected} alt='' />

                <h4>
                  {playerSelected?.minted_id ? (playerSelected.minted_id > 0 ? playerSelected?.minted_id : '') : ''} .{' '}
                  {selectedPlayer.nick_name !== '' ? selectedPlayer.nick_name : '?'}
                </h4>
              </div>

              <img src='/floating-light.png' alt='' className='floating-light-img' />
            </div>
          ) : (
            <> </>
          )}

          {cardSelected !== '' && selectedPlayer.nick_name === '' ? (
            <div className='player-register-form'>
              <h2>Register Your Fighter</h2>

              <div className='input-part'>
                <label htmlFor='nick_name'>Name:</label>

                <input
                  id='nick_name'
                  type='text'
                  placeholder='up to 12 letters'
                  value={formNickNameame}
                  onChange={(e) => {
                    setFormNickName(e.target.value)
                  }}
                  required
                />
              </div>

              <div className='input-part'>
                <label htmlFor='lucky_number'>Lucky #:</label>

                <input
                  id='lucky_number'
                  type='text'
                  placeholder='(1-100)'
                  onChange={(e) => {
                    setFormLuckyNumber(parseInt(e.target.value))
                  }}
                  required
                />
              </div>

              {!registerProcessRunning ? (
                <div
                  onClick={() => {
                    registerFormValidate()
                  }}
                  className='primary-btn-component'
                >
                  <span className='dot'></span>
                  <span className='dot'></span>
                  <span className='dot'></span>
                  <span className='dot'></span>

                  <div className='content'>
                    <span>Submit</span>
                  </div>
                </div>
              ) : (
                <div className='primary-btn-component'>
                  <span className='dot'></span>
                  <span className='dot'></span>
                  <span className='dot'></span>
                  <span className='dot'></span>

                  <div className='content'>
                    <span>Submitting...</span>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          <div className='two-parts'>
            <div className='players-box'>
              <div className='h2-wrapper'>
                <h2 className='text'>Select Fighter</h2>

                <h2 className='text-stroke'>Select Fighter</h2>

                <h2 className='text-shadow'>Select Fighter</h2>
              </div>

              {bitFighterNFTData.length == 0 && loggedInUserWalletAddress !== '' && bitfightersLoadedBool ? (
                <>
                  <p>No Bit Fighters detected in this wallet</p>

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
              ) : bitFighterNFTData.length == 0 && loggedInUserWalletAddress !== '' && !bitfightersLoadedBool ? (
                <>
                  <p>Loading...</p>
                </>
              ) : loggedInUserWalletAddress === '' ? (
                <>
                  <p>Checking for Bit Fighters...</p>
                </>
              ) : (
                <>
                  <div className='player-cards-wrapper'>
                    {bitFightersTotalData.map((data, index) => {
                      return (
                        <HtmlTooltip
                          title={
                            <React.Fragment>
                              {data.data.attributes.map((attr: { trait_type: any; value: any }, index) => {
                                return attr.trait_type === 'Defense' ? (
                                  <AttributeInfo key={index}>
                                    <img src='bitfgihter_assets/icons/diamond_icon.png' alt='.' />
                                    <h5>Defense: {attr.value} </h5>
                                  </AttributeInfo>
                                ) : attr.trait_type === 'Health' ? (
                                  <AttributeInfo key={index}>
                                    <img src='bitfgihter_assets/icons/heart_icon.png' alt='.' />
                                    <h5>Health: {attr.value} </h5>
                                  </AttributeInfo>
                                ) : attr.trait_type === 'Kick' ? (
                                  <AttributeInfo key={index}>
                                    <img src='bitfgihter_assets/icons/kick_icon.png' alt='.' />
                                    <h5>Kick: {attr.value} </h5>
                                  </AttributeInfo>
                                ) : attr.trait_type === 'Punch' ? (
                                  <AttributeInfo key={index}>
                                    <img src='bitfgihter_assets/icons/punch_icon.png' alt='.' />
                                    <h5>Punch: {attr.value} </h5>
                                  </AttributeInfo>
                                ) : attr.trait_type === 'Speed' ? (
                                  <AttributeInfo key={index}>
                                    <img src='bitfgihter_assets/icons/flash_icon.png' alt='.' />
                                    <h5>Speed: {attr.value} </h5>
                                  </AttributeInfo>
                                ) : attr.trait_type === 'Stamina' ? (
                                  <AttributeInfo key={index}>
                                    <img src='bitfgihter_assets/icons/water_drop_icon.png' alt='.' />
                                    <h5>Stamina: {attr.value} </h5>
                                  </AttributeInfo>
                                ) : (
                                  <></>
                                )
                              })}
                            </React.Fragment>
                          }
                        >
                          <div className='player-card'>
                            <img
                              src={`${data.data.first_frame_image}`}
                              alt={'Hero'}
                              loading='lazy'
                              onClick={() => {
                                handlePlayerSelection(data)
                              }}
                            />

                            <h4>{data?.nick_name !== '' ? data?.nick_name : '?'}</h4>
                          </div>
                        </HtmlTooltip>
                      )
                    })}
                  </div>
                </>
              )}
            </div>

            <ServerListWindow />
          </div>
        </div>
      </div>
    </>
  )
}
export default NewFighters
