import { useAppSelector } from "../../../hooks";
import styled from 'styled-components'

const Backdrop = styled.div`
  position: fixed;
  // text-align: center;
  // margin: auto;
  top: 30%;
  // background-color: aliceblue;
  width: 100%;
  // left: 40%;
`

const Wrapper = styled.div`
`

const TextDiv = styled.div`
  color: red;
`

export function BroadcastingAnnouncement() {
  const notificationFromServerBool = useAppSelector((state) => state.userPathStore.GotFightAnnouncementFromServer)
  const notificationFromServerMsg = useAppSelector((state) => state.userPathStore.FightAnnouncementMessageFromServer)
  // console.log("BroadcastingAnnouncement", notificationFromServerBool, notificationFromServerMsg)
  return (
    <Backdrop>
      <Wrapper>
      {
        notificationFromServerBool&& 
        <TextDiv className="text_shadows_fight_announcement" style={{
          // margin: `200px`,
          // padding: '200px'
        }}>
          {notificationFromServerMsg}
        </TextDiv>
      }
        {/* <TextDiv className="text_shadows_fight_announcement">
          Fight!
        </TextDiv> */}
      </Wrapper>
    </Backdrop>
  )
}