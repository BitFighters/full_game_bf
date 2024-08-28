
import { useAppSelector } from "../../../hooks";
import styled from 'styled-components'
import ProgressBar from 'react-bootstrap/ProgressBar';



const Backdrop = styled.div`
`

const Wrapper = styled.div`
`

const TextDiv = styled.div`
  border-style: solid;
  border-width: 5px;
`

export function LeftHealthBars() {
  const fightersInfo = useAppSelector((state) => state.userActionsDataStore.fightersInfo)
  // const [buffer, setBuffer] = useState(10);
  // console.log("inAppSelector --", fightersInfo)
  let healthBarColorString = ""
  if (fightersInfo.player1.health > 70) {
    healthBarColorString = "success"
  }
  if (fightersInfo.player1.health < 70 && fightersInfo.player2.health > 30) {
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
            now={fightersInfo.player1.health} 
            min={0} 
            max={fightersInfo.player1.max_health} 
            style={{
              padding: '1px'
            }}
          />
          <ProgressBar 
            variant="info" 
            now={fightersInfo.player1.stamina} 
            min={0} 
            max={fightersInfo.player1.max_stamina}
            style={{
              padding: '1px'
            }}
          />
        </TextDiv>
      </Wrapper>
    </Backdrop>
  )
}