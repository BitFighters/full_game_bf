// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */
import { useAppDispatch, useAppSelector } from "../../hooks"
import styled from 'styled-components'
import { LinearProgress } from "@mui/material"
import Utils from "../../landing-page/Utils";
import { HitFightMachine, SelectFightInFightMachineMenu, SetMouseClickControlATM, SetMouseClickControlFightMachine, TurnMouseClickOff } from "../../stores/UserActions";
import { useState } from "react";
import store from "../../stores";
import AddToQueueBox from "./MenuComponents/AddToQueueBox";
import phaserGame from "../../PhaserGame";
import Game from "../scenes/Game";
import Bootstrap from "../scenes/Bootstrap";
import { convertWBTCToBigIntWithDecimlas } from "../../utils/web3_utils";
import { EnterFightQueueApi, fetchPlayerWalletInfo } from "../../hooks/ApiCaller";
import { SetFailureNotificationBool, SetFailureNotificationMessage } from "../../stores/NotificationStore";
import { isNullOrUndefined } from "util";
import FightMenuSelectionBox from "./MenuComponents/FightMenuSelectionBox";
// import store from "../../stores";


const ProgressBarWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    color: blue;

    h3 {
        color: #33ac96;
        font-family: Monospace;
        font-style: bold;
        font-size: 25px;
    }
`

const ProgressBar = styled(LinearProgress)`
  width: 360px;
`

const Backdrop = styled.div`
    position: fixed;
    width: 35%;
    transform: translate(100%, 2%);
    overflow-y: auto;

    @media only screen and (max-height: 575.98px) and (orientation: landscape) {
        width: 50%;
        transform: translate(50%, 3%);
    }

    @media only screen and (orientation: portrait) {
        width: 80%;
        transform: translate(15%, 13%);
    }
`

const Backdrop2 = styled.div`
    position: absolute;
    width: 100%;
    height: 50%;
    transform: translate(0%, 30%);
