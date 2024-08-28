import { useState } from 'react'
import styled from 'styled-components'
import LinearProgress from '@mui/material/LinearProgress'
import { Box, Typography } from '@mui/material'
import phaserGame from '../../PhaserGame'
import Bootstrap from '../../game/scenes/Bootstrap'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { approveWBTC2, checkAllowancePresale, mintPreSaleNFT } from '../../contract'
import store from '../../stores'
import { ethers } from 'ethers'
import { randomGenaratePreSale } from '../../hooks/ApiCaller'
import { PRESALE_CONTRACT_ADDRESS } from '../../contract/presale_constants'
import { updatePresaleMintedCount } from '../../utils/web3_utils'
import Modal from '@mui/material/Modal'
import ReactPlayer from 'react-player'
import {
  SetFailureNotificationBool,
  SetFailureNotificationMessage,
  SetSuccessNotificationBool,
  SetSuccessNotificationMessage,
} from '../../stores/NotificationStore'
import NotificationMessageHelper from '../../game/Components/NotificationMessageHelper'

const Wrapper = styled.div`
  padding: 50px;
  display: flex;
  justify-content: center;
`

const ModalWrapper = styled.div``

const BoxWrapper = styled(Box)`
  // background: #989ea4;
  border-left: 10px solid #74777b;
  width: 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  // mix-blend-mode: multiply;
  background-repeat: repeat;
  // pointer-events: none;
  background-image: url('/bitfgihter_assets/sample-image.png');
  h4 {
    font-family: 'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 46px;
    color: white;
    line-height: 75%;
    margin: 15px;
  }

  button {
    margin: 20px;
    border: 4px solid #000000;
    border-radius: 5px;
  }
`

const ModalBoxWrapper = styled(Box)`
  background: #111b28;
  border: 10px solid #000000;
  border-radius: 10px;
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 50px;
  margin-left: 20%;
  margin-top: 10%;
  transform: 'translate(-50%, -50%)',
    // left: 50%;
    button {
    margin: 20px;
    border: 4px solid #000000;
    border-radius: 5px;
  }

  h2 {
    font-family: 'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 72px;
    color: grey;
    line-height: 75%;
    padding-top: 20px;
  }
`

const Title = styled.h1`
  font-size: 24px;
  color: #eee;
  text-align: center;
`

const CustomBox = styled(Box)`
  width: 90%;
  overflow: auto;
  background: #2c2c2c;
  border: 15px solid #696969;
  display: flex;
  flex-direction: column;
  margin: 20px;
  padding: 15px;

  span {
    font-family: 'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 20px;
  }

  h1 {
    font-family: 'Cooper Black', sans-serif;
    font-weight: 600;
    font-size: 30px;
    color: white;
    line-height: 75%;
    padding: 10px;
  }

  h3 {
    font-family: 'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 30px;
    color: white;
    line-height: 75%;
    padding-top: 20px;
  }

  input {
    color: black;
  }
`

const ProgressBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  h3 {
    color: grey;
  }
`

const ProgressBar = styled(LinearProgress)`
  width: 360px;
`

const MyDivider = styled.div`
  border: 15px solid #232121;
  border-bottom: 5px solid #494949;
  width: 85%;
  margin: 20px;
`

const FooterText = styled.div`
  margin-left: auto;
  h2 {
    color: #726d6d;
    padding: 5px;
    margin: 5px;
    font-family: 'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 20px;
    line-height: 75%;
  }
`

const FloaterBoxRight = styled.div`
  display: flex;
  margin-left: auto;
  // background-color: #363636;
  margin: 5px;
  padding: 5px;
  // padding: 5px 20px 5px 20px;
  justify-content: center;
  align-items: center;
  // border-radius: 20%;
  background: #2c2c2c;
  border: 5px solid #696969;
`

const TopRightBox = styled.div`
  display: flex;
  flex-direction: row;
  align-self: flex-end;
  justify-content: center;
  align-items: center;

  span {
    width: 20px;
    background-color: #00ff24;
    height: 20px;
    border-radius: 50%;
  }

  h2 {
    color: aliceblue;
    font-family: 'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 20px;
    height: 20px;
  }

  span.red {
    width: 20px;
    background-color: #ef3636;
    height: 20px;
    border-radius: 50%;
    margin-top: 5px;
    margin-right: 5px;
  }
