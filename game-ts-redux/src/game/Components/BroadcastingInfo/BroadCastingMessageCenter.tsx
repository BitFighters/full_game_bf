import { useAppSelector } from "../../../hooks";
import styled from 'styled-components'

const Backdrop = styled.div`
  position: fixed;
  text-align: center;
  margin: auto;
  width: 20%;
  margin: auto;
  left: 40%;
`

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  background-color: aliceblue;
  border-radius: 10px;
`

const TextDiv = styled.div`
  font-size: 2rem;
  font-family: Montserrat, sans-serif;
  font-weight: 500;
  text-transform: none;
  margin: 0px auto 0;
  color: black;
`

export function BroadCastingMessageCenter() {
  const notificationFromServerBool = useAppSelector((state) => state.userPathStore.GotNotificationFromServer)
  const notificationFromServerMsg = useAppSelector((state) => state.userPathStore.NotificationMessageFromServer)
  // console.log("in broadcasting thing..", notificationFromServerBool, notificationFromServerMsg)
  return (
    <Backdrop>
      <Wrapper>
      {
        notificationFromServerBool&& 
        <TextDiv>
          {notificationFromServerMsg}
        </TextDiv>
      }
        {/* <TextDiv>
          Start the fight
        </TextDiv> */}
      </Wrapper>
    </Backdrop>
  )
}