// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { useAppDispatch, useAppSelector } from "../../hooks"
import styled from 'styled-components'
import { Box, Button } from "@mui/material"
import { ShowFightConfirmationBox, TurnMouseClickOff } from "../../stores/UserActions";
import phaserGame from "../../PhaserGame";
import Bootstrap from "../scenes/Bootstrap";
import Game from "../scenes/Game";
import store from "../../stores";

const Backdrop = styled.div`
    position: fixed;
    top: 20%;
    left: 38%;
    width: 30%;
    z-index: 10000;

    @media only screen and (max-height: 575.98px) and (orientation: landscape) {
        width: 50%;
        top: 20%;
        left: 25%;
    }

    @media only screen and (orientation: portrait) {
        width: 80%;
        top: 20%;
        left: 12%;
    }
`

const Wrapper = styled.div`
    position: relative;
    height: 100%;
    padding: 16px;
    display: flex;
    flex-direction: column;
`

const FightConfirmationBoxDiv = styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    width: 100%;
    overflow: auto;
    opacity: 1;
    background: #000000a7;
    border: 5px solid #000000;
    border-radius: 10px;
    padding: 30px;
    height: 90%;

    h2 {
        font-family: Monospace;
        font-style: bold;
        font-size: 25px;
        color: white;
        margin-top: 10px;
    }

    span {
        font-family: Monospace;
        font-style: bold;
        font-size: 21px;
    }
`

export function FightConfirmationBox() {
    const gotFightConfirmationMessage = useAppSelector((state) => state.userActionsDataStore.showFightConfirmationBox)
    const gotFightConfirmationTime = useAppSelector((state) => state.userActionsDataStore.showFightConfirmationTime)
    // const friendsDetails = useAppSelector((state) => state.userPathStore.User_Data)
    // const PlayerSelectedInfo = useAppSelector((state) => state.playerDataStore.player_selected_all_info)
    // const [buttonLoading, setButtonLoading] = useState(false);
    // const dispatch = useAppDispatch();
    const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;
    const game = phaserGame.scene.keys.game as Game;

    const acceptFightRequest = async () => {
        console.log("accept fight request..")
        game.lobbySocketConnection.send(JSON.stringify({
            event: "fight_confirmation_accepted",
            walletAddress: store.getState().web3store.userAddress,
        }))
        bootstrap.play_err_sound()
        store.dispatch(ShowFightConfirmationBox(false))
    }

    const cancelFightRequest = async () => {
        store.dispatch(ShowFightConfirmationBox(false))
    }
    // const ref = useDetectClickOutside({ onTriggered: data.closeFunction });
    const dispatch = useAppDispatch()

    return (
        <div style={{
            zIndex: 999999
        }}>
            {
                gotFightConfirmationMessage &&
                <Backdrop >
                    <Wrapper
                        onMouseOver={() => {
                            // console.log(" mouse over .. in add to queuebox ")
                            dispatch(TurnMouseClickOff(true))
                        }}
                        onMouseOut={() => {
                            // console.log(" mouse out in add to queue box")
                            dispatch(TurnMouseClickOff(false))
                        }}
                    >
                        <FightConfirmationBoxDiv>
                            <h2 className="text-center fs-4">
                                It's your turn to play!
                            </h2>
                            {/* <span style={{
                            color: 'aliceblue',
                            }}>
                            (This pop-up will only be visible for 10 seconds.)
                            </span> */
                            }
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    dispatch(TurnMouseClickOff(false))
                                    acceptFightRequest()
                                }}
                            >
                                <span style={{
                                    color: 'aliceblue'
                                }}>Ready!</span>
                            </Button>
                            {
                                /* 
                                <Button 
                                    variant="contained" 
                                    color="error"
                                    onClick={() => cancelFightRequest()}
                                >
                                    No
                                </Button> 
                                */
                            }
                            <h2 sclassName="text-center fs-4">
                                {gotFightConfirmationTime}
                            </h2>
                        </FightConfirmationBoxDiv>
                    </Wrapper>
                </Backdrop>
            }
        </div>
    )
}