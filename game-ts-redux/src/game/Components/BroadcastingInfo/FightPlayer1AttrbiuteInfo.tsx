import { Grid } from "@mui/material";
import styled from "styled-components";
import { useAppSelector } from "../../../hooks";
import { v4 as uuidv4 } from 'uuid';

const Wrapper = styled.div`
`

const TextWrapper = styled.h5`
  color: aliceblue;
  font-size: 32px;
  padding: 10px;
  background-color: black;
`

const Imagewrapper = styled.div`
  // background-color: white;
`

export function FightPlayer1AttributeInfo() {
  const fightersInfo = useAppSelector((state) => state.userActionsDataStore.fightersInfo)
  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Wrapper>
          <TextWrapper>
            {fightersInfo.player1.nick_name}
          </TextWrapper>
          <Imagewrapper>
            <div>
              <img
                src={fightersInfo.player1.profile_image}
                style={{
                  height: '150px',
                  width: '150px',
                }}
              />
            </div>
          </Imagewrapper>
        </Wrapper>
      </Grid>
      <Grid item xs={4}>

          <div key={uuidv4()} style={{
            color: '#C1D5EE',
            padding: '10px',
            backgroundColor: 'aliceblue'
          }}>
            <table style={{
              width: `100%`
            }}>
              <tbody>
                <tr key={uuidv4()}>
                  <td>Defense</td>
                  <td>{fightersInfo.player1.defense}</td>
                </tr>
                <tr key={uuidv4()}>
                  <td>Punch</td>
                  <td>{fightersInfo.player1.punchpower}</td>
                </tr>
                <tr key={uuidv4()}>
                  <td>Kick</td>
                  <td>{fightersInfo.player1.kickpower}</td>
                </tr>
                <tr key={uuidv4()}>
                  <td>Speed</td>
                  <td>{fightersInfo.player1.speed}</td>
                </tr>
                <tr key={uuidv4()}>
                  <td>Health</td>
                  <td>{fightersInfo.player1.health}</td>
                </tr>
                <tr key={uuidv4()}>
                  <td>Stamina</td>
                  <td>{fightersInfo.player1.stamina}</td>
                </tr>
              </tbody>
            </table>
          </div>

      </Grid>

      <Grid item xs={4}>
      </Grid>
    </Grid>
  )
}