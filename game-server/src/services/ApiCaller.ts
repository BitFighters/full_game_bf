
import axios, { AxiosResponse } from "axios";
import { RATS_COIN_AMOUNT } from "../constants/constants";
import { MessageQueueHandler } from "../components/messageQueueHandler";


// var baseUrl = "http://localhost:3000/"
var baseUrl = process.env.ANAKIN_URL || "http://localhost:3000/"
// var baseUrl = "https://anakin.dev.bitfighters.club/"
// var baseUrl = "https://anakin.prod.bitfighters.club/"

if (process.env.ENV === "production" || process.env.ENV === "prod") {
  baseUrl = process.env.ANAKIN_URL;
}

console.log("base url -- ", baseUrl)

axios.get(baseUrl).then((response) => {
  console.log("----------_****___", response.data)
}).catch((error) => {
  console.log("error in ", error)
})

let fight_end_called_tracker = []

// export async function fetchQueueInfo() {
//   let response: AxiosResponse;
//   try {
//     response = await axios.get(baseUrl + "v1/web3/users/get/queue/");
//     return response.data;
//   } catch (err) {
//     console.log("error in fetchQueueInfo", err)
//     return [];
//   }
// }

// export async function updateQueue() {
//   let response: AxiosResponse;
//   try {
//     response = await axios.post(baseUrl + "v1/web3/user/update/queue/");
//     console.log("response in updateQueue ", response.status, response.data)
//   } catch (err) {
//     console.log("error in updateQueue,,", err)
//   }
// }

// export async function shiftDownInQueue(walletAddress: string) {
//   let response: AxiosResponse;
//   try {
//     response = await axios.post(baseUrl + `v1/web3/user/update/queue/down/${walletAddress}/`);
//     console.log("response in shiftDownInQueue ", response.status);
//   } catch (err) {
//     console.log("error in shiftDownInQueue,,", err.message);
//   }
// }

// export async function fetchDetailsOfBitFighters(user_wallet_address: string) {
//   let response: AxiosResponse;
//   try {
//     response = await axios.get(baseUrl + `v1/web3/fetch/bitfighters/${user_wallet_address}/`);
//     return response.data;
//   } catch (err) {
//     console.log("error in fetchQueueInfo", err)
//     return ;
//   }
// }

// export async function DeleteUserFromQueue(user_wallet_address: string) {
//   let response: AxiosResponse;
//   console.log("passing ", user_wallet_address, " to remove from queue")
//   try {
//     var data = JSON.stringify({
//       "user_wallet_address": user_wallet_address
//     });

//     var config = {
//       method: 'post',
//       url: baseUrl + `internal/delete/queue/`,
//       headers: { 
//         'Content-Type': 'application/json'
//       },
//       data : data
//     };
//     response = await axios(config);
//     console.log("response in DeleteUserFromQueue ", response.status, response.data)
//   } catch (err) {
//     console.log("error in delete queue,,", err)
//   }
// }

// export const resolveURL = async (url: string) => {
//   const res = await axios(url);
//   return res.data;
// };

// export async function AddMoneyToWallet(user_wallet_address: string) {
//   let response: AxiosResponse;
//   // console.log("passing ", user_wallet_address, " to remove from queue")
//   try {
//     var data = JSON.stringify({
//       "user_wallet_address": user_wallet_address,
//       "amount": RATS_COIN_AMOUNT,
//     });

//     var config = {
//       method: 'post',
//       url: baseUrl + `v1/wallet/add/`,
//       headers: { 
//         'Content-Type': 'application/json'
//       },
//       data : data
//     };
//     response = await axios(config);
//     console.log("response in AddMoneyToWallet ", response.status, response.data)
//   } catch (err) {
//     console.log("error in AddMoneyToWallet,,", err)
//   }
// }

// export async function ExecuteFightEnd(_winner: string, _loser: string, _draw: boolean) {
//   let response: AxiosResponse;
//   try {
//     var data = JSON.stringify({
//       "winner": _winner,
//       "loser": _loser,
//       "draw": _draw,
//     });

//     var config = {
//       method: 'post',
//       url: baseUrl + `v1/web3/users/executeFightEnd/`,
//       headers: { 
//         'Content-Type': 'application/json'
//       },
//       data : data
//     };
//     response = await axios(config);
//     if (response.status !== 200) {
//       throw "Some error happened"
//     } else {
//       MessageQueueHandler.FillGameMessageQueue({
//         event: "update_balance",
//         walletAddress: _winner
//       })
//       MessageQueueHandler.FillGameMessageQueue({
//         event: "update_balance",
//         walletAddress: _loser
//       })
//     }
//     console.log("response in ExecuteFightEnd ", response.status, response.data)
//     return true;
//   } catch (err) {
//     console.log("error in ExecuteFightEnd,,", err);
//     return false;
//   }
// }


