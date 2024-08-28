import React, { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../hooks';
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Snackbar, Tooltip } from '@mui/material';
import Carousel from 'react-material-ui-carousel'
import phaserGame from '../PhaserGame'
import Bootstrap from '../game/scenes/Bootstrap'
import { Link, useNavigate } from 'react-router-dom';
import Chat from '../game/Components/Chat';
import CancelIcon from '@mui/icons-material/Cancel';
import Utils from './Utils';
import { v4 as uuidv4 } from 'uuid';
import { SetCurrentGamePlayer, SetGameStarted, setNickName } from '../stores/PlayerData';
import { IPlayerData } from '../game/characters/IPlayer';
import { PlayersInfo } from '../game/Components/PlayersInfo';
import { SendingFriendRequest } from '../game/Components/SendingFriendRequest';
import { QueueAddInfoWindow } from '../game/Components/QueueAddInfoWindow';
// import { BroadCastingMessage } from '../game/Components/BroadcastingInfo/BroadCastingMessageCenter';
import { BroadcastingAnnouncement } from '../game/Components/BroadcastingInfo/BroadcastingAnnouncement';
import { BroadCastCombiner2 } from '../game/Components/BroadCastInfo2/BroadcastCombiner';
import { RegisterNow } from '../game/Components/RegisterNow';
import { RegisterNewUserInGame } from '../game/Components/RegisterNewUserInGame';
import { ControlsInfo } from '../game/Components/ControlsInfo';
import { isNullOrUndefined } from 'util';
import { getSystemInfo } from '../utils/systemInfo';
// import { CoinsView } from '../game/Components/CoinsView';
import { ATMView } from '../game/Components/ATMView';
import NewMenuSideBar from '../game/Components/NewMenuSideBar';
import { InventoryView } from '../game/Components/InventoryView/InventoryView';
import InGameAssetPurchase from '../game/Components/MenuComponents/InGameAsssetPurchase';
import { loginAndAuthenticatePlayer } from '../hooks/ApiCaller';
import store from '../stores';
import { setPlayerAuthToken } from '../stores/AuthStore';
import NotificationMessageHelper from '../game/Components/NotificationMessageHelper';
import { EquipView } from '../game/Components/InventoryView/EquipView';
import WinnersReceipt from '../game/Components/MenuComponents/WinnersReceipt';
import { Loader } from './components/Loader/Loader';
import { SetGameLoadingState, SetSelectedGameServerURL, SetShowGameServersList } from '../stores/WebsiteStateStore';
import { ListGameServers } from '../utils/game_server_utils';
import { ServerListWindow } from '../game/Components/MenuComponents/ServerList/ServerListWindow';
import REACT_APP_LOBBY_WEBSOCKET_SERVER from '../game/configs';
// import TextView from '../game/Components/TextView';
// import { MyInfoIcon } from '../game/Components/InfoIcon';


const Backdrop = styled.div`
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  gap: 60px;
  align-items: center;
`

const Wrapper = styled.div`
  background: #D8DFE5;
  border-radius: 16px;
  padding: 36px 60px;
  box-shadow: 0px 0px 5px #0000006f;
`

const Title = styled.h1`
  font-size: 28px;
  color: #eee;
  text-align: center;
  padding-top: 20px
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 50px 0;
  align-items: center;
  justify-content: center;

  // img:hover {
  //   opacity: 0.3;
  // }
`

const NewContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 50px 0;
  // align-items: center;
  // justify-content: center;

  padding-left: 30vw;
  // padding-top: 5vh;
`

const ImageWraper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  opacity: 0.8;
  padding: 20px 20px 20px;
  width: 300px;
  align-items: center;
  justify-content: center;
`

const HeadingText = styled.h1`
  font-size: 2rem;
  letter-spacing: 1px;
  font-family:'Cooper Black', sans-serif;
  // font-family: Montserrat, sans-serif;
  font-weight: 400;
  text-transform: none;
  margin: 0px auto 0;
  color: aliceblue;
`

const ButtonView = styled(Button)`
  span {
    color: black;
    font-style: bold;
    font-size: 20px;
    font-family:'Cooper Black', sans-serif;
  }

  background-color: #9c341a;

  &:hover {
    background-color: #852d17;
  }

  width: 300px;
  height: 60px;
`;
// background: #A1A7B8;
const vertical = 'top';
const horizontal = 'center';
// const baseHeight = 70;
// const baseWidth = 40;


