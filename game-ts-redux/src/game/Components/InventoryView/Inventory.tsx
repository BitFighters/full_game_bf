// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { Box, Button, Grid } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from 'uuid';
import { useAppSelector } from "../../../hooks";
import Game from "../../scenes/Game";
import phaserGame from "../../../PhaserGame";
import store from "../../../stores";
import { useAssetsApi } from "../../../hooks/ApiCaller";
import { SetFailureNotificationBool, SetFailureNotificationMessage, SetSuccessNotificationBool, SetSuccessNotificationMessage } from "../../../stores/NotificationStore";
import { SetEquippedBrewCount } from "../../../stores/AssetStore";
import { SetMouseClickControlInventory } from "../../../stores/UserActions";

// const Item = styled(Paper)(({ theme }) => ({
//   // backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
//   backgroundColor:  '#fff',
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: 'center',
//   color: '#1A2027',
// }));


const Item = styled.div`
    overflow: auto;
    background: #DFEEFC;
    border: 1px solid #000000;
    opacity: 0.9;
    background-color: #3B3B3B;
    padding: 20px;

    span {
        font-family:'Cooper Black', sans-serif;
        font-style: bold;
        font-size: 20px;
    }

    h2, h3 {
        font-family:'Cooper Black', sans-serif;
        font-style: bold;
        font-size: 22px;
        color: white;
        line-height: 75%;
    }

    width: 100%;

`

const ButtonGroupView = styled.div`
  // background: #DFEEFC;
  border: 1px solid #000000;
  background-color: #3B3B3B;
  border-radius: 10px;

  button {
    width: 100px;
    background-color: #4797df;
    color: aliceblue;
    border-radius: 5px;

    background-color: #9c341a;

    &:hover {
      background-color: #852d17;
    }
  }
`

