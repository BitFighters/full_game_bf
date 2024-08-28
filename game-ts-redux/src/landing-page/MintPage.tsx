// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import React, { useState } from 'react'
import styled from 'styled-components'
import LinearProgress from '@mui/material/LinearProgress'
import FormControl from '@mui/material/FormControl';
import Utils from './Utils'
import Button from '@mui/material/Button';
import { Alert, AlertTitle, Snackbar, TextField } from '@mui/material';
import { ethers } from 'ethers';
import phaserGame from '../PhaserGame';
import Bootstrap from '../game/scenes/Bootstrap';
import { fetchNFTsFromDB, randomGenarate, updateNFTsInDB } from '../hooks/ApiCaller';
import { useAppDispatch, useAppSelector } from '../hooks';
import { approveWBTC2, checkAllowance, createBitFighter3 } from '../contract';
import { Link } from 'react-router-dom';
import { setNFTDetails, setTotalNFTData } from '../stores/BitFighters';
import { fetchAllNFTsFromDbEntries } from '../hooks/FetchNFT';
import { gamelogic_contract_address } from '../contract/gamelogic_constants';
import store from '../stores';

const Backdrop = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  gap: 60px;
  align-items: center;
`

const Backdrop2 = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  gap: 60px;
  align-items: center;
`

const Wrapper = styled.div`
  // background-color: #262626;
  // background: #222639;
  background-color: #111B28;
  border-radius: 16px;
  padding: 36px 60px;
  box-shadow: 10px 10px 10px 10px #0000006f;
`

const ButtonView = styled(Button)`
  span {
    color: aliceblue;
    // font-family: Monospace;
    font-style: bold;
    font-size: 20px;
    font-family:'Cooper Black', sans-serif;
  }

  // background-color: #e60808;
  background-color: #9c341a;

  &:hover {
    background-color: #852d17;
  }


  width: 300px;
  height: 60px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #eee;
  text-align: center;
`

{/* <div className="cooper-black-tab">Mint</div> */ }

const Title2 = styled.h1`
  font-size: 22px;
  color: #eee;
  position: absolute;
  left: 10%;
  font-family:'Cooper Black', sans-serif;
  // padding-bottom: 40px;
  // margin-bottom: 40px;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 20px 0;
  align-items: center;
  justify-content: center;
  padding-top: 50px;

  img {
    border-radius: 8px;
    height: 120px;
  }
`

const ProgressBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  h3 {
    color: #33ac96;
  }
`

const ProgressBar = styled(LinearProgress)`
  width: 360px;
