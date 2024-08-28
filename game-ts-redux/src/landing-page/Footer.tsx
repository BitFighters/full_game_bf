import IconButton from "@mui/material/IconButton";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../hooks";
import CloseIcon from '@mui/icons-material/Close'
import { Tooltip } from "@mui/material";
import Bootstrap from "../game/scenes/Bootstrap";
import phaserGame from "../PhaserGame";
import store from "../stores";
import Game from "../game/scenes/Game";
import { TurnMouseClickOff } from "../stores/UserActions";

const Backdrop = styled.div`
  position: fixed;
  display: flex;
  gap: 10px;
  bottom: 16px;
  right: 16px;
  align-items: flex-end;
  z-index: 100;

  .wrapper-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`

const Wrapper = styled.div`
  position: relative;
  font-size: 16px;
  color: #eee;
  background: #222639;
  box-shadow: 0px 0px 5px #0000006f;
  border-radius: 16px;
  padding: 15px 35px 15px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;

  span {
    font-family:'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 20px;
  }

  .close {
    position: absolute;
    top: 5px;
    right: 5px;
    color: red;
  }
`

/***
 * Planning to show the notifications from server.
 */
export default function Footer() {

  const game = phaserGame.scene.keys.game as Game
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;
  const dispatch = useAppDispatch();

  const deleteUserFromQueue = async () => {
    console.log("delete user from queue pressed..")
    game.lobbySocketConnection.send(JSON.stringify({
      event: "delete_queue",
      walletAddress: store.getState().web3store.userAddress
    }))
    bootstrap.play_snap_sound()
  }
  const added_to_queue_pool = useAppSelector((state) => state.queueDetailedInfo.added_to_queue_pool)
  const queueCount = useAppSelector((state) => state.queueDetailedInfo.queueCount)
  return (
    <Backdrop 
      onMouseOver={() => {
        dispatch(TurnMouseClickOff(true))
      }}
      onMouseOut={() => {
        dispatch(TurnMouseClickOff(false))
      }}
    >
      {added_to_queue_pool && 
      <Wrapper>
        <span>
          Finding you an opponent..
        </span>
        <span role="img" aria-label="emoji">
          Please wait. Thank you. &#128516;
        </span>
        <span role="img" aria-label="emoji">
          Total players in pool {queueCount}
        </span>
        <div className="close-icon" onClick={() => {
          //
          deleteUserFromQueue()
        }}>
          <Tooltip title={"Click to Exit Queue Pool"}>
            <IconButton
              aria-label="close dialog"
              className="close"
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        
      </div>
      </Wrapper>
    }
    </Backdrop>
  )
}