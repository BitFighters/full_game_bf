// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */


import { useAppDispatch, useAppSelector } from "../../hooks"
import styled from 'styled-components'
import { Box, Button } from "@mui/material"
import { TurnMouseClickOff } from "../../stores/UserActions";
import { ChangeShowControls } from "../../stores/UserWebsiteStore";
import { getSystemInfo } from '../../utils/systemInfo';
import { useDetectClickOutside } from "react-detect-click-outside";

const Backdrop = styled.div`
    position: fixed;
    top: calc(10% + 60px);
    left: 10%;
    height: 80%;
    width: 80%;
    //z-index: 1;
`

const Backdrop2 = styled.div`
    position:fixed;
    top: 80px;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    // z-index: 1;
`

const Wrapper = styled.div`
    position: relative;
    height: 100%;
    width: 100%;
    padding: 20px;
    display: flex;
    flex-direction: column;
`

const FightConfirmationBoxDiv = styled(Box)`
    width: 100%;
    overflow: auto;
    opacity: 1;
    background: #000000a7;
    border: 5px solid #000000;
    border-radius: 10px;

    h2 {
        font-family: Monospace;
        font-style: bold;
        color: white;
    }

    span {
        font-family: Monospace;
        font-style: bold;
    }

    .controlsText {
        font-family: Monospace;
        font-style: bold;
        color: white;
        background: rgb(84, 86, 86);
    }
`

export function ControlsInfo() {
    const showControls = useAppSelector((state) => state.userPathStore.showControls)
    const dispatch = useAppDispatch();
    const ismobile = getSystemInfo();

    function closeView() {
        console.log("debug_inventory... clicked outside1");
        localStorage.setItem("saw_controls", "YES")
        if(localStorage.getItem("saw_controls"))
            dispatch(ChangeShowControls(false))
    }
    const ref = useDetectClickOutside({ onTriggered: closeView });

    const View = <Wrapper ref={ref}>
                <FightConfirmationBoxDiv className="text-center">
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-around'
                    }}>
                        <div style={{
                            justifyContent: 'space-around',
                            paddingTop: '2vh',
                        }}>
                            <h2 className="fs-3">
                                Controls
                            </h2>

                            <div className="controlsText fs-6">
                                P/ Left Mouse Click - Punch
                            </div>

                            <div className="controlsText fs-6">
                                K/ Right Mouse Click - Kick
                            </div>

                            <div className="controlsText fs-6">
                                W, A, S, D - movement
                            </div>
                        </div>

                        <div style={{
                            justifyContent: 'space-around',
                            paddingTop: '2vh',
                        }}>
                            <h2 className="fs-3">
                                Features
                            </h2>

                            <div className="controlsText fs-6">
                                To Chat - Press Enter to Open the chat Window
                            </div>

                            <div className="controlsText fs-6">
                                Join the fight by going near the Fight Box in right corner of HQ
                            </div>
                        </div>

                        <div style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            paddingTop: '4vh',
                            paddingBottom: "2vh"
                        }}>
                        </div>
                    </div>
                </FightConfirmationBoxDiv>
            </Wrapper>
    return (
        <div
            onMouseOver={() => {
                dispatch(TurnMouseClickOff(true))
            }}
            onMouseOut={() => {
                dispatch(TurnMouseClickOff(false))
            }}
            style={{
                zIndex: 5
            }}
        >
            {
                showControls &&
                <div>
                    {
                        !getSystemInfo() ?
                        <Backdrop>
                            {View}
                        </Backdrop> :
                        <Backdrop2>
                            {View}
                        </Backdrop2>
                    }
                </div>
            }
        </div>
    )
}