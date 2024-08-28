import React, { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../hooks';
import { Box, Button, CircularProgress, FormControl, Grid, ImageList, ImageListItem, InputLabel, MenuItem, Modal, Select, SelectChangeEvent, Snackbar, Tooltip, tooltipClasses, TooltipProps, Typography } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { SetCurrentGamePlayer, setNickName } from '../stores/PlayerData';
import { IPlayerData } from '../game/characters/IPlayer';
import { fetchNFTsFromDB, loginAndAuthenticatePlayer, updateNFTsInDB, updateSingleBfInDB } from '../hooks/ApiCaller';
import store from '../stores';
import { SetFailureNotificationBool, SetFailureNotificationMessage } from '../stores/NotificationStore';
import { registerBitfighter } from '../contract';
import { fetchAllNFTsFromDbEntries } from '../hooks/FetchNFT';
import { setTotalNFTData, setNFTDetails } from '../stores/BitFighters';

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


const FixedForm = styled.div`
  position: absolute;
  margin: 50%;
  transform: translate(-50%, -50%);

  background: #d2d3e1;
  width: 400px;
  height: 30vh;

  opacity: 0.9;

  border-radius: 20px;



  label {
    font-size: 20px;
    font-family:'Cooper Black', sans-serif;
    letter-spacing: 0.5px;
    margin-left: 5px;
  }

  // h2 {
  //   font-family:'Cooper Black', sans-serif;
  //   font-style: bold;
  //   font-size: 30px;
  //   color: black;
  //   line-height: 75%;
  //   margin: 10px;
  // }

  input[type="text"] {
    padding: 0;
    padding-left: 3px;
    background-color: transparent;
    outline: 0;
    border: 0;
    border-bottom: 3px solid #363636;
    max-width: 200px;
    text-align: center;
    font-family: "Cooper Black";
    font-size: 16px;
    color: #363636;;
  }

  input[type="number"] {
    padding: 0;
    padding-left: 3px;
    background-color: transparent;
    outline: 0;
    border: 0;
    border-bottom: 3px solid #363636;
    max-width: 40px;
    text-align: center;
    font-family: "Cooper Black";
    font-size: 16px;
    color: #363636;;
  }
`


const BoxWrapper2 = styled(Box)`
  // overflow-y: scroll;
  // width: 33vw;
  // position: relative;

  position:absolute;
  width: 33vw;
  // opacity: 100%;
  // top: 10%;
  // left: 33%;
  // background-color:#2d2a2a;
  // border-radius: 20px;

  img {
    margin-top: 50px;
  }

  h2 {
    font-family:'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 30px;
    color: black;
    line-height: 75%;
    margin: 10px;
    margin-top: 25px;
  }
`;


const ImageView = styled.div`
  h1 {
    font-family:'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 30px;
    color: aliceblue;
    line-height: 75%;
    // margin: 10px;
    // margin-top: 25px;
  }

  img {
    margin-top: 10px;
  }
`



function FightersNewCenterPart() {

  const selectedPlayer = useAppSelector(
    (state) => state.playerDataStore.current_game_player_info
  );

  const gameStarted = useAppSelector((state) => state.playerDataStore.gameStarted)



  const [formNickNameame, setFormNickName] = useState("")
  const [formLuckyNumber, setFormLuckyNumber] = useState(1)


  const [registerProcessRunning, setRegisterProcessRunning] = useState(false)

  const [playerSelected, setPlayerSelected] = useState<IPlayerData>();
  const [cardSelected, setCardSelected] = useState("")

  const registerFormValidate = async () => {
    setRegisterProcessRunning(true)

    console.log("in ---- register fn... ", formLuckyNumber, formNickNameame, playerSelected?.minted_id)

    if (!(formLuckyNumber > 0 && formLuckyNumber < 100)) {
      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage("Lucky Number should be 0-100"))
      setRegisterProcessRunning(false)
      return
    }

    if (!(formNickNameame.length > 0 && formNickNameame.length < 13)) {
      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage("Nick name should be of length 1-12"))
      setRegisterProcessRunning(false)
      return
    }

    if (playerSelected && playerSelected?.minted_id === 0) {
      return
    }

    if (!playerSelected) {
      return
    }

    // update in smart contract. and then update the db
    // then fetch data from db
    // and udate the UI

    const registered = await registerBitfighter(formNickNameame, formLuckyNumber, playerSelected?.minted_id)
    if (registered.error === 1) {
      //
      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage(registered.message + "\n" +  registered.error_data))

    } else {
      //
      await updateSingleBfInDB(store.getState().web3store.userAddress, playerSelected.minted_id);
      const result = await fetchNFTsFromDB(store.getState().web3store.userAddress);
      console.log("-------dataofnfts--*******-- .", result);

      const dataOfNFTS = await fetchAllNFTsFromDbEntries(result.message)
      console.log("dataofnfts -- ", dataOfNFTS )

      store.dispatch(setTotalNFTData(result.message))
      store.dispatch(setNFTDetails(dataOfNFTS))

      console.log("--dataofnfts-", playerSelected.minted_id)

      for (let i = 0; i < result.message.length; i++) {
        console.log("--dataofnfts-", playerSelected.minted_id, result.message[i].minted_id)
        if (playerSelected.minted_id === result.message[i].minted_id) {
          store.dispatch(SetCurrentGamePlayer(result.message[i]));
        }
      }
    }

    setRegisterProcessRunning(false)
    
  }


  return(

    <div>
      {!gameStarted && <BoxWrapper2>
              {
                (cardSelected !== "" && selectedPlayer.nick_name === "")?
                  <FixedForm>
                    <h2>
                      Register your Fighter
                    </h2>

                    <label htmlFor="nick_name" style={{
                      marginTop: '20px'
                    }}> Name: </label>
                    <input
                      id="nick_name"
                      type="text"
                      placeholder='up to 12 letters'
                      value={formNickNameame}
                      onChange={(e) => {
                        setFormNickName(e.target.value);
                      }}
                      required
                    />
                    <br />

                    <label htmlFor="lucky_number" style={{
                      marginTop: '20px'
                    }}> Lucky #: </label>
                    <input
                      id="lucky_number"
                      type="text"
                      placeholder='(1-100)'
                      onChange={(e) => {
                        setFormLuckyNumber(parseInt(e.target.value));
                      }}
                      required
                    />

                    { !registerProcessRunning? 
                    <ButtonView style={{marginTop: '40px'}}
                      onClick={() => {
                        registerFormValidate()
                      }}
                      >
                        <span>
                          Submit!
                      </span>
                    </ButtonView>: 
                    <ButtonView style={{marginTop: '40px'}}>
                      <span>
                        <CircularProgress />
                      </span>
                    </ButtonView>
                    
                    
                    }
                  </FixedForm>
                :<></>
              }
              {
                cardSelected !== ""?
                <ImageView>
                  <h1>
                    {playerSelected?.nick_name !== ""? playerSelected?.nick_name: ""}
                  </h1>
                  <img
                    className="imageSelector"
                    src={cardSelected}
                    alt={"Hello"}
                    loading="lazy"
                    style={{
                      height: (500).toString()+'px',
                      width: (300).toString()+'px',
                    }}
                    key={uuidv4()}
                  />
                </ImageView>
                  :<> </>
              }
      </BoxWrapper2>}
    </div>
  )
}
export default FightersNewCenterPart;