// export async function AddActiveAsset(user_wallet_address: string, asset_name: string) {
//   let response: AxiosResponse;
//   try {
//     var data = JSON.stringify({
//       "user_wallet_address": user_wallet_address,
//       "asset_name": asset_name,
//     });

//     var config = {
//       method: 'post',
//       url: baseUrl + `v1/users/assets/add/`,
//       headers: { 
//         'Content-Type': 'application/json'
//       },
//       data : data
//     };
//     response = await axios(config);
//     console.log("response in AddActiveAsset ", response.status, response.data);
//     FetchAssets(user_wallet_address);
//   } catch (err) {
//     console.log("error in AddActiveAsset,", err)
//   }
// }

// export async function UseAsset(user_wallet_address: string, asset_name: string) {
//   let response: AxiosResponse;
//   try {
//     var data = JSON.stringify({
//       "user_wallet_address": user_wallet_address,
//       "asset_name": asset_name,
//     });

//     var config = {
//       method: 'post',
//       url: baseUrl + `v1/users/assets/discard/`,
//       headers: { 
//         'Content-Type': 'application/json'
//       },
//       data : data
//     };
//     response = await axios(config);
//     console.log("response in AddActiveAsset ", response.status, response.data);
//     FetchAssets(user_wallet_address);
//   } catch (err) {
//     console.log("error in AddActiveAsset,", err)
//   }
// }

// export async function FetchAssets(user_wallet_address: string) {
//   let response: AxiosResponse;
//   try {
//     var data = JSON.stringify({
//       "user_wallet_address": user_wallet_address,
//     });

//     var config = {
//       method: 'post',
//       url: baseUrl + `v1/users/assets/fetch/`,
//       headers: { 
//         'Content-Type': 'application/json'
//       },
//       data : data
//     };
//     response = await axios(config);
//     console.log("response in FetchAssets ", response.status, response.data);
//     if (response.status === 200) {
//       MessageQueueHandler.FillGameMessageQueue({
//         event: "assets_update",
//         walletAddress: user_wallet_address,
//         data: response.data.result,
//       })
//     }
//   } catch (err) {
//     console.log("error in FetchAssets,", err)
//   }
// }

export async function FightEntryCreate(user_wallet_address: string, minted_id: string) {
  console.log("---------- ", user_wallet_address);
  let response: AxiosResponse;
  try {
    let data = JSON.stringify({
      "user_wallet_address": user_wallet_address,
      "minted_id": minted_id
    });
    let config = {
      method: 'post',
      url: baseUrl + `v1/fight/fight_entry/create/`,
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': "DarthVader",
        'x-client-secret': "ZZ",
      },
      data: data
    };
    response = await axios(config);
    console.log("response in FightEntryCreate ", response.status);
    if (response.status !== 200) {
      return {
        resultBool: false,
        data: {}
      };
    }
    return {
      resultBool: true,
      data: response.data
    };
  } catch (err) {
    console.log("error in FightEntryCreate,", err);
    return {
      resultBool: false,
      data: {}
    };
  }
}

export async function FightEntryCreateAdmin(user_wallet_address: string, minted_id: string, amount: number) {
  console.log("---------- ", user_wallet_address);
  let response: AxiosResponse;
  try {
    let data = JSON.stringify({
      "user_wallet_address": user_wallet_address,
      "minted_id": minted_id,
      "amount": amount
    });
    let config = {
      method: 'post',
      url: baseUrl + `v1/admin/fight_entry/create/`,
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': "DarthVader",
        'x-client-secret': "ZZ",
      },
      data: data
    };
    response = await axios(config);
    console.log("response in FightEntryCreate ", response.status);
    if (response.status !== 200) {
      return {
        resultBool: false,
        data: {}
      };
    }
    return {
      resultBool: true,
      data: response.data
    };
  } catch (err) {
    console.log("error in FightEntryCreate,", err);
    return {
      resultBool: false,
      data: {}
    };
  }
}

export async function FightEntryCreateV2(
  p1_address: string,
  p1_minted_id: string,
  p2_address: string,
  p2_minted_id: string
) {
  let response: AxiosResponse;
  try {
    let data = JSON.stringify({
      "p1_address": p1_address,
      "p1_minted_id": p1_minted_id,
      "p2_address": p2_address,
      "p2_minted_id": p2_minted_id,
    });
    let config = {
      method: 'post',
      url: baseUrl + `v2/fight/fight_entry/create/`,
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': "DarthVader",
        'x-client-secret': "ZZ",
      },
      data: data
    };
    response = await axios(config);
    console.log("response in FightEntryCreateV2 ", response.status);
    if (response.status !== 200) {
      return {
        resultBool: false,
        data: {}
      };
    }
    return {
      resultBool: true,
      data: response.data
    };
  } catch (err) {
    console.log("error in FightEntryCreateV2,", err);
    return {
      resultBool: false,
      data: {}
    };
  }
}

