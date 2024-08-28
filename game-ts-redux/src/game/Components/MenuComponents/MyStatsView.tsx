// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */


import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { isNullOrUndefined } from 'util';
import { v4 as uuidv4 } from 'uuid';
import { useAppSelector } from '../../../hooks';
import phaserGame from '../../../PhaserGame';
import store from '../../../stores';
import Game from '../../scenes/Game';

interface IAttributes {
  defense?: number,
  punchpower?: number,
  kickpower?: number,
  speed?: number,
  stamina?: number,
  health?: number,
  nickName?: string,
  all_aps?: any;
}

const ColoredH1 = styled.div`

  padding: 10px;
  margin: 10px;

  h2, h3 {
    font-family: Monospace;
    // font-family:'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 22px;
    color: white;
    line-height: 75%;
  }

`

export default function MyStatsView(data: any) {
  console.log("in mystatsview")
  // const game = phaserGame.scene.keys.game as Game;
  // // const otherPlayerSelected = useAppSelector((state) => state.userPathStore.OtherPlayerSelectedForStats)

  // const [playerData, setPlayerData] = useState<IAttributes>();

  const game = phaserGame.scene.keys.game as Game;
  // const otherPlayerSelected = useAppSelector((state) => state.userPathStore.OtherPlayerSelectedForStats)

  const [playerData, setPlayerData] = useState<IAttributes>();
  // const pdata: IAttributes = {}
  // const arr = Array.from(game.otherPlayers.keys());
  // for(let i=0; i < arr.length; i++) {
  //   const otherPlayer = game.otherPlayers.get(arr[i])
  //   if (otherPlayer?.wallet_address === store.getState().web3store.userAddress) {
  //     pdata.defense = otherPlayer.gameObject?.extra_data?.defense;
  //     pdata.health = otherPlayer.gameObject?.extra_data?.health;
  //     pdata.kickpower = otherPlayer.gameObject?.extra_data?.kickpower;
  //     pdata.punchpower = otherPlayer.gameObject?.extra_data?.punchpower;
  //     pdata.stamina = otherPlayer.gameObject?.extra_data?.stamina;
  //     pdata.speed = otherPlayer.gameObject?.extra_data?.speed;
  //     pdata.nickName = otherPlayer.nick_name;
  //     pdata.all_aps = otherPlayer.all_aps;
  //   }
  // }

  useEffect(() => {
    //console.log("MyStatsViewMyStatsViewMyStatsView"); // Log the data
    const pdata: IAttributes = {}
    const arr = Array.from(game.otherPlayers.keys());
    for (let i = 0; i < arr.length; i++) {
      const otherPlayer = game.otherPlayers.get(arr[i])
      if (otherPlayer?.wallet_address === store.getState().web3store.userAddress) {
        pdata.defense = otherPlayer.gameObject?.extra_data?.defense;
        pdata.health = otherPlayer.gameObject?.max_health;
        pdata.kickpower = otherPlayer.gameObject?.extra_data?.kickpower;
        pdata.punchpower = otherPlayer.gameObject?.extra_data?.punchpower;
        pdata.stamina = otherPlayer.gameObject?.max_stamina;
        pdata.speed = otherPlayer.gameObject?.extra_data?.speed;
        pdata.nickName = otherPlayer.nick_name;
        pdata.all_aps = otherPlayer.all_aps;
      }
    }
    // console.log("debug_stats 22", arr, data, pdata)
    setPlayerData(pdata);
    // console.log("debug_stats setting player data", )
  }, [])

  console.log("debug_stats ", playerData)

  return (
    <div>
      <div key={uuidv4()} style={{
        // color: '#C1D5EE',
      }}>
        <ColoredH1>

          <h2>
            {!isNullOrUndefined(playerData) && !isNullOrUndefined(playerData?.all_aps) && Object.keys(playerData).length > 0 && playerData?.nickName}
          </h2>
        </ColoredH1>

        <table style={{
          width: `100%`,
          backgroundColor: 'black'
        }}>
          {
            (!isNullOrUndefined(playerData) && Object.keys(playerData).length > 0) ?
              <tbody>
                <tr key={uuidv4()}>
                  <td>AP</td>
                  <td></td>
                  <td>Value</td>
                </tr>
                <tr key={uuidv4()}>
                  <td>{playerData?.all_aps.defense}</td>
                  <td>Defense</td>
                  <td>{playerData.defense}</td>
                </tr>
                <tr key={uuidv4()}>
                  <td>{playerData?.all_aps.punchpower}</td>
                  <td>Punch</td>
                  <td>{playerData.punchpower}</td>
                </tr>
                <tr key={uuidv4()}>
                  <td>{playerData?.all_aps.kickpower}</td>
                  <td>Kick</td>
                  <td>{playerData.kickpower}</td>
                </tr>
                <tr key={uuidv4()}>
                  <td>{playerData?.all_aps.speed}</td>
                  <td>Speed</td>
                  <td>{playerData.speed}</td>
                </tr>
                <tr key={uuidv4()}>
                  <td>{playerData?.all_aps.health}</td>
                  <td>Health</td>
                  <td>{playerData.health}</td>
                </tr>
                <tr key={uuidv4()}>
                  <td>{playerData?.all_aps.stamina}</td>
                  <td>Stamina</td>
                  <td>{playerData.stamina}</td>
                </tr>
              </tbody>
              :
              <>

              </>
          }
        </table>
      </div>
    </div>
  )
}