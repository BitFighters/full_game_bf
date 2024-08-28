
import styled from 'styled-components';
import { Box, Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { ChangeBetWindowViewState, TurnMouseClickOff } from '../../../stores/UserActions';
import { useState } from 'react';
import { useDetectClickOutside } from 'react-detect-click-outside';
import store from '../../../stores';

const Backdrop = styled.div`
  position: fixed;
  right: 520px;
  top: 10%;
  height: 15%;
  width: 20%;
`

const BetWindowViewDiv = styled(Box)`
  width: 100%;
  overflow: auto;
  opacity: 0.9;
  background: #2c2c2c;
  border: 5px solid #000000;
  border-radius: 10px;
  padding: 20px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  span {
    font-family: Monospace;
    font-style: bold;
    font-size: 20px;
  }

  h3 {
    font-family: Monospace;
    font-style: bold;
    font-size: 30px;
    color: white;
  }

  input {
    font-family: Monospace;
    font-style: bold;
    font-size: 15px;
    color: black;
    height: 50px;
  }
`

export default function BetWindowView() {
  const openBetWindowView = useAppSelector((state) => state.userActionsDataStore.openBetWindowView);
  const bettingOnPlayerData = useAppSelector((state) => state.userActionsDataStore.bettingOnPlayerData)
  console.log("queue view-- ", openBetWindowView, bettingOnPlayerData)
  const dispatch = useAppDispatch()
  const [amount, setAmount] = useState(0);
  const ref = useDetectClickOutside({ onTriggered: closeView });

  function closeView() {
    if (store.getState().userActionsDataStore.openBetWindowView) {
      store.dispatch(ChangeBetWindowViewState(false))
    }
  }

  const addBetToFightPlayer = async () => {
    console.log("queue bet ,, ", bettingOnPlayerData.selected_player, amount)
    // if (amount <= 0 || isNullOrUndefined(amount)) {
    //   return
    // }
    // const {success, data} = await BetOnOtherPlayerAndFightId(amount * 100, bettingOnPlayerData.fight_id, bettingOnPlayerData.selected_player);
    // if (success) {
    //   // 
    //   console.log(" queue betting added ", success);
    //   await fetchPlayerWalletInfo()
    //   setTimeout(() => {
    //     updateBetInfOfPlayer()
    //   }, 1000)
    // } else {
    //   alert(data)
    // }
  }

  return (
    <div
      ref={ref}
      onMouseOver={() => {
        dispatch(TurnMouseClickOff(true))
      }}
      onMouseOut={() =>{ 
        dispatch(TurnMouseClickOff(false))
      }}
    >

      {openBetWindowView && <Backdrop>
        <BetWindowViewDiv>
          <h3>
            Your Bet: 
            <input 
              type="number" 
              placeholder='amount in BITS' 
              value={amount}
              onChange={(e) => { setAmount(parseInt(e.target.value)) }}
            >
            </input>

            <Button
              variant="outlined"
              color="secondary"
              onClick={() => { addBetToFightPlayer() }}
            >
              Submit
            </Button>
          </h3>
          
        </BetWindowViewDiv>
      </Backdrop>}

    </div>
  )
}