export function Inventory(data: any) {
    // const [showButtonGroupBool, data.setShowButtonGroupBool] = useState(false);
    // const data.assetsInfo = useAppSelector((state) => state.web3BalanceStore.data.assetsInfo)
    // const data.assetsInfo = useAppSelector((state) => state.assetStore.assets)
    // const game = phaserGame.scene.keys.game as Game;
    // console.log(" in inventory -- ", data.assetsInfo)
    // const numberOfBrews = 
    // let showButtonGroupIndexArray: Array<boolean> = [];


    // const numberOfRows = 3;
    // const numberOfColumns = 3;
    // const numberOfBrew = 2;
    const brewArr = [];
    const nonBrewArrMap: any[] = [];
    const emptyArray = [];
    for (let i = 0; i < data.assetsInfo.length; i++) {
        const tempAsset = data.assetsInfo[i]
        for (let j = 0; j < tempAsset.active_assets; j++) {
            brewArr.push(0)
        }
    }
    for (let i = 0; i < 9 - (brewArr.length + nonBrewArrMap.length); i++) {
        emptyArray.push(0)
    }

    // async function useBrew() {
    //   console.log("debug_equip_brew...", data)
    //   if (new Date().getTime() - data.lastEquipTime <= 5 * 1000) {
    //     store.dispatch(SetFailureNotificationBool(true))
    //     store.dispatch(SetFailureNotificationMessage("Wait 5 seconds before drinking again"))
    //     return
    //   }
    //   data.setLastequipTime(new Date().getTime())
    //   store.dispatch(SetMouseClickControlInventory(false))
    //   // return
    //   const res = await useAssetsApi("brew")
    //   if (res) {
    //     // const otherPlayer = game.otherPlayers.get(store.getState().web3store.player_id)
    //     // if (otherPlayer?.gameObject) {
    //     //   // otherPlayer.drinkStarted = true
    //     //   // otherPlayer.drinking = false
    //     // }
    //     setTimeout(() => {
    //       game.lobbySocketConnection.send(JSON.stringify({
    //         event: "brew_used",
    //         walletAddress: store.getState().web3store.userAddress,
    //         force: true
    //       }));

    //       // store.dispatch(SetSuccessNotificationBool(true))
    //       // store.dispatch(SetSuccessNotificationMessage("Successfully Used."))
    //       // bootstrap.play_err_sound()
    //     }, 1000);
    //   }  else {
    //     setTimeout(() => {
    //       store.dispatch(SetFailureNotificationBool(true))
    //       store.dispatch(SetFailureNotificationMessage("Failed to use Brew"))
    //     }, 300);
    //   }
    // }

    // async function equipBrew() {
    //   console.log("debug_equip_brew...")
    //   if (new Date().getTime() - data.lastEquipTime <= 5 * 1000) {
    //     store.dispatch(SetFailureNotificationBool(true))
    //     store.dispatch(SetFailureNotificationMessage("Wait 5 seconds before equip again"))
    //     return
    //   }
    //   data.setLastequipTime(new Date().getTime())
    //   store.dispatch(SetMouseClickControlInventory(false))

    //   if (store.getState().assetStore.equippedBrewCount > 0) {
    //     store.dispatch(SetFailureNotificationBool(true))
    //     store.dispatch(SetFailureNotificationMessage("Not Allowed"))
    //   } else {
    //     // store.dispatch(SetEquippedBrewCount(1))
    //     const res = await useAssetsApi("brew")
    //     if (res) {
    //       store.dispatch(SetEquippedBrewCount(1))
    //       // send an message to 
    //       const temp = game.otherPlayers.get(store.getState().web3store.player_id)
    //       if (temp?.gameObject) {
    //         game.lobbySocketConnection.send(JSON.stringify({
    //           event: "semi_equip_brew",
    //           walletAddress: store.getState().web3store.userAddress,
    //           minted_id: temp.minted_id,
    //         }))
    //       }
    //       // game.lobbySocketConnection.send(JSON.stringify({
    //       //   event: "equip_brew",
    //       //   walletAddress: store.getState().web3store.userAddress,
    //       //   minted_id: temp.minted_id,
    //       // }))
    //     } else {
    //       setTimeout(() => {
    //         store.dispatch(SetFailureNotificationBool(true))
    //         store.dispatch(SetFailureNotificationMessage("Failed to Equip Brew"))
    //       }, 300);
    //     }
    //   }
    // }

    // let buttonGroupView = <></>;
    // const buttonGroupView = <ButtonGroupView>
    //     <Box sx={{ flexGrow: 1 }} 
    //       style={{
    //         // opacity: 0.8,
    //         padding: '10px',
    //       }}
    //     >
    //       <Grid container spacing={0} key={uuidv4()} style={{
    //         padding: '10px'
    //       }}>
    //         <Grid item xs={12} key={uuidv4()}>
    //           <Button 
    //             variant="contained" 
    //             color="info" 
    //             onClick={(event: any) => {
    //               event.preventDefault()
    //               data.useBrew()
    //             }}
    //             // onClick={useBrew}
    //           > Use </Button>
    //         </Grid>
    //       </Grid>

    //       <Grid container spacing={0} key={uuidv4()} style={{
    //         padding: '10px'
    //       }}>
    //         <Grid item xs={12} key={uuidv4()}>
    //           <Button 
    //             variant="contained" 
    //             color="info"
    //             onClick={(event: any) => {
    //               event.preventDefault()
    //               data.equipBrew()
    //             }}
    //           >
    //             Equip 
    //           </Button>
    //         </Grid>
    //       </Grid>
    //     </Box>
    // </ButtonGroupView>

    // console.log("debug_inventory--", data.showButtonGroupBool)

    return (
        <div
            style={{
                height: "100%",
                width: "100%",
                display: 'flex',
                position: "relative",
            }}>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <Item>
                            <h2> Inventory </h2>
                        </Item>
                    </Grid>
                    {
                        brewArr.map((el, index) => {
                            return (
                                <>
                                    <Grid item xs={4} key={index}>
                                        <Item>
                                            <img
                                                src="bitfgihter_assets/brew/BREW.png"
                                                alt="."
                                                height="35"
                                                width="15"
                                                onMouseDown={(el) => {
                                                    data.setShowButtonGroupBool(!data.showButtonGroupBool)
                                                    // if (el.button === 2) {
                                                    //     console.log("right button pressed")
                                                    //     data.setShowButtonGroupBool(true)
                                                    // } else {
                                                    //     data.setShowButtonGroupBool(false)
                                                    // }
                                                }}
                                                key={uuidv4()}
                                            ></img>
                                        </Item>
                                    </Grid>
                                </>
                            )
                        })
                    }

                    {
                        nonBrewArrMap.map(el => {
                            return (
                                <>
                                    <Grid item xs={4}>
                                        <Item>
                                            <img
                                                src="bitfgihter_assets/brew/empty-brew.png"
                                                alt="."
                                                height="35"
                                                width="15"
                                            ></img>
                                        </Item>
                                    </Grid>
                                </>
                            )
                        })
                    }

                    {
                        emptyArray.map(el => {
                            return (
                                <>
                                    <Grid item xs={4}>
                                        <Item>
                                            <img
                                                style={{
                                                    height: "35",
                                                    width: "15"
                                                }}
                                                height="35"
                                                width="15"
                                            ></img>
                                        </Item>
                                    </Grid>
                                </>
                            )
                        })
                    }
                </Grid>
            </Box>

            <div
                style={{
                    marginTop: '60px',
                    marginLeft: '20px'
                }}
            >
                {
                    data.showButtonGroupBool ?
                        <ButtonGroupView>
                            <Box sx={{ flexGrow: 1 }}
                                style={{
                                    padding: '10px',
                                }}
                            >
                                <Grid container spacing={0} key={uuidv4()} style={{
                                    padding: '10px'
                                }}>
                                    <Grid item xs={12} key={uuidv4()}>
                                        <Button
                                            variant="contained"
                                            color="info"
                                            onClick={async (event: any) => {
                                                event.preventDefault()
                                                await data.useBrew()
                                                data.setShowButtonGroupBool(false)
                                            }}

                                        > Use </Button>
                                    </Grid>
                                </Grid>

                                <Grid container spacing={0} key={uuidv4()} style={{
                                    padding: '10px'
                                }}>
                                    <Grid item xs={12} key={uuidv4()}>
                                        <Button
                                            variant="contained"
                                            color="info"
                                            onClick={async (event: any) => {
                                                event.preventDefault()
                                                await data.equipBrew()
                                                data.setShowButtonGroupBool(false)
                                            }}
                                        >
                                            Equip
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </ButtonGroupView> :
                        <></>
                }
            </div>
        </div>
    )
}