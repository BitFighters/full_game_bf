import styled from "styled-components";
import { useAppSelector } from "../hooks";

const Backdrop = styled.div`
  position: absolute;
  bottom: 20px;
  width: 100%;
  background-color: #111B28;
  align-items: center;
  justify-content: center;
  background-color: green;
  h4 {
    color: white;
  }
`

function BottomTextView() {
  // const notificationFromServerBool = useAppSelector((state) => state.userPathStore.GotNotificationFromServer)
  const notificationFromServerMsg = useAppSelector((state) => state.userPathStore.LoggerMessage)
  return(
    <Backdrop>
      <h4>
        {notificationFromServerMsg}
      </h4>
    </Backdrop>
  )
}

export default BottomTextView;