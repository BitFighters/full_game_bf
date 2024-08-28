import { QueuePoolHandler } from "../components/QueuePoolHandler";
import { NewQueueDB } from "../interfaces";

let timeStarted = new Date().getTime()

// const generateRandomString = (myLength) => {
//   const chars =
//     "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
//   const randomArray = Array.from(
//     { length: myLength },
//     (v, k) => chars[Math.floor(Math.random() * chars.length)]
//   );
//   const randomString = randomArray.join("");
//   return randomString;
// };

let data_1: NewQueueDB = {
  minted_id: Math.floor(Math.random()* 100000),
  nick_name: "abhishek",
  profile_image: "",
  user_wallet_address: "wallet_1",
  betAmount: 100,
  ante: 1,
}

let data_2: NewQueueDB = {
  minted_id: Math.floor(Math.random()* 100000),
  nick_name: "amit",
  profile_image: "",
  user_wallet_address: "wallet_2",
  betAmount: 1000,
  ante: 1,
}

let data_3: NewQueueDB = {
  minted_id: Math.floor(Math.random()* 100000),
  nick_name: "amit",
  profile_image: "",
  user_wallet_address: "wallet_3",
  betAmount: 200,
  ante: 1,
}

let data_4: NewQueueDB = {
  minted_id: Math.floor(Math.random()* 100000),
  nick_name: "amit",
  profile_image: "",
  user_wallet_address: "wallet_4",
  betAmount: 40,
  ante: 1,
}


function addPlayerToQueuePool() {
  // let tempData: NewQueueDB = {
  //   minted_id: Math.floor(Math.random()* 100000),
  //   nick_name: generateRandomString(5),
  //   profile_image: "",
  //   user_wallet_address: generateRandomString(10),
  //   betAmount: Math.floor(Math.random()* 10000),
  //   ante: 1,
  // }

  QueuePoolHandler.addPlayerInfoToQueuePool(data_1)
  QueuePoolHandler.addPlayerInfoToQueuePool(data_2)
  QueuePoolHandler.addPlayerInfoToQueuePool(data_3)
  QueuePoolHandler.addPlayerInfoToQueuePool(data_4)

  // if ( new Date().getTime() - timeStarted < 100 * 1000 ) {
  //   setTimeout(addPlayerToQueuePool, Math.floor(Math.random() * 20) * 1000)
  // } else {
  //   console.log(" not adding any more palyers")
  // }
}

function handleQueuePoolLoop() {
  QueuePoolHandler.RunLoop()
  setTimeout(handleQueuePoolLoop, 5 * 1000)
}



function main() {
  addPlayerToQueuePool()
  handleQueuePoolLoop()
}

main()