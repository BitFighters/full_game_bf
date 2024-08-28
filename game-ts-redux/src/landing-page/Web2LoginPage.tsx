// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { Alert, AlertTitle, Button, FormControl, Snackbar, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import styled from "styled-components"
import Utils from "./Utils"
import * as EmailValidator from 'email-validator';
import { loginWeb2User, signUpWeb2User } from "../hooks/ApiCaller";
import { isNullOrUndefined } from "util";
import {
  useNavigate,
} from "react-router-dom";
import { useAppDispatch } from "../hooks";
import { Login } from "../stores/Web3Store";


const Backdrop = styled.div`
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  gap: 60px;
  align-items: center;
`

const Wrapper = styled.div`
  background: #222639;
  border-radius: 16px;
  padding: 36px 60px;
  box-shadow: 0px 0px 5px #0000006f;
`


const Title = styled.h1`
  font-size: 24px;
  color: #eee;
  text-align: center;
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

interface LoginFormInput {
  email: string;
  password: string;
}

interface SignupFormInput {
  email: string;
  password: string;
  repeat_password: string;
}

const vertical = 'bottom';
const horizontal = 'center';

export function Web2LoginPage() {
  const navigate = useNavigate();
  const { height, width } = Utils();
  const [mode, setMode] = useState("login");
  const [errsnackBarOpen, setErrSnackBarOpen] = useState(false);
  const [errSnackBarMessage, setErrSnackBarMessage] = useState("");
  let View = null;
  const dispatch = useAppDispatch()

  const [loginFormFieldInput, setLoginFormFieldInput] = useState<LoginFormInput>({
    email: "",
    password: "",
  });

  const [signupFormFieldInput, setsignupFormFieldInput] = useState<SignupFormInput>({
    email: "",
    password: "",
    repeat_password: "",
  });

  const errSnackBarHandleClose = () => {
    setErrSnackBarOpen(false);
  };

  useEffect(() => {
    console.log(localStorage.getItem("web2_email_address"))
    if (!isNullOrUndefined(localStorage.getItem("web2_email_address")) && localStorage.getItem("web2_email_address") !== "") {
      setMode("")
    }
  }, []);

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

    if (isNullOrUndefined(res)) {
      setErrSnackBarOpen(true)
      setErrSnackBarMessage("Some error occured while");
      return;
    }
    dispatch(Login(signupFormFieldInput.email));
    localStorage.setItem("web2_email_address", signupFormFieldInput.email)
    setTimeout(() => {
      navigate("/home", { replace: true });
      window.location.reload()
    }, 1000);
  }


  const loginBtnPressed = async () => {
    console.log("login up btn pressed...", loginFormFieldInput)
    if (!EmailValidator.validate(loginFormFieldInput.email)) {
      setErrSnackBarOpen(true)
      setErrSnackBarMessage("Not Valid Email")
      return;
    }

    const res = await loginWeb2User(loginFormFieldInput.email, loginFormFieldInput.password)

    if (res !== "success") {
      setErrSnackBarOpen(true)
      setErrSnackBarMessage("Some error occured while");
      return;
    }
    dispatch(Login(loginFormFieldInput.email));
    localStorage.setItem("web2_email_address", loginFormFieldInput.email)
    setTimeout(() => {
      navigate("/home", { replace: true });
      window.location.reload()
    }, 1000);
  }

  if (mode === "login") {
    View = <>
      <Title style={{ paddingBottom: '50px' }}>Web2 Login Box</Title>
      <Content>
        <FormControl fullWidth sx={{ m: 1 }} style={{ width: width / 2, gap: '20px' }}>
          <TextField
            id="outlined-adornment-search-string"
            value={loginFormFieldInput.email}
            onChange={(e) => setLoginFormFieldInput(prevState => ({
              ...prevState,
              email: e.target.value
            }))}
            placeholder="Type Email Address"
            label="Email"
            type="text"
            required
          />

          <TextField
            id="outlined-adornment-referer"
            placeholder="Write Password"
            label="PassWord"
            type="password"
            value={loginFormFieldInput.password}
            onChange={(e) => setLoginFormFieldInput(prevState => ({
              ...prevState,
              password: e.target.value
            }))}
            required
          />

        </FormControl>
        <Button
          variant="outlined"
          color="secondary"
          style={{
            width: '150px'
          }}
          onClick={() => loginBtnPressed()}
        >
          Login
        </Button>
        <span style={{ color: 'aliceblue' }}>
          No account. Please
          <a style={{ color: '#3897df', paddingLeft: '10px' }} onClick={() => { setMode("signup") }} >SignUp.</a>
        </span>
      </Content>
    </>
  } else if (mode == "signup") {
    View = <>
      <Title style={{ paddingBottom: '50px' }}>Web2 Signup Box</Title>
      <Content>
        <FormControl fullWidth sx={{ m: 1 }} style={{ width: width / 2, gap: '20px' }}>
          <TextField
            id="outlined-adornment-search-string"
            value={signupFormFieldInput.email}
            onChange={(e) => setsignupFormFieldInput(prevState => ({
              ...prevState,
              email: e.target.value
            }))}
            placeholder="Type Email Address"
            label="Email"
            required
          />

          <TextField
            id="outlined-adornment-referer"
            placeholder="Write Password"
            label="PassWord"
            type="password"
            value={signupFormFieldInput.password}
            onChange={(e) => setsignupFormFieldInput(prevState => ({
              ...prevState,
              password: e.target.value
            }))}
          />

          <TextField
            id="outlined-adornment-referer"
            placeholder="Write Password"
            label="Repeat PassWord"
            type="password"
            value={signupFormFieldInput.repeat_password}
            onChange={(e) => setsignupFormFieldInput(prevState => ({
              ...prevState,
              repeat_password: e.target.value
            }))}
          />

        </FormControl>
        <Button
          variant="outlined"
          color="secondary"
          style={{
            width: '150px'
          }}
          onClick={() => signUpBtnPressed()}
        >
          SignUp
        </Button>
        <span style={{ color: 'aliceblue' }}>
          Already Have an account. Please
          <a style={{ color: '#3897df', paddingLeft: '10px' }} onClick={() => { setMode("login") }}>Login.</a>
        </span>
      </Content>
    </>
  } else {
    View = <>
      <Content>
        <div style={{
          color: 'aliceblue',
        }}>
          User is already Logged in.
        </div>

      </Content>
    </>
  }
  return (

    <>
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
      <Backdrop>
        <Wrapper>
          {View}
        </Wrapper>
      </Backdrop>
    </>
  )
}