function Fighters() {
    const navigate = useNavigate();
    const { height, width } = Utils();
    // console.log("***********height", height, width)
    let baseWidth = width / 45;
    if (getSystemInfo()) {
        if (width > 1000) {
            baseWidth = width / 40;
        } else if (width > 800) {
            baseWidth = width / 35;
        } else if (width > 700) {
            baseWidth = width / 30;
        } else if (width > 600) {
            baseWidth = width / 20;
        } else {
            baseWidth = width / 14;
        }
    }
    const baseHeight = height / 14;
    // const baseWidth = width/45;
    console.log("***********baseheight", height, width, baseHeight, baseWidth)
    const bitFighterNFTData = useAppSelector((state) => state.bitFighters.nftData)
    const bitFightersTotalData = useAppSelector((state) => state.bitFighters.totalNFTData)
    console.log("--------total_data-------", bitFightersTotalData)

    const loggedInUserWalletAddress = useAppSelector((state) => state.web3store.userAddress)

    const gameStarted = useAppSelector((state) => state.playerDataStore.gameStarted)


    const bitfightersLoadedBool = useAppSelector((state) => state.bitFighters.loaded)

    console.log("current path 333 ", gameStarted)

    const [game_server, set_game_server] = useState("Washington_DC")

    const [playerSelectedBool, setPlayerSelectedBool] = useState(false);
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState("")
    const [playerSelected, setPlayerSelected] = useState<IPlayerData>();
    // const [gameStarted, setGameStarted] = useState(false);
    const [cardSelected, setCardSelected] = useState("")
    const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
    let noBitFighter = false;
    let boxWidth = 500;
    let carouselUI = null;
    let totalUI = null;
    let animationView = <>Animation View</>;
    let animationUI = null;
    const dispatch = useAppDispatch();

    const handleClose = () => {
        setSnackBarOpen(false);
    };

    const SelectGameServerAndLoadInfo = async (region: string) => {
        ListGameServers(region)
        console.log("in SelectGameServerAndLoadInfo", region)
        set_game_server(region);
    }

    const handlePlayerSelection = async (data: IPlayerData) => {
        console.log("--player selected.. data ", data)
        setPlayerSelected(data);
        setPlayerSelectedBool(true);

        store.dispatch(SetShowGameServersList(true));
        store.dispatch(SetCurrentGamePlayer(data));
        store.dispatch(setNickName(data.nick_name))


        setCardSelected(data.data.image)
        bootstrap.play_select_sound()

        console.log("--player selected.. calling login ")
        const playerAuthToken = await loginAndAuthenticatePlayer(data.user_wallet_address, data.minted_id);
        if (!isNullOrUndefined(playerAuthToken)) {
            store.dispatch(setPlayerAuthToken(playerAuthToken))
            ListGameServers(game_server)
        }


        // console.log("game start -> ", playerSelected)
    }

    const startGame = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();

        // if (bodyHtml) {
        //   bodyHtml.style.zoom = "80%";
        //   // bodyHtml.style.webkitTransform = "rotate(90deg)";
        // }
        // navigate("/game", { replace: true });
        const playerAuthToken = await loginAndAuthenticatePlayer(playerSelected!.user_wallet_address, playerSelected!.minted_id);
        if (!isNullOrUndefined(playerAuthToken)) {
            store.dispatch(setPlayerAuthToken(playerAuthToken))
            dispatch(SetGameStarted(true));

            store.dispatch(SetSelectedGameServerURL(REACT_APP_LOBBY_WEBSOCKET_SERVER));

            // dispatch(SetCurrentGamePlayer(playerSelected))

            // dispatch(setNickName(playerSelected!.nick_name))
            // const bodyHtml = document.querySelector('html');
            // console.log("bodyhtml ", bodyHtml);
            store.dispatch(SetGameLoadingState(true))
            bootstrap.launchGame(playerSelected)
        }

    }

    const carouselItems = [];
    let carouselItemsLength = 5;
    const nftDataCopy = [];
    const nftTotalData = [];

    useEffect(() => {
        window.addEventListener('beforeunload', beforeUnloadFun)
        function beforeUnloadFun() {
            localStorage.setItem("last_logged_out", new Date().getTime().toString())
        }
        return () => {
            // beforeUnloadFun()
            window.removeEventListener('beforeunload', beforeUnloadFun)
        }
    }, [])


    if (bitFighterNFTData.length == 0 && (loggedInUserWalletAddress !== "") && bitfightersLoadedBool) {
        carouselUI = <Title>  :( No Bit Fighters detected in this wallet. </Title>
        boxWidth = 400;
        noBitFighter = true;
    } else if (bitFighterNFTData.length == 0 && (loggedInUserWalletAddress !== "") && !bitfightersLoadedBool) {
        carouselUI = <Title> Loading.. </Title>
        boxWidth = 400;
        noBitFighter = true;
    } else if (loggedInUserWalletAddress === "") {
        carouselUI = <Title>  Checking for Bitfighters </Title>
        boxWidth = 400;
        noBitFighter = true;
    } else {

        for (let i = 0; i < bitFighterNFTData.length + carouselItemsLength - 1; i++) {
            if (i < bitFighterNFTData.length) {
                nftDataCopy[i] = bitFighterNFTData[i]
                nftTotalData[i] = bitFightersTotalData[i]
                continue
            } else {
                nftDataCopy[i] = bitFighterNFTData[i - bitFighterNFTData.length]
                nftTotalData[i] = bitFightersTotalData[i - bitFighterNFTData.length]
            }
        }

        // if (getSystemInfo() ) {
        //   if (width > 1000) {
        //     baseWidth = width/40;
        //   } else if (width > 800) {
        //     baseWidth = width/30;
        //   } else if (width > 600) {
        //     baseWidth = width/20;
        //   } else {
        //     baseWidth = width/14;
        //   }
        // }

        if (getSystemInfo()) {
            boxWidth = 300 * 1;
            carouselItemsLength = 1;
        } else {
            if (bitFighterNFTData.length >= 5) {
                boxWidth = 300 * 3;
                carouselItemsLength = 5;
            } else {
                boxWidth = 300 * bitFighterNFTData.length;
                carouselItemsLength = bitFighterNFTData.length;
            }
        }

        // console.log("@@#$%$#@#$$#@", bitFighterNFTData.length, boxWidth, carouselItemsLength, "#$%^&*(")

        let count = 0;
        let width = baseWidth;
        let height = baseWidth;
        for (let i = 0; i < bitFighterNFTData.length; i++) {
            // console.log("-----carouselItemsLength- i--", i, carouselItemsLength)
            count = 0;
            width = baseWidth;
            height = baseHeight;
            carouselItems.push(
                // <Card raised className="Banner" key={i.toString()} style={{backgroundColor: "#A1A7B8"}}>
                <Grid container spacing={0} >
                    {nftTotalData.slice(i, i + carouselItemsLength).map((da, index) => {
                        // console.log(" ---------- da -- index ----------- ", index, da)
                        if (carouselItemsLength === 5) {
                            if ((index === 1) || (index === 3)) {
                                height = baseHeight * 5;
                                width = baseWidth * 5;
                            } else if (index === 2) {
                                height = baseHeight * 6;
                                width = baseWidth * 6;
                            } else if ((index === 0) || (index === 4)) {
                                height = baseHeight * 4;
                                width = baseWidth * 4;
                            }
                        } else if (carouselItemsLength === 1 || carouselItemsLength === 2) {
                            height = baseHeight * 6;
                            width = baseWidth * 6;
                        } else if (carouselItemsLength === 3) {
                            if ((index === 2)) {
                                height = baseHeight * 5;
                                width = baseWidth * 5;
                            } else if (index === 1) {
                                height = baseHeight * 6;
                                width = baseWidth * 6;
                            } else if ((index === 0)) {
                                height = baseHeight * 5;
                                width = baseWidth * 5;
                            }
                        } else if (carouselItemsLength === 4) {
                            if ((index === 1) || (index === 2)) {
                                height = baseHeight * 6;
                                width = baseWidth * 6;
                            } else if ((index === 0) || (index === 3)) {
                                height = baseHeight * 4;
                                width = baseWidth * 4;
                            }
                        }
                        // console.log('height , width, ', height, width, baseHeight, baseWidth)

                        return (
                            <ImageWraper key={uuidv4()}>
                                <HeadingText>{da.nick_name}</HeadingText>
                                <img
                                    className="imageSelector"
                                    src={da.data.image}
                                    alt={"Hello"}
                                    loading="lazy"
                                    key={uuidv4()}
                                    style={{
                                        height: `${height}px`,
                                        width: `${width}px`,
                                    }}
                                    onClick={() => handlePlayerSelection(da)}
                                />
                            </ImageWraper>
                        )
                    })}
                </Grid>
            )
        }

        carouselUI =
            <div >
                <Carousel
                    navButtonsAlwaysVisible
                    autoPlay={false}
                    animation="slide"
                    cycleNavigation
                    key={uuidv4()}
                >
                    {
                        carouselItems
                    }
                </Carousel>
            </div>
    }

    animationView = <div>
        <div style={{ position: 'absolute' }}>
            <Tooltip title="Click to go back">
                <CancelIcon
                    color='disabled'
                    style={{ float: "left" }}
                    fontSize='large'
                    onClick={() => {
                        setPlayerSelectedBool(false)
                        store.dispatch(SetShowGameServersList(false));
                        bootstrap.play_select_sound()
                    }}
                    key={uuidv4()}
                />
            </Tooltip>

        </div>

        <img
            className="imageSelector"
            src={cardSelected}
            alt={"Hello"}
            loading="lazy"
            // key={(100).toString()}
            style={{
                height: (baseHeight * 7).toString() + 'px',
                width: (baseWidth * 7).toString() + 'px',
            }}
            key={uuidv4()}
        />
    </div>

    if (gameStarted) {
        totalUI = <>
            {/* <FightersAttrInfo /> */}
            {/* <HealthBars /> */}
            {/* <BroadCastingMessage /> */}
            {/* <FightersAttrInfo4 /> */}
            {/* <CoinsView /> */}
            <NotificationMessageHelper />
            <NewMenuSideBar />
            <InventoryView />
            <EquipView />
            <BroadCastCombiner2 />
            <InGameAssetPurchase />
            <ATMView />
            <BroadcastingAnnouncement />
            <RegisterNow />
            <RegisterNewUserInGame />
            <ControlsInfo />
            {/* <BroadcastingAnnouncement /> */}

            <Chat />
            {/* <TextView /> */}
            <PlayersInfo />
            <QueueAddInfoWindow />
            <WinnersReceipt />

            <SendingFriendRequest />
        </>
    } else {
        totalUI = <>
            <Title>
                <div className="cooper-black-tab" style={{
                    fontSize: '30px'
                }}>Your Bitfighters </div>
            </Title>
            <Content>
                <Box sx={{
                    width: boxWidth,
                }}
                >
                    {carouselUI}
                </Box>
                {noBitFighter
                    ? <div>
                        <Link
                            className="primary"
                            to="/mint"
                        >
                            <ButtonView
                                variant="contained"
                            // style={{
                            //   width: 200,
                            // }}
                            >
                                <span>
                                    Mint BitFighters
                                </span>

                            </ButtonView>
                        </Link>
                    </div>
                    : <div style={{
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <LoadingButton
                            variant="contained"
                            color="info"
                            onClick={(event) => startGame(event)}
                            loading={!playerSelectedBool}
                            loadingIndicator="Select one"
                        // style={{
                        //   width: '200px'
                        // }}
                        >
                            Start Game
                        </LoadingButton>
                        {
                            (!isNullOrUndefined(localStorage.getItem("connected_matic_network"))) &&
                            <Link
                                className="primary"
                                to="/mint"
                            >
                                <ButtonView
                                    variant="contained"
                                    color="info"
                                    style={{
                                        // width: 200,
                                        marginTop: '30px'
                                    }}
                                >
                                    <span>
                                        Mint BitFighters
                                    </span>

                                </ButtonView>
                            </Link>
                        }

                    </div>}

            </Content>
        </>

        animationUI = <>
            <NewContent>
                <Box sx={{
                    width: baseWidth * 7,
                }}
                >
                    {animationView}
                </Box>



                {/* <Box sx={{ minWidth: 200 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Servers</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={game_server}
                    label="Age"
                    onChange={(event: SelectChangeEvent) => {
                      SelectGameServerAndLoadInfo(event.target.value as string)
                    }}
                    style={{
                      width: '300px',
                    }}
                  >
                    <MenuItem value={"Washington_DC"}>Washington_DC</MenuItem>
                  </Select>
                </FormControl>
              </Box> */}

                <ButtonView
                    variant="contained"
                    color="info"
                    onClick={(event) => startGame(event)}
                >
                    <span>
                        Start Game
                    </span>
                </ButtonView>

            </NewContent>
        </>
    }

    return (
        <div>
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={snackBarOpen}
                onClose={handleClose}
                message={snackBarMessage}
                key={vertical + horizontal}
            />
            <ServerListWindow />
            <Loader />
            {(!playerSelectedBool || gameStarted) ? totalUI : animationUI}
        </div>
    )
}
export default Fighters;