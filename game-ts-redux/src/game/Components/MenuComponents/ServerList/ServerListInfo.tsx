// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { Box, Button, FormControl, Grid, InputLabel, List, ListItemButton, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useAppSelector } from '../../../../hooks'
import './ServerListInfo.css'
import { v4 as uuidv4 } from 'uuid'
import styled from 'styled-components'
import { getEllipsisTxt } from '../../../../utils'
import { FetchGameServerConnection, fetchSystemWalletsInfo, ListGameServers } from '../../../../utils/game_server_utils'
import store from '../../../../stores'
import {
  SetGameLoadingState,
  SetGameServersData,
  SetSelectedRegionofGameServer,
  SetSelectedRoomId,
  SetShowGameServersList,
} from '../../../../stores/WebsiteStateStore'
import { SetGameStarted } from '../../../../stores/PlayerData'
import Bootstrap from '../../../scenes/Bootstrap'
import phaserGame from '../../../../PhaserGame'
import { WaveLoader } from '../../../../landing-page/components/WaveLoader/WaveLoader'
import { useState } from 'react'
import { isNullOrUndefined } from 'util'
import { Container, Row, Col } from 'react-bootstrap'
import { Label } from '@mui/icons-material'

// const ButtonView = styled(Button)`
//   span {
//     color: black;
//     // font-style: bold;
//     font-size: 10px;
//     font-family:'Cooper Black', sans-serif;
//   }

//   background-color: #9c341a;

//   &:hover {
//     background-color: #852d17;
//   }

//   width: 200px;
//   height: 50px;
// `;

const ButtonView = styled.button`
  background-color: #9c341a;

  &:hover {
    background-color: #852d17;
  }

  span {
    color: #a7a5a5;
    // font-family: Monospace;
    font-style: bold;
    font-size: 20px;
    font-family: 'Cooper Black';
    text-transform: uppercase;
  }
  width: 100%;
`

const BoxWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;

  span {
    color: aliceblue;
    font-style: bold;
    font-size: 20px;
    font-family: 'Cooper Black', sans-serif;
  }

  p {
    color: #808080;
  }
`

const MyDivider = styled.div`
  border: 1px solid #000000;
  margin-bottom: 10px;
`

const CenterText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    color: aliceblue;
    font-style: bold;
    font-size: 20px;
    font-family: 'Cooper Black', sans-serif;
    justify-content: center;
    align-items: center;
  }
`

