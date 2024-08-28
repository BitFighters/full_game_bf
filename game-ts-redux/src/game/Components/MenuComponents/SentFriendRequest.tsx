import { useAppDispatch, useAppSelector } from "../../../hooks"
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { v4 as uuidv4 } from 'uuid';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import phaserGame from "../../../PhaserGame";
import Bootstrap from "../../scenes/Bootstrap";
import { isNullOrUndefined } from "util";
import { getEllipsisTxt } from "../../../utils";

export default function SentFriendRequests() {
  const friendsDetails = useAppSelector((state) => state.userPathStore.User_Data)
  const dispatch = useAppDispatch();
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;

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
      {/* <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}> */}
      <Box style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: 'center'
      }} >
        <List>
        {
          !isNullOrUndefined(friendsDetails) && friendsDetails.sent.map(details => {
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
      </Box>
    </div>
  )
}