export async function FightEntryAdd(p1_wallet: string, p2_wallet: string, minted_id: string) {
  // console.log("---------- ", user_wallet_address);
  let response: AxiosResponse;
  try {
    let data = JSON.stringify({
      "p1_wallet": p1_wallet,
      "p2_wallet": p2_wallet,
      "minted_id": minted_id
    });
    let config = {
      method: 'post',
      url: baseUrl + `v1/fight/fight_entry/add/`,
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': "DarthVader",
        'x-client-secret': "ZZ",
      },
      data: data
    };
    response = await axios(config);
    console.log("response in FightEntryAdd ", response.status);
    if (response.status !== 200) {
      return {
        resultBool: false,
        data: {}
      };
    }
    return {
      resultBool: true,
      data: response.data,
    };
  } catch (err) {
    console.log("error in AddActiveAsset,", err);
    return {
      resultBool: false,
      data: {}
    };
  }
}

export async function FightEntryAddAdmin(p1_wallet: string, p2_wallet: string, minted_id: string, amount: number) {
  let response: AxiosResponse;
  try {
    let data = JSON.stringify({
      "p1_wallet": p1_wallet,
      "p2_wallet": p2_wallet,
      "minted_id": minted_id,
      "amount": amount
    });
    let config = {
      method: 'post',
      url: baseUrl + `v1/admin/fight_entry/add/`,
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': "DarthVader",
        'x-client-secret': "ZZ",
      },
      data: data
    };
    response = await axios(config);
    console.log("response in FightEntryAdd ", response.status);
    if (response.status !== 200) {
      return {
        resultBool: false,
        data: {}
      };
    }
    return {
      resultBool: true,
      data: response.data,
    };
  } catch (err) {
    console.log("error in AddActiveAsset,", err);
    return {
      resultBool: false,
      data: {}
    };
  }
}

export async function UpdateFightEndStats(fight_id: string, p1_last_health: number, p2_last_health: number, p1: string, p2: string) {
  // console.log("---------- ", user_wallet_address);
  let response: AxiosResponse;
  try {
    let data = JSON.stringify({
      "p1_end_health": p1_last_health,
      "p2_end_health": p2_last_health,
      "fight_id": fight_id,
    });
    let config = {
      method: 'post',
      url: baseUrl + `v1/fight/update/result/`,
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': "DarthVader",
        'x-client-secret': "ZZ",
      },
      data: data
    };
    response = await axios(config);
    console.log("response in UpdateFightEndStats ", response.status, p1, p2);
    if (response.status !== 200) {
      return false
    }
    if (!fight_end_called_tracker.includes(fight_id)) {
      fight_end_called_tracker.push(fight_id)
      await FightEndApi(fight_id, p1, p2);
    }

    // let obj = {
    //   event: "fetch_balance",
    //   user_wallet_address: p1,
    // }
    // MessageQueueHandler.FillGameMessageQueue(obj)
    // let obj1 = {
    //   event: "fetch_balance",
    //   user_wallet_address: p2,
    // }
    // MessageQueueHandler.FillGameMessageQueue(obj1)
    return true;
  } catch (err) {
    console.log("error in UpdateFightEndStats,", err);
    return false;
  }
}

export async function UpdateFightStartedState(fight_id: string) {
  console.log("-----in UpdateFightStartedState----- ", fight_id);
  let response: AxiosResponse;
  try {
    let data = JSON.stringify({
      "state": 20,
      "fight_id": fight_id,
    });
    let config = {
      method: 'post',
      url: baseUrl + `v1/fight/update/state/`,
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': "DarthVader",
        'x-client-secret': "ZZ",
      },
      data: data
    };
    response = await axios(config);
    console.log("response in UpdateFightState ", response.status);
    if (response.status !== 200) {
      return false
    }
    return true;
  } catch (err) {
    console.log("error in UpdateFightState,", err);
    return false;
  }
}

export async function FightEndApi(fight_id: string, p1, p2) {
  let response: AxiosResponse;
  try {
    let data = JSON.stringify({
      "fight_id": fight_id,
    });
    let config = {
      method: 'post',
      url: baseUrl + `v1/fight/end/`,
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': "DarthVader",
        'x-client-secret': "ZZ",
      },
      data: data
    };
    response = await axios(config);
    console.log("response in FightEnd ", response.status);
    setTimeout(() => {
      MessageQueueHandler.SendBalanceUpdateMessageToAll([p1, p2])
    }, 1000)
    if (response.status !== 200) {
      return false
    }
    return true
  } catch (err) {
    console.log("error in FightEnd,", err);
    return false;
  }
}