export function ServerListInfo() {
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
  const gameServersInfo = useAppSelector((state) => state.websiteStateStore.serversInfo)

  const selectedPlayer = useAppSelector((state) => state.playerDataStore.current_game_player_info)

  const gameServerReginoSelected = useAppSelector((state) => state.websiteStateStore.region)
  console.log('game servers info --', gameServersInfo)

  // console.log("debug_selected_player ", selectedPlayer)
  const SelectGameServerAndLoadInfo = async (region: string) => {
    store.dispatch(SetGameServersData([]))
    ListGameServers(region)
    console.log('in SelectGameServerAndLoadInfo', region)
    store.dispatch(SetSelectedRegionofGameServer(region))
  }

  const fetchServerUrlAndConnect = async (room_id: string) => {
    console.log(room_id)
    await FetchGameServerConnection(room_id)
    store.dispatch(SetSelectedRoomId(room_id))

    fetchSystemWalletsInfo()
    startGame()
    // setTimeout(() => {
    //   startGame()
    // }, 2000)
  }

  const startGame = async () => {
    // event.preventDefault();
    console.log('debug_startGame----')
    store.dispatch(SetGameStarted(true))
    localStorage.setItem('game_state', 'start')
    store.dispatch(SetGameLoadingState(true))
    bootstrap.launchGame(store.getState().playerDataStore.current_game_player_info)
    store.dispatch(SetShowGameServersList(false))
    store.dispatch(SetShowGameServersList(false))
  }

  // return (
  //   <>
  //     <BoxWrapper sx={{ flexGrow: 1 }} key={uuidv4()}>
  //       <FormControl
  //         fullWidth
  //         style={{
  //           alignItems: 'center',
  //           paddingBottom: '20px',
  //           paddingTop: '20px',
  //         }}
  //       >
  //         <span className='fs-5'>World Servers</span>
  //         <p className='fs-6 text-center'> Please connect to your nearest world server for best experience</p>
  //         <Select
  //           id='demo-simple-select'
  //           value={gameServerReginoSelected}
  //           onChange={(event: SelectChangeEvent) => {
  //             SelectGameServerAndLoadInfo(event.target.value as string)
  //           }}
  //           style={{
  //             width: 'auto',
  //           }}
  //         >
  //           <MenuItem value={'Washington_DC'}>US-East</MenuItem>
  //           <MenuItem value={'Mumbai'}>India</MenuItem>
  //         </Select>
  //       </FormControl>
  //       {gameServersInfo && gameServersInfo.length > 0 ? (
  //         gameServersInfo.map((serverinfo, index) => {
  //           return (
  //             <div key={index} style={{ height: '100%', width: '100%' }}>
  //               <ListItemButton key={uuidv4()} className='p-0'>
  //                 <div className='w-100'>
  //                   <div className='w-100 h-100 row m-0'>
  //                     <Col className='align-items-center'>
  //                       <div className='h-100 w-100' style={{ display: 'flex', textAlign: 'justify', justifyContent: 'center', alignItems: 'center' }}>
  //                         <h3
  //                           style={{
  //                             color: 'aliceblue',
  //                             textAlign: 'center',
  //                           }}
  //                           className='fs-5'
  //                         >
  //                           {index + 1}
  //                         </h3>
  //                       </div>
  //                     </Col>
  //                     <Col className='align-items-center'>
  //                       <div className='h-100 w-100' style={{ display: 'flex', textAlign: 'justify', justifyContent: 'center', alignItems: 'center' }}>
  //                         <ListItemText
  //                           primary={
  //                             <span
  //                               className='fs-6'
  //                               style={{
  //                                 color: 'aliceblue',
  //                                 textAlign: 'center',
  //                               }}
  //                             >
  //                               {`${getServerNameForDisplay(serverinfo.region)} - ${serverinfo.active_users}/ 50`}
  //                             </span>
  //                           }
  //                           secondary={getEllipsisTxt(serverinfo.room_id)}
  //                         />
  //                       </div>
  //                     </Col>
  //                     <Col className='align-items-center'>
  //                       <div className='h-100 w-100' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  //                         <ButtonView
  //                           variant='contained'
  //                           onClick={() => {
  //                             fetchServerUrlAndConnect(serverinfo.room_id)
  //                           }}
  //                           disabled={selectedPlayer.nick_name === ''}
  //                         >
  //                           {selectedPlayer.nick_name === '' ? <span> </span> : <span style={{ fontSize: '1em', alignContent: 'center' }}>Connect</span>}
  //                         </ButtonView>
  //                       </div>
  //                     </Col>
  //                   </div>
  //                 </div>
  //               </ListItemButton>
  //               <MyDivider className='m-2'></MyDivider>
  //             </div>
  //           )
  //         })
  //       ) : Object.keys(selectedPlayer).length > 0 ? (
  //         <div>
  //           <WaveLoader />
  //         </div>
  //       ) : (
  //         <CenterText>
  //           <span className='fs-5 text-center'>Choose a Fighter to load game servers</span>
  //         </CenterText>
  //       )}
  //     </BoxWrapper>
  //   </>
  // )

  return (
    <div className='servers-box'>
      <div className='h2-wrapper'>
        <h2 className='text'>World Servers</h2>

        <h2 className='text-stroke'>World Servers</h2>

        <h2 className='text-shadow'>World Servers</h2>
      </div>

      <p className='top-desc'>Please connect to your nearest world server for best experience</p>

      <div className='select-wrapper'>
        <Select
          id='demo-simple-select'
          value={gameServerReginoSelected}
          onChange={(event: SelectChangeEvent) => {
            SelectGameServerAndLoadInfo(event.target.value as string)
          }}
          style={{
            width: 'auto',
          }}
        >
          <MenuItem value={'Washington_DC'}>US-East</MenuItem>
          <MenuItem value={'Mumbai'}>India</MenuItem>
        </Select>
      </div>

      {gameServersInfo && gameServersInfo.length > 0 ? (
        gameServersInfo.map((serverinfo, index) => {
          return (
            <div key={index} className='server-card'>
              <p>{index + 1}</p>

              <div className='server-info'>
                <p>{`${getServerNameForDisplay(serverinfo.region)} - ${serverinfo.active_users} / 50`}</p>
                <p>{getEllipsisTxt(serverinfo.room_id)}</p>
              </div>

              <div
                onClick={() => {
                  fetchServerUrlAndConnect(serverinfo.room_id)
                }}
                className='primary-btn-component'
              >
                <span className='dot'></span>
                <span className='dot'></span>
                <span className='dot'></span>
                <span className='dot'></span>

                <div className='content'>
                  <span>Connect</span>
                </div>
              </div>
            </div>
          )
        })
      ) : Object.keys(selectedPlayer).length > 0 ? (
        <p>Loading...</p>
      ) : (
        <p>Choose a fighter to load game servers</p>
      )}
    </div>
  )
}

function getServerNameForDisplay(region: string) {
  if (region === 'Washington_DC') {
    return 'US_East'
  }
  if (region === 'Mumbai') {
    return 'India'
  }
}
