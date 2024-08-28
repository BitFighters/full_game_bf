const axios = require("axios");

// var WebSocketClient = require("websocket").client;
var W3CWebSocket = require("websocket").w3cwebsocket;

const REACT_APP_BASE_API_ANAKIN_URL = "https://anakin.dev.bitfighters.club";
// const REACT_APP_BASE_API_ANAKIN_URL = "http://localhost:3000";

function randomNickNameGenarate() {
  var adjs = [
    "Fudster",
    "Jeeter",
    "N00b",
    "Dogeboy",
    "ShitCoinSam",
    "RugPullRon",
    "CryptoKid",
    "Hodler",
    "AltQueen",
    "EtherealG",
    "PumpKing",
    "BlockHead",
    "Mooner",
    "FomoJoe",
    "GasGuzzler",
    "BinanceBob",
    "ChainChad",
    "MetaBoy",
    "DefiDan",
    "StakeMike",
    "BullrunBen",
    "WalletWiz",
    "MinerMax",
    "ShillSue",
    "SamBankman",
    "ElonCrust",
    "JanetJerome",
    "USDtoZero",
    "FartKnocker",
    "SlickWilly",
    "BitBoy",
    "BotMan",
    "CoinKarl",
    "GetREKT",
    "StankyManky",
    "BTC4LIFE",
    "DumpinBags",
    "Finnick",
    "RogueTard",
    "HodlHarry",
    "EthFairy",
    "CryptoFren",
    "GoblinJack",
    "PiggyBooBoo",
    "TokenDude",
    "NetRunner",
    "ForkFace",
    "BearBryan",
    "DNTRUGME",
    "h4x0r",
    "CoinFolk",
    "BearBoy",
    "ChainChad",
    "NodeMan",
    "TetherTed",
    "LameDuck",
    "MysticMax",
    "Web3Wendel",
    "RugRider",
    "CryptoCat",
    "FintechBoy",
    "DefiDonny",
  ];

  return adjs[Math.floor(Math.random() * (adjs.length - 1))];
}
function getSpawnPoints() {
  const random_spawn_points_player = [
    {
      x: 500,
      y: 500,
    },
    {
      x: 500,
      y: 550,
    },
    {
      x: 550,
      y: 550,
    },
    {
      x: 550,
      y: 600,
    },
    {
      x: 450,
      y: 800,
    },
    {
      x: 450,
      y: 650,
    },
    {
      x: 450,
      y: 700,
    },
    {
      x: 450,
      y: 750,
    },
    {
      x: 450,
      y: 600,
    },
  ];
  return random_spawn_points_player[Math.floor(Math.random() * random_spawn_points_player.length)];
}
let sprites = [
  "https://new-dev-assets.s3.ap-south-1.amazonaws.com/0xb4c2d38ca5382b565cb9e8f849da42d8e441b59e-03200200310002d0014-sprite.png",
  "https://new-dev-assets.s3.ap-south-1.amazonaws.com/0xb4c2d38ca5382b565cb9e8f849da42d8e441b59e-00210110051032d0011-sprite.png",
  "https://new-dev-assets.s3.ap-south-1.amazonaws.com/0xb4c2d38ca5382b565cb9e8f849da42d8e441b59e-00000400410030d1013-sprite.png",
  "https://new-dev-assets.s3.ap-south-1.amazonaws.com/0xb4c2d38ca5382b565cb9e8f849da42d8e441b59e-01400301500004d1012-sprite.png",
  "https://new-dev-assets.s3.ap-south-1.amazonaws.com/0xb4c2d38ca5382b565cb9e8f849da42d8e441b59e-00030330053010d1012-sprite.png",
  "https://new-dev-assets.s3.ap-south-1.amazonaws.com/0xb4c2d38ca5382b565cb9e8f849da42d8e441b59e-00000000120000d0013-sprite.png",
  "https://new-dev-assets.s3.ap-south-1.amazonaws.com/0xb4c2d38ca5382b565cb9e8f849da42d8e441b59e-02100002320001d0014-sprite.png",
  "https://new-dev-assets.s3.ap-south-1.amazonaws.com/0xb4c2d38ca5382b565cb9e8f849da42d8e441b59e-00110410051001d0012-sprite.png",
];

