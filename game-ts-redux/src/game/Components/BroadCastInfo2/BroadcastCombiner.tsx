// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */


import { useAppDispatch, useAppSelector } from "../../../hooks";
import { Timer } from "./Timer";
import { LeftHealthBars } from "./LeftHealthBars";
import { RightHealthBars } from "./RightHealthBars";
import { LeftPlayerInfo } from "./LeftPlayerInfo";
import { RightPlayerInfo } from "./RightPlayerInfo";
import { TurnMouseClickOff } from "../../../stores/UserActions";
import { PlayersPrizeMoney } from "./PlayersPrizeMoney";
import { Col, Row } from "react-bootstrap";
import { useEffect } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
    display: inline-block;
    width: 80%;
    position: absolute;
    transform: translate(22%,10%);

    @media only screen and (orientation: portrait) {
        width: 100%;
        transform: translate(0%, 23%);
    }
`

export function BroadCastCombiner2() {
    // const fightersInfo = {
    //     preFightStarted: true
    // }
    const fightersInfo = useAppSelector((state) => state.userActionsDataStore.fightersInfo)
    const dispatch = useAppDispatch()

    return (
        <Wrapper>
            {
                (fightersInfo.preFightStarted) &&
                <div style={{ width: "100%", display: "flex", backgroundColor: "rgba(0, 0, 0, 0)"}}>
                    {/* <BroadcastingAnnouncement /> */}
                    <Col className="col-sm-2">
                        <LeftPlayerInfo />
                    </Col>
                    <Col className="col-6">
                        <div style={{
                            width: "100%",
                            display: "flex",
                        }}>
                            <Col className="col-4-auto" style={{ justifyContent: "end" }}>
                                <LeftHealthBars />
                            </Col>
                            <Col className="col-2">
                                <Timer />
                            </Col>
                            <Col className="col-4-auto">
                                <RightHealthBars />
                            </Col>
                        </div>
                        <div>
                            <div style={{ height: "1vh" }}></div>
                        </div>
                        <div>
                            <PlayersPrizeMoney />
                        </div>
                    </Col>
                    <Col className="col-sm-2">
                        <RightPlayerInfo />
                    </Col>
                </div>

            }
        </Wrapper>
    )
}