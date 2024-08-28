// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

// import { useAppDispatch, useAppSelector } from "../../hooks"
import styled from 'styled-components'
import { Box, Button } from "@mui/material"
import { useDetectClickOutside } from "react-detect-click-outside";
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { SetMouseClickControlFightMachine, TurnMouseClickOff } from '../../../stores/UserActions';
import store from "../../../stores";
import { Col, Row } from 'react-bootstrap';

const FriendRequestBox = styled(Box)`
    display: flex;
    flex-direction: column;
    width: 100%;
    opacity: 0.9;
    background: #2c2c2c;
    border: 5px solid #000000;
    border-radius: 10px;
    padding: 3%;

    overflow-y: auto;
    max-height: calc(100vh - 150px);
    input {
        color: black;
    }
    h2,h3{
        font-family: Monospace;
        font-style: bold;
        color: white;
    }
    span {
        font-family: Monospace;
        font-style: bold;
    }

    @media only screen and (orientation: portrait) {
        gap: 10px;
    }
`

interface IQueueOptions {
    closeFunction: any,
    enterQueue: any,
    amount: number,
    setAmount: any,
    ANTE: number,
    amountInString: string,
    enterfightButtonPressed: any,
}

export default function AddToQueueBox(data: IQueueOptions) {
    const queueData = useAppSelector((state) => state.userPathStore.QueueData)
    const ref = useDetectClickOutside({ onTriggered: data.closeFunction });
    const dispatch = useAppDispatch()

    return (
        <div ref={ref} style={{
            display: "flex", overflowY: "auto", alignContent: "center", justifyContent: "center", paddingBottom: '200px',
            marginBottom: '200px',
            // backgroundColor: 'yellow'
        }}
            onMouseOver={() => {
                dispatch(SetMouseClickControlFightMachine(true))
            }}
            onMouseOut={() => {
                dispatch(SetMouseClickControlFightMachine(false))
            }}
        >
            <FriendRequestBox>
                <Row>
                    <h2 className='fs-4 text-center'>Genesis HQ - Tier 5</h2>
                </Row>
                <Row className='m-1'></Row>
                <Row>
                    <Col>
                        <h3 className='fs-6'>Rules: 1v1 Death Match</h3>
                    </Col>
                    <Col>
                        <h3 className='fs-6'>Time: 60 seconds</h3>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h3 className='fs-6'>Draw: Sudden Death</h3>
                    </Col>
                    <Col>
                        <h3 className='fs-6'>Queue: {Math.floor(queueData.length / 2)}/{50}</h3>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h3 className='fs-6'>Est. Wait: {Math.floor(queueData.length / 2) * 1} minutes</h3>
                    </Col>
                    <Col>
                        <h3 className='fs-6'>Ante: {(data.ANTE).toLocaleString()} {store.getState().web3store.web3Connected ? "BITS" : "COINS"}</h3>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h3 className='fs-6'>Min Bet: None</h3>
                    </Col>
                    <Col>
                        <h3 className='fs-6'>Max Bet: None</h3>
                    </Col>
                </Row>
                <Row>
                    <Col className='col-md-auto'>
                        <h3 className='fs-6'>Your Max Bet:</h3>
                    </Col>
                    <Col>
                        <input type="number"
                            placeholder={store.getState().web3store.web3Connected ? 'amount in BITS' : 'Coins'}
                            // placeholder={'amount in BITS'}
                            // style={{ marginTop: '10px', marginLeft: "15px" }}
                            // value={data.amountInString}
                            onChange={(e) => {
                                let tempString = e.target.value
                                if (e.target.value === "") {
                                    data.setAmount(0)
                                } else {
                                    if (tempString.startsWith("0") && tempString.length > 1) {
                                        tempString = tempString.slice(1);
                                    }
                                    data.setAmount(parseInt(tempString))
                                }
                                console.log(e.target.value, ":", tempString, ":", data.amount)
                            }}
                        >
                        </input>
                    </Col>
                </Row>
                <Row>
                    <h3 className='fs-6'>Total Wager: {(data.ANTE + data.amount).toLocaleString()}</h3>
                </Row>
                <Row className='m-1'></Row>
                <Row className='d-flex justify-content-center'>
                    <Button
                        style={{ width: "70%" }}
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            data.enterQueue()
                            dispatch(TurnMouseClickOff(false))
                        }}
                    >
                        <span style={{
                            color: 'aliceblue'
                        }}>Enter Fight</span>
                    </Button>
                </Row>
            </FriendRequestBox>
        </div>
    )
}