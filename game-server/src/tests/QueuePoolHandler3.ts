import { QueuePoolHandler } from "../components/QueuePoolHandler";
import { NewQueueDB } from "../interfaces";

let timeStarted = new Date().getTime()

const generateRandomString = (myLength) => {
  const chars =
    "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
  const randomArray = Array.from(
    { length: myLength },
    (v, k) => chars[Math.floor(Math.random() * chars.length)]
  );

  const randomString = randomArray.join("");
  return randomString;
};

function addPlayerToQueuePool() {
  let tempData: NewQueueDB = {
    minted_id: Math.floor(Math.random()* 100000),
    nick_name: generateRandomString(5),
    profile_image: "",
    user_wallet_address: generateRandomString(10),
    betAmount: Math.floor(Math.random()* 10000),
    ante: 1,
  }
  QueuePoolHandler.addPlayerInfoToQueuePool(tempData)
  if (new Date().getTime() - timeStarted < 100 * 1000) {
    setTimeout(addPlayerToQueuePool, Math.floor(Math.random() * 20) * 1000)
  } else {
    console.log(" not adding any more palyers")
  }
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