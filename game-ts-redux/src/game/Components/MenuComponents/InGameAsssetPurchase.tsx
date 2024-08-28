// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import styled from 'styled-components';
import { Box, Button, CircularProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { BrewMachinePunched, ShowBrewEjectAnimation, TurnMouseClickOff } from '../../../stores/UserActions';
import React, { useState, useEffect } from 'react';

import phaserGame from '../../../PhaserGame';
import Bootstrap from '../../scenes/Bootstrap';
import Game from '../../scenes/Game';
import store from '../../../stores';
import { useDetectClickOutside } from 'react-detect-click-outside';
import { parseWBTCBalanceV3 } from '../../../utils/web3_utils';
import { SetFailureNotificationBool, SetFailureNotificationMessage, SetSuccessNotificationBool, SetSuccessNotificationMessage } from '../../../stores/NotificationStore';
import { FetchPartnerInfo, fetchPlayerWalletInfo, purchaseAssets } from '../../../hooks/ApiCaller';

import partners, { Partner } from '../../../constants/PartnersData';
import { getSystemInfo } from '../../../utils/systemInfo';

const ScrollContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 75px);
    gap: 18px;
    margin-top: 0px;
    margin-bottom: 0px;
    margin-left: 8px;
    margin-right: 8px;
    overflow-y: scroll;
    overflow-x: scroll;
    padding-right: calc(2px + var(--scrollbar-width));

    &::-webkit-scrollbar {
        width: 25px;
    }

    &::-webkit-scrollbar-track {
        background: #444;
        width: 20px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #ccc;
        border-radius: 12px;
        width: 20px;
    }
`;

const Wrapper = styled.div`
    display: inline-block;
    position: absolute;
    top: 15%;  
    left: 10vw;  
    transform: scale(100%, 100%);

    // overflow-y: scroll;
    // overflow-x: scroll;
`;

const FriendRequestBox = styled(Box)`
    display:block;

    opacity: 0.9;
    background: #2c2c2c;
    border: 5px solid #000000;
    border-radius: 10px;

    width: 80vw;
    height: 75vh;
    overflow-y: auto;
    overflow-y: scroll;
    overflow-x: scroll;

    span {
        font-family: Monospace;
        font-style: bold;
        font-size: 20px;
    }

    h2, h3 {
        font-family: Monospace;
        font-style: bold;
        font-size: 21px;
        color: white;
        line-height: 75%;
    }

    input {
        color: black;
    }

    @media only screen and (max-height: 575.98px) and (orientation: landscape) {
        height: calc(100vh - 100px);
    }

    @media   (orientation: landscape) {
        width: 60vw;
    }
`;

const MyDivider = styled.div`
    border: 2px solid #000000;
    margin-bottom: 10px;
