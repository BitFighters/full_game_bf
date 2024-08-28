// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { useAppSelector } from "../../../hooks";
import styled from 'styled-components'

const Backdrop = styled.div`
    margin: auto;
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    align-content: center;
    background-color: #000000a7;
    border-radius: 10px;
    border-left: 5px solid #000000;
    border-top: 5px solid #000000;
    border-right: 5px solid #000000;
    border-bottom: 5px solid #000000;

    @media only screen and (max-height: 575.98px) and (orientation: landscape) {
        //height: 30px;
        width: 100%;
    }

    @media only screen and (max-width: 575.98px) and (orientation: portrait) {
        //height: 30px;
        width: 100%;
    }
`

const TextDiv = styled.div`
    font-size: 30px !important;
    font-family: Montserrat, sans-serif;
    font-weight: 600;
    text-transform: none;
    color: aliceblue;

    @media only screen and (max-height: 575.98px) and (orientation: landscape) {
        font-size: 20px !important;
        font-weight: 400;
    }

    @media only screen and (orientation: portrait) {
        font-size: 15px !important;
        font-weight: 400;
    }
`

export function Timer() {
    const notificationFromServerBool = useAppSelector((state) => state.userPathStore.GotNotificationFromServer)
    const notificationFromServerMsg = useAppSelector((state) => state.userPathStore.NotificationMessageFromServer)
    // const notificationFromServerBool = true;
    // const notificationFromServerMsg = 50
    return (
        <Backdrop>
            {
                notificationFromServerBool ?
                    (
                        <TextDiv className="text-center fs-1 user-select-none">
                            {notificationFromServerMsg}
                        </TextDiv>
                    ) :
                    <TextDiv className="text-center fs-1 user-select-none">
                        {60}
                    </TextDiv>
            }
        </Backdrop>
    )
}