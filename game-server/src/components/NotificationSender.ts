import { MessageQueueHandler } from "./messageQueueHandler"

export class NotificationSender {
  static playersInQueuePool = []

  static sendNotificationMessage(msg: string, user_wallet_address: string, state: string, count: number) {
    let message = {
      event: "notification",
      walletAddress: user_wallet_address,
      message: msg,
      state,
      count,
    }
    MessageQueueHandler.FillGameMessageQueue(message)
  }
  
}