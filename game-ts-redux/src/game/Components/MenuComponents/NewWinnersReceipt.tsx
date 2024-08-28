// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */
import styled from 'styled-components'
import { Box, Modal } from "@mui/material"
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { fetchPlayerWalletInfo } from '../../../hooks/ApiCaller';
import { IQueueCombined, ShowWinnerCardAtFightEnd } from '../../../stores/UserWebsiteStore';
import { parseWBTCBalanceV3, parseWBTCBalanceV4 } from '../../../utils/web3_utils';
import store from '../../../stores';
import { isNullOrUndefined } from 'util';

const ModalWrapper = styled.div`
  overflow-y: auto;
`


const ModalBoxWrapper = styled(Box)`
  background: #111B28;
  border: 10px solid #000000;
  border-radius: 10px;
  width: 35%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin-left: 30%;
  margin-top: 10%;
  


  @media only screen and (max-width: 575.98px) and (orientation: portrait) {
      height: 400px;
      width: 90%;
      margin-top: 20%;
      margin-left: 10%;
  }

  @media only screen and (max-width: 575.98px) and (orientation: landscape) {
      // height: 400px;
      width: 80%;
      // margin-top: 20%;
      // margin-left: 10%;
  }

  // display: block;
  // max-height: 80vh;
  // overflow-y: auto;
  
  // max-height: 80%;
  // transform: 'translate(-50%, -50%)',

  button {
    margin: 20px;
    border: 4px solid #000000;
    border-radius: 5px;
  }

  h2 {
    font-family:'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 32px;
    color: aliceblue;
    line-height: 75%;
  }

  h3 {
    font-family:'Cooper Black', sans-serif;
    font-style: bold;
    font-size: 24px;
    color: grey;
    line-height: 75%;
    // padding-bottom: 10px;
  }
`

const Wrapper = styled.div`
  // padding: 10px;
`

const CustomBox = styled(Box)`
  // width: 100%;
  // overflow: auto;
  // opacity: 0.9;
  // background: #2c2c2c;
  // border: 10px solid #000000;
  // border-radius: 10px;
  // padding: 20px;

  overflow-y: auto;
  max-height: calc(100vh - 150px);

  @media only screen and (max-width: 575.98px) and (orientation: portrait) {
      max-height: 400px;
      width: 90%;
  }


  span {
    font-family: Monospace;
    font-style: bold;
    font-size: 20px;
  }

  h1 {
    font-family: Monospace;
    font-style: bold;
    font-size: 32px;
    color: white;
    line-height: 75%;
    padding-top: 10px;
  }

  h2 {
    font-family: Monospace;
    font-style: bold;
    font-size: 20px;
    color: white;
    line-height: 75%;
  }

  h4 {
    font-family: Monospace;
    font-style: bold;
    font-size: 12px;
    color: white;
    line-height: 75%;
  }

  h3 {
    font-family: Monospace;
    font-style: bold;
    font-size: 20px;
    color: white;
    line-height: 75%;
    padding-top: 20px;
  }

  input {
    color: black;
  }
`

const Backdrop = styled.div`
  margin: auto;
  max-height: 25%;
  max-width: 25%;
`

const MyDivider = styled.hr`
  border-top: 6px solid #bbb;
  border-radius: 2px;
`

const DottedDivider = styled.hr`
  border-top: 3px dotted #bbb;
`

const Header = styled.div`

`

const TextInfo = styled.div`
  // diplay: flex;
  // flex-direction: column;
  // align-items: flex-start;
  // justify-content: flex-start;
  padding: 5px;
  text-align: left;
`


let lastP1 = ""
let lastP2 = ""

let p1 = "";
let p2 = "";

let p1_win_pot = 0;
let p2_win_pot = 0;
let p1_self_bet = 0;
let p2_self_bet = 0;
let p1_total_tips = 0;
let p2_total_tips = 0;


