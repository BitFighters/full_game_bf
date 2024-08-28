// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import styled from 'styled-components'
import Box from '@mui/material/Box'
import { Button, ButtonGroup, Fab, Tab, Tabs } from '@mui/material'
import PendingRequests from './MenuComponents/PendingRequests';
import FriendsList from './MenuComponents/FriendsList';
import SentFriendRequests from './MenuComponents/SentFriendRequest';
import { useAppDispatch, useAppSelector } from '../../hooks'
import store from '../../stores'
import { ChangeShowGangView, ChangeShowQueueBox, ChangeShowStatsView, ChangeShowLog } from '../../stores/UserWebsiteStore'
import { SetMouseClickControlProfileWindow, TurnMouseClickOff } from '../../stores/UserActions'
import { getEllipsisTxt } from '../../utils';
import { setNFTLoadedBool } from '../../stores/BitFighters';
import { LogOut } from '../../stores/Web3Store';
// import BetWindowView from './MenuComponents/BetWindowView';
import RefreshIcon from '@mui/icons-material/Refresh';
import { updateBetInfOfPlayer } from '../../utils/fight_utils';
import MyStatsView from './MenuComponents/MyStatsView';
import MyLogView from './MenuComponents/MyLogView';
import OtherStatsView from './MenuComponents/OtherStatsView';
import QueueListV2 from './MenuComponents/QueueListV2';
import React, { useState, useEffect } from 'react';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

export interface ListViewerData {
    main: string,
    sequence: number,
    subdata: string,
}

export interface ListViewerDataWrapper {
    data: ListViewerData;
}

// function TabPanel(props: TabPanelProps) {
//     const { children, value, index, ...other } = props;

//     return (
//         <div
//             role="tabpanel"
//             hidden={value !== index}
//             id={`simple-tabpanel-${index}`}
//             aria-labelledby={`simple-tab-${index}`}
//             {...other}
//             className='container w-100 h-100'
//         >
//             {
//                 value === index && ({ children })
//             }
//         </div>
//     );
// }

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
            className='container w-100 h-100'
        >
            {value === index && (
                <div>{children}</div>
            )}
        </div>
    );
}