`

export default function MintPage() {
  const loggedInUserWalletAddress = useAppSelector((state) => state.web3store.userAddress)
  const web3ConnectedUser = useAppSelector((state) => state.web3store.web3Connected)
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
  const [mintingState, setMintingState] = useState('')
  const [mintingBool, setMintingBool] = useState(false)
  const [snackBarOpen, setSnackBarOpen] = useState(false)
  const [errsnackBarOpen, setErrSnackBarOpen] = useState(false)
  const [errSnackBarMessage, setErrSnackBarMessage] = useState('')
  const userAddress = useAppSelector((state) => state.web3store.userAddress)
  const [openModal, setOpenModal] = useState(false)

  const totalPresaleCount = 100

  const preSaleMintedNFT = useAppSelector((state) => state.bitFighters.preSaleNFTMintedCount)

  const dispatch = useAppDispatch()

  const preSaleMint = async () => {
    // if (!validateFields()) return;
    setMintingBool(true)
    setMintingState('Generating Your Mint Card')

    const allowance = await checkAllowancePresale(store.getState().web3store.userAddress)
    console.log('allowance -- >', allowance.toString())
    if (ethers.BigNumber.from('10000000000000000').gte(ethers.BigNumber.from(allowance.toString()))) {
      console.log('less allowance')
      if (!(await approveWBTC2(PRESALE_CONTRACT_ADDRESS, ethers.BigNumber.from('10000000000000000000')))) {
        setMintingBool(false)
        setMintingState('')
        // setErrSnackBarOpen(true);
        // setErrSnackBarMessage("Something went wrong.. ")

        store.dispatch(SetFailureNotificationBool(true))
        store.dispatch(SetFailureNotificationMessage('Approval Failed'))
        bootstrap.play_err_sound()
        return
      }
    }

    const output = await randomGenaratePreSale(store.getState().web3store.userAddress)
    console.log('---output ', output)

    setMintingState('Minting Your Mint Card')
    const minted = await mintPreSaleNFT(output.data.nft_url)
    if (!minted) {
      bootstrap.play_err_sound()
      setMintingBool(false)
      setMintingState('')

      store.dispatch(SetFailureNotificationBool(true))
      store.dispatch(SetFailureNotificationMessage('Minting Failed'))

      // setErrSnackBarOpen(true);
      // setErrSnackBarMessage("Something went wrong.. ")

      return
    } else {
      // minted..
      // show modal
      bootstrap.play_dr_bits_success_sound()
      store.dispatch(SetSuccessNotificationBool(true))
      store.dispatch(SetSuccessNotificationMessage(`Success`))
      setTimeout(() => {
        handleModalOpen()
      }, 1000)
    }

    setMintingBool(false)
    setSnackBarOpen(true)

    updatePresaleMintedCount()
    // bootstrap.play_err_sound()
  }

  const handleModalClose = () => {
    setOpenModal(false)
  }

  const handleModalOpen = () => setOpenModal(true)

  let CustomUI = (
    <Wrapper>
      <BoxWrapper className='mint_box_shadow'>
        <TopRightBox>
          {totalPresaleCount - preSaleMintedNFT > 0 ? (
            <>
              <span></span>
              <FloaterBoxRight>
                <h2>Ready</h2>
              </FloaterBoxRight>
            </>
          ) : (
            <>
              <span className='red'></span>
            </>
          )}
        </TopRightBox>

        <CustomBox>
          <h1>Bit Fighter Mint Card</h1>

          <h1>{totalPresaleCount - preSaleMintedNFT} Remaining</h1>
        </CustomBox>

        <div
          className='cooper-black-tab'
          style={{
            display: 'flex',
            flexDirection: 'row',
            // alignItems: 'center',
            // justifyContent: 'center'
          }}
        >
          <h1>Price - 0.001 BTC.b</h1>

          <img
            height={30}
            width={30}
            src='bitfgihter_assets/avax.png'
            style={{
              margin: '10px',
            }}
          />
        </div>

        <div>
          {totalPresaleCount - preSaleMintedNFT > 0 ? (
            <button
              onClick={() => preSaleMint()}
              style={{
                width: '150px',
                backgroundColor: '#ae0606',
                height: '80px',
              }}
            >
              <h4 className='cooper-black-tab'>Go!</h4>
            </button>
          ) : (
            <div
              style={{
                height: '80px',
              }}
            ></div>
          )}
        </div>

        <MyDivider />

        <FooterText>
          <h2>M-o-M Inc.</h2>
        </FooterText>

        {mintingBool && (
          <ProgressBarWrapper
            style={{
              margin: '20px',
            }}
          >
            <h3> {mintingState} </h3>
            <ProgressBar
              style={{
                backgroundColor: 'grey',
              }}
            />
          </ProgressBarWrapper>
        )}
      </BoxWrapper>
    </Wrapper>
  )

  if (openModal) {
    CustomUI = (
      <ModalWrapper>
        <Modal open={openModal} onClose={handleModalClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
          <ModalBoxWrapper>
            <h2>Success!</h2>
            <Typography id='modal-modal-title' variant='h2' component='h2'></Typography>
            <ReactPlayer url='https://production-bitfighters.s3.ap-south-1.amazonaws.com/videos/mc.mp4' controls={true} loop playing={true} />
          </ModalBoxWrapper>
        </Modal>
      </ModalWrapper>
    )
  }

  return (
    <>
      <NotificationMessageHelper />
      {loggedInUserWalletAddress !== '' && web3ConnectedUser ? <div>{CustomUI}</div> : <Title>Loading...</Title>}
    </>
  )
}
