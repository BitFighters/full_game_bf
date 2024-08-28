// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */


import { Grid } from "@mui/material";
import styled from "styled-components"
import { isNullOrUndefined } from "util";
import { useAppSelector } from "../../../hooks";
import { IQueueCombined } from "../../../stores/UserWebsiteStore";
import { parseWBTCBalanceV2 } from "../../../utils/web3_utils";
import { Col, Row } from "react-bootstrap";


const BackDrop = styled.div`
    width: 100%%;
    margin: auto;
    display: flex;
    flex-direction: row;
`;

const PrizeTextDiv = styled.div`
    width: 100%;
    height: 100%;
    background-color: #000000a7;
    display: flex;
    flex-direction: column;
    background-color: #000000a7;
    border-bottom: 5px solid #000000;
    border-top: 5px solid #000000;
    justify-content: center;
    align-items: center;
`

const PrizeTextDiv1 = styled.div`
    width: 100%;
    height: 100%;
    background-color: #000000a7;
    border-left: 5px solid #000000;
    border-top: 5px solid #000000;
    border-bottom: 5px solid #000000;
    display: flex;
    justify-content: center;
    align-items: center;
`

const PrizeTextDiv2 = styled.div`
    width: 100%;
    height: 100%;
    background-color: #000000a7;
    border-right: 5px solid #000000;
    border-top: 5px solid #000000;
    border-bottom: 5px solid #000000;
    display: flex;
    justify-content: center;
    align-items: center;
`

const GridItem = styled.div`

`

export function PlayersPrizeMoney() {
    // const fightersInfo = useAppSelector((state) => state.userActionsDataStore.fightersInfo)
    // const p1_total_bet = useAppSelector((state) => state.fightInfoStore.win_pot_p1)
    // const p2_total_bet = useAppSelector((state) => state.fightInfoStore.win_pot_p2)

    const combinedQueueData = useAppSelector((state) => state.userPathStore.CombinedQueueData)
    const queueDetailsInfo = useAppSelector((state) => state.queueDetailedInfo.queue_to_fight_info_map)
    let p1_self_bet = 0;
    let p2_self_bet = 0;
    if (combinedQueueData.length > 0) {
        combinedQueueData.map((data: IQueueCombined, index) => {
            if (index > 0) {
                return
            }
            const tempQueueDetailInfo = queueDetailsInfo[data.fight_id];
            if (!isNullOrUndefined(tempQueueDetailInfo)) {
                p1_self_bet = tempQueueDetailInfo.win_pot_p1 ? tempQueueDetailInfo.win_pot_p1 : 0;
                p2_self_bet = tempQueueDetailInfo.win_pot_p1 ? tempQueueDetailInfo.win_pot_p2 : 0;
            }

            // if (!isNullOrUndefined(tempQueueDetailInfo)) {
            //   p1_self_bet = tempQueueDetailInfo.self_bet_p1? Math.min(tempQueueDetailInfo.self_bet_p1, tempQueueDetailInfo.self_bet_p2) + tempQueueDetailInfo.total_tip_p1 : 0;
            //   p2_self_bet = tempQueueDetailInfo.self_bet_p2? Math.min(tempQueueDetailInfo.self_bet_p1, tempQueueDetailInfo.self_bet_p2) + tempQueueDetailInfo.total_tip_p2: 0;
            // }
        })
    }

    return (
        <BackDrop>
            <Col className="col-3-auto">
                <PrizeTextDiv1 className="prize_text_below_health_bar">
                    <span className="fs-6 user-select-none">
                        {
                            parseWBTCBalanceV2(p1_self_bet.toString())
                        }
                    </span>
                </PrizeTextDiv1>
            </Col>
            <Col className="col-3-auto">
                <PrizeTextDiv className="prize_text_below_health_bar_1">
                    <span className="fs-6 user-select-none text-center">
                        Fight Prize
                    </span>
                </PrizeTextDiv>
            </Col>
            <Col className="col-3-auto">
                <PrizeTextDiv2 className="prize_text_below_health_bar">
                    <span className="fs-6 user-select-none">
                        {
                            parseWBTCBalanceV2(p2_self_bet.toString())
                        }
                    </span>
                </PrizeTextDiv2>
            </Col>
        </BackDrop>
    )
}