export default function NewWinnersReceipt() {
  // const [updatedAt, setUpdatedAt] = useState(0);

  const showWinnersCardBool = useAppSelector((state) => state.userPathStore.showWinnerCardAtFightEnd);
  // const showWinnersCardBool = true;
  const fight_winner = useAppSelector((state) => state.fightInfoStore.fight_winner)
  const combinedQueueData = useAppSelector((state) => state.userPathStore.CombinedQueueData)
  const queueDetailsInfo = useAppSelector((state) => state.queueDetailedInfo.queue_to_fight_info_map)


  let updateOrNot = true;
  // let lastUpdated = 0;

  if (
    lastP1 === store.getState().web3store.userAddress
    || lastP2 === store.getState().web3store.userAddress
  ) {
    if (p1_win_pot === 0 || p2_win_pot === 0) {
      updateOrNot = true;
    }
    // updateOrNot = true;
  } else {
    updateOrNot = true;
    // lastUpdated = new Date().getTime()
    // setUpdatedAt(new Date().getTime())
  }

  // if (
  //   lastP1 === store.getState().web3store.userAddress 
  //   || lastP2 === store.getState().web3store.userAddress
  // ) {
  //   if (combinedQueueData.length > 0) {
  //     if (queueDetailsInfo.)
  //   }
  // }

  // console.log("debug--11 ", updateOrNot, p1, p2, store.getState().web3store.userAddress, combinedQueueData.length )
  if (combinedQueueData.length > 0 && updateOrNot) {
    combinedQueueData.map((data: IQueueCombined, index) => {
      if (index > 0) {
        return
      }
      const tempQueueDetailInfo = queueDetailsInfo[data.fight_id];
      if (!isNullOrUndefined(tempQueueDetailInfo)) {

        // if (
        //   lastP1 === store.getState().web3store.userAddress 
        //   || lastP2 === store.getState().web3store.userAddress
        // ) {
        //   // if (tempQueueDetailInfo.player1 === store.getState().web3store.userAddress
        //   // || tempQueueDetailInfo.player2 === store.getState().web3store.userAddress) {
        //   //   return
        //   // }
        //   if (store.getState().web3store.userAddress  !== tempQueueDetailInfo.player1 
        //   || store.getState().web3store.userAddress  !== tempQueueDetailInfo.player2) {
        //     return
        //   }
        // }


        p1_win_pot = tempQueueDetailInfo.win_pot_p1 ? tempQueueDetailInfo.win_pot_p1 : 0;
        p2_win_pot = tempQueueDetailInfo.win_pot_p2 ? tempQueueDetailInfo.win_pot_p2 : 0;

        p1_total_tips = tempQueueDetailInfo.total_tip_p1 ? tempQueueDetailInfo.total_tip_p1 : 0;
        p2_total_tips = tempQueueDetailInfo.total_tip_p2 ? tempQueueDetailInfo.total_tip_p2 : 0;

        p1_self_bet = tempQueueDetailInfo.self_bet_p1 ? tempQueueDetailInfo.self_bet_p1 : 0;
        p2_self_bet = tempQueueDetailInfo.self_bet_p2 ? tempQueueDetailInfo.self_bet_p2 : 0;

        p1 = tempQueueDetailInfo.player1 ? tempQueueDetailInfo.player1 : "";
        p2 = tempQueueDetailInfo.player2 ? tempQueueDetailInfo.player2 : "";

        lastP1 = p1;
        lastP2 = p2;
      }
    })
  }

  // const closeDialogMenu = () => {
  //   dispatch(ShowWinnerCardAtFightEnd(false))
  // }

  const handleModalClose = () => {
    lastP1 = ""
    lastP2 = ""

    p1 = "";
    p2 = "";

    p1_win_pot = 0;
    p2_win_pot = 0;
    p1_self_bet = 0;
    p2_self_bet = 0;
    p1_total_tips = 0;
    p2_total_tips = 0;

    console.log("handle modal close in winrecipt..")
    dispatch(ShowWinnerCardAtFightEnd(false))
    fetchPlayerWalletInfo(false, "winner receipt ")
  };

  // const ref = useDetectClickOutside({ onTriggered: closeDialogMenu });
  const dispatch = useAppDispatch();

  let money = 'bits'
  if (!store.getState().web3store.web3Connected) {
    money = "coins"
  }
  return (
    <div>
      <Modal
        open={showWinnersCardBool}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalBoxWrapper>
          <div>
            <CustomBox>
              <Header>
                <h3>You win</h3>
                <MyDivider />
              </Header>

              <h3>
                Genesis HQ - Level 5 - Fight!
              </h3>

              <MyDivider />

              <TextInfo>
                <h4> Your Ante: 50 {money}</h4>
                <h4> Their Ante: 50 {money}</h4>
                <div>
                  {
                    (store.getState().web3store.userAddress === store.getState().userActionsDataStore.fightersInfo.player1.walletAddress) ?
                      <>
                        <h4>Your Max Bet: {parseWBTCBalanceV3(p1_self_bet - 5000)} {money}</h4>
                        <h4>Their Max Bet: {parseWBTCBalanceV3(p2_self_bet - 5000)} {money} </h4>
                      </> :
                      <>
                        <h4>Your Max Bet: {parseWBTCBalanceV3(p2_self_bet - 5000)} {money}</h4>
                        <h4>Their Max Bet: {parseWBTCBalanceV3(p1_self_bet - 5000)} {money} </h4>
                      </>
                  }
                </div>

                {/* <div>
                  {
                    (store.getState().web3store.userAddress !== store.getState().userActionsDataStore.fightersInfo.player1.walletAddress) ?
                    <h4>Your Max Bet: { parseWBTCBalanceV3(p1_win_pot - p1_self_bet - p1_total_tips - 5000) } {money}</h4>:
                    <h4>Their Max Bet: { parseWBTCBalanceV3(p2_win_pot - p2_self_bet - p2_total_tips - 5000) } {money} </h4>
                  }
                </div> */}

                <div>
                  {
                    (store.getState().web3store.userAddress === store.getState().userActionsDataStore.fightersInfo.player1.walletAddress) ?
                      <h4>Your Total Tip: {parseWBTCBalanceV3(p1_total_tips)} {money}</h4> :
                      <h4>Your Total Tip: {parseWBTCBalanceV3(p2_total_tips)} {money} </h4>
                  }
                </div>

                <div>
                  {
                    (store.getState().web3store.userAddress === store.getState().userActionsDataStore.fightersInfo.player1.walletAddress) ?
                      <h4>Total Prize: {parseWBTCBalanceV3(p1_win_pot)} {money}</h4> :
                      <h4>Total Prize: {parseWBTCBalanceV3(p2_win_pot)} {money} </h4>
                  }
                </div>

              </TextInfo>
              <DottedDivider />

              <TextInfo>
                {
                  fight_winner === p1 ?
                    <>
                      <h4> 10% PPS - {(parseWBTCBalanceV4(p1_win_pot) * 0.1).toFixed(3)} </h4>
                      <DottedDivider />
                      <h4> 2% BLDG - {(parseWBTCBalanceV4(p1_win_pot) * 0.02).toFixed(3)} </h4>
                      <h4> 2% GANG - {(parseWBTCBalanceV4(p1_win_pot) * 0.02).toFixed(3)} </h4>
                      <h4> 2% Treasury - {(parseWBTCBalanceV4(p1_win_pot) * 0.02).toFixed(3)} </h4>
                      <h4> 2% System - {(parseWBTCBalanceV4(p1_win_pot) * 0.02).toFixed(3)} </h4>
                      <h4> 1% Prize Pool - {(parseWBTCBalanceV4(p1_win_pot) * 0.01).toFixed(3)} </h4>
                      <h4> 1% JackPot - {(parseWBTCBalanceV4(p1_win_pot) * 0.01).toFixed(3)} </h4>
                      <DottedDivider />
                    </>
                    :
                    <>
                      <h4> 10% PPS - {(parseWBTCBalanceV4(p2_win_pot) * 0.1).toFixed(3)} </h4>
                      <DottedDivider />
                      <h4> 2% BLDG - {(parseWBTCBalanceV4(p2_win_pot) * 0.02).toFixed(3)} </h4>
                      <h4> 2% GANG - {(parseWBTCBalanceV4(p2_win_pot) * 0.02).toFixed(3)} </h4>
                      <h4> 2% Treasury - {(parseWBTCBalanceV4(p2_win_pot) * 0.02).toFixed(3)} </h4>
                      <h4> 2% System - {(parseWBTCBalanceV4(p2_win_pot) * 0.02).toFixed(3)} </h4>
                      <h4> 1% Prize Pool - {(parseWBTCBalanceV4(p2_win_pot) * 0.01).toFixed(3)} </h4>
                      <h4> 1% JackPot - {(parseWBTCBalanceV4(p2_win_pot) * 0.01).toFixed(3)} </h4>
                      <DottedDivider />
                    </>
                }
              </TextInfo>
              <DottedDivider />

              <div>
                {
                  fight_winner === p1 ?
                    <h1> Get {parseWBTCBalanceV3(0.9 * p1_win_pot)} {money} </h1> :
                    <h1> Get {parseWBTCBalanceV3(0.9 * p2_win_pot)} {money} </h1>
                }
              </div>

            </CustomBox>
          </div>
        </ModalBoxWrapper>
      </Modal>
    </div>
  )
}