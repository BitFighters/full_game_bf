// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { v4 as uuidv4 } from 'uuid';
import store from "../../../stores";
import { useAppSelector } from '../../../hooks';
import { isNullOrUndefined } from 'util';
import styled from 'styled-components';
import { useState } from 'react';
import { updateBetInfOfPlayer } from '../../../utils/fight_utils';
import { IQueueCombined } from '../../../stores/UserWebsiteStore';
import { Box, Button, Divider, Grid, InputBase, ListItemButton } from '@mui/material';
import { BetOnOtherPlayerAndFightId, fetchPlayerWalletInfo } from '../../../hooks/ApiCaller';
import { SetFailureNotificationBool, SetFailureNotificationMessage } from '../../../stores/NotificationStore';
import QueueListPlayerView from './QueueListPlayerView';
import { Col, Container, Row } from 'react-bootstrap';

// function lotsOfStringGenrator() {
//   const arr: string[] = []
//   for (let i = 0; i< 100; i++) {
//     arr.push(uuidv4())
//   }
//   return arr;
// }

const ListItemViews = styled.div`
    width: 100%;
    img {
        width: 2.5vw;
    }
    h1 {
        color: aliceblue;
        font-style: bold;
        font-size: 28px;
        font-family:'Cooper Black', sans-serif;
    }
`

const BackDrop = styled.div`
  width: 100%;
  height: 100%;
`

const Wrapper = styled.div`
    overflow-y: auto;
`
const MyDivider = styled.div`
    border: 1px solid #000000;
    margin-bottom: 10px;
`;