function TabPanel2(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
            className='container w-100 p-0'
        >
            {value === index && (
                <div className='d-flex w-100 h-100'> {children} </div>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function a11yProps2(index: number) {
    return {
        id: `simple-tab2-${index}`,
        'aria-controls': `simple-tabpanel2-${index}`,
    };
}

function a11yProps3(index: number) {
    return {
        id: `simple-tab2-${index}`,
        'aria-controls': `simple-tabpanel2-${index}`,
    };
}

const Backdrop = styled.div`
    position: fixed;
    right: 0%;
    height: 100%;
    width: 30%;
    z-index: 100;
    overflow-y: scroll;

    @media only screen and (max-height: 575.98px) and (orientation: landscape) {
        width: 50%;
    }

    @media only screen and (orientation: portrait) {
        width: 90%;
    }
`

const Wrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    opacity: 0.95;
    justify-content: 'center';
    width: auto;
    background: #2c2c2c;
    //border-radius: 10px;
`

const MenuBox = styled(Box)`
    width: 100%;
`

const MenuBoxHeader = styled.div`
    position: relative;
    background: #000000a7;
    display: flex;
    justify-content: center;
    //border-radius: 10px 10px 0px 0px;
    //padding: 20px;
`

const TabsBoxHeader = styled.div`
    position: relative;
    background: #000000a7;
`

const TabsSection = styled.div`
    display: flex;
    flex-direction: column;
    height: 800px;
`

const TextWrapper = styled.div`
  color: aliceblue;
  font-family: Monospace;
  font-size: 25px;
`

export default function NewMenuSideBar() {
    // const userAddress = useAppSelector((state) => state.web3store.userAddress)
    // const ProfilemenuClicked = useAppSelector((state) => state.userPathStore.ShowMenuBox)
    const showQueueBoxRedux = useAppSelector((state) => state.userPathStore.ShowQueueBox)

    const showStatsBox = useAppSelector((state) => state.userPathStore.ShowStatsView)
    const showLog = useAppSelector((state) => state.userPathStore.ShowLog)
    const ShowMenuBoxRedux = useAppSelector((state) => state.userPathStore.ShowMenuBox)
    const userAddress = useAppSelector((state) => state.web3store.userAddress)
    const [value, setValue] = React.useState(1);
    const [value2, setValue2] = React.useState(0);
    const [value3, setValue3] = React.useState(0);
    const dispatch = useAppDispatch();

    console.log("-- debug showmenubox ", ShowMenuBoxRedux, showQueueBoxRedux, showStatsBox, showLog)

    // const web3LogOut = async () => {
    //   console.log("button pressed");
    //   if (window.confirm("You sure you want to Logout? ")) {
    //     store.dispatch(setNFTLoadedBool(false))
    //     // await Moralis.User.logOut();
    //     dispatch(LogOut())
    //     localStorage.removeItem("connected_matic_network")
    //     localStorage.removeItem("web2_wallet_address")
    //     localStorage.removeItem("web2_email_address")
    //     localStorage.removeItem("saw_controls")
    //     console.log("logged out ");
    //     setTimeout(() => {
    //       window.location.reload()
    //     }, 500)
    //   }

    //   // store.dispatch(setNFTLoadedBool(false))
    //   // // await Moralis.User.logOut();
    //   // dispatch(LogOut())
    //   // localStorage.removeItem("connected_matic_network")
    //   // localStorage.removeItem("web2_wallet_address")
    //   // localStorage.removeItem("web2_email_address")
    //   // localStorage.removeItem("saw_controls")
    //   // console.log("logged out ");
    //   // setTimeout(() => {
    //   //   window.location.reload()
    //   // }, 500)
    // }

    // const [showMenuBar, setShowMenuBar] = useState(false);
    // const [showFriendsInfo, setShowFriendsInfo] = useState(false)

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        console.log("debug handleChange----", newValue)
        setValue(newValue);
    };

    const handleChange2 = (event: React.SyntheticEvent, newValue: number) => {
        setValue2(newValue);
    };

    const handleChange3 = (event: React.SyntheticEvent, newValue: number) => {
        setValue3(newValue);
    };

    // const LogoutButtonView =  () => {
    //   return (  
    //                           <button 
    //                             type="button" 
    //                             className="btn btn-danger"
    //                             style={{
    //                               margin: '10px',

    //                             }}
    //                             onClick={() => web3LogOut()}
    //                           >
    //                             LogOut
    //                           </button>
    //   )
    // }                         

    // console.log("queue -> menu box and friends box ", ShowMenuBoxRedux, showQueueBoxRedux)

    return (
        <Backdrop>

            {ShowMenuBoxRedux && ((
                <Wrapper
                    onMouseOver={() => {
                        dispatch(SetMouseClickControlProfileWindow(true))
                    }}
                    onMouseOut={() => {
                        dispatch(SetMouseClickControlProfileWindow(false))
                    }}>
                    <TextWrapper className='fs-6 text-center'>Connected Wallet
                        <span
                            style={{
                                color: 'grey',
                                paddingLeft: '20px'
                            }}
                            onClick={
                                () => {
                                    updateBetInfOfPlayer()
                                }
                            }>
                            <RefreshIcon />
                        </span>
                    </TextWrapper>
                    <TextWrapper className='fs-6 text-center' style={{ color: "#BF8B8B", fontSize: '20px' }}>{getEllipsisTxt(userAddress)}</TextWrapper>
                    <MenuBoxHeader>
                        <ButtonGroup>
                            {
                                /* 
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => {
                                            store.dispatch(ChangeShowQueueBox(false))
                                        }}
                                    >
                                        Friends
                                    </Button> 
                                */
                            }
                            <Button
                                className='fs-6'
                                variant="outlined"
                                color="secondary"
                                onClick={() => {
                                    store.dispatch(ChangeShowQueueBox(true))
                                    store.dispatch(ChangeShowStatsView(false))
                                    store.dispatch(ChangeShowLog(false))
                                }}
                            >
                                Game
                            </Button>

                            {
                                /* 
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => {
                                            store.dispatch(ChangeShowGangView(true))
                                        }}
                                        >
                                            Gang
                                    </Button> 
                                */
                            }

                            <Button
                                className='fs-6'
                                variant="outlined"
                                color="secondary"
                                onClick={() => {
                                    store.dispatch(ChangeShowQueueBox(false))
                                    store.dispatch(ChangeShowStatsView(true))
                                    store.dispatch(ChangeShowLog(false))
                                }}
                            >
                                Stats
                            </Button>

                            <Button
                                className='fs-6'
                                variant="outlined"
                                color="secondary"
                                onClick={() => {
                                    store.dispatch(ChangeShowQueueBox(false))
                                    store.dispatch(ChangeShowStatsView(false))
                                    store.dispatch(ChangeShowLog(true))
                                }}
                            >
                                Log
                            </Button>
                        </ButtonGroup>
                    </MenuBoxHeader>

                    {
                        showQueueBoxRedux ?
                            <TabsSection>
                                <TabsBoxHeader>
                                    <Tabs aria-label="basic tabs example 2" centered style={{ fontSize: '15px' }} onChange={handleChange2} value={value2} textColor="secondary" indicatorColor="secondary" >
                                        <Tab label="Queue" {...a11yProps2(0)} />
                                    </Tabs>
                                </TabsBoxHeader>
                                <MenuBox sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabPanel2 value={value2} index={0}>
                                        <QueueListV2 />
                                    </TabPanel2>
                                </MenuBox>
                            </TabsSection> :

                            showStatsBox ? (
                                <TabsSection>
                                    <TabsBoxHeader>
                                        <Tabs
                                            aria-label="basic tabs example"
                                            centered
                                            style={{ fontSize: '15px' }}
                                            onChange={(e, newValue) => {
                                                console.log("debug handleChange----", newValue)
                                                setValue(newValue);
                                            }}
                                            value={value}
                                            textColor="secondary"
                                            indicatorColor="secondary"
                                        >
                                            <Tab label="Others" {...a11yProps(0)} />
                                            <Tab label="Self" {...a11yProps(1)} />
                                        </Tabs>
                                    </TabsBoxHeader>
                                    <MenuBox sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <TabPanel value={value} index={0}>
                                            <OtherStatsView />
                                        </TabPanel>
                                        <TabPanel value={value} index={1}>
                                            <MyStatsView />
                                        </TabPanel>
                                    </MenuBox>
                                </TabsSection>
                            ) :

                                showLog ?
                                    <TabsSection>
                                        <TabsBoxHeader>
                                            <Tabs aria-label="basic tabs example 2" centered style={{ fontSize: '15px' }} onChange={handleChange3} value={value3} textColor="secondary" indicatorColor="secondary" >
                                                <Tab className='fs-6' label="Transactions" {...a11yProps3(0)} />
                                            </Tabs>
                                        </TabsBoxHeader>
                                        <MenuBox sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                            <TabPanel value={value3} index={0}>
                                                <MyLogView key={"mylogview"} />
                                            </TabPanel>
                                        </MenuBox>
                                    </TabsSection> :
                                    <TabsSection>
                                        <TabsBoxHeader>
                                        </TabsBoxHeader>
                                        <MenuBox sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        </MenuBox>
                                    </TabsSection>
                    }

                </Wrapper>
            )
            )}
        </Backdrop>
    )
}
