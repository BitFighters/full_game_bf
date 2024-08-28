// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { useAppDispatch, useAppSelector } from "../../hooks"
import styled from 'styled-components'
import { Box } from "@mui/material"
// import { v4 as uuidv4 } from 'uuid';
// import CancelIcon from '@mui/icons-material/Cancel';
// import Utils from "../../landing-page/Utils";
// import { FriendButtonClickedInInfoMenu } from "../../stores/UserActions";
import { fetchUserDetails, sendFriendRequest } from "../../hooks/ApiCaller";
import { ChangeUserData, USER_DETAILS } from "../../stores/UserWebsiteStore";
// import MyCustomSnackBar from "../../utils/MyCustomSnackBar";
import { useState } from "react";
// import { LoadingButton } from "@mui/lab";
// import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import phaserGame from "../../PhaserGame";
import Bootstrap from "../scenes/Bootstrap";
// import { isNullOrUndefined } from "util";
// import ClearIcon from '@mui/icons-material/Clear';

const Backdrop = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  max-height: 25%;
  max-width: 30%;
`

const Wrapper = styled.div`
  position: relative;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
`

const FriendRequestBox = styled(Box)`
  width: 100%;
  overflow: auto;
  opacity: 1;
  background: #cfe2f3;
  border: 1px solid #00000029;
  border-radius: 50px;
  padding: 20px;

  h2 {
    font-family: Monospace;
    font-style: bold;
    font-size: 21px;
  }
`

export function SendingFriendRequest() {
  // const [snackBarMessage, setSnackBarMessage] = useState("");
  // const [errSnackBarMessage, setErrSnackBarMessage] = useState("")
  const friendButtonMenuClicked = useAppSelector((state) => state.userActionsDataStore.friendButtonClickedInInfoMenu)
  const friendsDetails = useAppSelector((state) => state.userPathStore.User_Data)
  const PlayerSelectedInfo = useAppSelector((state) => state.playerDataStore.player_selected_all_info)
  const [buttonLoading, setButtonLoading] = useState(false);
  const dispatch = useAppDispatch();
  // const { height, width } = Utils();
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;
  // console.log("--- friendButtonMenuClicked ---", friendButtonMenuClicked)
  // console.log("SendingFriendRequest-PlayerSelectedInfo", PlayerSelectedInfo)
  // console.log("SendingFriendRequest-PlayerSelectedInfo", friendsDetails)

  const addFriendButtonClick = async () => {
    console.log("sending friend request")
    setButtonLoading(true)
    await sendFriendRequest(PlayerSelectedInfo.user_wallet_address, PlayerSelectedInfo.minted_id)
    const user_all_data: USER_DETAILS = await fetchUserDetails();
    // if (!user_all_data) return;
    dispatch(ChangeUserData(user_all_data))
    setButtonLoading(false)
    bootstrap.play_err_sound()
  }

  return (
    <div>
      {
        friendButtonMenuClicked &&
        <div></div>
        // <div>
        //   <Backdrop >
        //     <Wrapper>
        //       <FriendRequestBox>
        //         <CancelIcon
        //           color='disabled'
        //           style={{ float:"left", color: '#2c2c2c' }}
        //           fontSize='large'
        //           onClick={() => {
        //             dispatch(FriendButtonClickedInInfoMenu(false))
        //           }}
        //           key={uuidv4()}
        //         />

        //         {
        //           !isNullOrUndefined(friendsDetails) && friendsDetails.sent.includes(PlayerSelectedInfo.user_wallet_address+ ":"+ PlayerSelectedInfo.minted_id+ ":" + PlayerSelectedInfo.nick_name) ?
        //               <div style={{
        //                 display: 'flex',
        //                 flex: 1,
        //                 flexDirection: 'row',
        //                 alignContent: 'center',
        //                 justifyContent: 'center',
        //                 gap:"20px"
        //               }}>
        //                 <h4 style={{
        //                   borderRadius: '2px',
        //                   paddingLeft: '15px'
        //                 }}> Request Sent </h4> 
        //                 <DoneOutlineIcon style={{
        //                   color: 'green',
        //                 }} />
        //               </div>:
        //               <div>
        //                 {
        //                   !friendsDetails.friends.includes(PlayerSelectedInfo.user_wallet_address+ ":"+ PlayerSelectedInfo.minted_id+ ":" + PlayerSelectedInfo.nick_name) ?
        //                       <div>
        //                         <h2>
        //                           Do you want to add {PlayerSelectedInfo.nick_name} as a friend ?
        //                         </h2>
        //                         <LoadingButton 
        //                           variant="contained" 
        //                           color="info"
        //                           onClick={() => addFriendButtonClick()}
        //                           loading={buttonLoading}
        //                           loadingIndicator="Adding..."
        //                           style = {{
        //                             borderRadius: '20px'
        //                           }}
        //                         >
        //                           Add Friend
        //                         </LoadingButton>
        //                       </div>: 
        //                       <div>
        //                         <h2>
        //                           <span style={{
        //                             color: 'red'
        //                           }}> {PlayerSelectedInfo.nick_name} </span> is already a friend.
        //                         </h2>
        //                       </div>
        //                 }
        //               </div>
        //         }
        //       </FriendRequestBox>
        //     </Wrapper>
        //   </Backdrop>

        // </div>
      }
    </div>
  )
}