export default function QueueListV2() {
    // const [betWindowOpen, setBetWindowOpen] = useState(false);
    // const fightersInfo = useAppSelector((state) => state.userActionsDataStore.fightersInfo)

    const combinedQueueData = useAppSelector((state) => state.userPathStore.CombinedQueueData)

    const [betOnPlayer, setBetOnPlayer] = useState(0)
    const [tipOnPlayer, setTipOnPlayer] = useState(0)
    const [fight_id_selected, setFightIdSelected] = useState("")
    const [playerSelected, setPlayerSelected] = useState("")
    const [betLastEdit, setBetLastEdit] = useState(false)

    const [betState, setBetState] = useState("BET")

    // const bet_queue_view_map = useAppSelector((state) => state.queueDetailedInfo.bet_queue_view_map)

    // if (Object.keys(bet_queue_view_map).length === 0) {
    //     "bet_amount": 0,
    //     "tip_amount": 0,
    //     "fight_id_selected": "",
    //     "player_id_selected": "",
    //     "last_edit_bet": false,
    // }
    // const playersBetInfo = useAppSelector((state) => state.userPathStore.playersBetInfo)
    // const queueDetailsInfo = useAppSelector((state) => state.queueDetailedInfo.queue_to_fight_info_map)
    // console.log("debug__queueDetailsInfo ",queueDetailsInfo)

    // const [playerChosen, setPlayerChosen] = useState<string>();
    // const [fightIdChosen, setFightIdChosen] = useState<string>();

    // const [betOnPlayer, setBetOnPlayer] = useState(0)
    // const [tipOnPlayer, setTipOnPlayer] = useState(0)
    // const [betLastEdit, setBetLastEdit] = useState(false);
    // const [tipLastEdit, setTipLastEdit] = useState(false);

    // const [betState, setBetState] = useState("Bet")

    // const game = phaserGame.scene.keys.game as Game
    // const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;

    // const deleteUserFromQueue = async () => {
    //   console.log("delete user from queue pressed..")
    //   game.lobbySocketConnection.send(JSON.stringify({
    //     event: "delete_queue",
    //     walletAddress: store.getState().web3store.userAddress
    //   }))
    //   bootstrap.play_snap_sound()
    // }

    // const addBetToFightPlayer = async () => {
    //   console.log("queue bet ,, ", fightIdChosen, playerChosen, betOnPlayer, tipOnPlayer)
    //   setBetState("....")
    //   if (betOnPlayer <= 0 || isNullOrUndefined(betOnPlayer)) {
    //     store.dispatch(SetFailureNotificationBool(true))
    //     store.dispatch(SetFailureNotificationMessage("Set Proper Bet Amount"))
    //     return
    //   }
    //   if (tipOnPlayer < 0 || tipOnPlayer > 100 || isNullOrUndefined(tipOnPlayer)) {
    //     store.dispatch(SetFailureNotificationBool(true))
    //     store.dispatch(SetFailureNotificationMessage("Tip should be a percent between 0 to 100"))
    //     return
    //   }
    //   if (!fightIdChosen) {
    //     store.dispatch(SetFailureNotificationBool(true))
    //     store.dispatch(SetFailureNotificationMessage("Unexpected error"))
    //     return
    //   }
    //   if (!playerChosen) {
    //     store.dispatch(SetFailureNotificationBool(true))
    //     store.dispatch(SetFailureNotificationMessage("Unexpected error"))
    //     return
    //   }
    //   const {success, data} = await BetOnOtherPlayerAndFightId(betOnPlayer * 100, fightIdChosen, playerChosen, tipOnPlayer);
    //   if (success) {
    //     // 
    //     console.log(" queue betting added ", success);
    //     // FetchFightInfo(fightIdChosen)
    //     fetchPlayerWalletInfo()
    //     setBetState("Confirmed")
    //     // await fetchPlayerWalletInfo()
    //     setTimeout(() => {
    //       updateBetInfOfPlayer()
    //       setBetState("Bet")
    //       setBetOnPlayer(0)
    //       setTipOnPlayer(0)
    //     }, 1000)
    //   } else {
    //     alert(data)
    //   }
    // }

    const addBetToFightPlayer = async () => {
        console.log("queue_bet ,, ", fight_id_selected, playerSelected, betOnPlayer, tipOnPlayer)
        setBetState("....")
        if (betOnPlayer <= 0 || isNullOrUndefined(betOnPlayer)) {
            store.dispatch(SetFailureNotificationBool(true))
            store.dispatch(SetFailureNotificationMessage("Set Proper Bet Amount"))
            return
        }
        if (tipOnPlayer < 0 || tipOnPlayer > 100 || isNullOrUndefined(tipOnPlayer)) {
            store.dispatch(SetFailureNotificationBool(true))
            store.dispatch(SetFailureNotificationMessage("Tip should be a percent between 0 to 100"))
            return
        }
        if (!fight_id_selected) {
            store.dispatch(SetFailureNotificationBool(true))
            store.dispatch(SetFailureNotificationMessage("Unexpected error"))
            return
        }
        if (!playerSelected) {
            store.dispatch(SetFailureNotificationBool(true))
            store.dispatch(SetFailureNotificationMessage("Unexpected error"))
            return
        }
        const { success, data } = await BetOnOtherPlayerAndFightId(betOnPlayer * 100, fight_id_selected, playerSelected, tipOnPlayer);
        if (success) {
            console.log(" queue betting added ", success);
            // updateSingleBetInfOfPlayer(fight_id_selected)
            fetchPlayerWalletInfo()
            setBetState("Confirmed")
            await fetchPlayerWalletInfo()
            setTimeout(() => {
                // updateSingleBetInfOfPlayer(fight_id_selected)
                updateBetInfOfPlayer()
                setBetState("Bet")
                setBetOnPlayer(0)
                setTipOnPlayer(0)
            }, 2000)
        } else {
            alert(data)
            setBetState("Bet")
            setBetOnPlayer(0)
            setTipOnPlayer(0)
        }
    }

    return (
        <Wrapper className='w-100 p-2'>
            <List>
                {
                !isNullOrUndefined(combinedQueueData) && combinedQueueData.length > 0 &&
                combinedQueueData.map((data: IQueueCombined, index) => {
                    return (
                        <BackDrop className='w-100' key={uuidv4()}>
                            <ListItem disablePadding key={uuidv4()}>
                                <div style={{display:"flex", flexDirection:"row", gap:"10px"}}>
                                    <>
                                        {
                                            /*
                                            <Col className="col-sm-auto h-100">
                                                <h1 className="fs-6 center h-100 bg-transparent" style={{ color: 'aliceblue' }}> {index + 1} </h1>
                                            </Col>
                                            */
                                        }
                                        <Col className="w-50 h-100">
                                            <QueueListPlayerView
                                                player_id={"p1"}
                                                fight_id={data.fight_id}
                                                wallet={data.p1_wallet}
                                                nick_name={data.p1_nick_name}
                                                profile_image={data.p1_profile_image}
                                                total_bet={data.total_bet}
                                                p1_total_bet={data.p1_total_bet}
                                                p2_total_bet={0}
                                                extra_data={{
                                                    bet_amount: betOnPlayer,
                                                    setBetOnPlayer: setBetOnPlayer,

                                                    tip_amount: tipOnPlayer,
                                                    setTipOnPlayer: setTipOnPlayer,

                                                    fight_id_selected: fight_id_selected,
                                                    setFightIdSelected: setFightIdSelected,

                                                    player_id_selected: playerSelected,
                                                    setPlayerSelected: setPlayerSelected,

                                                    last_edit_bet: betLastEdit,
                                                    setBetLastEdit: setBetLastEdit,

                                                    betState: betState,
                                                    addBetToFightPlayer: addBetToFightPlayer
                                                }}
                                            />
                                        </Col>
                                        <Col className="w-50 h-100">
                                            <QueueListPlayerView
                                                    player_id={"p2"}
                                                    fight_id={data.fight_id}
                                                    wallet={data.p2_wallet}
                                                    nick_name={data.p2_nick_name}
                                                    profile_image={data.p2_profile_image}
                                                    total_bet={data.total_bet}
                                                    p2_total_bet={data.p2_total_bet}
                                                    p1_total_bet={0}
                                                    extra_data={{
                                                        bet_amount: betOnPlayer,
                                                        setBetOnPlayer: setBetOnPlayer,

                                                        tip_amount: tipOnPlayer,
                                                        setTipOnPlayer: setTipOnPlayer,

                                                        fight_id_selected: fight_id_selected,
                                                        setFightIdSelected: setFightIdSelected,

                                                        player_id_selected: playerSelected,
                                                        setPlayerSelected: setPlayerSelected,

                                                        last_edit_bet: betLastEdit,
                                                        setBetLastEdit: setBetLastEdit,

                                                        betState: betState,
                                                        addBetToFightPlayer: addBetToFightPlayer
                                                    }}
                                                />
                                        </Col>
                                    </>
                                </div>
                            </ListItem>
                        </BackDrop>
                    )
                })
                }
            </List>
        </Wrapper>
    )
}