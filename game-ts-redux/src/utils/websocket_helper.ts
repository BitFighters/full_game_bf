/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */



export default function messageSender(client: WebSocket, newPlayer: any, event: string, walletAddress: string, orientation = "", room_id = "") {
  // console.log("sending --> ", event, newPlayer.x, newPlayer.y)
  try {
    client.send(JSON.stringify({
      x: newPlayer.x,
      y: newPlayer.y,
      event,
      walletAddress,
      orientation,
      room_id,
    }))
  } catch (err) {
    console.log(err)
  }
}