export async function FightQueueExitApi(fight_id: string, user_wallet_address: string, other_wallet_address: string) {
  let response: AxiosResponse;
  try {
    let data = JSON.stringify({
      "fight_id": fight_id,
      "user_wallet_address": user_wallet_address
    });
    let config = {
      method: 'post',
      url: baseUrl + `v1/fight/queue/exit/`,
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': "DarthVader",
        'x-client-secret': "ZZ",
      },
      data: data,
    };
    response = await axios(config);
    console.log("response in FightQueueExitApi ", response.status);
    if (response.status !== 200) {
      return false
    }
    // let obj = {
    //   event: "fetch_balance",
    //   user_wallet_address,
    // }
    // MessageQueueHandler.FillGameMessageQueue(obj)
    // let obj1 = {
    //   event: "fetch_balance",
    //   other_wallet_address,
    // }
    // MessageQueueHandler.FillGameMessageQueue(obj1)
    MessageQueueHandler.SendBalanceUpdateMessageToAll()
    return true
  } catch (err) {
    console.log("error in FightQueueExitApi,", err);
    return false;
  }
}

export async function QueuePoolExitApi(user_wallet_address: string) {
  let response: AxiosResponse;
  try {
    let data = JSON.stringify({
      "user_wallet_address": user_wallet_address
    });
    let config = {
      method: 'post',
      url: baseUrl + `v2/fight/queue/exit/`,
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': "DarthVader",
        'x-client-secret': "ZZ",
      },
      data: data,
    };
    response = await axios(config);
    console.log("response in QueuePoolExitApi ", response.status);
    if (response.status !== 200) {
      return false
    }
    let obj = {
      event: "fetch_balance",
      user_wallet_address,
    }
    MessageQueueHandler.FillGameMessageQueue(obj)
    return true
  } catch (err) {
    console.log("error in FightQueueExitApi,", err);
    return false;
  }
}

// export async function GetFightInfo(fight_id: string) {
//   let response: AxiosResponse;
//   try {
//     let config = {
//       method: 'get',
//       url: baseUrl + `v1/fight/info/server/fetch/${fight_id}/`,
//       headers: {
//         'Content-Type': 'application/json',
//         'x-client-id': "DarthVader",
//         'x-client-secret': "ZZ",
//       },
//     };
//     response = await axios(config);
//     console.log("response in GetFightInfo ", response.status);
//     if (response.status !== 200) {
//       return null
//     }
//     return response.data;
//   } catch (err) {
//     console.log("error in GetFightInfo,", err);
//     return null;
//   }
// }


export async function JackPotWinEventApi(target_number, user_wallet_address, minted_id) {
  let response: AxiosResponse;
  try {
    let data = JSON.stringify({
      "target_number": target_number,
      "user_wallet_address": user_wallet_address,
      "minted_id": minted_id,
    });
    let config = {
      method: 'post',
      url: baseUrl + `v1/jackpot/win/`,
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': "DarthVader",
        'x-client-secret': "ZZ",
      },
      data: data
    };
    response = await axios(config);
    console.log("response in JackPotWinEvent ", response.status, response.data);
    if (response.status !== 200) {
      return { success: false, data: -1 }
    }
    return { success: true, data: response.data.data }
  } catch (err) {
    console.log("error in JackPotWinEvent,", err);
    return { success: false, data: -1 };
  }
}

export async function RatKillReceiveReward(user_wallet_address: string, rat_uuid: string) {
  console.log("----------RatKillReceiveReward ", user_wallet_address, rat_uuid);
  let response: AxiosResponse;
  try {
    let data = JSON.stringify({
      "user_wallet_address": user_wallet_address,
      "rat_uuid": rat_uuid,
    });
    let config = {
      method: 'post',
      url: baseUrl + `v1/internal/receive/reward/`,
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': "DarthVader",
        'x-client-secret': "ZZ",
      },
      data: data
    };
    response = await axios(config);
    console.log("response in RatKillReceiveReward ", response.status);
  } catch (err) {
    console.log("error in RatKillReceiveReward,", err);
  }
}

export async function ReceiveAdminItemReward(user_wallet_address: string, item_name: string) {
  console.log("----------ReceiveAdminItemRewaRD ", user_wallet_address, item_name);
  let response: AxiosResponse;
  try {
    let data = JSON.stringify({
      "user_wallet_address": user_wallet_address,
      "item_name": item_name,
    });
    let config = {
      method: 'post',
      url: baseUrl + `v1/internal/receive/admin/reward/`,
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': "DarthVader",
        'x-client-secret': "ZZ",
      },
      data: data
    };
    response = await axios(config);
    console.log("response in ReceiveAdminItemRewaRD ", response.status);
  } catch (err) {
    console.log("error in ReceiveAdminItemRewaRD,", err);
  }
}

