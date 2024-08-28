import { Alert, AlertTitle, Button, FormControl, IconButton, Snackbar, TextField } from "@mui/material";
import { useState } from "react";
import styled from "styled-components"
import { isNullOrUndefined } from "util";
import { useAppDispatch, useAppSelector } from "../../hooks";
import * as EmailValidator from 'email-validator';
import { assignBitfighterToEmail, signUpWeb2User } from "../../hooks/ApiCaller";
import { Login } from "../../stores/Web3Store";
import { useNavigate } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close'
import { ChangeRegisterShowInGame } from "../../stores/UserWebsiteStore";
import { TurnMouseClickOff } from "../../stores/UserActions";

const Wrapper = styled.div`
  position:absolute;
  text-align: center;
  width: 60%;
  left:20%;
  top:20%;
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

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 20px 0;
  align-items: center;
  justify-content: center;

  img {
    border-radius: 8px;
    height: 120px;
  }
`

interface SignupFormInput {
  new_name: string;
  email : string;
  password: string;
  repeat_password: string;
}

const vertical= 'bottom';
const horizontal = 'center';

export function RegisterNewUserInGame() {
  const navigate = useNavigate();
  const web3ConnectedUser = useAppSelector((state) => state.web3store.web3Connected);
  const registerOptionShow = useAppSelector((state) => state.userPathStore.registerShowInGame)
  const [regBtnClicked, setregBtnClicked] = useState(false);
  console.log("web3ConnectedUser ", web3ConnectedUser )
  const [errsnackBarOpen , setErrSnackBarOpen] = useState(false);
  const [errSnackBarMessage, setErrSnackBarMessage] = useState("");
  const dispatch = useAppDispatch()

  const [signupFormFieldInput, setsignupFormFieldInput] = useState<SignupFormInput>({
    email: "",
    password: "",
    repeat_password: "",
    new_name: "",
  });

  const errSnackBarHandleClose = () => {
    setErrSnackBarOpen(false);
  };

  const signUpBtnPressed = async () => {
    console.log("sign up btn pressed...", signupFormFieldInput)
    if (!EmailValidator.validate(signupFormFieldInput.email)) {
      setErrSnackBarOpen(true)
      setErrSnackBarMessage("Not Valid Email")
      return;
    }

    if (signupFormFieldInput.password !== signupFormFieldInput.repeat_password) {
      setErrSnackBarOpen(true)
      setErrSnackBarMessage("Passwords do not Match");
      return;
    }
    const res = await signUpWeb2User(signupFormFieldInput.email, signupFormFieldInput.password)
    console.log("res --------", res);

    if (isNullOrUndefined(res)) {
      setErrSnackBarOpen(true)
      setErrSnackBarMessage("Some error occured while");
      return;
    }
    dispatch(Login(signupFormFieldInput.email));
    localStorage.setItem("web2_email_address", signupFormFieldInput.email);
    const temp = localStorage.getItem("web2_wallet_address");
    if (!isNullOrUndefined(temp)) {
      const res = await assignBitfighterToEmail(temp, signupFormFieldInput.email, signupFormFieldInput.new_name);
      if (!isNullOrUndefined(res)) {
        setTimeout(() => {
          navigate("/home", { replace: true });
          window.location.reload()
        }, 1000);
      }
    }
  }

  
  return(
    <div 
      onMouseOver={() => {
        dispatch(TurnMouseClickOff(true))
      }}
      onMouseOut={() => {
        dispatch(TurnMouseClickOff(false))
      }}
    > 
      <div>
        <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={errsnackBarOpen}
        autoHideDuration={6000}
        onClose={errSnackBarHandleClose}
        key={vertical + horizontal + "dsfg"}
      >
        <Alert onClose={errSnackBarHandleClose} severity="error" sx={{ width: '100%' }} variant="filled">
          <AlertTitle> Error </AlertTitle>
            {errSnackBarMessage}
        </Alert>
      </Snackbar>
      </div>
      {
        (registerOptionShow)&& 
        <Wrapper>
          <TextBox>

            <IconButton
                aria-label="close dialog"
                className="close"
                onClick={() => (dispatch(ChangeRegisterShowInGame(false)))}
                size="large"
                color="info"
                style={{
                  float: "left"
                }}
              >
                <CloseIcon />
              </IconButton>

            <div>
              <span>We recommend you move to web3 properly</span>
              <br />
              <span>own your fighter, save your game, and earn!</span>
              <br />
              <span>Don't worry our guide will help you along the way.</span>
            </div>
            <div>
              <Button variant="contained" color="info" style={{
                marginTop: '20px'
              }}><span> Go Web3 </span></Button>
            </div>

            <Content>
              <FormControl fullWidth sx={{ m: 1 }} style={{gap: '20px'}}>
                <TextField
                  id="outlined-adornment-name-string"
                  value={signupFormFieldInput.new_name}
                  onChange={(e) => setsignupFormFieldInput(prevState => ({
                    ...prevState,           
                    new_name: e.target.value
                  })) }
                  placeholder="Type NickName"
                  label="New NickName"
                  required
                />

                <TextField
                  id="outlined-adornment-email-string"
                  value={signupFormFieldInput.email}
                  onChange={(e) => setsignupFormFieldInput(prevState => ({
                    ...prevState,           
                    email: e.target.value
                  })) }
                  placeholder="Type Email Address"
                  label="Email"
                  required
                />

                <TextField
                  id="outlined-adornment-pass"
                  placeholder="Write Password"
                  label="PassWord"
                  type="password"
                  value={signupFormFieldInput.password}
                  onChange={(e) => setsignupFormFieldInput(prevState => ({
                    ...prevState,           
                    password: e.target.value
                  })) }
                />

                <TextField
                  id="outlined-adornment-repass"
                  placeholder="Write Password"
                  label="Repeat PassWord"
                  type="password"
                  value={signupFormFieldInput.repeat_password}
                  onChange={(e) => setsignupFormFieldInput(prevState => ({
                    ...prevState,           
                    repeat_password: e.target.value
                  })) }
                />

                <div>
                <Button variant="contained" color="info" 
                onClick={() => signUpBtnPressed()}
                style={{
                  marginTop: '20px'
                }}><span> Save to Web2 </span></Button>
              </div>


                {/* <Button
                  variant="outlined"
                  color="secondary"
                  style={{
                    width: '150px'
                  }}
                  onClick={() => signUpBtnPressed()}
                >
                  Save to Web2
                </Button> */}

              </FormControl>
            </Content>
          </TextBox>
          
        </Wrapper>
      }
    </div>
    
  )
}