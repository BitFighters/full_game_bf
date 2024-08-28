// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */


import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { TurnMouseClickOff } from '../../../stores/UserActions';
import { useDetectClickOutside } from 'react-detect-click-outside';
// import { parseWBTCBalanceV3 } from '../../../utils/web3_utils';

import { v4 as uuidv4 } from 'uuid';
import { getSystemInfo } from '../../../utils/systemInfo';
import phaserGame from '../../../PhaserGame';
import Game from '../../scenes/Game';

const Backdrop = styled.div`
  position: fixed;
  bottom: 0%;
  left: 44%;
  // width: 12%;
  text-align: center;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
  justify-content: center;
  align-items: center;
  // background: #2c2c2c;
  // border: 5px solid #000000;
  // border-style: solid;
  // border-width: 2px;
  // border-radius: 10px;

  background: #2c2c2c;
  border: 2px solid #000000;
  border-radius: 10px;
  gap: 20px;

  span {
    font-family: Monospace;
    font-style: bold;
    font-size: 14px;
    color: white;
  }
`

const BitsView = styled.div`
  // width: 10%%;
  // overflow: auto;
  // opacity: 0.9;
  // background: #2c2c2c;
  // border: 5px solid #000000;
  // border-radius: 10px;
  // padding: 20px;
  // background-color: red;

  span {
    font-family: Monospace;
    font-style: bold;
    font-size: 20px;
    color: white;
  }

  h2, h3 {
    font-family: Monospace;
    font-style: bold;
    font-size: 25px;
    color: white;
    line-height: 75%;
  }
`


export function EquipView() {
  const equippedBrewCount = useAppSelector((state) => state.assetStore.equippedBrewCount)
  const web2_credit_balance = useAppSelector((state) => state.web3BalanceStore.web2CreditBalance)
  const dispatch = useAppDispatch()
  // equippedBrewCount = 1;

  const game = phaserGame.scene.keys.game as Game

  function closeView() {
    // setInventoryState("basic")
  }

  const ref = useDetectClickOutside({ onTriggered: closeView });

  const ismobile = getSystemInfo();

  return (
    <div>
      {equippedBrewCount > 0 && <Backdrop
        ref={ref}
        onMouseOver={() => {
          dispatch(TurnMouseClickOff(true))
        }}
        onMouseOut={() => {
          dispatch(TurnMouseClickOff(false))
        }}
      >
        <Wrapper>

          {
            !ismobile && <span>
              Press Q to Open
            </span>
          }


          <div style={{
            padding: '10px',
            // paddingRight: '10px',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <img
              // src="bitfgihter_assets/brew/brew-can.png" 
              src="bitfgihter_assets/brew/BREW.png"
              alt="."
              height="35"
              width="15"
              key={uuidv4()}

              onClick={() => {
                // 
                game.keyControls.keyQCodeDownHandler()
              }}
            ></img>
          </div>



        </Wrapper>
      </Backdrop>}
    </div>
  )
}