`

const vertical = 'bottom';
const horizontal = 'center';

interface IFormInput {
  nick_name: string;
  referer_address: string;
  lucky_number: number
}

export default function OldMintPage() {
  const loggedInUserWalletAddress = useAppSelector((state) => state.web3store.userAddress)
  const web3ConnectedUser = useAppSelector((state) => state.web3store.web3Connected)
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;
  const { height, width } = Utils();
  const [mintingState, setMintingState] = useState("")
  const [mintingBool, setMintingBool] = useState(false)
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [errsnackBarOpen, setErrSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("BitFighter Minted");
  const [errSnackBarMessage, setErrSnackBarMessage] = useState("");
  const userAddress = useAppSelector((state) => state.web3store.userAddress);
  const inputValues: IFormInput = {
    nick_name: "",
    referer_address: "",
    lucky_number: 0,
  };

  const dispatch = useAppDispatch();
  const [formFieldInput, setFormFieldInput] = useState<IFormInput>({
    nick_name: "",
    referer_address: "",
    lucky_number: 0,
  });

  const validateFields = () => {
    console.log(" validation ......", formFieldInput)
    if (formFieldInput.nick_name.length < 2) {
      setErrSnackBarMessage("Set Nick Name of Length greater than 1")
      setErrSnackBarOpen(true)
      bootstrap.play_err_sound()
      return false
    }
    inputValues.nick_name = formFieldInput.nick_name;

    if (!(formFieldInput.lucky_number > 0 && formFieldInput.lucky_number < 100)) {
      setErrSnackBarMessage("Lucky Number should be between 1 and 100.")
      setErrSnackBarOpen(true)
      bootstrap.play_err_sound()
      return false;
    }

    inputValues.lucky_number = formFieldInput.lucky_number;

    if (formFieldInput.referer_address.length === 0) {
      inputValues.referer_address = ethers.constants.AddressZero;
      setFormFieldInput(prevState => ({
        ...prevState,
        referer_address: ethers.constants.AddressZero
      }))
    }

    if (formFieldInput.referer_address.length > 0) {
      try {
        inputValues.referer_address = ethers.utils.getAddress(formFieldInput.referer_address)
      } catch (err) {
        console.log(" error in getting proper address from this .. ", err)
        inputValues.referer_address = ethers.constants.AddressZero;
        setFormFieldInput(prevState => ({
          ...prevState,
          referer_address: ethers.constants.AddressZero
        }))
      }
    }

    return true;
  }

  const mintOperation = async () => {
    if (!validateFields()) return;
    setMintingBool(true);
    setMintingState("Generating Your Bitfighter");

    const allowance = await checkAllowance(store.getState().web3store.userAddress)
    console.log("allowance -- >", allowance.toString());
    if (ethers.BigNumber.from("1000000000").gte(ethers.BigNumber.from(allowance.toString()))) {
      console.log("less allowance")
      if (!await approveWBTC2(gamelogic_contract_address, ethers.BigNumber.from("100000000000000000"))) {
        setMintingBool(false);
        setMintingState("");
        setErrSnackBarOpen(true);
        setErrSnackBarMessage("Something went wrong.. ")
        bootstrap.play_err_sound()
        setFormFieldInput({
          nick_name: "",
          referer_address: "",
          lucky_number: 0,
        })
        return;
      }
    }

    const output = await randomGenarate(userAddress, inputValues.referer_address, inputValues.lucky_number, inputValues.nick_name);

    // setMintingState("Approving wBTC");
    // if (!await approveWBTC2(gamelogic_contract_address, ethers.BigNumber.from("100000000000000000000"))) {
    //   setMintingBool(false);
    //   setMintingState("");
    //   setErrSnackBarOpen(true);
    //   setErrSnackBarMessage("Something went wrong.. ")
    //   bootstrap.play_err_sound()
    //   setFormFieldInput({
    //     nick_name: "",
    //     referer_address: "",
    //     lucky_number: 0,
    //   })
    //   return;
    // };
    setMintingState("Minting Your BitFighter");
    // console.log("approved.. wbtc ")
    console.log(" just before minting ... ", inputValues)
    const minted = await createBitFighter3(output.ipfsURL, inputValues.referer_address, inputValues.lucky_number, inputValues.nick_name, 0);
    // let minted = await WriterContractHandler.createBitfighters(output.ipfsURL, inputValues.referer_address, inputValues.lucky_number, inputValues.nick_name);
    if (!minted) {
      setMintingBool(false);
      setMintingState("");
      setErrSnackBarOpen(true);
      setErrSnackBarMessage("Something went wrong.. ")
      bootstrap.play_err_sound()
      setFormFieldInput({
        nick_name: "",
        referer_address: "",
        lucky_number: 0,
      })
      return;
    }
    await updateNFTsInDB(userAddress);
    const result = await fetchNFTsFromDB(userAddress);
    console.log(userAddress);
    console.log("---------*******-- .", result);
    const dataOfNFTS = await fetchAllNFTsFromDbEntries(result.message)
    dispatch(setTotalNFTData(result.message))
    dispatch(setNFTDetails(dataOfNFTS))
    // await fetchNFTsFromDB(userAddress);

    setMintingBool(false);
    setSnackBarOpen(true);
    bootstrap.play_err_sound()
    setFormFieldInput({
      nick_name: "",
      referer_address: "",
      lucky_number: 0,
    })
  }

  const handleClose = () => {
    setSnackBarOpen(false);
  };

  const errSnackBarHandleClose = () => {
    setErrSnackBarOpen(false);
  };


  return (
    <>

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={snackBarOpen}
        autoHideDuration={12000}
        onClose={handleClose}
        key={vertical + horizontal}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }} variant="filled" >
          <AlertTitle style={{
            padding: '10px'
          }}>Success</AlertTitle>
          {snackBarMessage} <strong>check them out !! </strong>

          <Link
            className="primary"
            to="/game"
          >
            <ButtonView
              variant="contained"
              color="success"
              style={{
                width: 200,
              }}
            >
              View Bitfighters
            </ButtonView>
          </Link>
        </Alert>
      </Snackbar>

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

      {(loggedInUserWalletAddress !== "" && web3ConnectedUser) ?
        <Backdrop>
          <Wrapper>
            {/* <Title style={{paddingBottom: '50px'}}>Welcome to the Bit-o-Matic !</Title> */}
            <Title2> Now minting Open Alpha Fighters! </Title2>
            <Content>

              <FormControl fullWidth sx={{ m: 1 }} style={{ width: width / 2, gap: '20px' }}>
                <TextField
                  id="outlined-adornment-search-string"
                  value={formFieldInput.nick_name}
                  onChange={(e) => setFormFieldInput(prevState => ({
                    ...prevState,
                    nick_name: e.target.value
                  }))}
                  placeholder="Choose a cool NickName"
                  label="Your fighter's Name"
                  required
                />

                <TextField
                  id="outlined-adornment-referer"
                  value={formFieldInput.referer_address}
                  onChange={(e) => setFormFieldInput(prevState => ({
                    ...prevState,
                    referer_address: e.target.value
                  }))}
                  placeholder="Write wallet address of the Referer"
                  label="Your Refferal's Address"
                />

                <TextField
                  id="outlined-adornment-lucky"
                  value={formFieldInput.lucky_number.toString()}
                  onChange={(e) => setFormFieldInput(prevState => ({
                    ...prevState,
                    lucky_number: parseInt(e.target.value)
                  }))}
                  placeholder="Choose a Lucky Number (1 - 100)"
                  label="Lucky Number (1-100)"
                  required
                  type="number"
                />
              </FormControl>
              <ButtonView
                variant="outlined"
                color="secondary"
                onClick={() => mintOperation()}
                style={{
                  width: '150px'
                }}
              >
                <span>
                  Mint
                </span>
              </ButtonView>
            </Content>
          </Wrapper>
          {mintingBool && <ProgressBarWrapper>
            <h3> {mintingState} </h3>
            <ProgressBar color="secondary" />
          </ProgressBarWrapper>}
        </Backdrop> :
        <Backdrop>
          <Title>
            Loading...
          </Title>
        </Backdrop>
      }
    </>
  )
}
