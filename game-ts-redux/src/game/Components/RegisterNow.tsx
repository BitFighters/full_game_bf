import { Button } from "@mui/material";
import styled from "styled-components"
import { isNullOrUndefined } from "util";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { ChangeRegisterShowInGame } from "../../stores/UserWebsiteStore";


const Wrapper = styled.div`
  position:fixed;
  right:0;
  bottom:0;
  z-index:1;
`

const TextBox = styled.div`
  overflow: auto;
  opacity: 0.9;
  background: #2c2c2c;
  border: 5px solid #000000;
  border-radius: 10px;
  padding: 20px;

  span {
    font-family: Monospace;
    font-style: bold;
    font-size: 20px;
    color: aliceblue;
  }

  h2 {
    font-family: Monospace;
    font-style: bold;
    font-size: 30px;
    color: white;
  }
`

export function RegisterNow() {
  const web3ConnectedUser = useAppSelector((state) => state.web3store.web3Connected);
  const dispatch = useAppDispatch();
  // const [regBtnClicked, setregBtnClicked] = useState(false);
  // console.log("web3ConnectedUser ", web3ConnectedUser )

  const registerButtonClicked =() => {
    console.log("register button clicked..")
    dispatch(ChangeRegisterShowInGame(true))
  }

  return(
    <div> 
      {
        (!web3ConnectedUser && isNullOrUndefined(localStorage.getItem("web2_email_address")))&& 
        <Wrapper>
          <TextBox onClick={() => registerButtonClicked()}>
            <span>Save your bitfighter.</span>
            <br />
            <Button><span> Register Now </span></Button>
          </TextBox>
        </Wrapper>
      }
    </div>
    
  )
}