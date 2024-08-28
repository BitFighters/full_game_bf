// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

// import { useAppDispatch, useAppSelector } from "../../hooks"
import styled from 'styled-components'
import { Box } from "@mui/material"
import { useDetectClickOutside } from "react-detect-click-outside";
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { TurnMouseClickOff } from '../../../stores/UserActions';
import { parseWBTCBalanceV2, parseWBTCBalanceV3 } from '../../../utils/web3_utils';
import { getEllipsisTxt } from '../../../utils';
import store from '../../../stores';
import { unmountComponentAtNode } from 'react-dom';
import { useEffect } from 'react';

const Wrapper = styled.div`
    display: flex;
    position: relative;
    width: 75vw;
    overflow: auto;
    left: -8vw;
`

const TableWrapper = styled.div`
    th, td {
        border: 2px solid #000;
    }

    th {
        font-size: 20px;
    }

    td {
        font-size: 30px;
        color: blue;
    }

    input::placeholder {
        font-size: 20px;
    }

    margin-left: auto;
    margin-right: auto;

    padding-bottom: 20px;

    @media only screen and (max-height: 575.98px) and (orientation: landscape) {
        td {
            font-size: 15px;
        }

        th {
            font-size: 10px;
        }

        padding-bottom: 5px;
    }
`

const ATMBOX = styled(Box)`
    position: relative;
    width: 60vw;
    left: -8vw;
    overflow: auto;
    opacity: 0.8;
    background: #def0ee;
    border: 15px solid #fa6931;
    border-radius: 10px;
    padding: 20px;

    span {
        font-family: Monospace;
        font-style: bold;
        font-size: 20px;
    }

    h2 {
        font-family: Monospace;
        font-style: bold;
        font-size: 34px;
        color: black;
    }

    input:focus {
        outline: none;
    }

    @media only screen and (max-height: 575.98px) and (orientation: landscape) {
        span {
            font-size: 10px;
        }

        h2 {
            font-size: 17px;
        }
    }
`


interface IQueueOptions {
    amount: number;
    closeFunction: any,
    setAmount: any,
    AddMoneyToWallet: any,
    RemoveFromWallet: any
    // enterQueue: any
}


export default function AtmViewBox(data: IQueueOptions) {
    const wbtcBalance = useAppSelector((state) => state.web3BalanceStore.wbtcBalance);
    // const walletBalance = useAppSelector((state) => state.web3BalanceStore.walletBalance);
    const betBalance = useAppSelector((state) => state.web3BalanceStore.betBalance);
    const web2_credit_balance = useAppSelector((state) => state.web3BalanceStore.web2CreditBalance);

    // const ref = useDetectClickOutside({ onTriggered: data.closeFunction });
    // const dispatch = useAppDispatch();
    return (
        <ATMBOX>
            <h2 className='text-center'>
                ATM <span>(1 BTC == 1,000,000 Bits)</span>
            </h2>
            <span style={{ color: 'red', fontSize: '14px', fontWeight: 600 }}>
                {store.getState().web3store.web3Connected ? '' : 'Not Allowed for Web2 Player'}
            </span>
            <TableWrapper>
                <table style={{
                    width: '100%'
                }}>
                    <thead>
                        <tr>
                            <th>Bits</th>
                            <th>Wallet: {getEllipsisTxt(store.getState().web3store.userAddress)}</th>
                            <th>Bag</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>BTC.b</td>
                            <td>{parseWBTCBalanceV2(wbtcBalance)}</td>
                            <td>{parseWBTCBalanceV3(web2_credit_balance)}</td>
                            <td>
                                {/* <TextField id="outlined-basic" label="Outlined" variant="outlined" /> */}
                                <input
                                    type="number"
                                    placeholder='Enter Bits'
                                    value={data.amount}
                                    style={{
                                        width: "200px"
                                    }}
                                    onChange={(e) => {
                                        data.setAmount(e.target.value)
                                    }}></input>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </TableWrapper>
            
            <div style={{display: "flex", alignContent: "center", justifyContent:"center", gap:"30px"}} className='m-3'>
                <button
                    style={{
                        backgroundColor: '#75c850',
                        borderRadius: "10px",
                        height: "35px",
                        width: "150px"
                    }}
                    onClick={() => data.AddMoneyToWallet()}
                >
                    <span className="fs-5" style={{
                        color: 'aliceblue'
                    }}>Deposit</span>
                </button>


                <button
                    style={{
                        backgroundColor: '#af3708',
                        borderRadius: "10px",
                        height: "35px",
                        width: "150px"
                    }}
                    onClick={() => data.RemoveFromWallet()}
                >
                    <span className="fs-5" style={{
                        color: 'aliceblue'
                    }}>Withdraw</span>
                </button>
            </div>

            <div className='text-center'>
                <span>
                    40 bit fee on all withdraws.
                </span>
            </div>
        </ATMBOX>
        
    )
}