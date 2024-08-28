import { PlayersDataHandler } from "./playersDataHandler";


export class MessageQueueHandler {
  static gameMessageQueueA = [];
  static gameMessageQueueB = [];
  static queueRunningIndex = 0;
  // constructor() {
    
  // }

  static  FillGameMessageQueue(message: object) {
    // console.log("----FillGameMessageQueue-------", message)
    if (MessageQueueHandler.queueRunningIndex%2 === 0) {
      MessageQueueHandler.gameMessageQueueA.push(message)
    } else {
      MessageQueueHandler.gameMessageQueueB.push(message)
    }
  }

  static SendBalanceUpdateMessageToAll(except_addresses=[]) {
    for(let i=0; i< PlayersDataHandler.nftDataofLiveConnections.length; i++) {
      if (except_addresses.length>0 && except_addresses.includes(PlayersDataHandler.nftDataofLiveConnections[i].walletAddress)){
        continue
      }
      let obj = {
        event: "fetch_balance",
        user_wallet_address: PlayersDataHandler.nftDataofLiveConnections[i].walletAddress,
      }
      MessageQueueHandler.FillGameMessageQueue(obj)
    }
  }

}