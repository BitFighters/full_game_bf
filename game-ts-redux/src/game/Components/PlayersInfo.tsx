// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */
import { useAppDispatch, useAppSelector } from "../../hooks"
import styled from 'styled-components'
import { Box } from "@mui/material"
import { v4 as uuidv4 } from 'uuid';
import CancelIcon from '@mui/icons-material/Cancel';
import { setInfoButtonClicked } from "../../stores/PlayerData";
import Utils from "../../landing-page/Utils";

const Backdrop = styled.div`
  position: fixed;
  top: 40;
  right: 0;
  max-height: 80%;
  max-width: 40%;
`

const Wrapper = styled.div`
  position: relative;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
`

const InfoBox = styled(Box)`
  height: 100%;
  width: 100%;
  overflow: auto;
  opacity: 1;
  background: #AEEEEA;
  border: 1px solid #00000029;

  img {
    height: 70%;
    padding: 20px;
  }
`

export function PlayersInfo() {
  // const InfoButtonClicked = useAppSelector((state) => state.playerDataStore.info_button_clicked)
  const InfoButtonClicked = false
  const PlayerSelectedInfo = useAppSelector((state) => state.playerDataStore.player_selected_all_info)
  const dispatch = useAppDispatch();
  const { height, width } = Utils();
  // console.log("player selected info .. ", PlayerSelectedInfo)

  return (
    <div>
      {
        InfoButtonClicked &&
        <div>
          <Backdrop style={{
            height: `${height - 100}px`,
            width: `${400}px`
          }}>
            <Wrapper>
              <InfoBox>
                <CancelIcon
                  color='disabled'
                  style={{ float: "left", color: '#2c2c2c' }}
                  fontSize='large'
                  onClick={() => {
                    dispatch(setInfoButtonClicked(false))
                  }}
                  key={uuidv4()}
                />
                <img
                  src={PlayerSelectedInfo.data.image}
                  key={uuidv4()}
                  alt="img"
                />
              </InfoBox>
            </Wrapper>
          </Backdrop>

        </div>
      }
    </div>
  )
}