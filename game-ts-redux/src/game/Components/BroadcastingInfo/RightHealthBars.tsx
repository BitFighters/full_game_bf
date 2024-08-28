
import { useAppSelector } from "../../../hooks";
import styled from 'styled-components'
import ProgressBar from 'react-bootstrap/ProgressBar';

const Backdrop = styled.div`
`

const Wrapper = styled.div`
  // display: flex;
  // justify-content: center;
  // background-color: aliceblue;
  // border-radius: 10px;
`

const TextDiv = styled.div`
  // font-size: 2rem;
  // font-family: Montserrat, sans-serif;
  // font-weight: 500;
  // text-transform: none;
  // margin: 0px auto 0;
  // color: black;
  // position: fixed;
  // width: 40%;
  border-style: solid;
  border-width: 10px;
  // right: 0%;
`

export function RightHealthBars() {
  const fightersInfo = useAppSelector((state) => state.userActionsDataStore.fightersInfo)
  // console.log("inAppSelector --", fightersInfo)
  let healthBarColorString = ""
  if (fightersInfo.player2.health > 70) {
    healthBarColorString = "success"
  }
  if (fightersInfo.player2.health < 70 && fightersInfo.player2.health > 30) {
    healthBarColorString = "warning"
  }
  if (fightersInfo.player2.health < 30) {
    healthBarColorString = "error"
  }
  return (
    <Backdrop>
      <Wrapper>
                <TextDiv>
          <ProgressBar 
            variant={`${healthBarColorString}`} 
            now={fightersInfo.player2.health} 
            min={0} 
            max={fightersInfo.player2.max_health} 
            style={{
              padding: '1px'
            }}
          />
          <ProgressBar 
            variant="info" 
            now={fightersInfo.player2.stamina} 
            min={0} 
            max={fightersInfo.player2.max_stamina}
            style={{
              padding: '1px'
            }}
          />
        </TextDiv>
      </Wrapper>
    </Backdrop>
  )
}