`

export function QueueAddInfoWindow() {
    const [amount, setAmount] = useState(0);
    const [amountInString, setAmountInString] = useState("")
    const ANTE = 50;

    const hitFightMachine = useAppSelector((state) => state.userActionsDataStore.hitFightMachine)
    const selectFightMenu = useAppSelector((state) => state.userActionsDataStore.selectedFightButton)
    const [enterfightButtonPressed, setEnterFightButtonPressed] = useState(false)

    // console.log("**********debug.. ", hitFightMachine, selectFightMenu)

    const [addToQueueBool, setaddToQueueBool] = useState(false)
    const [addToQueueState, setaddToQueueState] = useState("")
    const dispatch = useAppDispatch();
    const { height } = Utils();
    const game = phaserGame.scene.keys.game as Game
    const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;

    const changeAmount = (val: number) => {
        setAmount(val)
        setAmountInString(val.toLocaleString())
    }

    const enterFightButton = async () => {
        if (isNullOrUndefined(amount) || isNullOrUndefined(ANTE + amount)) {
            store.dispatch(SetFailureNotificationBool(true))
            store.dispatch(SetFailureNotificationMessage("Please enter valid amount"))
            return
        }
        console.log("debug_enter_fight_button_pressed ", enterfightButtonPressed)
        if (enterfightButtonPressed) {
            setaddToQueueState("Wait.");
            return
        }
        setEnterFightButtonPressed(true)
        setaddToQueueBool(true);
        setaddToQueueState("Processing");

        const success = await EnterFightQueueApi(convertWBTCToBigIntWithDecimlas(ANTE + amount).toString());
        if (success) {
            game.lobbySocketConnection.send(
                JSON.stringify({
                    // event: "add_queue_new",
                    event: "add_queue",
                    data: {
                        minted_id: store.getState().playerDataStore.current_game_player_info.minted_id,
                        nick_name: store.getState().playerDataStore.current_game_player_info.nick_name,
                        profile_image: store.getState().playerDataStore.current_game_player_info.data.profile_image,
                        user_wallet_address: store.getState().web3store.userAddress,
                        betAmount: amount * 100,
                        ante: ANTE * 100,
                        // total_bet: (ANTE + amount) * 100
                    }
                }))
            setaddToQueueState("Successfully Added to Queue");
            await fetchPlayerWalletInfo();
            // await updateBetInfOfPlayer()
            bootstrap.play_snap_sound()
            setTimeout(() => {
                setaddToQueueBool(true);
                dispatch(HitFightMachine(false))

                setaddToQueueState("");
                setaddToQueueBool(false);

                store.dispatch(HitFightMachine(false))
                store.dispatch(SelectFightInFightMachineMenu(false))
                setAmount(0)
                setEnterFightButtonPressed(false)
            }, 1000)
        } else {
            setaddToQueueBool(true);
            setaddToQueueState("Failed to add to queue");
            setaddToQueueBool(false);
            bootstrap.play_err_sound()
            store.dispatch(SetFailureNotificationBool(true))
            store.dispatch(SetFailureNotificationMessage("Less balance. Please Use ATM to add funds"))
            dispatch(HitFightMachine(false))
            setaddToQueueBool(false);
            setEnterFightButtonPressed(false)
            return
        }


        // const success = await BetMoneyInFight(convertWBTCToBigIntWithDecimlas(ANTE + amount))
        // if (!success) {

        // setaddToQueueBool(true);
        // setaddToQueueState("Failed to add to queue");
        // setaddToQueueBool(false);
        // bootstrap.play_err_sound()
        // setTimeout(() => {
        //   alert("Failed to add in Queue")
        // }, 1000)
        // dispatch(HitFightMachine(false))
        // setaddToQueueBool(false);
        // return
        // }
        // getBalances(store.getState().web3store.userAddress)


        // do it in server.
        // let res = "done"

        // console.log("queue, addUserToQueueDB ", res)
        // if (res === null) {
        //   setaddToQueueBool(true);
        //   setaddToQueueState("Failed to add to queue");
        //   setaddToQueueBool(false);
        //   bootstrap.play_err_sound()
        //   setTimeout(() => {
        //     setaddToQueueBool(true);
        //   }, 1000)
        //   dispatch(HitFightMachine(false))
        //   setaddToQueueBool(false);
        //   return;
        // }
        // console.log("enterFight button pressed ", res)

        // setaddToQueueBool(false);
        // setaddToQueueState("Successfully Added to Queue");
        // // bootstrap.play_err_sound()
        // bootstrap.play_snap_sound()
        // setTimeout(() => {
        //   setaddToQueueBool(true);
        //   dispatch(HitFightMachine(false))

        //   setaddToQueueState("");
        //   setaddToQueueBool(false);
        // }, 1000)
        // dispatch(FightStart(true))
    }

    const closeDialogMenu = () => {
        console.log("click happened .. ")
        dispatch(TurnMouseClickOff(false))
    }

    // const closeFunction = () => {
    //   console.log("debug_mouse in close fn queue add info window")
    //   // dispatch(TurnMouseClickOff(false))
    //   dispatch(SetMouseClickControlFightMachine(false))
    // }

    // const ref = useDetectClickOutside({ onTriggered: closeFunction });

    return (
        <div style={{ display: "flex", width: "100%", height: "70%" }}>
            {
                selectFightMenu ?
                    <Backdrop
                        // ref={ref}
                        className="queue-menu"
                    >
                        <AddToQueueBox
                            closeFunction={closeDialogMenu}
                            enterQueue={enterFightButton}
                            amount={amount}
                            setAmount={changeAmount}
                            amountInString={amountInString}
                            ANTE={ANTE}
                            enterfightButtonPressed={enterfightButtonPressed}

                        />
                        {
                            addToQueueBool &&
                            <ProgressBarWrapper>
                                <h3> {addToQueueState} </h3>
                                <ProgressBar color="secondary" />
                            </ProgressBarWrapper>
                        }
                    </Backdrop>
                    :
                    hitFightMachine ?
                        <Backdrop2>
                            <FightMenuSelectionBox />
                        </Backdrop2>
                        :
                        <></>
            }
        </div>
    )
}