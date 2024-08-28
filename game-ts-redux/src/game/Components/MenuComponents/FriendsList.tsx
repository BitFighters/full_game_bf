// import { useAppDispatch, useAppSelector } from "../../../hooks"
// import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
// import InboxIcon from '@mui/icons-material/Inbox';
// import DraftsIcon from '@mui/icons-material/Drafts';
import { v4 as uuidv4 } from 'uuid';
// import { Button } from "@mui/material";
// import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// import { acceptFriendRequest, fetchUserDetails } from "../../../hooks/ApiCaller";
// import { ChangeUserData, USER_DETAILS } from "../../../stores/UserWebsiteStore";
// import phaserGame from "../../../PhaserGame";
// import Bootstrap from "../../scenes/Bootstrap";
// import { arrayBuffer } from "node:stream/consumers";
import { getEllipsisTxt } from "../../../utils";
import { isNullOrUndefined } from 'util';
import { useAppSelector } from '../../../hooks';


function lotsOfStringGenrator() {
  const arr: string[] = []
  for (let i = 0; i< 100; i++) {
    arr.push(uuidv4())
  }
  return arr;
}

export default function FriendsList() {
  // const friendsDetails = useAppSelector((state) => state.userPathStore.User_Data)
  // const dispatch = useAppDispatch();
  // const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;
  const lotsOfstrings = lotsOfStringGenrator()
  const user_data = useAppSelector((state) => state.userPathStore.User_Data)
  // console.log("update user data --", user_data)


  // const accptFriendButtonClick = async(user_wallet_string: string) => {
  //   console.log("sending friend request")
  //   await acceptFriendRequest(user_wallet_string)
  //   let user_all_data: USER_DETAILS = await fetchUserDetails();
  //   if (!user_all_data) return;
  //   dispatch(ChangeUserData(user_all_data))
  //   bootstrap.play_err_sound()
  // }

  return (
    <div>
        <List>
        {
          !isNullOrUndefined(user_data)
          && user_data.friends.map(details => {
          // lotsOfstrings.map(user_wallet_address => {
            return (
              <ListItem disablePadding key={uuidv4()} >
                <ListItemButton style={{
                  display: "flex",
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '15px'
                }}>
                  {
                    (details.friends_profile_image !== "") ?
                    <img
                      className='hexagon-icon'
                      src={details.friends_profile_image}
                      style={{
                        height: '60px',
                        width: '60px',
                      }}
                      alt="Hero"
                    />:
                    <img
                      className='hexagon-icon'
                      src="https://i.picsum.photos/id/0/5616/3744.jpg?hmac=3GAAioiQziMGEtLbfrdbcoenXoWAW-zlyEAMkfEdBzQ"
                      style={{
                        height: '60px',
                        width: '60px',
                      }}
                    />
                  }
                  <ListItemText primary={
                    <span style={{
                      color: "aliceblue"
                    }}>
                      {details.friends_nick_name}
                      
                    </span>
                  } 
                  secondary={getEllipsisTxt(details.other_user_address.split(":")[0])} 
                  />
                  
                  <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '10px'
                  }}>
                    <InfoOutlinedIcon style={{
                      color: '#85BAEA',
                    }} />
                    <CloseIcon style={{
                      color: 'red'
                    }} />
                  </div>

                </ListItemButton>
                <Divider />
                
              </ListItem>
            )
          })
        }
          </List>
    </div>
  )
}