`;

const topButtonStyle = {
    width: '200px',
    height: '75px',
};

const smallButtonStyle = {
    width: '75px',
    height: '75px',
    marginTop: '-5px',
    marginBottom: '0px',
};

const brewCounter = {
    position: 'absolute',
    top: '2px',
    right: '2px',
    background: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '10%',
    padding: '1px',
};

export default function InGameAssetPurchase() {
    const [partnerBrewsSold, setPartnerBrewsSold] = useState<{ [key: string]: number }>({});
    const [sortedPartners, setSortedPartners] = useState<Partner[]>(partners); // Initialize sorted partners
    const dispatch = useAppDispatch();
    const brewMachinePunched = useAppSelector((state) => state.userActionsDataStore.brewMachinePunched);
    const [transactionStarted, setTransactionStarted] = useState(false);
    const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;
    const [quantity, setQuantity] = useState(1);

    const ismobile = getSystemInfo();


    useEffect(() => {
        if (brewMachinePunched && ismobile && !store.getState().web3store.web3Connected) {
            // call the buy api.. and ,.. do not show UI 
            if (transactionStarted) {
                return
            }
            AssetBuyer("Bitfighter");
        }
    }, [brewMachinePunched])

    useEffect(() => {
        // Whenever partnerBrewsSold changes, sort the partners array based on brews sold
        const updatedPartners = [...partners].sort((a, b) => {
            const brewsSoldA = partnerBrewsSold[a.name] || 0;
            const brewsSoldB = partnerBrewsSold[b.name] || 0;
            return brewsSoldB - brewsSoldA;
        });

        // Set the sorted partners as the new display order
        setSortedPartners(updatedPartners);
    }, [partnerBrewsSold]);

    const loopFunctionUpdater = async () => {
        const data = await FetchPartnerInfo();
        const ndata: { [key: string]: number } = {}
        for (let i = 0; i < data.data.length; i++) {
            ndata[data.data[i].partner_id] = data.data[i].quantity;
        }
        setPartnerBrewsSold(ndata)
        console.log("InGameAssetPurchase_useeffect ", data, ndata);
    }

    useEffect(() => {
        // (async function () {
        //   const data = await FetchPartnerInfo();
        //   const ndata: { [key: string]: number } = {}
        //   for(let i=0; i < data.data.length; i++) {
        //     ndata[data.data[i].partner_id] = data.data[i].quantity;
        //   }
        //   setPartnerBrewsSold(ndata)
        //   console.log("InGameAssetPurchase_useeffect ", data, ndata);
        // })();
        loopFunctionUpdater()
        const interval = setInterval(() => loopFunctionUpdater(), 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const AssetBuyer = async (partner_id: string) => {
        setTransactionStarted(true);

        if (quantity > 9) {
            setTimeout(() => {
                store.dispatch(SetFailureNotificationBool(true));
                store.dispatch(SetFailureNotificationMessage("Quantity should be less than 9"));
                bootstrap.play_err_sound();
                setTransactionStarted(false);
            }, 200);
            return;
        }
        if (quantity <= 0) {
            setTimeout(() => {
                store.dispatch(SetFailureNotificationBool(true));
                store.dispatch(SetFailureNotificationMessage("Quantity should be greater than 0"));
                bootstrap.play_err_sound();
                setTransactionStarted(false);
            }, 200);
            return;
        }
        const result = await purchaseAssets(quantity, "brew", partner_id);
        if (result?.success) {
            console.log(" brew asset bought ..");
            setTimeout(() => {
                dispatch(ShowBrewEjectAnimation(true));
                store.dispatch(SetSuccessNotificationBool(true));
                store.dispatch(SetSuccessNotificationMessage(`${quantity} Brew purchased!`));
                bootstrap.play_err_sound();
                handleIncrementBrewsSold(partner_id);
                fetchPlayerWalletInfo(false, "ingameassetprchase");
            }, 200);
        } else {
            setTimeout(() => {
                store.dispatch(SetFailureNotificationBool(true));
                store.dispatch(SetFailureNotificationMessage(result?.error));
                bootstrap.play_err_sound();
            }, 200);
        }

        setTimeout(() => {
            setTransactionStarted(false);
        }, 500);
    };

    const closeFunction = () => {
        dispatch(TurnMouseClickOff(false));
        store.dispatch(BrewMachinePunched(false));
    };

    const ref = useDetectClickOutside({ onTriggered: closeFunction });

    const handleIncrementBrewsSold = (partnerName: string) => {
        setPartnerBrewsSold((prevCount) => ({
            ...prevCount,
            [partnerName]: (prevCount[partnerName] || 0) + 1,
        }));
    };

    return (
        <div
            ref={ref}
            onMouseOver={() => {
                dispatch(TurnMouseClickOff(true));
            }}
            onMouseOut={() => {
                dispatch(TurnMouseClickOff(false));
            }}
        >
            {brewMachinePunched && store.getState().web3store.web3Connected && (
                <Wrapper>
                    <FriendRequestBox>
                        <h2 className='m-2 fs-5 text-center'> Hello! Please choose a flavor! </h2>
                        <MyDivider></MyDivider>

                        <h3 className='m-2 fs-6 text-center'>
                            Price: {parseWBTCBalanceV3(500 * quantity)} Bits
                        </h3>
                        <MyDivider></MyDivider>

                        <div style={{ display: 'flex', flexDirection: 'row', height: "80%" }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: "80%" }}>
                                {sortedPartners.slice(0, 5).map((partner: Partner, index: number) => (
                                    <Button
                                        key={index}
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                            if (transactionStarted) {
                                                return
                                            }
                                            AssetBuyer(partner.name);
                                        }}
                                        style={{
                                            ...topButtonStyle,
                                            marginBottom: '10px',
                                            backgroundImage: `url(${partner.largeImageUrl})`,
                                            backgroundSize: 'cover',
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: "center",
                                            color: 'white',
                                            position: 'relative', // Needed for positioning the count div
                                        }}
                                    >
                                        <span style={{ visibility: 'hidden' }}>{partner.name}</span>
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: '1px',
                                                right: '1px',
                                                background: 'rgba(0, 0, 0, 0.5)',
                                                borderRadius: '10%',
                                                padding: '1px',
                                            }}
                                        >
                                            {partnerBrewsSold[partner.name] || 0}
                                        </div>
                                    </Button>
                                ))}
                            </div>
                            <ScrollContainer>
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(3, 75px)',
                                        gap: '8px',
                                        marginTop: '0px',
                                        marginBottom: '0px',
                                        marginLeft: '8px',
                                        height: '400px',
                                        paddingRight: '10px',
                                    }}
                                >
                                    {sortedPartners.slice(5).map((partner: Partner, index: number) => (
                                        <Button
                                            key={index}
                                            variant="contained"
                                            color="primary"
                                            onClick={() => {
                                                if (transactionStarted) {
                                                    return
                                                }
                                                AssetBuyer(partner.name);
                                            }}
                                            style={{
                                                ...smallButtonStyle,
                                                backgroundImage: `url(${partner.smallImageUrl})`,
                                                backgroundSize: 'contain',
                                                backgroundRepeat: "no-repeat",
                                                color: 'white',
                                                position: 'relative', // Needed for positioning the count div
                                            }}
                                        >
                                            <span style={{ visibility: 'hidden' }}>{partner.name}</span>
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: '1px',
                                                    right: '1px',
                                                    background: 'rgba(0, 0, 0, 0.5)',
                                                    borderRadius: '10%',
                                                    padding: '1px',
                                                }}
                                            >
                                                {partnerBrewsSold[partner.name] || 0}
                                            </div>
                                        </Button>
                                    ))}
                                </div>
                            </ScrollContainer>
                        </div>

                        {transactionStarted ? (
                            <div style={{
                                marginTop: '20px'
                            }}>
                                <CircularProgress />
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                {/* Additional content when no transaction is started */}
                            </div>
                        )}
                    </FriendRequestBox>
                </Wrapper>
            )}
        </div>
    );
}