const FindClosestPoint = (bot_pos, rats_pos) => {
  if (rats_pos.length <= 0) return { x: 0, y: 0 };
  let minV = "9999999";
  let minPos = rats_pos[0];
  for (let i = 0; i < rats_pos.length; i++) {
    const rat_pos = rats_pos[i];
    const dist = Math.sqrt(Math.pow(bot_pos.x - rat_pos.x, 2) + Math.pow(bot_pos.y - rat_pos.y, 2));
    if (dist < minV) {
      minPos = rat_pos;
      minV = dist;
    }
  }
  minPos.x = Math.max(minPos.x + 30, 0);
  console.log("Final Cats position", minPos);
  return minPos;
};
// const REACT_APP_BASE_API_ANAKIN_URL = "http://192.168.8.107:3000";
// let client = new W3CWebSocket("ws://128.0.0.1:9001");
let number_of_connections = 10;
let other_joined = false;
const brew_pos = {
  x: 371,
  y: 577,
};

function generateRandomString(myLength) {
  const chars = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
  const randomArray = Array.from(
    {
      length: myLength,
    },
    (v, k) => chars[Math.floor(Math.random() * chars.length)]
  );
  const randomString = randomArray.join("");
  return randomString;
}

async function handleW3Conection() {
  // let client = new W3CWebSocket("wss://xmfjtk.edge.hathora.dev:25334");
  let client = new W3CWebSocket("ws://localhost:9001/");
  const bot_level = 2;
  //0: easy
  //1: medium
  //2: hard

  // let joining_message = [];
  let players_move_message_last = {};
  let wallet = "";
  let nickName = "TEST";
  let mintedId = 0;
  let join_json = {};
  let stop_move = false;
  let first_move = false;
  let stop_move_fight = false;
  let move_to_point = false;
  let bot_position = { x: 0, y: 0 };
  let rats_flag = false;
  let rats_positiions = [];
  let kickable = false;
  let opposit_player_wallet = "";
  let opposit_player_pos = {};
  let joined = false;
  let fight_flag = false;
  let go_to_fight = false;

  let go_to_buy_brew = false;
  let new_move_flag_after_rats = false;

  let brew_bought = false;

  let targetPos = {
    x: 432,
    y: 508,
  };

  function getMoveMessage(user_wallet) {
    if (user_wallet in players_move_message_last && new Date().getTime() - players_move_message_last[user_wallet].last_update < 5 * 1000) {
      return players_move_message_last[user_wallet].message;
    }
    const rand = Math.random();
    const runBool = Math.random() > 0.5;
    let direction = [];
    if (rand >= 0.75) {
      right_move = true;
      direction.push("right");
    } else if (rand >= 0.5 && rand < 0.75) {
      down_move = true;
      direction.push("down");
    } else if (rand >= 0.25 && rand < 0.5) {
      up_move = true;
      direction.push("up");
    } else {
      left_move = true;
      direction.push("left");
    }

    let new_move_message = {
      event: "move",
      delta: 30,
      walletAddress: user_wallet,
      action_id: "8f6d9d67-6037-4ecb-9af5-7aefcc496bbe",
      orientation_switch: true,
      direction,
      running: runBool,
    };

    players_move_message_last[user_wallet] = {
      message: new_move_message,
      last_update: new Date().getTime(),
    };
    return new_move_message;
  }

  function getJoiningMessage(wallet_string, nickName, mintedId) {
    let pos = getSpawnPoints();
    console.log("--- ", pos);
    bot_position = pos;
    const bot_sprite = sprites[Math.min(Math.trunc(Math.random() * sprites.length), sprites.length - 1)];
    return {
      event: "joined",
      walletAddress: wallet_string,
      sprite_url: bot_sprite,
      //        "https://new-dev-assets.s3.ap-south-1.amazonaws.com/bitfighter/7PmNdiiiOnP0s1QAOPw49KVY71kpnNdGNuVROEH8FHbHpD9nOo-155008083320005d0014-sprite.png",
      minted_id: -1 * mintedId,
      nick_name: nickName,
      attributes: [
        { trait_type: "Defense", value: 3 },
        { trait_type: "Health", value: 5 },
        { trait_type: "Kick", value: 4 },
        { trait_type: "Punch", value: 4 },
        { trait_type: "Speed", value: 1 },
        { trait_type: "Stamina", value: 3 },
        { trait_type: "Hat/Hair", value: "Black Slick" },
        { trait_type: "Eyes", value: "Determined" },
        { trait_type: "Head", value: "Jack" },
        { trait_type: "Hands", value: "Hands" },
        { trait_type: "Arms", value: "Black Ninja" },
        { trait_type: "Body", value: "White Ninja" },
        { trait_type: "Legs", value: "Grey Sweats" },
        { trait_type: "Feet", value: "Timbies" },
        { trait_type: "Rarity", value: "Common" },
      ],
      profile_image: bot_sprite,
      //"https://new-dev-assets.s3.ap-south-1.amazonaws.com/bitfighter/7PmNdiiiOnP0s1QAOPw49KVY71kpnNdGNuVROEH8FHbHpD9nOo-155008083320005d0014-profile.png",
      last_position_x: pos.x,
      last_position_y: pos.y,
      orientation: "right",
      user_type: "web2",
    };
  }

  const EnterFightQueueApi = async (amount, userWalletAddress) => {
    console.log(amount, userWalletAddress);
    const result = await axios.post(
      `${REACT_APP_BASE_API_ANAKIN_URL}/v1/fight/admin/queue/enter/`,
      {
        fight_bet_money: amount,
        user_wallet_address: userWalletAddress,
        identity: "bot",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-client-id": "DarthVader",
          "x-client-secret": "ZZ",
        },
      }
    );

    console.log(result.data);
    return result.data;
  };

  const BuyingBrew = async (userWalletAddress) => {
    console.log("BuyingBrew", userWalletAddress);
    if (brew_bought) return null;

    try {
      const result = await axios.post(
        `${REACT_APP_BASE_API_ANAKIN_URL}/v1/internal/assets/add/`,
        {
          asset_name: "brew",
          quantity: 1,
          user_wallet_address: userWalletAddress,
          partner_id: "Bitfighter",
          identity: "bot",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-client-id": "DarthVader",
            "x-client-secret": "ZZ",
          },
        }
      );
      brew_bought = true;
      setTimeout(() => {
        brew_bought = false;
      }, 20 * 1000);
      return result.data;
    } catch (error) {
      console.error("Error in BuyingBrew:", error);
      throw error;
    }
  };

  const start_play = async (client) => {
    const add_json = {
      event: "add_queue",
      data: {
        minted_id: join_json.minted_id,
        nick_name: join_json.nick_name,
        profile_image: join_json.profile_image,
        user_wallet_address: join_json.walletAddress,
        betAmount: 0,
        ante: 5000,
      },
    };

    EnterFightQueueApi(50, join_json.walletAddress)
      .then((res) => {
        console.log(res);
        if (res.success == 1) {
          client.send(JSON.stringify(add_json));
        }
        joined = true;
      })
      .catch((err) => console.warn(err));
  };

  const confirm_fight = async (client, wallet) => {
    const confirm_json = {
      event: "fight_confirmation_accepted",
      walletAddress: wallet,
    };
    client.send(JSON.stringify(confirm_json));
  };

  const start_fight = async (client, wallet) => {
    console.log("start to kick and punch");

    if (bot_level < 2) {
      function sendNumber() {
        console.log("Fighting move with level 0,1 _003");
        if (client.readyState === client.OPEN) {
          const move_json = getMoveMessage(wallet);
          client.send(JSON.stringify(move_json));
          if (stop_move_fight) return;
          setTimeout(sendNumber, Math.floor(2000 / 25) * 5);
        }
      }
      sendNumber();
    } else {
      targetPos = {
        x: opposit_player_pos.x,
        y: opposit_player_pos.y,
      };
      moveToPoint(client);
    }

    setInterval(() => {
      const attacktype = Math.random() > 0.5 ? "kick" : "punch";
      const attack_json = {
        event: attacktype,
        walletAddress: wallet,
      };
      if (bot_level == 0) {
        if (fight_flag) client.send(JSON.stringify(attack_json));
      } else if (bot_level == 1) {
        if (Math.abs(bot_position.x - opposit_player_pos.x) < 50 && Math.abs(bot_position.y - opposit_player_pos.y) < 50) kickable = true;
        else kickable = false;

        if (fight_flag && kickable) client.send(JSON.stringify(attack_json));
      } else {
        if (Math.abs(bot_position.y - opposit_player_pos.y) < 15 && Math.abs(bot_position.x - opposit_player_pos.x) < 50) {
          console.log(bot_position, opposit_player_pos);
          if (bot_position.x > opposit_player_pos.x) {
            client.send(
              JSON.stringify({
                event: "move",
                delta: 1,
                walletAddress: wallet,
                action_id: "8f6d9d67-6037-4ecb-9af5-7aefcc496bbe",
                orientation_switch: true,
                direction: ["left"],
                running: false,
              })
            );
          } else {
            client.send(
              JSON.stringify({
                event: "move",
                delta: 1,
                walletAddress: wallet,
                action_id: "8f6d9d67-6037-4ecb-9af5-7aefcc496bbe",
                orientation_switch: true,
                direction: ["right"],
                running: false,
              })
            );
          }
          kickable = true;
        } else {
          kickable = false;
        }

        if (fight_flag && kickable) client.send(JSON.stringify(attack_json));
      }
    }, Math.max(Math.random(), 0.4) * 2 * 1000);
  };

  function moveToPoint(client) {
    if (other_joined && other_joined !== wallet) {
      stop_move = false;
      go_to_fight = false;

      // function sendNumber() {
      //   first_move = true;
      //   const move_json = getMoveMessage(wallet);
      //   client.send(JSON.stringify(move_json));
      //   if (stop_move) return;
      //   setTimeout(sendNumber, Math.floor(2000 / 25));
      // }
      // sendNumber();
      return;
    }

    if (rats_flag == true && rats_positiions.length > 1) {
      console.log("Catching Rats", targetPos);
      targetPos = FindClosestPoint(bot_position, rats_positiions);
    }

    if (fight_flag) {
      targetPos = {
        x: opposit_player_pos.x + 30,
        y: opposit_player_pos.y,
      };
    }

    let direction = [];
    const cx = bot_position.x;
    const cy = bot_position.y;
    const tx = targetPos.x;
    const ty = targetPos.y;

    if (Math.abs(cx - tx) < 10 && Math.abs(cy - ty) < 10) {
      console.log("Moved to Point", cx, cy, tx, ty);

      client.send(
        JSON.stringify({
          event: "move",
          delta: 1,
          walletAddress: wallet,
          action_id: "8f6d9d67-6037-4ecb-9af5-7aefcc496bbe",
          orientation_switch: true,
          direction: ["left"],
          running: false,
        })
      );
      const attack_json = {
        event: "punch",
        walletAddress: wallet,
      };

      if (rats_flag) {
        setInterval(() => {
          const attacktype = Math.random() > 0.5 ? "kick" : "punch";
          const attack_json1 = {
            event: attacktype,
            walletAddress: wallet,
          };
          if (rats_flag) client.send(JSON.stringify(attack_json1));
        }, Math.max(Math.random(), 0.4) * 2 * 1000);
      } else client.send(JSON.stringify(attack_json));

      console.log(go_to_buy_brew, !fight_flag);
      if (go_to_buy_brew && !fight_flag) {
        setTimeout(() => {
          BuyingBrew(wallet).then((res) => {
            console.log("Drink Brew", res);
            if (res) {
              const drink = {
                event: "brew_used",
                walletAddress: wallet,
                x: 351.5,
                y: 584.5,
              };
              go_to_buy_brew = false;
              client.send(JSON.stringify(drink));
            }
          });
        }, 1000);
      } else {
        if (!joined) {
          start_play(client);
          joined = true;
        }
      }

      console.log("flight_flag ------------------------", fight_flag);
      move_to_point = false;
      if (!fight_flag && !rats_flag) return;
    }

    if (tx > cx) {
      direction.push("right");
    } else {
      direction.push("left");
    }

    if (ty > cy) {
      direction.push("down");
    } else {
      direction.push("up");
    }

    let new_move_message = {
      event: "move",
      delta: 30,
      walletAddress: wallet,
      action_id: "8f6d9d67-6037-4ecb-9af5-7aefcc496bbe",
      orientation_switch: true,
      direction,
      running: false,
    };

    client.send(JSON.stringify(new_move_message));

    setTimeout(() => {
      moveToPoint(client);
    }, Math.floor(2000 / 25));
  }

  client.onerror = function (err) {
    console.log("Connection Error ", err);
  };

  client.onopen = function () {
    wallet = generateRandomString(10);
    // let nickName = generateRandomString(5)
    nickName = randomNickNameGenarate();
    mintedId = Math.floor(Math.random() * 1000 + 10000);
    console.log("WebSocket Client Connected ");
    join_json = getJoiningMessage(wallet, nickName, mintedId);
    client.send(JSON.stringify(join_json));

    console.log(join_json);

    // BuyingBrew(wallet);

    function sendNumber() {
      if (client.readyState === client.OPEN) {
        first_move = true;
        const move_json = getMoveMessage(wallet);
        client.send(JSON.stringify(move_json));
        if (stop_move) return;
        setTimeout(sendNumber, Math.floor(2000 / 25));
      }
    }
    sendNumber();
  };

  client.onclose = function () {
    console.log("echo-protocol Client Closed ");
  };

  client.onmessage = function (e) {
    const objs = JSON.parse(e.data.replace(/'/g, '"'));

    if (objs.length > 0) {
      for (let i = 0; i < objs.length; i++) {
        const obj = objs[i];

        // console.log(obj.event);

        if (obj.event === "queue_info" && joined == false) {
          // console.log("queue_info..", obj.data);
          if (obj.data.length % 2 == 1 && !other_joined) {
            other_joined = wallet;
            console.log("Start to Paly");
            stop_move = true;
            go_to_fight = true;
            targetPos = {
              x: 432,
              y: 508,
            };

            if (!move_to_point) {
              console.log("start func");
              moveToPoint(client);
            }
          }
        } else if (obj.event === "ping") {
          client.send(
            JSON.stringify({
              event: "pong",
              walletAddress: wallet,
              orientation: "",
              room_id: "lobby",
              message: "https://new-dev-assets.s3.ap-south-1.amazonaws.com/bitfighter/7PmNdiiiOnP0s1QAOPw49KVY71kpnNdGNuVROEH8FHbHpD9nOo-155008083320005d0014-sprite.png", //this.game.nftData.sprite_image,
            })
          );
        } else if (obj.event === "kick" || obj.event === "punch" || obj.event === "stop_show_stuned" || obj.event === "fight_end_announcement" || obj.event === "stop_show_stunned") {
        } else if (obj.event === "update_health") {
          const health = obj.health;
          if (obj.walletAddress === wallet && !go_to_buy_brew && health < 50) {
            targetPos = brew_pos;
            go_to_buy_brew = true;
            stop_move = false;
            console.log("update_health~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", health);
            moveToPoint(client);
            // setTimeout(() => {
            //   go_to_buy_brew = false;
            // }, 30 * 1000);
          }
        } else if (obj.event === "mouse_update") {
          if (!fight_flag) {
            const rats = obj.rats_positiions;
            rats_positiions = rats;

            if (rats && rats.length > 1) {
              targetPos = FindClosestPoint(bot_position, rats_positiions);
              console.log("Updated Rat Position", targetPos, "rat!!!!!!!!!");
            }

            if (rats && rats.length > 1 && !rats_flag && !go_to_fight && !stop_move_fight) {
              console.log("rats appeared", rats);
              rats_flag = true;

              console.log("Start to Seek Rats");
              stop_move = true;
              move_to_point = false;
              targetPos = FindClosestPoint(bot_position, rats_positiions);
              moveToPoint(client);
            } else {
              if (rats.length <= 1) {
                rats_flag = false;
                if (!new_move_flag_after_rats && !stop_move && !first_move) {
                  new_move_flag_after_rats = true;
                  function sendNumber() {
                    console.log("after_rats_move_002");
                    if (client.readyState === client.OPEN) {
                      const move_json = getMoveMessage(wallet);
                      client.send(JSON.stringify(move_json));
                      if (stop_move) return;
                      setTimeout(sendNumber, Math.floor(2000 / 25) * 2);
                    }
                  }
                  sendNumber();
                }
              }
            }
          }
        } else if (obj.event === "move") {
          console.log(obj);
        } else if (obj.event === "fight_announcement") {
          console.log("fight_announcement", obj);
          if (obj.winner == wallet || obj.loser == wallet) {
            console.log("Bot don't need to kick or punch");
            fight_flag = false;
            setTimeout(() => {
              joined = false;
            }, 5000);
            stop_move_fight = true;
            stop_move = false;
            go_to_fight = false;
            other_joined = false;
            function sendNumber() {
              console.log("After fight move 005");
              if (client.readyState === client.OPEN) {
                const move_json = getMoveMessage(wallet);
                client.send(JSON.stringify(move_json));
                if (stop_move) return;
                setTimeout(sendNumber, Math.floor(2000 / 25) * 2);
              }
            }
            sendNumber();
          }
        } else if (obj.event === "fight_update") {
          // console.log("fight_update", obj);
        } else if (obj.event === "fight_confirmation") {
          console.log("fight_confirmation", obj, wallet);
          if (obj.walletAddress === wallet) confirm_fight(client, wallet);
        } else if (obj.event === "fight_start_pre_announcement") {
          if (obj.player1 == wallet || obj.player2 == wallet) {
            fight_flag = true;
            console.log("fight_start_pre_announcement", obj, wallet);
            // if (obj.walletAddress !== wallet)
            if (obj.player1 === wallet) opposit_player_wallet = obj.player2;
            else opposit_player_wallet = obj.player1;
            stop_move = false;
            start_fight(client, wallet);
          }
        } else {
          // stop_show_stunned;
          // stop_show_stunned;
          console.log(obj.event);
        }
      }
    } else {
      if (objs.event === "move") {
        if (objs.walletAddress === wallet) {
          bot_position = {
            x: objs.x,
            y: objs.y,
          };
          // console.log(bot_position);aaaaaaaa
        }
        // if (objs.walletAddress !== wallet) console.log(objs.x, objs.y);

        if (objs.walletAddress === opposit_player_wallet && fight_flag) {
          console.log(objs.walletAddress, objs.x, objs.y);
          opposit_player_pos = {
            x: objs.x,
            y: objs.y,
          };
        }
      }
    }
  };
}

async function main() {
  console.log("Starting connections...");

  const maxDelay = 10000; // Maximum delay in milliseconds

  for (let i = 0; i < number_of_connections; i++) {
    // Random delay for each bot to start the connection
    const delay = Math.random() * maxDelay;

    setTimeout(() => {
      console.log(`Connecting bot ${i + 1}`);
      handleW3Conection(); // Assuming your function doesn't need arguments to manage different bots
    }, delay);
  }

  console.log("All connection attempts scheduled.");
}

main();

process.stdin.resume();
console.log("The process will stay alive until manually terminated.");
