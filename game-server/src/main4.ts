import { OUTER_BOUNDARY } from './boundaries/outer_boundary';
import { ICompressedNFTDataOfConnections, IFightEntry, IKeysInfo, INFTDataOfConnections, IPosition, IRatsStateManager, NewQueueDB, QueueDB } from "interfaces";
import { isNullOrUndefined } from "util";
import { v4 as uuidv4 } from "uuid";
import { INNER_BOUNDARY, center_of_stage, totalBoundaries } from "./boundaries";
import { HealthManager } from "./components/HealthManager";
import { FightHandler } from "./components/fightHandler";
import { FightQueueHandler } from "./components/fightQueueHandler";
import { MessageQueueHandler } from "./components/messageQueueHandler";
import { PlayersDataHandler } from "./components/playersDataHandler";
import {
  DEFAULT_SPRITE_DISPLAY_HEIGHT,
  DEFAULT_SPRITE_DISPLAY_WIDTH_COLLISION_FIGHT,
  HealthAndStaminaMap,
  KICK_SPEED,
  KickPowerMap,
  PUNCH_SPEED,
  RunSpeedMap,
  SERVER_REFRESH_RATE,
  SPEED_TO_ACTUAL_STAMINA_REDUCTION_MULTIPLIER,
  StaminaRegenarationMap,
  TotalHealth,
  TotalStamina,
  WalkSpeedMap,
  createEmptyPlayer,
  MaxHealthRegenarationMap,
  HealthRegenarationMap,
  AttackNullifyChance,
  AutoAttackReductionBonus,
  StaminaLossOfDefender,
  ExhaustedTimeMap,
  FIXED_GET_UP_TIME,
  PLAYERS_LIMIT_COUNT,
  MAX_RATS_MOVEMENT,
  MIN_RATS_MOVEMENT,
  RatState,
  RATS_COUNT,
  RATS_SHIFT_MULTIPLIER_AFTER_ATTACK,
  RATS_TOTAL_HEALTH,
  DEFAULT_SPRITE_DISPLAY_WIDTH,
  MIN_RATS_COUNT,
  ITEM_PICK_UP_DISTANCE,
} from "./constants/constants";
import { random_spawn_points_player } from "./constants/player_spawn_points";
import { FightEntryAdd, FightEntryCreate, UpdateFightEndStats, UpdateFightStartedState } from "./services/ApiCaller";
import { basicCollisionAndMovementPlayerV3, basicCollisionWithBoundaryAndPlayer, checkOnlyColissionWithBoundaries, checkOnlyColissionWithBoundariesMouse, getSecondsDifference, rectangularCollision } from "./utils";
import { LatencyChecker } from "./components/LatencyChecker";
import { BrewManager } from "./components/BrewMananger";
import { QueuePoolHandler } from "./components/QueuePoolHandler";
import * as _ from "lodash";
import { JackPotWheelLogic } from "./components/JackPotWheelLogic";
// import { OUTER_COLISION_BOUNDARY } from "./boundaries/collision_map";
import { random_spawn_points } from "./constants/rats_spawn_points";
import { IRatRewardInfo, RatsPPRewardPoolData } from "./components/RatsPPRewardPoolData";
import { ItemManager } from "./components/ItemsManager/ItemMananger";
const uWS = require("uWebSockets.js");

// let messageQueue = new Queue<any>();
let messageQueue = [];

console.log("len of boundariyy ", totalBoundaries.length);

// var WebSocketServer = ws.server;
const PORT = process.env.PORT || 9001;
const PROTOCOL = process.env.PROTOCOL || "";

console.log("--- port --", PORT, process.env.PORT, process.env.MY_POD_IP, process.env.ENV);

var enc = new TextDecoder("utf-8");

function originIsAllowed(origin) {
  console.log("origin ", origin);
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

function sendMessageToAll(msg: string) {
  let arr = Object.keys(ConnectionToUserUidMapping);
  for (let i = 0; i < arr.length; i++) {
    ConnectionToUserUidMapping[arr[i]].send(msg, false);
  }
}

function sendMessageToOne(element, msg: string) {
  element.send(msg, false);
}

// var PlayersDataHandler.nftDataofLiveConnections: Array<INFTDataOfConnections> =[];
var ConnectionToUserUidMapping = {};
// var connections: Array<ws.connection> = [];
var totalConnectionCount = 0;
// var queueData: Array<QueueDB> = []

function AddToChatQueue(data: any) {
  // console.log("adding to chat queue ",messageQueue.length, data, )
  data["msgId"] = uuidv4();
  // let mq2 = []
  if (messageQueue.length > 50) {
    messageQueue = messageQueue.slice(1);
    messageQueue.push(data);
    // messageQueue.dequeue()
    // messageQueue.enqueue(data)
  } else {
    messageQueue.push(data);
    // messageQueue.enqueue(data)
  }
  console.log("added to chat queue ", messageQueue.length);

  // messageQueue = mq2
}

function SendAllChatsToConnection(connection: any) {
  // console.log("sending_all_chats_to_connection ", messageQueue)
  var message = {
    event: "all_chats",
    chats: messageQueue,
  };
  sendMessageToOne(connection, JSON.stringify(message));
}

// function sendLiveBitFighterstoAll() {
//   console.log(" in sendLiveBitfighterstoAll -- ", PlayersDataHandler.nftDataofLiveConnections.length)
//   let arr = []
//   for (let i = 0; i < PlayersDataHandler.nftDataofLiveConnections.length; i++) {
//     let data = PlayersDataHandler.nftDataofLiveConnections[i];
//     if (getSecondsDifference(data.status_timer) < 15 * 1000) {
//       let ndata = playerDataReduceForJoining(data)
//       arr.push(ndata)
//     }
//   }
//   console.log("count of live players is ---> ", arr.length, PlayersDataHandler.nftDataofLiveConnections.length)
//   let obj = {
//     event: 'live_players_init',
//     live_players: arr
//   }
//   // console.log(obj)
//   MessageQueueHandler.FillGameMessageQueue(obj)
//   // sendMessageToAll(JSON.stringify(obj))
// }

function sendLiveBitFighterstoOne(connection: any) {
  // console.log(" in sendLiveBitfighterstoAll -- ", PlayersDataHandler.nftDataofLiveConnections.length)
  let arr = [];
  for (let i = 0; i < PlayersDataHandler.nftDataofLiveConnections.length; i++) {
    let data = PlayersDataHandler.nftDataofLiveConnections[i];
    // if (getSecondsDifference(data.status_timer) < 15 * 1000) {
    //   let ndata = playerDataReduceForJoining(data);
    //   arr.push(ndata);
    // }
    let ndata = playerDataReduceForJoining(data);
    arr.push(ndata);
  }
  // console.log("count of live players is ---> ", arr.length, PlayersDataHandler.nftDataofLiveConnections.length)
  let obj = {
    event: "live_players_init",
    live_players: arr,
  };
  // console.log("sendLiveBitFighterstoOne", obj)

  sendMessageToOne(connection, JSON.stringify([obj]));
}

function sendThisPlayerToAll(data: INFTDataOfConnections) {
  console.log(" in sendLiveBitFighterstoOne -- ", PlayersDataHandler.nftDataofLiveConnections.length);
  let arr = [];
  for (let i = 0; i < PlayersDataHandler.nftDataofLiveConnections.length; i++) {
    let data = PlayersDataHandler.nftDataofLiveConnections[i];
    // if (getSecondsDifference(data.status_timer) < 15 * 1000) {
    //   let ndata = playerDataReduceForJoining(data);
    //   arr.push(ndata);
    // }
    let ndata = playerDataReduceForJoining(data);
    arr.push(ndata);
  }
  // let arr = [data]
  let obj = {
    event: "live_players_init",
    live_players: arr,
  };
  MessageQueueHandler.FillGameMessageQueue(obj);
}

const server = uWS
  ./*SSL*/ App()
  .ws("/*", {
    compression: uWS.SHARED_COMPRESSOR,
    maxPayloadLength: 16 * 1024 * 1024,
    idleTimeout: 10,
    open: (connection) => {
      console.log("A WebSocket connected!");
    },
    message: async (connection, message, isBinary) => {
      // console.log("--", message)
      // console.log(enc.decode(message));
      // let ok = connection.send(message, isBinary);

      try {
        // let obj = JSON.parse(message.utf8Data.replace(/'/g, '"'))
        let obj = JSON.parse(enc.decode(message));
        // console.log("debug --- ", obj)
        if (obj.event === "chat") {
          // console.log("chat--", obj)
          obj["type"] = 10;
          AddToChatQueue(obj);
          MessageQueueHandler.FillGameMessageQueue(obj);
        } else if (obj.event == "typing") {
          // sendMessageToAll(JSON.stringify(obj))
          MessageQueueHandler.FillGameMessageQueue(obj);
        } else if (obj.event === "drop_admin_item") {
          console.log(obj)
          let required_player_index = -1;
          for (let i = 0; i < PlayersDataHandler.nftDataofLiveConnections.length; i++) {
            let data = PlayersDataHandler.nftDataofLiveConnections[i];
            if (data.walletAddress === obj.walletAddress) {
              required_player_index = i;
              break;
            }
          }
          console.log(obj, required_player_index)
          if (required_player_index >= 0) {
            let playerData = PlayersDataHandler.nftDataofLiveConnections[required_player_index]
            if (obj.item_id === "admin_coin") {
              ItemManager.addItem(
                playerData.last_position_x,
                playerData.last_position_y,
                "",
                uuidv4(),
                1,
                'admin_coin'
              )
            }
          }

        } else if (obj.event === "joined") {
          console.log("---debug ", obj)
          // ConnectionToUserUidMapping.set(obj.walletAddress, connection)

          if (Object.keys(ConnectionToUserUidMapping).length >= PLAYERS_LIMIT_COUNT) {
            console.log("cannot accept more");
            connection.close();
            return;
          }
          ConnectionToUserUidMapping[obj.walletAddress] = connection;
          // console.log("joined incoming ", obj)

          let personExist = false;
          for (let i = 0; i < PlayersDataHandler.nftDataofLiveConnections.length; i++) {
            let data = PlayersDataHandler.nftDataofLiveConnections[i];
            if (obj.walletAddress != data.walletAddress && obj.walletAddress != data.minted_id) {
              continue;
            } else {
              personExist = true;
              break;
            }
          }
          if (!personExist) {
            let tempDict = {};
            obj.attributes.map((dd) => {
              if (dd.trait_type === "Defense") tempDict["defense"] = dd["value"];
              if (dd.trait_type === "Kick") tempDict["kickpower"] = dd["value"];
              if (dd.trait_type === "Punch") tempDict["punchpower"] = dd["value"];
              if (dd.trait_type === "Health") tempDict["health"] = dd["value"];
              if (dd.trait_type === "Stamina") tempDict["stamina"] = dd["value"];
              if (dd.trait_type === "Speed") tempDict["speed"] = dd["value"];
            });

            // console.log("player joined --- ", tempDict)

            let tempHealth = HealthManager.getHealth(obj.walletAddress, obj.minted_id.toString());
            // console.log("temp health -- > ", tempHealth, obj.walletAddress);
            if (tempHealth === -99) {
              tempHealth = HealthAndStaminaMap[tempDict["health"]] * TotalHealth + TotalHealth;
            }
            // console.log("temp health -- > ", tempHealth);
            let connection_data: INFTDataOfConnections = {
              walletAddress: obj.walletAddress,
              // status: 1,
              status_timer: new Date().getTime(),
              sprite_url: obj.sprite_url,
              // all_nft_data: obj.all_nft_data,
              last_position_x: obj.last_position_x,
              last_position_y: obj.last_position_y,
              orientation: obj.orientation,
              fighting: false,
              minted_id: obj.minted_id,
              nick_name: obj["nick_name"],

              defense: tempDict["defense"],
              // attributes: tempDict,

              // speed related
              speed: tempDict["speed"],
              walk_speed: WalkSpeedMap[tempDict["speed"]],
              run_speed: RunSpeedMap[tempDict["speed"]],

              kickpower: KickPowerMap[tempDict["kickpower"]],
              punchpower: KickPowerMap[tempDict["punchpower"]] / 2,

              health: tempHealth,
              max_upto_regen_health: parseFloat((TotalHealth * MaxHealthRegenarationMap[tempDict["health"]]).toFixed(2)),
              health_regenarate: HealthRegenarationMap[tempDict["health"]],
              health_ap: tempDict["health"],

              stamina: HealthAndStaminaMap[tempDict["stamina"]] * TotalStamina + TotalStamina,
              stamina_regeneration: StaminaRegenarationMap[tempDict["stamina"]],
              stamina_ap: tempDict["stamina"],

              max_stamina: HealthAndStaminaMap[tempDict["stamina"]] * TotalStamina + TotalStamina,
              max_health: HealthAndStaminaMap[tempDict["health"]] * TotalHealth + TotalHealth,

              profile_image: obj["profile_image"],
              stunned: false,
              loginTime: new Date().getTime(),

              all_aps: tempDict,

              brew_equipped: BrewManager.GetBrewState(obj.walletAddress, obj.minted_id.toString()),
              user_type: obj.user_type,

              // died_lastTime: 0,
            };
            // console.log("---", connection_data);
            PlayersDataHandler.nftDataofLiveConnections.push(connection_data);
            PlayersDataHandler.nftDataofLiveConnectionsMap.set(obj.walletAddress, connection_data);
            // console.log(PlayersDataHandler.nftDataofLiveConnections)
            // add joined message...
            let joining_message = {
              event: "joined",
              walletAddress: obj.walletAddress,
              nick_name: obj["nick_name"],
              type: 20,
              message: " Joined",
              health: tempHealth,
              stamina: HealthAndStaminaMap[tempDict["stamina"]] * TotalStamina + TotalStamina,
            };
            HealthManager.setHealth(obj.walletAddress, tempHealth, obj.minted_id.toString());
            // sendMessageToAll(JSON.stringify(joining_message));
            AddToChatQueue(joining_message);
            SendAllChatsToConnection(connection);
            // FetchAssets(obj.walletAddress);
            MessageQueueHandler.FillGameMessageQueue(joining_message);
            if (BrewManager.GetBrewState(obj.walletAddress, obj.minted_id.toString()) || BrewManager.GetSemiBrewState(obj.walletAddress, obj.minted_id.toString())) {
              let brewMessage = {
                event: "semi_equip_brew",
                walletAddress: obj.walletAddress,
                minted_id: obj.minted_id.toString(),
              };
              setTimeout(() => {
                MessageQueueHandler.FillGameMessageQueue(brewMessage);
              }, 2000);
            }

            // let message = {
            //   event: "update_health",
            //   walletAddress: obj.walletAddress,
            //   health: tempHealth,
            // }
            // MessageQueueHandler.FillGameMessageQueue(message)
          }
          // console.log(PlayersDataHandler.nftDataofLiveConnections[PlayersDataHandler.nftDataofLiveConnections.length - 1])
          console.log("current live players ", PlayersDataHandler.nftDataofLiveConnections.length);

          // sendLiveBitFighterstoAll();
          // TODO: instead of this function. write separate fubctions to send all users to the guy who joined now.
          // and send the guy who joined to all the other guys.
          sendLiveBitFighterstoOne(connection);
          sendThisPlayerToAll(PlayersDataHandler.nftDataofLiveConnections[PlayersDataHandler.nftDataofLiveConnections.length - 1]);
        } else if (obj.event === "pong") {
          // console.log("receieved pong ", obj)
          for (let i = 0; i < PlayersDataHandler.nftDataofLiveConnections.length; i++) {
            let data = PlayersDataHandler.nftDataofLiveConnections[i];
            if (obj.walletAddress != data.walletAddress) {
              continue;
            } else {
              data.status_timer = new Date().getTime();
              // data.status = 1;
              PlayersDataHandler.nftDataofLiveConnections[i] = data;
              LatencyChecker.setPingReceivedAt(data.walletAddress, new Date().getTime());
            }
          }
        } else if (obj.event === "latency_check") {
          let tempMsg = {
            event: "latency_check",
            walletAddress: obj.walletAddress,
            client_time: obj.client_time,
            server_time: new Date().getTime(),
          };
          MessageQueueHandler.FillGameMessageQueue(tempMsg);
        } else if (obj.event === "add_queue") {
          const queueData = obj.data as QueueDB;
          let checkIfAlreadyExist = false;
          for (let i = 0; i < FightQueueHandler.combinedQueueData.length; i++) {
            if (FightQueueHandler.combinedQueueData[i].p1_wallet === obj.data.user_wallet_address || FightQueueHandler.combinedQueueData[i].p2_wallet === obj.data.user_wallet_address) {
              checkIfAlreadyExist = true;
            }
          }
          // console.log("------- debug ,. ", checkIfAlreadyExist, obj.data.user_wallet_address)
          if (checkIfAlreadyExist) {
            return;
          }
          let { queue_index, player_index } = FightQueueHandler.getUserPositionInQueueV2();
          console.log("*********************************************************");
          console.log("player index -- ", player_index, queue_index);
          if (queue_index > -1) {
            let data: any;
            if (player_index % 2 === 0) {
              data = await FightEntryCreate(obj.data.user_wallet_address, obj.data.minted_id);
              console.log("--- calling FightEntryCreate ", data);
              if (data.resultBool) {
                let fightEntryInfo: IFightEntry = data.data.data;
                // console.log("fight entry info --- ", fightEntryInfo);
                FightQueueHandler.createNewEntryForCombinedQueue(
                  queueData,
                  fightEntryInfo.player1,
                  fightEntryInfo.fight_id,
                  fightEntryInfo.total_bet_p1,
                  fightEntryInfo.total_bet_p2,
                  fightEntryInfo.total_bet,
                  fightEntryInfo.player_count,
                  fightEntryInfo
                );
              }
            } else {
              data = await FightEntryAdd(FightQueueHandler.combinedQueueData[FightQueueHandler.combinedQueueData.length - 1].p1_wallet, queueData.user_wallet_address, obj.data.minted_id);
              // console.log("--- calling FightEntryAdd ", data);
              if (data.resultBool) {
                let fightEntryInfo: IFightEntry = data.data.data;
                console.log("fight entry info 2--- ", fightEntryInfo);
                FightQueueHandler.addEntryForCombinedQueue(
                  queueData,
                  fightEntryInfo.player1,
                  fightEntryInfo.fight_id,
                  fightEntryInfo.total_bet_p1,
                  fightEntryInfo.total_bet_p2,
                  fightEntryInfo.total_bet,
                  fightEntryInfo.player_count,
                  fightEntryInfo
                );
              }
            }
            console.log("-----------------------", FightQueueHandler.combinedQueueData.length);
            BroadcastQueueStatus();
          } else {
            FightQueueHandler.deleteUserFromQueue(obj.data.user_wallet_address);
          }
        } else if (obj.event === "add_queue_new") {
          const queueData = obj.data as NewQueueDB;
          console.log("******************** Request to add to queue ************************************", queueData);
          // if (FightQueueHandler.combinedQueueData.length === 0) {
          //   let data: any;
          //   data = await FightEntryCreate(obj.data.user_wallet_address, obj.data.minted_id)
          //   console.log("--- calling FightEntryCreate ", data);
          //   if (data.resultBool) {
          //     let fightEntryInfo: IFightEntry = data.data.data;
          //     FightQueueHandler.createNewEntryForCombinedQueueV2(
          //       queueData,
          //       fightEntryInfo.player1,
          //       fightEntryInfo.fight_id,
          //       fightEntryInfo.total_bet_p1,
          //       fightEntryInfo.total_bet_p2,
          //       fightEntryInfo.total_bet,
          //       fightEntryInfo.player_count,
          //     )
          //   }
          // } else {
          //   QueuePoolHandler.addPlayerInfoToQueuePool(queueData)
          // }
          QueuePoolHandler.addPlayerInfoToQueuePool(queueData);
        } else if (obj.event === "delete_queue") {
          FightQueueHandler.ValidateAndRemoveUser(obj.walletAddress);
          // QueuePoolHandler.removePlayerInfoFromQueuePool(obj.walletAddress)
          BroadcastQueueStatus();
        } else if (obj.event === "move") {
          // TODO: debug why i am directly sedning these to people and not at every refresh.

          // console.log(obj)
          // for walking no stamina is consumed.
          // for running stamina is consumed equal to speed attrbute
          let required_player_index = -1;
          for (let i = 0; i < PlayersDataHandler.nftDataofLiveConnections.length; i++) {
            let data = PlayersDataHandler.nftDataofLiveConnections[i];
            if (data.walletAddress === obj.walletAddress) {
              required_player_index = i;
              break;
            }
          }
          // console.log("movoing ", required_player_index)
          if (required_player_index < 0) {
            return;
          }
          if (
            // PlayersDataHandler.nftDataofLiveConnections[required_player_index].died &&
            PlayersDataHandler.nftDataofLiveConnections[required_player_index].died_lastTime + 10000 >
            new Date().getTime()
          ) {
            return;
          }

          if (
            // PlayersDataHandler.nftDataofLiveConnections[player2_index].got_hit_lift_off_fall &&
            PlayersDataHandler.nftDataofLiveConnections[required_player_index].got_hit_lift_off_fall_lastTime + FIXED_GET_UP_TIME >
            new Date().getTime()
          ) {
            return;
          }

          if (PlayersDataHandler.nftDataofLiveConnections[required_player_index].lastKickTime + KICK_SPEED > new Date().getTime()) {
            return;
          }
          if (PlayersDataHandler.nftDataofLiveConnections[required_player_index].lastPunchTime + PUNCH_SPEED > new Date().getTime()) {
            return;
          }
          // PlayersDataHandler.playersMovementData.set(obj.walletAddress, obj)
          // return
          let tempPos = {
            x: PlayersDataHandler.nftDataofLiveConnections[required_player_index].last_position_x,
            y: PlayersDataHandler.nftDataofLiveConnections[required_player_index].last_position_y,
          };

          tempPos.x = Math.round((tempPos.x + Number.EPSILON) * 100) / 100;
          tempPos.y = Math.round((tempPos.y + Number.EPSILON) * 100) / 100;
          // if (required_player_index > -1) {
          // console.log("move request .. ", required_player_index, PlayersDataHandler.nftDataofLiveConnections[required_player_index].stamina, PlayersDataHandler.nftDataofLiveConnections[required_player_index].movementAbility)
          if (PlayersDataHandler.nftDataofLiveConnections[required_player_index].stunned || PlayersDataHandler.nftDataofLiveConnections[required_player_index].stamina <= 3) {
            PlayersDataHandler.nftDataofLiveConnections[required_player_index].stunned = true;
            let message = {
              event: "show_stunned",
              walletAddress: obj.walletAddress,
              stamina: PlayersDataHandler.nftDataofLiveConnections[required_player_index].stamina,
            };
            sendMessageToAll(JSON.stringify(message));
            return;
          }

          BrewManager.checkPlayerNearAnyBrew(tempPos, PlayersDataHandler.nftDataofLiveConnections[required_player_index].walletAddress);
          let receivedCoinItem = ItemManager.checkPlayerNearItem(tempPos, PlayersDataHandler.nftDataofLiveConnections[required_player_index].walletAddress);
          if (receivedCoinItem.colided) {
            if (receivedCoinItem.name === 'rats') {
              console.log("received coin item... ")
              rats_state_manager.rats_state[receivedCoinItem.index] = RatState.COIN_PICKED;
              let msgObj = {
                event: 'mouse_update',
                ...rats_state_manager
              }
              MessageQueueHandler.FillGameMessageQueue(msgObj);
            } else if (receivedCoinItem.name === 'admin_coins') {
              // 
            }
          }

          let you_are_player = -1;
          let player1Data: INFTDataOfConnections;
          let player2Data: INFTDataOfConnections;
          // if (PlayersDataHandler.nftDataofLiveConnections[required_player_index].fighting) {
          player1Data = createEmptyPlayer();
          player2Data = createEmptyPlayer();
          for (let i = 0; i < PlayersDataHandler.nftDataofLiveConnections.length; i++) {
            let data = PlayersDataHandler.nftDataofLiveConnections[i];
            if (data.walletAddress === FightHandler.fightInfo.player1) {
              player1Data = data;
            }
            if (data.walletAddress === FightHandler.fightInfo.player2) {
              player2Data = data;
            }
          }
          // player1Data = PlayersDataHandler.nftDataofLiveConnectionsMap.get(FightHandler.fightInfo.player1)
          // player2Data = PlayersDataHandler.nftDataofLiveConnectionsMap.get(FightHandler.fightInfo.player2)
          if (obj.walletAddress === player1Data.walletAddress) {
            you_are_player = 1;
          } else if (obj.walletAddress === player2Data.walletAddress) {
            you_are_player = 2;
          }
          // let keyInfo = obj.keys;
          // console.log("--", keyInfo)
          let keyInfo: IKeysInfo = {
            keyA: {
              pressed: false,
              double_pressed: false,
            },
            keyD: {
              pressed: false,
              double_pressed: false,
            },
            keyS: {
              pressed: false,
            },
            keyW: {
              pressed: false,
            },
            lastKey: "",
            keyP: undefined,
            keyK: undefined,
          };
          // console.log("-------", obj.direction)
          if (_.isNull(obj.direction) || _.isUndefined(obj.direction) || !_.isArray(obj.direction)) {
            console.log("coming wrong value in movement .,.. ", obj);
            return;
          }
          if (obj.direction.includes("left")) {
            keyInfo.keyA.pressed = true;
            if (obj.running) {
              keyInfo.keyA.double_pressed = true;
            }
          }
          if (obj.direction.includes("right")) {
            keyInfo.keyD.pressed = true;
            if (obj.running) {
              keyInfo.keyD.double_pressed = true;
            }
          }
          if (obj.direction.includes("up")) {
            keyInfo.keyW.pressed = true;
          }
          if (obj.direction.includes("down")) {
            keyInfo.keyS.pressed = true;
          }
          let orientation = PlayersDataHandler.nftDataofLiveConnections[required_player_index].orientation;
          if (keyInfo.keyA.pressed && obj.orientation_switch) {
            orientation = "left";
          } else if (keyInfo.keyD.pressed && obj.orientation_switch) {
            orientation = "right";
          }
          PlayersDataHandler.nftDataofLiveConnections[required_player_index].orientation = orientation;
          // console.log("you are player .. in move ",
          //   you_are_player,
          //   PlayersDataHandler.nftDataofLiveConnections[required_player_index].walk_speed,
          //   PlayersDataHandler.nftDataofLiveConnections[required_player_index].run_speed,
          // )
          if (you_are_player > 0 && !PlayersDataHandler.nftDataofLiveConnections[required_player_index].stunned && FightHandler.fightInfo.fightStageStarted) {
            if (you_are_player === 1) {
              let { event, pos, calculatedSpeed } = basicCollisionWithBoundaryAndPlayer(
                totalBoundaries,
                tempPos,
                obj.delta,
                keyInfo,
                {
                  x: player2Data.last_position_x,
                  y: player2Data.last_position_y,
                },
                PlayersDataHandler.nftDataofLiveConnections[required_player_index].walk_speed,
                PlayersDataHandler.nftDataofLiveConnections[required_player_index].run_speed
              );
              pos.x = Math.round((pos.x + Number.EPSILON) * 100) / 100;
              pos.y = Math.round((pos.y + Number.EPSILON) * 100) / 100;
              // console.log("-- pos -- ", you_are_player, pos, tempPos)
              if (event === "running") {
                // console.log("running -- ", 10*calculatedSpeed/SERVER_REFRESH_RATE) // 1. something.
                if (PlayersDataHandler.nftDataofLiveConnections[required_player_index].stamina > 3) {
                  PlayersDataHandler.nftDataofLiveConnections[required_player_index].stamina -= (SPEED_TO_ACTUAL_STAMINA_REDUCTION_MULTIPLIER * calculatedSpeed) / SERVER_REFRESH_RATE;
                } else {
                  PlayersDataHandler.nftDataofLiveConnections[required_player_index].stunned = true;
                }
              }
              if (PlayersDataHandler.nftDataofLiveConnections[required_player_index].lastPunchTime + PUNCH_SPEED > new Date().getTime()) {
                return;
              }
              if (PlayersDataHandler.nftDataofLiveConnections[required_player_index].lastKickTime + KICK_SPEED > new Date().getTime()) {
                return;
              }

              let tempMsg = {
                event,
                walletAddress: obj.walletAddress,
                orientation,
                ...pos,
                stamina: PlayersDataHandler.nftDataofLiveConnections[required_player_index].stamina,
                health: PlayersDataHandler.nftDataofLiveConnections[required_player_index].health,
                action_id: obj.action_id,
              };

              PlayersDataHandler.nftDataofLiveConnections[required_player_index].last_position_x = pos.x;
              PlayersDataHandler.nftDataofLiveConnections[required_player_index].last_position_y = pos.y;
              // MessageQueueHandler.FillGameMessageQueue(tempMsg)
              sendMessageToAll(JSON.stringify(tempMsg));
            } else {
              let { event, pos, calculatedSpeed } = basicCollisionWithBoundaryAndPlayer(
                totalBoundaries,
                tempPos,
                obj.delta,
                keyInfo,
                {
                  x: player1Data.last_position_x,
                  y: player1Data.last_position_y,
                },
                PlayersDataHandler.nftDataofLiveConnections[required_player_index].walk_speed,
                PlayersDataHandler.nftDataofLiveConnections[required_player_index].run_speed
              );

              pos.x = Math.round((pos.x + Number.EPSILON) * 100) / 100;
              pos.y = Math.round((pos.y + Number.EPSILON) * 100) / 100;
              // console.log("-- pos -- ", you_are_player, pos, tempPos)

              if (event === "running") {
                // console.log("running -- ", 10*calculatedSpeed/SERVER_REFRESH_RATE)
                if (PlayersDataHandler.nftDataofLiveConnections[required_player_index].stamina > 3) {
                  PlayersDataHandler.nftDataofLiveConnections[required_player_index].stamina -= (SPEED_TO_ACTUAL_STAMINA_REDUCTION_MULTIPLIER * calculatedSpeed) / SERVER_REFRESH_RATE;
                } else {
                  PlayersDataHandler.nftDataofLiveConnections[required_player_index].stunned = true;
                }
                // PlayersDataHandler.nftDataofLiveConnections[required_player_index].stamina -= 10*calculatedSpeed/SERVER_REFRESH_RATE;
              }

              let tempMsg = {
                event,
                walletAddress: obj.walletAddress,
                orientation,
                ...pos,
                stamina: PlayersDataHandler.nftDataofLiveConnections[required_player_index].stamina,
                health: PlayersDataHandler.nftDataofLiveConnections[required_player_index].health,
                action_id: obj.action_id,
              };

              PlayersDataHandler.nftDataofLiveConnections[required_player_index].last_position_x = pos.x;
              PlayersDataHandler.nftDataofLiveConnections[required_player_index].last_position_y = pos.y;
              // MessageQueueHandler.FillGameMessageQueue(tempMsg)
              sendMessageToAll(JSON.stringify(tempMsg));
            }
            if (PlayersDataHandler.nftDataofLiveConnections[required_player_index].stamina <= 3) {
              let message = {
                event: "show_stunned",
                walletAddress: obj.walletAddress,
                stamina: PlayersDataHandler.nftDataofLiveConnections[required_player_index].stamina,
              };
              sendMessageToAll(JSON.stringify(message));
            }
          } else {
            let { event, pos, calculatedSpeed } = basicCollisionAndMovementPlayerV3(
              totalBoundaries,
              tempPos,
              obj.delta,
              keyInfo,
              PlayersDataHandler.nftDataofLiveConnections[required_player_index].walk_speed,
              PlayersDataHandler.nftDataofLiveConnections[required_player_index].run_speed
            );
            pos.x = Math.round((pos.x + Number.EPSILON) * 100) / 100;
            pos.y = Math.round((pos.y + Number.EPSILON) * 100) / 100;
            // console.log("-- pos -- ", pos)
            if (event === "running") {
              // console.log("running -- ", 10*calculatedSpeed/SERVER_REFRESH_RATE)
              if (PlayersDataHandler.nftDataofLiveConnections[required_player_index].stamina > 3) {
                PlayersDataHandler.nftDataofLiveConnections[required_player_index].stamina -= (SPEED_TO_ACTUAL_STAMINA_REDUCTION_MULTIPLIER * calculatedSpeed) / SERVER_REFRESH_RATE;
                // PlayersDataHandler.nftDataofLiveConnections[required_player_index].health -= SPEED_TO_ACTUAL_STAMINA_REDUCTION_MULTIPLIER*calculatedSpeed/SERVER_REFRESH_RATE;
              } else {
                PlayersDataHandler.nftDataofLiveConnections[required_player_index].stunned = true;
              }
              // PlayersDataHandler.nftDataofLiveConnections[required_player_index].stamina -= 10*PlayersDataHandler.nftDataofLiveConnections[required_player_index].run_speed/SERVER_REFRESH_RATE;
            }
            // console.log("move request .. ", required_player_index, PlayersDataHandler.nftDataofLiveConnections[required_player_index].stamina, PlayersDataHandler.nftDataofLiveConnections[required_player_index].movementAbility)

            let tempMsg = {
              event,
              walletAddress: obj.walletAddress,
              orientation,
              ...pos,
              stamina: PlayersDataHandler.nftDataofLiveConnections[required_player_index].stamina,
              health: PlayersDataHandler.nftDataofLiveConnections[required_player_index].health,
              action_id: obj.action_id,
            };
            PlayersDataHandler.nftDataofLiveConnections[required_player_index].last_position_x = pos.x;
            PlayersDataHandler.nftDataofLiveConnections[required_player_index].last_position_y = pos.y;
            if (PlayersDataHandler.nftDataofLiveConnections[required_player_index].stamina <= 3) {
              let message = {
                event: "show_stunned",
                walletAddress: obj.walletAddress,
                stamina: PlayersDataHandler.nftDataofLiveConnections[required_player_index].stamina,
              };
              MessageQueueHandler.FillGameMessageQueue(message);
            }
            sendMessageToAll(JSON.stringify(tempMsg));
          }
          // }
        } else if (obj.event === "kick" || obj.event === "punch") {
          // console.log("----- kick , pounchaa")
          let player1Data: INFTDataOfConnections;
          let player2Data: INFTDataOfConnections;
          let required_player_index = -1;
          let player1_index = -1;
          let player2_index = -1;
          // if (PlayersDataHandler.nftDataofLiveConnections[required_player_index].fighting) {
          player1Data = createEmptyPlayer();
          player2Data = createEmptyPlayer();
          for (let i = 0; i < PlayersDataHandler.nftDataofLiveConnections.length; i++) {
            var data = PlayersDataHandler.nftDataofLiveConnections[i];
            if (data.walletAddress === FightHandler.fightInfo.player1) {
              player1Data = data;
              player1_index = i;
            }
            if (data.walletAddress === FightHandler.fightInfo.player2) {
              player2Data = data;
              player2_index = i;
            }
            if (data.walletAddress === obj.walletAddress) {
              required_player_index = i;
            }
          }
          if (PlayersDataHandler.nftDataofLiveConnections[required_player_index].died_lastTime + 10000 > new Date().getTime()) {
            return;
          }
          if (PlayersDataHandler.nftDataofLiveConnections[required_player_index].got_hit_lift_off_fall_lastTime + FIXED_GET_UP_TIME > new Date().getTime() && obj.event === "punch") {
            return;
          }
          let you_are_player = -1;
          if (obj.walletAddress === player1Data.walletAddress) {
            you_are_player = 1;
          } else if (obj.walletAddress === player2Data.walletAddress) {
            you_are_player = 2;
          }

          if (PlayersDataHandler.nftDataofLiveConnections[required_player_index].stamina < 3 || PlayersDataHandler.nftDataofLiveConnections[required_player_index].stunned) {
            // console.log("kick or punch show stunned ", PlayersDataHandler.nftDataofLiveConnections[required_player_index].stamina, PlayersDataHandler.nftDataofLiveConnections[required_player_index].stunned)
            let message = {
              event: "show_stunned",
              walletAddress: obj.walletAddress,
              stamina: PlayersDataHandler.nftDataofLiveConnections[required_player_index].stamina,
            };
            PlayersDataHandler.nftDataofLiveConnections[required_player_index].stunned = true;
            // console.log("player kick/punch making stun true")
            MessageQueueHandler.FillGameMessageQueue(message);
            return;
          }

          if (obj.event === "kick") {
            if (PlayersDataHandler.nftDataofLiveConnections[required_player_index].lastKickTime + KICK_SPEED > new Date().getTime()) {
              return;
            }
            PlayersDataHandler.nftDataofLiveConnections[required_player_index].lastKickTime = new Date().getTime();
            // reduce stamina of the player
            if (PlayersDataHandler.nftDataofLiveConnections[required_player_index].stamina > 3) {
              PlayersDataHandler.nftDataofLiveConnections[required_player_index].stamina -= PlayersDataHandler.nftDataofLiveConnections[required_player_index].kickpower;
            } else {
              // console.log("player kick making stun true")
              PlayersDataHandler.nftDataofLiveConnections[required_player_index].stunned = true;
            }
          }
          if (obj.event === "punch") {
            if (PlayersDataHandler.nftDataofLiveConnections[required_player_index].lastPunchTime + PUNCH_SPEED > new Date().getTime()) {
              return;
            }
            PlayersDataHandler.nftDataofLiveConnections[required_player_index].lastPunchTime = new Date().getTime();
            // reduce stamina of the player
            if (PlayersDataHandler.nftDataofLiveConnections[required_player_index].stamina > 3) {
              PlayersDataHandler.nftDataofLiveConnections[required_player_index].stamina -= PlayersDataHandler.nftDataofLiveConnections[required_player_index].punchpower / 2;
            } else {
              // console.log("player punch making stun true")
              PlayersDataHandler.nftDataofLiveConnections[required_player_index].stunned = true;
            }
          }

          if (!PlayersDataHandler.nftDataofLiveConnections[required_player_index].stunned) {
            let message = {
              event: "swing_sound",
              walletAddress: PlayersDataHandler.nftDataofLiveConnections[required_player_index].walletAddress,
            };
            MessageQueueHandler.FillGameMessageQueue(message);
          }

          if (obj.event === "kick") {
            // handle hitting the mouses here. with kick only
            let playerData = PlayersDataHandler.nftDataofLiveConnections[required_player_index];
            let actual_mouse_hit = false;
            for (let mouse_i = 0; mouse_i < rats_state_manager.rats_positiions.length; mouse_i++) {
              //   console.log("rats colide rats check 3--- ", 
              //   mouse_i, playerData.last_position_x, 
              //   playerData.last_position_y, 
              //   rats_state_manager.rats_positiions[mouse_i],
              //   (playerData.last_position_x + DEFAULT_SPRITE_DISPLAY_WIDTH >= rats_state_manager.rats_positiions[mouse_i].x),
              //   (playerData.last_position_x - DEFAULT_SPRITE_DISPLAY_WIDTH <= rats_state_manager.rats_positiions[mouse_i].x),
              //   (Math.abs(playerData.last_position_y + DEFAULT_SPRITE_DISPLAY_HEIGHT/2 - rats_state_manager.rats_positiions[mouse_i].y) <= DEFAULT_SPRITE_DISPLAY_HEIGHT/4),
              //   (playerData.orientation === "right" && (rats_state_manager.rats_positiions[mouse_i].x - playerData.last_position_x >= 0)),
              //   (playerData.orientation === "left" && (rats_state_manager.rats_positiions[mouse_i].x - playerData.last_position_x < 0))
              // )
              if (
                (playerData.last_position_x + DEFAULT_SPRITE_DISPLAY_WIDTH >= rats_state_manager.rats_positiions[mouse_i].x)
                && (playerData.last_position_x - DEFAULT_SPRITE_DISPLAY_WIDTH <= rats_state_manager.rats_positiions[mouse_i].x)
                && (Math.abs(playerData.last_position_y + DEFAULT_SPRITE_DISPLAY_HEIGHT / 2 - rats_state_manager.rats_positiions[mouse_i].y) <= DEFAULT_SPRITE_DISPLAY_HEIGHT / 4)
                && (
                  (playerData.orientation === "right" && (rats_state_manager.rats_positiions[mouse_i].x - playerData.last_position_x >= 0))
                  || (playerData.orientation === "left" && (rats_state_manager.rats_positiions[mouse_i].x - playerData.last_position_x < 0))
                )
              ) {
                console.log("***********************coliding with rats check--- ", mouse_i, playerData.last_position_x, rats_state_manager.rats_positiions[mouse_i])
                if ((rats_state_manager.rats_state[mouse_i] === RatState.ALIVE) || (rats_state_manager.rats_state[mouse_i] === RatState.HIT)) {
                  let tempHealth = {
                    currHealth: rats_state_manager.rats_health[mouse_i],
                  };
                  let rats_on_which_side = "right"
                  if (playerData.last_position_x > rats_state_manager.rats_positiions[mouse_i].x) {
                    rats_on_which_side = "left"
                  }
                  actual_mouse_hit = true;
                  // rats_state_manager.rats_positiions[mouse_i] = ChooseNewPositionForRat(rats_state_manager.rats_positiions[mouse_i], playerData.kickpower, rats_on_which_side);
                  rats_state_manager.rats_health[mouse_i] -= playerData.kickpower;
                  rats_state_manager.rats_last_health[mouse_i] = tempHealth.currHealth;
                  rats_state_manager.rats_state[mouse_i] = RatState.HIT;
                  if (rats_state_manager.rats_health[mouse_i] <= 0) {
                    rats_state_manager.rats_state[mouse_i] = RatState.DEAD;
                    setTimeout(() => {
                      rats_state_manager.rats_state[mouse_i] = RatState.TURN_TO_COINS;
                      console.log("killed rats ----", rats_state_manager.rats_prize[mouse_i])
                      if (rats_state_manager.rats_positiions[mouse_i] && rats_state_manager.rats_prize[mouse_i] > 0) {
                        ItemManager.addItem(
                          rats_state_manager.rats_positiions[mouse_i].x,
                          rats_state_manager.rats_positiions[mouse_i].y,
                          "",
                          rats_state_manager.rats_uuid[mouse_i],
                          mouse_i,
                          'rats')
                      }
                    }, 2000)
                  } else {
                    rats_state_manager.rats_positiions[mouse_i] = ChooseNewPositionForRat(rats_state_manager.rats_positiions[mouse_i], playerData.kickpower, rats_on_which_side);
                  }
                }
                // if ((rats_state_manager.rats_state[mouse_i] === RatState.TURN_TO_COINS)) {
                //   actual_mouse_hit = true;
                //   rats_state_manager.rats_state[mouse_i] = RatState.COIN_PICKED;
                //   // call the api.. about the details of the rat created.
                // }
              } else {
                rats_state_manager.rats_last_health[mouse_i] = rats_state_manager.rats_health[mouse_i];
              }
            }
            if (actual_mouse_hit) {
              let msgObj = {
                event: 'mouse_got_hit',
                ...rats_state_manager
              }
              MessageQueueHandler.FillGameMessageQueue(msgObj);
            }
          }

          if (you_are_player > 0) {
            let coliding = false;
            if (obj.event === "punch") {
              if (
                player1Data.last_position_x + DEFAULT_SPRITE_DISPLAY_WIDTH_COLLISION_FIGHT / 3 >= player2Data.last_position_x - DEFAULT_SPRITE_DISPLAY_WIDTH_COLLISION_FIGHT / 3 &&
                player1Data.last_position_x - DEFAULT_SPRITE_DISPLAY_WIDTH_COLLISION_FIGHT / 3 <= player2Data.last_position_x + DEFAULT_SPRITE_DISPLAY_WIDTH_COLLISION_FIGHT / 3 &&
                Math.abs(player1Data.last_position_y + DEFAULT_SPRITE_DISPLAY_HEIGHT / 2 - (player2Data.last_position_y + DEFAULT_SPRITE_DISPLAY_HEIGHT / 2)) <= DEFAULT_SPRITE_DISPLAY_HEIGHT / 2 / 5
              ) {
                coliding = true;
              }
            }
            if (obj.event === "kick") {
              if (
                player1Data.last_position_x + DEFAULT_SPRITE_DISPLAY_WIDTH_COLLISION_FIGHT / 3 + 10 >= player2Data.last_position_x - DEFAULT_SPRITE_DISPLAY_WIDTH_COLLISION_FIGHT / 3 &&
                player1Data.last_position_x - DEFAULT_SPRITE_DISPLAY_WIDTH_COLLISION_FIGHT / 3 - 10 <= player2Data.last_position_x + DEFAULT_SPRITE_DISPLAY_WIDTH_COLLISION_FIGHT / 3 &&
                Math.abs(player1Data.last_position_y + DEFAULT_SPRITE_DISPLAY_HEIGHT / 2 - (player2Data.last_position_y + DEFAULT_SPRITE_DISPLAY_HEIGHT / 2)) <= DEFAULT_SPRITE_DISPLAY_HEIGHT / 2 / 5
              ) {
                coliding = true;
              }
            }

            if (coliding) {
              // console.log("colliding --- ", you_are_player)
              if (
                (you_are_player === 1 &&
                  FightHandler.fightInfo.fightStageStarted &&
                  ((player1Data.last_position_x < player2Data.last_position_x && player1Data.orientation === "right") || (player1Data.last_position_x > player2Data.last_position_x && player1Data.orientation === "left"))) ||
                (you_are_player === 2 &&
                  FightHandler.fightInfo.fightStageStarted &&
                  ((player2Data.last_position_x < player1Data.last_position_x && player2Data.orientation === "right") || (player2Data.last_position_x > player1Data.last_position_x && player2Data.orientation === "left")))
              ) {
                // console.log("coming here.. --- ", you_are_player)
                let eventToSend = "";
                let last_health_p1 = 0;
                let last_health_p2 = 0;
                // colision is happening..
                if (you_are_player === 1) {
                  if (
                    // PlayersDataHandler.nftDataofLiveConnections[player2_index].got_hit_lift_off_fall &&
                    PlayersDataHandler.nftDataofLiveConnections[player2_index].got_hit_lift_off_fall_lastTime + FIXED_GET_UP_TIME > new Date().getTime() &&
                    obj.event === "punch"
                  ) {
                    return;
                  }
                  if (PlayersDataHandler.nftDataofLiveConnections[player2_index].health <= 0) {
                    return;
                  }
                  if (PlayersDataHandler.nftDataofLiveConnections[player2_index].brew_started_drinking) {
                    let tempMsg = {
                      event: "show_brew_drop_frame",
                      walletAddress: PlayersDataHandler.nftDataofLiveConnections[player2_index].walletAddress,
                    };
                    BrewManager.SetBrewState(PlayersDataHandler.nftDataofLiveConnections[player2_index].walletAddress, PlayersDataHandler.nftDataofLiveConnections[player2_index].minted_id.toString(), false);
                    BrewManager.SetSemiBrewState(PlayersDataHandler.nftDataofLiveConnections[player2_index].walletAddress, PlayersDataHandler.nftDataofLiveConnections[player2_index].minted_id.toString(), false);
                    MessageQueueHandler.FillGameMessageQueue(tempMsg);
                    PlayersDataHandler.nftDataofLiveConnections[player2_index].brew_started_drinking = false;
                  }
                  PlayersDataHandler.nftDataofLiveConnections[player2_index].got_hit_lift_off_fall = false;
                  let tempPunchPower = player1Data.punchpower;
                  let tempKickPower = player1Data.kickpower;
                  let damageDealt = 0;
                  last_health_p2 = PlayersDataHandler.nftDataofLiveConnections[player2_index].health;
                  console.log("----last health p2 -", last_health_p2);

                  let nullifyThisAttack: boolean = Math.random() <= AttackNullifyChance[player2Data.defense];
                  console.log("player 2 nulify attack ", nullifyThisAttack);
                  if (!nullifyThisAttack) {
                    if (obj.event === "kick") {
                      if (player2Data.health >= 0 && !nullifyThisAttack) {
                        damageDealt = (1 - AutoAttackReductionBonus[player2Data.defense]) * tempKickPower;
                        PlayersDataHandler.nftDataofLiveConnections[player2_index].health -= damageDealt;
                      }
                      if (!(PlayersDataHandler.nftDataofLiveConnections[player2_index].got_hit_lift_off_fall_lastTime + FIXED_GET_UP_TIME > new Date().getTime())) {
                        PlayersDataHandler.nftDataofLiveConnections[player2_index].stamina -= tempKickPower * StaminaLossOfDefender[player2Data.defense];
                      }
                      eventToSend = "gotKickHit";
                    } else if (obj.event === "punch") {
                      if (player2Data.health >= 0 && !nullifyThisAttack) {
                        damageDealt = (1 - AutoAttackReductionBonus[player2Data.defense]) * tempPunchPower;
                        PlayersDataHandler.nftDataofLiveConnections[player2_index].health -= damageDealt;
                      }
                      if (!(PlayersDataHandler.nftDataofLiveConnections[player2_index].got_hit_lift_off_fall_lastTime + FIXED_GET_UP_TIME > new Date().getTime())) {
                        PlayersDataHandler.nftDataofLiveConnections[player2_index].stamina -= tempPunchPower * StaminaLossOfDefender[player2Data.defense];
                      }
                      eventToSend = "gotPunchHit";
                    }
                  }

                  if (nullifyThisAttack) {
                    // send message to game that nullified
                  }
                  // move other player back
                  // find the back direction -> if orientation is "right" then move it "left" vice versa
                  // also check collision
                  let toMoveOtherPlayer = "right";
                  if (player2Data.orientation === "right" && player1Data.orientation === "right") {
                    toMoveOtherPlayer = "right";
                  }
                  if (player2Data.orientation === "left" && player1Data.orientation === "left") {
                    toMoveOtherPlayer = "left";
                  }
                  if (player2Data.orientation === "right" && player1Data.orientation === "left") {
                    toMoveOtherPlayer = "left";
                  }
                  if (player2Data.orientation === "left" && player1Data.orientation === "right") {
                    toMoveOtherPlayer = "right";
                  }
                  // let _canMove = false;
                  // let canMove = false;
                  // let pos = {
                  //   x: 0,
                  //   y: 0
                  // }
                  // while (!_canMove) {
                  //   console.log("running while loop -- p1",damageDealt, PlayersDataHandler.nftDataofLiveConnections[player2_index].stunned, eventToSend, PlayersDataHandler.nftDataofLiveConnections[player2_index].stamina )
                  //   let {dummyCanMove, dummyPos} = checkOnlyColissionWithBoundaries(INNER_BOUNDARY, {
                  //     x: player2Data.last_position_x,
                  //     y: player2Data.last_position_y
                  //   }, damageDealt,toMoveOtherPlayer )
                  //   damageDealt= damageDealt-2;
                  //   _canMove = dummyCanMove;
                  //   pos = JSON.parse(JSON.stringify(dummyPos))
                  //   if (damageDealt<=6){
                  //     break;
                  //   }
                  // }
                  // canMove = _canMove;

                  // console.log("player stamina and stunned ", PlayersDataHandler.nftDataofLiveConnections[player2_index].stamina)

                  // console.log("p1 hitting p2 ----- ",
                  //   PlayersDataHandler.nftDataofLiveConnections[player2_index].got_hit_lift_off_fall_lastTime,
                  //   PlayersDataHandler.nftDataofLiveConnections[player2_index].got_hit_lift_off_fall_lastTime + FIXED_GET_UP_TIME > new Date().getTime(),
                  //   obj.event === "kick",
                  //   !((PlayersDataHandler.nftDataofLiveConnections[player2_index].stamina < 3) || (PlayersDataHandler.nftDataofLiveConnections[player2_index].stunned))
                  // )
                  if (
                    !(PlayersDataHandler.nftDataofLiveConnections[player2_index].stamina < 3 || PlayersDataHandler.nftDataofLiveConnections[player2_index].stunned) ||
                    (PlayersDataHandler.nftDataofLiveConnections[player2_index].got_hit_lift_off_fall_lastTime + FIXED_GET_UP_TIME > new Date().getTime() && obj.event === "kick")
                  ) {
                    let { dummyCanMove, dummyPos } = checkOnlyColissionWithBoundaries(
                      INNER_BOUNDARY,
                      {
                        x: player2Data.last_position_x,
                        y: player2Data.last_position_y,
                      },
                      2 * damageDealt,
                      toMoveOtherPlayer
                    );
                    let canMove = dummyCanMove;
                    let pos = JSON.parse(JSON.stringify(dummyPos));
                    // console.log("can move p2... in ", canMove, toMoveOtherPlayer, player1Data.orientation, player2Data.orientation)

                    pos.x = Math.round((pos.x + Number.EPSILON) * 100) / 100;
                    pos.y = Math.round((pos.y + Number.EPSILON) * 100) / 100;

                    if (canMove) {
                      PlayersDataHandler.nftDataofLiveConnections[player2_index].last_position_x = pos.x;
                      PlayersDataHandler.nftDataofLiveConnections[player2_index].last_position_y = pos.y;
                    }
                    let tempMsg = {
                      event: "teleport",
                      walletAddress: PlayersDataHandler.nftDataofLiveConnections[player2_index].walletAddress,
                      orientation: PlayersDataHandler.nftDataofLiveConnections[player2_index].orientation,
                      ...pos,
                    };
                    MessageQueueHandler.FillGameMessageQueue(tempMsg);

                    let secondCall = checkOnlyColissionWithBoundaries(
                      INNER_BOUNDARY,
                      {
                        x: player1Data.last_position_x,
                        y: player1Data.last_position_y,
                      },
                      damageDealt,
                      toMoveOtherPlayer === "right" ? "left" : "right"
                    );
                    let canMove2 = secondCall.dummyCanMove;
                    let pos2 = JSON.parse(JSON.stringify(secondCall.dummyPos));
                    // console.log("can move p2... in ", canMove, toMoveOtherPlayer, player1Data.orientation, player2Data.orientation)

                    pos2.x = Math.round((pos2.x + Number.EPSILON) * 100) / 100;
                    pos2.y = Math.round((pos2.y + Number.EPSILON) * 100) / 100;

                    if (canMove2) {
                      PlayersDataHandler.nftDataofLiveConnections[player1_index].last_position_x = pos2.x;
                      PlayersDataHandler.nftDataofLiveConnections[player1_index].last_position_y = pos2.y;
                    }
                    let tempMsg2 = {
                      event: "teleport",
                      walletAddress: PlayersDataHandler.nftDataofLiveConnections[player1_index].walletAddress,
                      orientation: PlayersDataHandler.nftDataofLiveConnections[player1_index].orientation,
                      ...pos2,
                    };
                    MessageQueueHandler.FillGameMessageQueue(tempMsg2);
                  } else {
                    // console.log("in here .. p2 ", player2Data.orientation, player1Data.orientation)
                    if (player2Data.orientation === player1Data.orientation) {
                      if (player2Data.orientation === "right") {
                        PlayersDataHandler.nftDataofLiveConnections[player2_index].orientation = "left";
                      } else {
                        PlayersDataHandler.nftDataofLiveConnections[player2_index].orientation = "right";
                      }
                    }
                    PlayersDataHandler.nftDataofLiveConnections[player2_index].got_hit_lift_off_fall_lastTime = new Date().getTime();
                    let tempMsg = {
                      event: "got_hit_lift_off_fall",
                      walletAddress: PlayersDataHandler.nftDataofLiveConnections[player2_index].walletAddress,
                      orientation: PlayersDataHandler.nftDataofLiveConnections[player2_index].orientation,
                    };
                    MessageQueueHandler.FillGameMessageQueue(tempMsg);
                  }
                } else {
                  // console.log(
                  //   "check condition i am p2 ",
                  //   PlayersDataHandler.nftDataofLiveConnections[player1_index].got_hit_lift_off_fall,
                  //   PlayersDataHandler.nftDataofLiveConnections[player1_index].got_hit_lift_off_fall_lastTime ,
                  //   new Date().getTime(),
                  //   PlayersDataHandler.nftDataofLiveConnections[player1_index].got_hit_lift_off_fall_lastTime + FIXED_GET_UP_TIME > new Date().getTime()
                  // )
                  if (
                    // PlayersDataHandler.nftDataofLiveConnections[player1_index].got_hit_lift_off_fall &&
                    // new Date().getTime()
                    PlayersDataHandler.nftDataofLiveConnections[player1_index].got_hit_lift_off_fall_lastTime + FIXED_GET_UP_TIME > new Date().getTime() &&
                    obj.event === "punch"
                  ) {
                    return;
                  }
                  if (PlayersDataHandler.nftDataofLiveConnections[player1_index].health <= 0) {
                    return;
                  }
                  PlayersDataHandler.nftDataofLiveConnections[player1_index].got_hit_lift_off_fall = false;

                  if (PlayersDataHandler.nftDataofLiveConnections[player1_index].brew_started_drinking) {
                    let tempMsg = {
                      event: "show_brew_drop_frame",
                      walletAddress: PlayersDataHandler.nftDataofLiveConnections[player1_index].walletAddress,
                    };
                    BrewManager.SetBrewState(PlayersDataHandler.nftDataofLiveConnections[player1_index].walletAddress, PlayersDataHandler.nftDataofLiveConnections[player2_index].minted_id.toString(), false);
                    BrewManager.SetSemiBrewState(PlayersDataHandler.nftDataofLiveConnections[player1_index].walletAddress, PlayersDataHandler.nftDataofLiveConnections[player2_index].minted_id.toString(), false);

                    MessageQueueHandler.FillGameMessageQueue(tempMsg);
                    PlayersDataHandler.nftDataofLiveConnections[player1_index].brew_started_drinking = false;
                  }

                  let tempPunchPower = player2Data.punchpower;
                  let tempKickPower = player2Data.kickpower;
                  let damageDealt = 0;
                  last_health_p1 = PlayersDataHandler.nftDataofLiveConnections[player1_index].health;
                  console.log("----last health p1 -", last_health_p1);

                  let nullifyThisAttack: boolean = Math.random() <= AttackNullifyChance[player1Data.defense];
                  console.log("player 1 nulify attack ", nullifyThisAttack);
                  if (!nullifyThisAttack) {
                    if (obj.event === "kick") {
                      if (player1Data.health >= 0 && !nullifyThisAttack) {
                        damageDealt = (1 - AutoAttackReductionBonus[player1Data.defense]) * tempKickPower;
                        PlayersDataHandler.nftDataofLiveConnections[player1_index].health -= damageDealt;
                      }
                      if (!(PlayersDataHandler.nftDataofLiveConnections[player1_index].got_hit_lift_off_fall_lastTime + FIXED_GET_UP_TIME > new Date().getTime())) {
                        PlayersDataHandler.nftDataofLiveConnections[player1_index].stamina -= tempPunchPower * StaminaLossOfDefender[player1Data.defense];
                      }
                      eventToSend = "gotKickHit";
                    } else if (obj.event === "punch") {
                      if (player1Data.health >= 0 && !nullifyThisAttack) {
                        damageDealt = (1 - AutoAttackReductionBonus[player1Data.defense]) * tempPunchPower;
                        PlayersDataHandler.nftDataofLiveConnections[player1_index].health -= damageDealt;
                      }
                      if (!(PlayersDataHandler.nftDataofLiveConnections[player1_index].got_hit_lift_off_fall_lastTime + FIXED_GET_UP_TIME > new Date().getTime())) {
                        PlayersDataHandler.nftDataofLiveConnections[player1_index].stamina -= tempPunchPower * StaminaLossOfDefender[player1Data.defense];
                      }
                      eventToSend = "gotPunchHit";
                    }
                  }

                  if (nullifyThisAttack) {
                    // send message to game that nullified
                  }

                  // move other player back
                  // find the back direction -> if orientation is "right" then move it "left" vice versa
                  // also check collision
                  let toMoveOtherPlayer = "right";
                  if (player2Data.orientation === "right" && player1Data.orientation === "right") {
                    toMoveOtherPlayer = "right";
                  }
                  if (player2Data.orientation === "left" && player1Data.orientation === "left") {
                    toMoveOtherPlayer = "left";
                  }
                  if (player2Data.orientation === "right" && player1Data.orientation === "left") {
                    toMoveOtherPlayer = "right";
                  }
                  if (player2Data.orientation === "left" && player1Data.orientation === "right") {
                    toMoveOtherPlayer = "left";
                  }
                  // console.log("p2 hitting p1 -- ",
                  //   PlayersDataHandler.nftDataofLiveConnections[player1_index].got_hit_lift_off_fall_lastTime,
                  //   PlayersDataHandler.nftDataofLiveConnections[player1_index].got_hit_lift_off_fall_lastTime + FIXED_GET_UP_TIME > new Date().getTime(),
                  //   obj.event === "kick",
                  //   !((PlayersDataHandler.nftDataofLiveConnections[player1_index].stamina < 3)|| (PlayersDataHandler.nftDataofLiveConnections[player1_index].stunned))
                  // )
                  if (
                    !(PlayersDataHandler.nftDataofLiveConnections[player1_index].stamina < 3 || PlayersDataHandler.nftDataofLiveConnections[player1_index].stunned) ||
                    (PlayersDataHandler.nftDataofLiveConnections[player1_index].got_hit_lift_off_fall_lastTime + FIXED_GET_UP_TIME > new Date().getTime() && obj.event === "kick")
                  ) {
                    let { dummyCanMove, dummyPos } = checkOnlyColissionWithBoundaries(
                      INNER_BOUNDARY,
                      {
                        x: player1Data.last_position_x,
                        y: player1Data.last_position_y,
                      },
                      2 * damageDealt,
                      toMoveOtherPlayer
                    );
                    let canMove = dummyCanMove;
                    let pos = JSON.parse(JSON.stringify(dummyPos));

                    pos.x = Math.round((pos.x + Number.EPSILON) * 100) / 100;
                    pos.y = Math.round((pos.y + Number.EPSILON) * 100) / 100;
                    // console.log("can move p1... in ", canMove, toMoveOtherPlayer, player1Data.orientation, player2Data.orientation)

                    if (canMove) {
                      PlayersDataHandler.nftDataofLiveConnections[player1_index].last_position_x = pos.x;
                      PlayersDataHandler.nftDataofLiveConnections[player1_index].last_position_y = pos.y;
                    }
                    let tempMsg = {
                      event: "teleport",
                      walletAddress: PlayersDataHandler.nftDataofLiveConnections[player1_index].walletAddress,
                      orientation: PlayersDataHandler.nftDataofLiveConnections[player1_index].orientation,
                      ...pos,
                    };
                    MessageQueueHandler.FillGameMessageQueue(tempMsg);

                    let secondCall = checkOnlyColissionWithBoundaries(
                      INNER_BOUNDARY,
                      {
                        x: PlayersDataHandler.nftDataofLiveConnections[player2_index].last_position_x,
                        y: PlayersDataHandler.nftDataofLiveConnections[player2_index].last_position_y,
                      },
                      damageDealt,
                      toMoveOtherPlayer === "right" ? "left" : "right"
                    );
                    let canMove2 = secondCall.dummyCanMove;
                    let pos2 = JSON.parse(JSON.stringify(secondCall.dummyPos));
                    // console.log("can move p2... in ", canMove, toMoveOtherPlayer, player1Data.orientation, player2Data.orientation)

                    pos2.x = Math.round((pos2.x + Number.EPSILON) * 100) / 100;
                    pos2.y = Math.round((pos2.y + Number.EPSILON) * 100) / 100;

                    if (canMove2) {
                      PlayersDataHandler.nftDataofLiveConnections[player2_index].last_position_x = pos2.x;
                      PlayersDataHandler.nftDataofLiveConnections[player2_index].last_position_y = pos2.y;
                    }
                    let tempMsg2 = {
                      event: "teleport",
                      walletAddress: PlayersDataHandler.nftDataofLiveConnections[player2_index].walletAddress,
                      orientation: PlayersDataHandler.nftDataofLiveConnections[player2_index].orientation,
                      ...pos2,
                    };
                    MessageQueueHandler.FillGameMessageQueue(tempMsg2);
                  } else {
                    // console.log("in here .. p1 ", player2Data.orientation, player1Data.orientation )
                    if (player2Data.orientation === player1Data.orientation) {
                      if (player1Data.orientation === "right") {
                        PlayersDataHandler.nftDataofLiveConnections[player1_index].orientation = "left";
                      } else {
                        PlayersDataHandler.nftDataofLiveConnections[player1_index].orientation = "right";
                      }
                    }
                    PlayersDataHandler.nftDataofLiveConnections[player1_index].got_hit_lift_off_fall = true;
                    PlayersDataHandler.nftDataofLiveConnections[player1_index].got_hit_lift_off_fall_lastTime = new Date().getTime();
                    let tempMsg = {
                      event: "got_hit_lift_off_fall",
                      walletAddress: PlayersDataHandler.nftDataofLiveConnections[player1_index].walletAddress,
                      orientation: PlayersDataHandler.nftDataofLiveConnections[player1_index].orientation,
                    };
                    MessageQueueHandler.FillGameMessageQueue(tempMsg);
                  }
                }

                if (eventToSend !== "") {
                  let msg = {
                    player1: playerDataReducerPart2ForHIt(PlayersDataHandler.nftDataofLiveConnections[player1_index]),
                    player2: playerDataReducerPart2ForHIt(PlayersDataHandler.nftDataofLiveConnections[player2_index]),
                    event: eventToSend,
                    fightStarted: FightHandler.fightInfo.fightStageStarted,
                    preFightStarted: FightHandler.fightInfo.preFightStageStarted,
                    fightStartedAt: FightHandler.fightInfo.fightStageStartedAt,
                    // fight_id: FightHandler.fightInfo.fight_id,
                    last_health_p1,
                    last_health_p2,
                  };
                  console.log("sending events.....kick punch .", last_health_p1, last_health_p2);
                  MessageQueueHandler.FillGameMessageQueue(msg);
                }

                if (
                  !(
                    PlayersDataHandler.nftDataofLiveConnections[player1_index].got_hit_lift_off_fall_lastTime + FIXED_GET_UP_TIME > new Date().getTime() ||
                    PlayersDataHandler.nftDataofLiveConnections[player2_index].got_hit_lift_off_fall_lastTime + FIXED_GET_UP_TIME > new Date().getTime()
                  )
                ) {
                  // hit animation message logic
                  if (you_are_player === 2) {
                    let gotHitMessage = {};
                    if (player1Data.orientation === player2Data.orientation) {
                      gotHitMessage = {
                        event: "showGotBackHitAnimation",
                        walletAddress: player1Data.walletAddress,
                      };
                      MessageQueueHandler.FillGameMessageQueue(gotHitMessage);
                      // sendMessageToAll(JSON.stringify(gotHitMessage))
                    } else {
                      gotHitMessage = {
                        event: "showGotHitAnimation",
                        walletAddress: player1Data.walletAddress,
                      };
                      MessageQueueHandler.FillGameMessageQueue(gotHitMessage);
                      // sendMessageToAll(JSON.stringify(gotHitMessage))
                    }
                  } else {
                    let gotHitMessage = {};
                    if (player1Data.orientation === player2Data.orientation) {
                      gotHitMessage = {
                        event: "showGotBackHitAnimation",
                        walletAddress: player2Data.walletAddress,
                      };
                      MessageQueueHandler.FillGameMessageQueue(gotHitMessage);
                      // sendMessageToAll(JSON.stringify(gotHitMessage))
                    } else {
                      gotHitMessage = {
                        event: "showGotHitAnimation",
                        walletAddress: player2Data.walletAddress,
                      };
                      MessageQueueHandler.FillGameMessageQueue(gotHitMessage);
                      // sendMessageToAll(JSON.stringify(gotHitMessage))
                    }
                  }
                }
              }
            }
          }
          let tempMsg = {
            event: obj.event,
            walletAddress: obj.walletAddress,
          };
          MessageQueueHandler.FillGameMessageQueue(tempMsg);
        } else if (obj.event === "fight_machine_button_press") {
          MessageQueueHandler.FillGameMessageQueue(obj);
          // sendMessageToAll(JSON.stringify(obj))
        } else if (obj.event === "fight_confirmation_accepted") {
          // console.log(obj)
          // check if live
          console.log("got fight confirmation message ", obj.walletAddress, FightHandler.fightInfo.player2, FightHandler.fightInfo.player1);
          var live = false;
          for (var i = 0; i < PlayersDataHandler.nftDataofLiveConnections.length; i++) {
            var data = PlayersDataHandler.nftDataofLiveConnections[i];
            if (obj.walletAddress === data.walletAddress) {
              live = true;
              break;
            }
          }
          if (live) {
            if (obj.walletAddress === FightHandler.fightInfo.player1) {
              FightHandler.fightInfo.acceptSentPlayer1 = true;
            } else if (obj.walletAddress === FightHandler.fightInfo.player2) {
              FightHandler.fightInfo.acceptSentPlayer2 = true;
            }
          }
        } else if (obj.event === "typing") {
          MessageQueueHandler.FillGameMessageQueue(obj);
        } else if (obj.event === "item_bought") {
          console.log("item bought .... ");
          if (obj.itemName === "brew") {
            // AssetManager.addBrew(obj.walletAddress, 1)
            // AddActiveAsset(obj.walletAddress, "brew")
          }
          // MessageQueueHandler.FillGameMessageQueue({
          //   event: "item_added",
          //   itemName: obj.itemName,
          //   walletAddress: obj.walletAddress,
          //   number_of_brews: AssetManager.brewForUsers[obj.walletAddress]
          // })
        } else if (obj.event === "geoInfo") {
          // let newData = obj.data;
          // newData["_walletAddress"] = obj.walletAddress;
          // PlayersInfoManager.setGeoInfo(newData, obj.walletAddress);
        } else if (obj.event === "brew_used") {
          let required_player_index = -1;
          for (let i = 0; i < PlayersDataHandler.nftDataofLiveConnections.length; i++) {
            let data = PlayersDataHandler.nftDataofLiveConnections[i];
            if (data.walletAddress === obj.walletAddress) {
              required_player_index = i;
              break;
            }
          }
          PlayersDataHandler.nftDataofLiveConnections[required_player_index].brew_started_drinking_time = new Date().getTime();
          PlayersDataHandler.nftDataofLiveConnections[required_player_index].brew_started_drinking = true;

          let brewUsedMessage = {
            event: "brew_used",
            walletAddress: PlayersDataHandler.nftDataofLiveConnections[required_player_index].walletAddress,
            force: obj.force,
          };
          MessageQueueHandler.FillGameMessageQueue(brewUsedMessage);
          BrewManager.SetBrewState(obj.walletAddress, obj.minted_id, false);
          BrewManager.SetSemiBrewState(obj.walletAddress, obj.minted_id, false);
        } else if (obj.event === "equip_brew") {
          // console.log("-------", obj)
          BrewManager.SetBrewState(obj.walletAddress, obj.minted_id, true);
          BrewManager.SetSemiBrewState(obj.walletAddress, obj.minted_id, false);
          MessageQueueHandler.FillGameMessageQueue(obj);
        } else if (obj.event === "semi_equip_brew") {
          // console.log("-------", obj)
          BrewManager.SetSemiBrewState(obj.walletAddress, obj.minted_id, true);
          MessageQueueHandler.FillGameMessageQueue(obj);
        } else if (obj.event === "unequip_brew") {
          console.log("-------", obj);
          BrewManager.SetBrewState(obj.walletAddress, obj.minted_id, false);
          BrewManager.SetSemiBrewState(obj.walletAddress, obj.minted_id, false);
          MessageQueueHandler.FillGameMessageQueue(obj);
        } else if (obj.event === "eject_brew") {
          let random_id = BrewManager.addBrews(obj.x, obj.y, obj.walletAddress);
          BrewManager.moveNextPosToAnimate(random_id);
        } else if (obj.event === "jackpot_spin_hit") {
          try {
            if (obj.walletAddress === JackPotWheelLogic.JACKPOT_SHOW_USER_INFO_TEMP["user_wallet_address"]) {
              const data = await JackPotWheelLogic.MakeApiCallWithTargetValue(
                JackPotWheelLogic.JACKPOT_SHOW_USER_INFO_TEMP["target_value"],
                JackPotWheelLogic.JACKPOT_SHOW_USER_INFO_TEMP["user_wallet_address"],
                JackPotWheelLogic.JACKPOT_SHOW_USER_INFO_TEMP["minted_id"]
              );
              console.log("debug_jackpot", data, JackPotWheelLogic.JACKPOT_SHOW_USER_INFO_TEMP);
              if (data.success && data.data > -1) {
                // jackpot win
                let fight_decision_message = {
                  event: "jackpot_win",
                  user_wallet_address: JackPotWheelLogic.JACKPOT_SHOW_USER_INFO_TEMP["user_wallet_address"],
                  amount: data.data,
                };
                MessageQueueHandler.FillGameMessageQueue(fight_decision_message);
              } else {
                setTimeout(() => {
                  let fight_decision_message = {
                    event: "jackpot_lose",
                    user_wallet_address: JackPotWheelLogic.JACKPOT_SHOW_USER_INFO_TEMP["user_wallet_address"],
                  };
                  MessageQueueHandler.FillGameMessageQueue(fight_decision_message);
                });
              }
              JackPotWheelLogic.JACKPOT_SHOW_USER_INFO_TEMP = {};
            }
          } catch (err) {
            console.log("error in jackpot_spin_hit ", err);
          }
        }
      } catch (error) {
        console.log("error occured -->", error);
      }
    },
    drain: (connection) => {
      console.log("WebSocket backpressure: " + connection.getBufferedAmount());
    },
    close: (connection, code, message) => {
      console.log("WebSocket closed");
      let arr = Object.keys(ConnectionToUserUidMapping);
      let leftPlayer = "";

      for (let i = 0; i < arr.length; i++) {
        if (connection === ConnectionToUserUidMapping[arr[i]]) {
          console.log("this user exited,,,", arr[i]);
          leftPlayer = arr[i];
          break;
        }
      }
      console.log("left player", leftPlayer);
      delete ConnectionToUserUidMapping[leftPlayer];

      if (leftPlayer !== "") {
        let newArr = [];
        let leftPlayerData: INFTDataOfConnections = createEmptyPlayer();
        // console.log("left player 1", leftPlayer)
        for (let i = 0; i < PlayersDataHandler.nftDataofLiveConnections.length; i++) {
          let data = PlayersDataHandler.nftDataofLiveConnections[i];
          // console.log("left player 2", data.walletAddress, leftPlayer, data.walletAddress != leftPlayer)
          if (data.walletAddress != leftPlayer) {
            newArr.push(data.walletAddress);
          }
          if (data.walletAddress === leftPlayer) {
            leftPlayerData = data;
          }
        }
        // check if he is in queue and call the correct function
        FightQueueHandler.ValidateAndRemoveUser(leftPlayerData.walletAddress);
        QueuePoolHandler.removePlayerInfoFromQueuePool(leftPlayerData.walletAddress);
        if (leftPlayerData.walletAddress !== "") {
          let leaving_message = {
            event: "player_left",
            walletAddress: leftPlayerData.walletAddress,
            nick_name: leftPlayerData.nick_name,
            type: 20,
            message: " Left",
          };
          MessageQueueHandler.FillGameMessageQueue(leaving_message);
          leftPlayerData.logoutTime = new Date().getTime();
          leftPlayerData.loggedInDuration = (leftPlayerData.logoutTime - leftPlayerData.loginTime) / 1000;

          HealthManager.setHealth(leftPlayerData.walletAddress, leftPlayerData.health, leftPlayerData.minted_id.toString());
          AddToChatQueue(leaving_message);
        }
        let obj = {
          event: "live_players",
          live_players: newArr,
        };
        MessageQueueHandler.FillGameMessageQueue(obj);

        let narr = [];
        PlayersDataHandler.nftDataofLiveConnectionsMap = new Map();
        for (let i = 0; i < PlayersDataHandler.nftDataofLiveConnections.length; i++) {
          let data = PlayersDataHandler.nftDataofLiveConnections[i];
          if (data.walletAddress != leftPlayer) {
            narr.push(data);

            PlayersDataHandler.nftDataofLiveConnectionsMap.set(data.walletAddress, data);
          }
        }
        PlayersDataHandler.nftDataofLiveConnections = [...narr];
        console.log("changed live players ", PlayersDataHandler.nftDataofLiveConnections.length);
        BroadcastQueueStatus();
      }
      totalConnectionCount -= 1;
      console.log(new Date() + " Peer " + connection.remoteAddress + " disconnected.");
    },
  })
  .any("/*", (res, req) => {
    res.end("Nothing to see here!");
  });

console.log("********************************************* ");
server.listen(PORT, (token) => {
  if (token) {
    console.log("Listening to PORT " + PORT);
  } else {
    console.log("Failed to listen to PORT " + PORT);
  }
});

function messageBroadcaster() {
  let lastTimeout: NodeJS.Timeout;
  // UpdateFightStatus()
  try {
    if (MessageQueueHandler.queueRunningIndex % 2 === 0) {
      if (MessageQueueHandler.gameMessageQueueA.length > 0) {
        sendMessageToAll(JSON.stringify(MessageQueueHandler.gameMessageQueueA));
      }
      MessageQueueHandler.gameMessageQueueA = [];
      MessageQueueHandler.queueRunningIndex += 1;
    } else {
      if (MessageQueueHandler.gameMessageQueueB.length > 0) {
        sendMessageToAll(JSON.stringify(MessageQueueHandler.gameMessageQueueB));
      }
      // sendMessageToAll(JSON.stringify(MessageQueueHandler.gameMessageQueueB));
      MessageQueueHandler.gameMessageQueueB = [];
      MessageQueueHandler.queueRunningIndex += 1;
    }
    if (MessageQueueHandler.queueRunningIndex === 1000) {
      MessageQueueHandler.queueRunningIndex = 0;
    }
    lastTimeout = setTimeout(messageBroadcaster, Math.round(1000 / SERVER_REFRESH_RATE));
  } catch (err) {
    console.log("----some error happened in messageBroadcaster -----", err);
    clearTimeout(lastTimeout);
    lastTimeout = setTimeout(messageBroadcaster, Math.round(1000 / SERVER_REFRESH_RATE));
  }
}

async function BroadcastQueueStatus() {
  FightQueueHandler.UpdateQueueInfo();
  console.log("------------------------ BroadcastQueueStatus ---------------", FightQueueHandler.combinedQueueData.length);
  console.log("------------------------ Total Connections  ---------------", PlayersDataHandler.nftDataofLiveConnections.length, Object.keys(ConnectionToUserUidMapping).length);
}

async function sendFightRequestConfirmationToP1AndP2() {
  console.log("sending request to p1 and p2");
  try {
    let message = {
      event: "fight_confirmation",
      walletAddress: FightHandler.fightInfo.player1,
    };
    if (!isNullOrUndefined(ConnectionToUserUidMapping[FightHandler.fightInfo.player1])) {
      MessageQueueHandler.FillGameMessageQueue(message);
    }
    FightHandler.fightInfo.requestSentPlayer1 = true;
    FightHandler.fightInfo.requestSentPlayer2 = true;
    message = {
      event: "fight_confirmation",
      walletAddress: FightHandler.fightInfo.player2,
    };
    if (!isNullOrUndefined(ConnectionToUserUidMapping[FightHandler.fightInfo.player2])) {
      MessageQueueHandler.FillGameMessageQueue(message);
    }
    FightHandler.fightInfo.requestSentTime = new Date().getTime();
  } catch (err) {
    console.error("error in sendFightRequestConfirmationToP1AndP2 --> ", err);
    FightHandler.fightInfo.requestSentPlayer1 = false;
    FightHandler.fightInfo.requestSentPlayer2 = false;
    BroadcastQueueStatus();
  }
}

async function resetHealthAndStamina(update_health_and_stamina_bool = false) {
  console.log("sending fight update data...");
  let player1Data: INFTDataOfConnections = createEmptyPlayer();
  let player2Data: INFTDataOfConnections = createEmptyPlayer();
  for (let i = 0; i < PlayersDataHandler.nftDataofLiveConnections.length; i++) {
    let data = PlayersDataHandler.nftDataofLiveConnections[i];
    if (data.walletAddress === FightHandler.fightInfo.player1) {
      player1Data = data;
    }
    if (data.walletAddress === FightHandler.fightInfo.player2) {
      player2Data = data;
    }
  }
  if (update_health_and_stamina_bool) {
    player1Data.health = player1Data.max_health;
    player1Data.stamina = player1Data.max_stamina;
    player2Data.health = player2Data.max_health;
    player2Data.stamina = player2Data.max_stamina;
  }
  let msgObj = {
    event: "fight_update",
    player1: playerDataReducer(player1Data),
    player2: playerDataReducer(player2Data),
    fightStarted: FightHandler.fightInfo.fightStageStarted,
    preFightStarted: FightHandler.fightInfo.preFightStageStarted,
    fightStartedAt: FightHandler.fightInfo.fightStageStartedAt,
  };
  MessageQueueHandler.FillGameMessageQueue(msgObj);

  // sendMessageToAll(JSON.stringify(msgObj))
}

async function FightStartMessageSender(count: number) {
  var msg = "";
  if (count > 3) {
    msg = `${count - 3}`;
  } else if (count <= 3 && count > 2) {
    msg = `Ready?`;
  } else if (count == 2) {
    msg = `Fight!`;
  }
  if (count > 1) {
    var msgObj = {
      event: "fight_start_pre_announcement",
      message: msg,
      // ...FightHandler.fightInfo,
      player1: FightHandler.fightInfo.player1,
      player2: FightHandler.fightInfo.player2,
      fight_id: FightHandler.fightInfo.fight_id,
      centerX: center_of_stage.x,
      centerY: center_of_stage.y,
    };
    MessageQueueHandler.FillGameMessageQueue(msgObj);
    // sendMessageToAll(JSON.stringify(msgObj))
    // teleportingToStageMessage(fightInfo.player1, "left", "right")
    // teleportingToStageMessage(fightInfo.player2, "right", "left")
  }
}

function playerDataReducer(playerData: INFTDataOfConnections): ICompressedNFTDataOfConnections {
  return {
    walletAddress: playerData.walletAddress,
    // nick_name: playerData.nick_name,
    defense: playerData.defense,
    speed: playerData.speed,
    kickpower: playerData.kickpower,
    punchpower: playerData.punchpower,
    health: playerData.health,
    stamina: playerData.stamina,
    // last_position_x: (playerData.last_position_x),
    // last_position_y: playerData.last_position_y,
    // max_stamina: playerData.max_stamina,
    // max_health: playerData.max_health,
    // profile_image: playerData.profile_image
  };
}

function playerDataReducerPart2ForHIt(playerData: INFTDataOfConnections) {
  return {
    walletAddress: playerData.walletAddress,
    health: playerData.health,
    stamina: playerData.stamina,
  };
}

function playerDataReduceForJoining(playerData: INFTDataOfConnections) {
  return {
    walletAddress: playerData.walletAddress,
    last_position_x: playerData.last_position_x,
    last_position_y: playerData.last_position_y,
    profile_image: playerData.profile_image,
    minted_id: playerData.minted_id,
    max_health: playerData.max_health,
    max_stamina: playerData.max_stamina,
    nick_name: playerData.nick_name,
    sprite_url: playerData.sprite_url,

    defense: playerData.defense,
    punchpower: playerData.punchpower,
    kickpower: playerData.kickpower,
    speed: playerData.speed,
    health: playerData.max_health,
    stamina: playerData.max_stamina,

    all_aps: playerData.all_aps,
    user_type: playerData.user_type,
  };
}

function UpdateFightStatus() {
  let player1Data: INFTDataOfConnections = createEmptyPlayer();
  let player2Data: INFTDataOfConnections = createEmptyPlayer();
  for (let i = 0; i < PlayersDataHandler.nftDataofLiveConnections.length; i++) {
    let data = PlayersDataHandler.nftDataofLiveConnections[i];
    if (data.walletAddress === FightHandler.fightInfo.player1) {
      player1Data = data;
    }
    if (data.walletAddress === FightHandler.fightInfo.player2) {
      player2Data = data;
    }
  }

  let msgObj = {
    event: "fight_update",
    player1: playerDataReducer(player1Data),
    player2: playerDataReducer(player2Data),
    fightStarted: FightHandler.fightInfo.fightStageStarted,
    preFightStarted: FightHandler.fightInfo.preFightStageStarted,
    fightStartedAt: FightHandler.fightInfo.fightStageStartedAt,
    fight_id: FightHandler.fightInfo.fight_id,
  };
  MessageQueueHandler.FillGameMessageQueue(msgObj);
}

function UpdateLastHealthOfPlayers(fight_id: string, p1: string, p2: string) {
  console.log("update last player health into db ", fight_id, p1, p2);
  let player1Data: INFTDataOfConnections = createEmptyPlayer();
  let player2Data: INFTDataOfConnections = createEmptyPlayer();
  for (let i = 0; i < PlayersDataHandler.nftDataofLiveConnections.length; i++) {
    var data = PlayersDataHandler.nftDataofLiveConnections[i];
    if (data.walletAddress === p1) {
      player1Data = data;
    }
    if (data.walletAddress === p2) {
      player2Data = data;
    }
  }
  UpdateFightEndStats(fight_id, player1Data.health, player2Data.health, p1, p2);
}

async function fightStartMessageSender(count: number) {
  var myTimeout = setTimeout(() => {
    count--;
    FightStartMessageSender(count);
    UpdateFightStatus();
    fightStartMessageSender(count);
  }, 1 * 1000);
  if (count <= 0) {
    clearTimeout(myTimeout);
  }
}

function ChangeMovementAbilityOfFighters(ability: string) {
  let player1Data: INFTDataOfConnections = createEmptyPlayer();
  let player2Data: INFTDataOfConnections = createEmptyPlayer();
  for (let i = 0; i < PlayersDataHandler.nftDataofLiveConnections.length; i++) {
    var data = PlayersDataHandler.nftDataofLiveConnections[i];
    if (data.walletAddress === FightHandler.fightInfo.player1) {
      player1Data = data;
    }
    if (data.walletAddress === FightHandler.fightInfo.player2) {
      player2Data = data;
    }
  }

  player1Data.movementAbility = ability;
  player2Data.movementAbility = ability;
}

function TeleportLogic(teleport_in = true, far = true) {
  let player1Data: INFTDataOfConnections = createEmptyPlayer();
  let player2Data: INFTDataOfConnections = createEmptyPlayer();
  for (let i = 0; i < PlayersDataHandler.nftDataofLiveConnections.length; i++) {
    var data = PlayersDataHandler.nftDataofLiveConnections[i];
    if (data.walletAddress === FightHandler.fightInfo.player1) {
      player1Data = data;
    }
    if (data.walletAddress === FightHandler.fightInfo.player2) {
      player2Data = data;
    }
  }
  if (teleport_in) {
    if (far) {
      player1Data.last_position_x = center_of_stage.x - 80;
      player1Data.last_position_y = center_of_stage.y - 20;
      player2Data.last_position_x = center_of_stage.x + 80;
      player2Data.last_position_y = center_of_stage.y - 20;
    } else {
      player1Data.last_position_x = center_of_stage.x - 30;
      player1Data.last_position_y = center_of_stage.y - 10;
      player2Data.last_position_x = center_of_stage.x + 30;
      player2Data.last_position_y = center_of_stage.y - 10;
    }
  } else {
    let random_pos_selected = Math.floor(Math.random() * random_spawn_points_player.length);
    player1Data.last_position_x = random_spawn_points_player[random_pos_selected].x;
    player1Data.last_position_y = random_spawn_points_player[random_pos_selected].y;

    random_pos_selected = Math.floor(Math.random() * random_spawn_points_player.length);
    player2Data.last_position_x = random_spawn_points_player[random_pos_selected].x;
    player2Data.last_position_y = random_spawn_points_player[random_pos_selected].y;
  }

  let action_id = uuidv4();

  let msgObj = {
    event: "teleport",
    x: player1Data.last_position_x,
    y: player1Data.last_position_y,
    walletAddress: player1Data.walletAddress,
    orientation: "right",
    action_id,
  };

  let msgObj2 = {
    event: "teleport",
    x: player2Data.last_position_x,
    y: player2Data.last_position_y,
    walletAddress: player2Data.walletAddress,
    orientation: "left",
    action_id,
  };

  MessageQueueHandler.FillGameMessageQueue(msgObj);
  MessageQueueHandler.FillGameMessageQueue(msgObj2);
}

function isPlayerLive(userWalletAddress: string) {
  if (userWalletAddress in ConnectionToUserUidMapping) {
    return true;
  }
  return false;
}

function MinHealthReachedForAnyPlayer() {
  // console.log("----- executing .. MinHealthReachedForAnyPlayer ")
  var player1Data: INFTDataOfConnections = createEmptyPlayer();
  var player2Data: INFTDataOfConnections = createEmptyPlayer();
  var min_health_reached = false;
  for (var i = 0; i < PlayersDataHandler.nftDataofLiveConnections.length; i++) {
    var data = PlayersDataHandler.nftDataofLiveConnections[i];
    if (data.walletAddress === FightHandler.fightInfo.player1) {
      player1Data = data;
    }
    if (data.walletAddress === FightHandler.fightInfo.player2) {
      player2Data = data;
    }
  }
  // console.log(" health of 1 and 2 ", player1Data.health, player2Data.health )
  if (player1Data.health <= 0) {
    min_health_reached = true;
    var message = {
      event: "show_dead",
      walletAddress: player1Data.walletAddress,
    };
    sendMessageToAll(JSON.stringify(message));
  }
  if (player2Data.health <= 0) {
    min_health_reached = true;
    var message = {
      event: "show_dead",
      walletAddress: player2Data.walletAddress,
    };
    sendMessageToAll(JSON.stringify(message));
  }
  // show_dead
  // console.log("******************************", min_health_reached)
  return min_health_reached;
}

var currentFightResult = "";
function DecideFightWinner() {
  let player1Data: INFTDataOfConnections = createEmptyPlayer();
  let player2Data: INFTDataOfConnections = createEmptyPlayer();
  for (let i = 0; i < PlayersDataHandler.nftDataofLiveConnections.length; i++) {
    let data = PlayersDataHandler.nftDataofLiveConnections[i];
    if (data.walletAddress === FightHandler.fightInfo.player1) {
      player1Data = data;
    }
    if (data.walletAddress === FightHandler.fightInfo.player2) {
      player2Data = data;
    }
  }
  let _winner = "";
  let _loser = "";
  let winner_nick_name = "";
  let loser_nick_name = "";
  let winner_minted_id = -1;
  let _draw = false;
  if (player1Data.walletAddress !== "" && player2Data.walletAddress !== "") {
    if (player1Data.health === player2Data.health) {
      currentFightResult = "Draw";
      _draw = true;
      if (player1Data.max_health > player2Data.max_health) {
        _winner = player1Data.walletAddress;
        _loser = player2Data.walletAddress;
        winner_nick_name = player1Data.nick_name;
        loser_nick_name = player2Data.nick_name;

        player2Data.health = player1Data.health - 1;
      } else {
        _winner = player2Data.walletAddress;
        _loser = player1Data.walletAddress;
        winner_nick_name = player2Data.nick_name;
        loser_nick_name = player1Data.nick_name;

        player1Data.health = player2Data.health - 1;
      }
    } else if (player1Data.health > player2Data.health) {
      currentFightResult = `${player1Data.nick_name} wins.`;
      _winner = player1Data.walletAddress;
      _loser = player2Data.walletAddress;
      winner_nick_name = player1Data.nick_name;
      loser_nick_name = player2Data.nick_name;
      winner_minted_id = player1Data.minted_id;
    } else {
      currentFightResult = `${player2Data.nick_name} wins.`;
      _winner = player2Data.walletAddress;
      _loser = player1Data.walletAddress;
      winner_nick_name = player2Data.nick_name;
      loser_nick_name = player1Data.nick_name;
      winner_minted_id = player2Data.minted_id;
    }
  } else if (player1Data.walletAddress !== "" && player2Data.walletAddress === "") {
    currentFightResult = `${player1Data.nick_name} wins.`;
    _winner = player1Data.walletAddress;
    winner_nick_name = player1Data.nick_name;
    winner_minted_id = player1Data.minted_id;
  } else if (player1Data.walletAddress === "" && player2Data.walletAddress !== "") {
    currentFightResult = `${player2Data.nick_name} wins.`;
    _winner = player2Data.walletAddress;
    winner_nick_name = player2Data.nick_name;
    winner_minted_id = player2Data.minted_id;
  }
  return {
    winner: _winner,
    loser: _loser,
    draw: _draw,
    winner_nick_name,
    loser_nick_name,
    winner_minted_id,
  };
}

async function FightEndExecutor(show_lose_anim = true) {
  FightHandler.fightInfo.postFightStageStarted = true;
  FightQueueHandler.RemoveFirstFightIndex();
  console.log("executing fight end.. ", show_lose_anim);
  FightHandler.fightInfo.postFightStageStarted = true;
  FightHandler.fightInfo.postFightStageStartedAt = new Date().getTime();
  FightHandler.fightInfo.fightStageStarted = false;
  // await updateQueue();
  let { winner, loser, winner_nick_name, loser_nick_name, winner_minted_id } = DecideFightWinner();

  let fight_decision_message = {
    event: "fight_announcement",
    winner,
    loser,
    winner_nick_name,
    loser_nick_name,
  };
  AddToChatQueue(fight_decision_message);
  MessageQueueHandler.FillGameMessageQueue(fight_decision_message);

  // let show_jackpot_wheel = false;
  // let client_target = 0;
  const { client_target, show_jackpot_wheel } = JackPotWheelLogic.DecideIfShowJackPotWheel();
  console.log("in FightEndExecutor jackpot ", client_target, show_jackpot_wheel);
  if (show_jackpot_wheel) {
    JackPotWheelLogic.JACKPOT_SHOW_USER_INFO_TEMP = {
      user_wallet_address: winner,
      minted_id: winner_minted_id,
      target_number: client_target,
    };
    setTimeout(async () => {
      let fight_decision_message = {
        event: "jackpot_show",
        user_wallet_address: winner,
        target_value: client_target,
      };
      MessageQueueHandler.FillGameMessageQueue(fight_decision_message);
    }, 10 * 1000);
    FightHandler.stopFightForSomeEvent = true;
    setTimeout(() => {
      FightHandler.stopFightForSomeEvent = false;
    }, 10 * 1000)
  }

  ChangePlayersFightState(false); // change fighting state to false coz fight ended
  // await BroadcastQueueStatus();
  // ExecuteFightEnd(winner, loser, draw );
  let fight_id = FightHandler.fightInfo.fight_id;
  UpdateLastHealthOfPlayers(fight_id, FightHandler.fightInfo.player1, FightHandler.fightInfo.player2);

  // AmplitudeService.exportFightInfo(winner, loser)
  let player1Data: INFTDataOfConnections;
  let player2Data: INFTDataOfConnections;
  let loser_index = -1;
  for (let i = 0; i < PlayersDataHandler.nftDataofLiveConnections.length; i++) {
    let data = PlayersDataHandler.nftDataofLiveConnections[i];
    if (data.walletAddress === FightHandler.fightInfo.player1) {
      player1Data = data;
      if (data.walletAddress === loser) {
        loser_index = i;
      }
      let message = {
        event: "stop_show_stunned",
        walletAddress: data.walletAddress,
        stamina: data.stamina,
      };
      MessageQueueHandler.FillGameMessageQueue(message);
    }
    if (data.walletAddress === FightHandler.fightInfo.player2) {
      player2Data = data;
      if (data.walletAddress === loser) {
        loser_index = i;
      }
      let message = {
        event: "stop_show_stunned",
        walletAddress: data.walletAddress,
        stamina: data.stamina,
      };
      MessageQueueHandler.FillGameMessageQueue(message);
    }
    PlayersDataHandler.nftDataofLiveConnections[i] = data;
  }

  let msgObj = {
    event: "fight_end_announcement",
    player1: player1Data,
    player2: player2Data,
    fightStarted: FightHandler.fightInfo.fightStageStarted,
    preFightStarted: false,
    fightStartedAt: FightHandler.fightInfo.fightStageStartedAt,
    message: currentFightResult,
    winner,
    loser,
  };
  console.log("sending fight_end_announcement");
  MessageQueueHandler.FillGameMessageQueue(msgObj);
  // setTimeout(() => {
  //   MessageQueueHandler.FillGameMessageQueue(msgObj)
  // }, 5000)
  console.log("executing fight_end_.. loser index ", loser_index, show_lose_anim);
  let winningMessage = {
    event: "showWinAnimation",
    walletAddress: winner,
  };
  MessageQueueHandler.FillGameMessageQueue(winningMessage);
  console.log("executing fight_end_.. ", show_lose_anim);
  if (show_lose_anim) {
    let loseMessage = {
      event: "showLosingAnimation",
      walletAddress: loser,
    };
    MessageQueueHandler.FillGameMessageQueue(loseMessage);
  } else {
    let dyingMessage = {
      event: "showDeadAnim",
      walletAddress: loser,
    };
    MessageQueueHandler.FillGameMessageQueue(dyingMessage);
    try {
      PlayersDataHandler.nftDataofLiveConnections[loser_index].died = true;
      PlayersDataHandler.nftDataofLiveConnections[loser_index].died_lastTime = new Date().getTime();
    } catch (err) {
      console.log("err in line 1609 ", err);
    }
  }
  // let moveAbilityChange1 = {
  //   event: 'movementAbility',
  //   walletAddress: loser,
  //   ability: "stop"
  // }
  // let moveAbilityChange2 = {
  //   event: 'movementAbility',
  //   walletAddress: winner,
  //   ability: "stop"
  // }
  // MessageQueueHandler.FillGameMessageQueue(moveAbilityChange1)
  // MessageQueueHandler.FillGameMessageQueue(moveAbilityChange2)
  // MessageQueueHandler.FillGameMessageQueue(winningMessage)
}

function ChangePlayersFightState(state: boolean) {
  let player1Data: INFTDataOfConnections = createEmptyPlayer();
  let player2Data: INFTDataOfConnections = createEmptyPlayer();
  for (let i = 0; i < PlayersDataHandler.nftDataofLiveConnections.length; i++) {
    let data = PlayersDataHandler.nftDataofLiveConnections[i];
    if (data.walletAddress === FightHandler.fightInfo.player1) {
      player1Data = data;
    }
    if (data.walletAddress === FightHandler.fightInfo.player2) {
      player2Data = data;
    }
  }

  player1Data.fighting = state;
  player2Data.fighting = state;
}

var fight_ongoing: boolean = false;
var last_fight_done_on: number = 0;
async function HandleFightStatusV2() {
  // console.log("in HandleFightStatusV2 -------------------------------", queueData.length, fightInfo)
  // console.log("in HandleFightStatusV2 -------------------------------", )
  if (
    FightHandler.fightInfo.acceptSentPlayer1 &&
    FightHandler.fightInfo.acceptSentPlayer2 &&
    FightHandler.fightInfo.preFightStageStarted &&
    FightHandler.fightInfo.preFightAnnouncementStarted &&
    !FightHandler.fightInfo.fightStageStarted &&
    FightHandler.fightInfo.postFightStageStarted
  ) {
    console.log("ongoing post fight stage");
    if (new Date().getTime() - FightHandler.fightInfo.postFightStageStartedAt > 10 * 1000) {
      console.log("ongoing post fight stage reset");

      // await UpdateFightEndStats(FightHandler.fightInfo.fight_id, FightHandler.fightInfo.)
      // FightQueueHandler.deleteUserFromQueue(FightHandler.fightInfo.player1)
      // FightQueueHandler.deleteUserFromQueue(FightHandler.fightInfo.player2)
      // FightQueueHandler.rearrangeCombinedQueueData()
      // teleport out
      // let moveAbilityChange1 = {
      //   event: 'movementAbility',
      //   walletAddress: FightHandler.fightInfo.player1,
      //   ability: "play"
      // }
      // MessageQueueHandler.FillGameMessageQueue(moveAbilityChange1)
      // let moveAbilityChange2 = {
      //   event: 'movementAbility',
      //   walletAddress: FightHandler.fightInfo.player2,
      //   ability: "play"
      // }
      // MessageQueueHandler.FillGameMessageQueue(moveAbilityChange1)
      // MessageQueueHandler.FillGameMessageQueue(moveAbilityChange2)
      TeleportLogic(false);
      FightHandler.resetFightInfo();
      // FightQueueHandler.RemoveFirstFightIndex()
      UpdateFightStatus();
    }
    last_fight_done_on = new Date().getTime();
    fight_ongoing = false;
  } else if (
    FightHandler.fightInfo.acceptSentPlayer1 &&
    FightHandler.fightInfo.acceptSentPlayer2 &&
    FightHandler.fightInfo.preFightStageStarted &&
    FightHandler.fightInfo.preFightAnnouncementStarted &&
    FightHandler.fightInfo.fightStageStarted
  ) {
    // keep checking player 1 and player 2 health
    console.log("fight ongoing..");
    // UpdateStaminalOfUser()
    if (isPlayerLive(FightHandler.fightInfo.player1) && isPlayerLive(FightHandler.fightInfo.player2)) {
      // both player are live.
      // console.log("both players are live.. and playing/..")
    } else if (isPlayerLive(FightHandler.fightInfo.player1) && !isPlayerLive(FightHandler.fightInfo.player2)) {
      // announce --- player1 wins
      console.log("end_fight, player1 wins , p2 not live");
      FightEndExecutor();
    } else if (isPlayerLive(FightHandler.fightInfo.player2) && !isPlayerLive(FightHandler.fightInfo.player1)) {
      // announce --- player2 wins
      console.log("end_fight, player2 wins p1 not live");
      FightEndExecutor();
    }
    // else if (MinHealthReachedForAnyPlayer()) {
    //   console.log("end_fight min health reached for some player")
    //   FightEndExecutor(false);
    // }
    // else {
    //   console.log("end_fight, players left..")
    //   FightEndExecutor();
    // }
    // win by decision
    if (new Date().getTime() - FightHandler.fightInfo.fightStageStartedAt > 60 * 1000) {
      console.log("end_fight, duration ended..");
      FightEndExecutor();
    }
    // win by ko
    if (MinHealthReachedForAnyPlayer()) {
      console.log("end_fight min health reached for some player");
      FightEndExecutor(false);
    }
  } else if (FightHandler.fightInfo.acceptSentPlayer1 && FightHandler.fightInfo.acceptSentPlayer2 && FightHandler.fightInfo.preFightStageStarted && FightHandler.fightInfo.preFightAnnouncementStarted) {
    // do nothing..
    console.log("waiting for pre fight announcement to end..", new Date().getTime() - FightHandler.fightInfo.prefightStageStartedAt);
    if (new Date().getTime() - FightHandler.fightInfo.prefightStageStartedAt > 5 * 1000) {
      FightHandler.fightInfo.fightStageStarted = true;
      FightHandler.fightInfo.fightStageStartedAt = new Date().getTime();

      // give movement ability to fighters.
      // ChangeMovementAbilityOfFighters("move")
      console.log("pre fight announcement ended..");
    }
    fight_ongoing = true;
  } else if (
    FightQueueHandler.combinedQueueData.length >= 1 &&
    FightHandler.fightInfo.acceptSentPlayer1 &&
    FightHandler.fightInfo.acceptSentPlayer2 &&
    FightHandler.fightInfo.preFightStageStarted &&
    !FightHandler.fightInfo.preFightAnnouncementStarted
  ) {
    // send transport players..
    // countdown start..
    ChangePlayersFightState(false);
    UpdateFightStartedState(FightHandler.fightInfo.fight_id);
    setTimeout(() => {
      MessageQueueHandler.SendBalanceUpdateMessageToAll();
    }, 1000);
    FightHandler.fightInfo.prefightStageStartedAt = new Date().getTime();
    FightHandler.fightInfo.preFightAnnouncementStarted = true;
    // teleport players first..
    TeleportLogic();
    // ChangeMovementAbilityOfFighters("stop")
    fightStartMessageSender(7);
  } else if (FightQueueHandler.combinedQueueData.length >= 1 && FightHandler.fightInfo.player1 !== "" && FightHandler.fightInfo.player2 !== "" && FightHandler.fightInfo.requestSentPlayer1 && FightHandler.fightInfo.requestSentPlayer2 && !FightHandler.stopFightForSomeEvent) {
    // wait for accepting
    if (FightHandler.fightInfo.acceptSentPlayer1 && FightHandler.fightInfo.acceptSentPlayer2) {
      resetHealthAndStamina();
      // move to  pre fight stage
      FightHandler.fightInfo.preFightStageStarted = true;
      FightHandler.fightInfo.prefightStageStartedAt = new Date().getTime();
    }
    if (new Date().getTime() - FightHandler.fightInfo.requestSentTime >= 20 * 1000) {
      // wait time over
      // check who accepted
      if (FightHandler.fightInfo.acceptSentPlayer1 && !FightHandler.fightInfo.acceptSentPlayer2) {
        // only p1 accepted --> move p2 to bottom
        console.log("p2 not accepted..");
        FightQueueHandler.shiftToBottom(FightHandler.fightInfo.fight_id);
        // await shiftDownInQueue(FightHandler.fightInfo.player2)
        FightHandler.resetFightInfo();
        BroadcastQueueStatus();
      } else if (!FightHandler.fightInfo.acceptSentPlayer1 && FightHandler.fightInfo.acceptSentPlayer2) {
        // only p1 accepted --> move p1 to bottom
        console.log("p1 not accepted..");
        FightQueueHandler.shiftToBottom(FightHandler.fightInfo.fight_id);
        // await shiftDownInQueue(FightHandler.fightInfo.player1)
        FightHandler.resetFightInfo();
        BroadcastQueueStatus();
      } else {
        FightQueueHandler.shiftToBottom(FightHandler.fightInfo.fight_id);
        // FightQueueHandler.shiftToBottom(FightHandler.fightInfo.player2)
        // await shiftDownInQueue(FightHandler.fightInfo.player1)
        // await shiftDownInQueue(FightHandler.fightInfo.player2)
        FightHandler.resetFightInfo();
        BroadcastQueueStatus();
      }
      // move them from queue
    } else {
      console.log("waiting..");
    }
  } else if (FightQueueHandler.combinedQueueData.length >= 1 && FightHandler.fightInfo.player1 !== "" && FightHandler.fightInfo.player2 !== "" && !FightHandler.fightInfo.requestSentPlayer1 && !FightHandler.fightInfo.requestSentPlayer2 && !FightHandler.stopFightForSomeEvent) {
    // sendRequest to p1 and p2
    console.log("sending confirmation to p1 and p2", FightHandler.fightInfo.player1_nickname, FightHandler.fightInfo.player2_nickname);
    sendFightRequestConfirmationToP1AndP2();
  } else if (FightQueueHandler.combinedQueueData.length >= 1 && !FightHandler.stopFightForSomeEvent) {
    FightHandler.resetFightInfo();
    if (FightQueueHandler.combinedQueueData.length > 0 && FightQueueHandler.combinedQueueData[0].player_count === 2) {
      FightHandler.fightInfo.player1 = FightQueueHandler.combinedQueueData[0].p1_wallet;
      FightHandler.fightInfo.player1_nickname = FightQueueHandler.combinedQueueData[0].p1_nick_name;
      FightHandler.fightInfo.player2 = FightQueueHandler.combinedQueueData[0].p2_wallet;
      FightHandler.fightInfo.player2_nickname = FightQueueHandler.combinedQueueData[0].p2_nick_name;
      FightHandler.fightInfo.fight_id = FightQueueHandler.combinedQueueData[0].fight_id;
    }

    if (FightHandler.fightInfo.player1 === "" || FightHandler.fightInfo.player2 === "") {
      FightHandler.resetFightInfo();
    }
    console.log("fighters in fightInfo ", FightHandler.fightInfo.player1, FightHandler.fightInfo.player2);
  } else {
    //
    console.log("no conditions match..", FightHandler.stopFightForSomeEvent);
    FightHandler.resetFightInfo();
  }
  // console.log("fighters in fightInfo ", FightHandler.fightInfo.player1_nickname, FightHandler.fightInfo.player2_nickname);
  // console.log("in HandleFightStatusV2 --*******************************--")
}

function UpdateStaminalOfAll(updateStaminaBool: boolean) {
  // let updated = false;
  for (let i = 0; i < PlayersDataHandler.nftDataofLiveConnections.length; i++) {
    let data = PlayersDataHandler.nftDataofLiveConnections[i];
    // console.log("-444------ ", data.stamina, data.max_stamina)
    // if (data.stamina + 1 < data.max_stamina) {
    // console.log("-333------ ", data.stamina, data.stunned)
    if (updateStaminaBool && data.stamina + 1 < data.max_stamina) {
      data.stamina += data.stamina_regeneration;
    }
    if (data.stamina > 3 + StaminaRegenarationMap[data.stamina_ap] * ExhaustedTimeMap[data.stamina_ap] && data.stunned) {
      // console.log("-222------ ", data.stamina, data.stunned)
      data.stamina = Math.floor(0.2 * data.max_stamina);
    }

    if (data.stamina > 3 + StaminaRegenarationMap[data.stamina_ap] * ExhaustedTimeMap[data.stamina_ap]) {
      // console.log("-111------ ", data.stamina, data.stunned)
      data.stunned = false;
      if (updateStaminaBool) {
        let message = {
          event: "stop_show_stunned",
          walletAddress: data.walletAddress,
          stamina: data.stamina,
        };
        MessageQueueHandler.FillGameMessageQueue(message);
      }
    }
    PlayersDataHandler.nftDataofLiveConnections[i] = data;
    // }
  }
}

let updateStaminaCounter = 0;
function updateStaminaOfAll() {
  try {
    UpdateStaminalOfAll(updateStaminaCounter % 20 === 0);
    updateStaminaCounter += 1;
    if (updateStaminaCounter === 101) {
      updateStaminaCounter = 1;
    }
    setTimeout(updateStaminaOfAll, 100 * 1);
  } catch (err) {
    setTimeout(updateStaminaOfAll, 100 * 1);
  }
}

function UpdateHealthOfAll() {
  for (let i = 0; i < PlayersDataHandler.nftDataofLiveConnections.length; i++) {
    let data = PlayersDataHandler.nftDataofLiveConnections[i];
    let updated = true;
    if (data.health < data.max_upto_regen_health) {
      data.health += 2 * data.health_regenarate;
      updated = true;
    }
    if (data.brew_started_drinking && new Date().getTime() - data.brew_started_drinking_time > 1000) {
      data.brew_started_drinking = false;
      if (data.health + 40 >= data.max_health) {
        data.health = data.max_health;
      } else {
        data.health += 40;
      }
      let message = {
        event: "update_health",
        walletAddress: data.walletAddress,
        health: data.health,
      };
      MessageQueueHandler.FillGameMessageQueue(message);
      // let brewUsedMessage = {
      //   event: "brew_used",
      //   walletAddress: data.walletAddress,
      // }
      // MessageQueueHandler.FillGameMessageQueue(brewUsedMessage)
    }

    PlayersDataHandler.nftDataofLiveConnections[i] = data;
    if (updated) {
      let message = {
        event: "update_health",
        walletAddress: data.walletAddress,
        health: data.health,
      };
      MessageQueueHandler.FillGameMessageQueue(message);
    }
  }
}

function updateHealthOfAll() {
  try {
    UpdateHealthOfAll();
    setTimeout(updateHealthOfAll, 1000 * 2);
  } catch (err) {
    setTimeout(updateHealthOfAll, 1000 * 2);
  }
}

function checkFightStatus() {
  try {
    // HandleFightStatus()
    HandleFightStatusV2();
    setTimeout(checkFightStatus, 1000 * 2);
  } catch (err) {
    setTimeout(checkFightStatus, 1000 * 2);
  }
}

function updateFightStatus() {
  try {
    UpdateFightStatus();
    setTimeout(updateFightStatus, 2 * 1000);
  } catch (err) {
    setTimeout(updateFightStatus, 2 * 1000);
  }
}

function broadCastQueueStatus() {
  try {
    BroadcastQueueStatus();
    // FightQueueHandler.UpdateTotalBetsInFights()
    setTimeout(broadCastQueueStatus, 1000 * 7);
  } catch (err) {
    setTimeout(broadCastQueueStatus, 1000 * 7);
  }
}

// function updateQueueBets() {
//   try {
//     // FightQueueHandler.UpdateTotalBetsInFights()
//     setTimeout(updateQueueBets, 1000 * 20)
//   } catch (err) {
//     setTimeout(updateQueueBets, 1000 * 20)
//   }
// }

function sendPingPongToAll() {
  try {
    console.log("----sending ping pong to all -----");
    // let date = new Date();
    // let now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
    //                 date.getUTCDate(), date.getUTCHours(),
    //                 date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
    for (let i = 0; i < PlayersDataHandler.nftDataofLiveConnections.length; i++) {
      let data = PlayersDataHandler.nftDataofLiveConnections[i];
      let obj = {
        event: "ping",
        latency_time: LatencyChecker.getLatencyTime(data.walletAddress),
        total_connections: PlayersDataHandler.nftDataofLiveConnections.length,
        walletAddress: data.walletAddress,
      };
      LatencyChecker.setPingSentAt(data.walletAddress, new Date().getTime());
      sendMessageToOne(ConnectionToUserUidMapping[data.walletAddress], JSON.stringify(obj));
    }
    setTimeout(sendPingPongToAll, 1000 * 5);
  } catch (err) {
    console.log("----some error happened in sendpingpongtoall -----", err);
    setTimeout(sendPingPongToAll, 1000 * 5);
  }
}

function handleQueuePoolLoop() {
  try {
    // QueuePoolHandler.RunLoop()
    BroadcastQueueStatus();
    setTimeout(handleQueuePoolLoop, 5 * 1000);
  } catch (err) {
    console.log("----some error happened in handleQueuePoolLoop -----", err);
    setTimeout(handleQueuePoolLoop, 1000 * 5);
  }
}

function FetchConstantsValue() {
  JackPotWheelLogic.GetJackPotConstantData();
  RatsPPRewardPoolData.GetRatsPrizeData();
}

function fetchConstantsValue() {
  FetchConstantsValue();
  setTimeout(fetchConstantsValue, 2 * 60 * 1000);
}

var rats_last_launched_time: number = 0;
var rats_launched_info: Array<IRatRewardInfo> = []
var rats_state_manager: IRatsStateManager = {
  rats_prize: [],
  rats_uuid: [],
  rats_launch_start: false,
  rats_lauched: false,
  rats_count: 0,
  rats_positiions: [],
  rats_orientations: [],
  rats_launch_time: 0,
  rats_state: [],
  rats_health: [],
  rats_last_health: [],
  rats_coins: [],
  track_movement: [],
  rats_escape_time: []
};

async function ratsLaunchLogic() {
  console.log("-----------------------*********** RATS LOGIC *******---------------------");
  if (PlayersDataHandler.nftDataofLiveConnections.length < 1) {
    console.log("-----------------------*********** RATS LOGIC *******-------- length < 1-------------");
    setTimeout(() => {
      ratsLaunchLogic();
    }, 20 * 1000);
    return;
  }

  if (new Date().getTime() - rats_last_launched_time > 1 * 60 * 1000 && rats_state_manager.rats_launch_start) {
    // destroy rats

    console.log("-----------------------*********** DESTROYING RATS RATS *******---------------------", rats_state_manager.rats_launch_start);
    rats_state_manager.rats_launch_start = !rats_state_manager.rats_launch_start;
    rats_last_launched_time = new Date().getTime();
    clearRats()
  }

  if (new Date().getTime() - rats_last_launched_time > 1 * 60 * 1000 && !rats_state_manager.rats_launch_start) {
    // launch rats
    rats_last_launched_time = new Date().getTime();
    console.log("-----------------------*********** LAUNCHING RATS *******---------------------", rats_state_manager.rats_launch_start);
    rats_state_manager.rats_launch_start = !rats_state_manager.rats_launch_start;
  }

  setTimeout(() => {
    ratsLaunchLogic();
  }, 20 * 1000);
  console.log("-----------------------******************---------------------");
}

async function ratsLaunchLogicV2() {
  // if (PlayersDataHandler.nftDataofLiveConnections.length < 1) {
  //   console.log("-----------------------*********** RATS LOGIC *******-------- length < 1-------------");
  //   setTimeout(() => {
  //     ratsLaunchLogicV2();
  //   }, 20 * 1000);
  //   return;
  // }

  let launchState = RatsPPRewardPoolData.checkLaunchState()
  console.log("-----------------------*********** RATS LOGIC  V2 *******---------------------",
    launchState.start,
    launchState.index,
    new Date().getTime() - rats_last_launched_time > 1 * 60 * 1000,
    !rats_state_manager.rats_launch_start,
    // launchState.rats_info
  );

  if (!launchState.start && !rats_state_manager.rats_launch_start) {
    setTimeout(() => {
      ratsLaunchLogicV2();
    }, 5 * 1000);
    return false
  }

  if (new Date().getTime() - rats_last_launched_time > 1 * 60 * 1000 && !rats_state_manager.rats_launch_start) {
    rats_last_launched_time = new Date().getTime();
    console.log("-----------------------*********** LAUNCHING RATS V2 *******---------------------", rats_state_manager.rats_launch_start);
    rats_state_manager.rats_launch_start = true;
    rats_launched_info = launchState.rats_info
  }

  // if (new Date().getTime() - rats_last_launched_time > 5 * 60 * 1000 && rats_state_manager.rats_launch_start) {
  //   console.log("-----------------------*********** DESTROYING RATS RATS V2 *******---------------------", rats_state_manager.rats_launch_start);
  //   rats_state_manager.rats_launch_start = !rats_state_manager.rats_launch_start;
  //   rats_last_launched_time = new Date().getTime();
  //   rats_launched_info = []
  //   clearRats()
  // }

  setTimeout(() => {
    ratsLaunchLogicV2();
  }, 5 * 1000);
  // console.log("-----------------------******************---------------------");
}

async function ManageLaunchedRats() {
  if (rats_state_manager.rats_lauched) {
    console.log("in first loop ", rats_state_manager.rats_count)
    // update position...
    // first decide -- move or not move that mouse. -- cancel
    let temp_position_arr = [];
    let temp_orientation = [];
    let temp_track_movement = [];
    let delete_index = [];
    for (let i = 0; i < rats_state_manager.rats_count; i++) {
      // random choose if move or not
      let orientation = rats_state_manager.rats_orientations[i];
      let pos = rats_state_manager.rats_positiions[i];
      let randomChoose = Math.random() > 0.5 && ((new Date().getTime() - rats_state_manager.track_movement[i]) > 2 * 1000);
      // console.log("rats_logic_______",i , Math.random() > 0.8, ((new Date().getTime() - rats_state_manager.track_movement[i]) > 4* 1000 ), randomChoose, (new Date().getTime() - rats_state_manager.track_movement[i])/1000)
      if (randomChoose && rats_state_manager.rats_state[i] === RatState.ALIVE) {
        // let dx = Math.sign(Math.random() - 0.5) * (5 + 10 * Math.random());
        // let dy = Math.sign(Math.random() - 0.5) * (5 + 10 * Math.random());

        let dx = Math.sign(Math.random() - 0.5) * (10 + 20 * Math.random());
        let dy = Math.sign(Math.random() - 0.5) * 10;
        // let dy = -10;
        let { dummyCanMove, dummyPos } = checkOnlyColissionWithBoundariesMouse(
          totalBoundaries,
          {
            x: pos.x,
            y: pos.y,
          },
          { dx, dy },
          dx >= 0 ? "right" : "left"
        );
        // console.log("-----------rats check ", dummyCanMove, i, {
        //   x: pos.x + dx,
        //   y: pos.y + dy,
        // },)
        // if (dummyCanMove) {
        pos = JSON.parse(JSON.stringify(dummyPos));

        // pos.x += dx;
        pos.y += dy;
        pos.x = Math.round((pos.x + Number.EPSILON) * 100) / 100;
        pos.y = Math.round((pos.y + Number.EPSILON) * 100) / 100;
        if (dx >= 0) {
          orientation = "right"
        };
        if (dx < 0) {
          orientation = "left"
        };
        // }
      }
      if (rats_state_manager.rats_state[i] === RatState.HIT) {
        rats_state_manager.rats_state[i] = RatState.ALIVE;
      }

      if (rats_state_manager.rats_state[i] === RatState.COIN_PICKED
        || rats_state_manager.rats_state[i] === RatState.COIN_END) {
        rats_state_manager.rats_state[i] = RatState.COIN_END;
        delete_index.push(i);
      }
      if (rats_state_manager.rats_state[i] === RatState.RUN_AWAY) {
        delete_index.push(i);
      }

      // console.log("debug_________________", rats_last_launched_time + rats_state_manager.rats_escape_time[i] < new Date().getTime())
      if (rats_last_launched_time + rats_state_manager.rats_escape_time[i] < new Date().getTime()) {
        rats_state_manager.rats_state[i] = RatState.RUN_AWAY
      }


      temp_position_arr.push(pos);
      temp_orientation.push(orientation);
      temp_track_movement.push(randomChoose ? new Date().getTime() : -1)
    }

    rats_state_manager.rats_orientations = temp_orientation;
    rats_state_manager.rats_positiions = temp_position_arr;
    rats_state_manager.track_movement = temp_track_movement;
    if (delete_index.length > 0) {
      console.log("deleting indices.. ", delete_index);
      for (let i = 0; i < delete_index.length; i++) {
        rats_state_manager.rats_health.splice(delete_index[i], 1);
        rats_state_manager.rats_last_health.splice(delete_index[i], 1);
        rats_state_manager.rats_positiions.splice(delete_index[i], 1);
        rats_state_manager.rats_orientations.splice(delete_index[i], 1);
        rats_state_manager.rats_state.splice(delete_index[i], 1);
        rats_state_manager.rats_uuid.splice(delete_index[i], 1);
        rats_state_manager.rats_prize.splice(delete_index[i], 1);
        rats_state_manager.rats_count -= 1;
      }
    }
  } else if (!rats_state_manager.rats_lauched && rats_state_manager.rats_launch_start) {
    console.log("in second loop ")
    console.log("creating rats prev -- ", rats_state_manager.rats_count, rats_launched_info.length);
    // let rats_old_count = rats_state_manager.rats_count;
    // if (rats_state_manager.rats_count <= rats_launched_info.length) {
    //   rats_state_manager.rats_count = Math.floor(Math.random() * (RATS_COUNT) + MIN_RATS_COUNT);
    // }
    // let rats_old_count = 0;
    // rats_state_manager.rats_count = 10;
    rats_state_manager.rats_count = rats_launched_info.length;
    // console.log("creating rats -- ", rats_state_manager.rats_count);
    // launch rats - spawn at some position and inform the clients abt it
    let temp_position_arr = [];
    let temp_orientation = [];
    let temp_health_rats = [];
    let temp_last_health_rats = [];
    let temp_rats_state = [];
    let temp_rats_movement = [];
    let temp_prizes = [];
    let temp_uuids = [];
    let temp_rats_escape_time = [];

    for (let i = 0; i < rats_state_manager.rats_count; i++) {
      let random_pos_selected = Math.floor(Math.random() * random_spawn_points.length);
      temp_position_arr.push({
        x: random_spawn_points[random_pos_selected].x,
        y: random_spawn_points[random_pos_selected].y,
      });
      if (Math.random() > 0.5) temp_orientation.push("left");
      else temp_orientation.push("right");

      var tempHealth = RATS_TOTAL_HEALTH + Math.random() * RATS_TOTAL_HEALTH;
      temp_health_rats.push(tempHealth);
      temp_rats_state.push(RatState.ALIVE);
      temp_last_health_rats.push(tempHealth);
      temp_rats_movement.push(0);
      temp_prizes.push(rats_launched_info[i].prize)
      temp_uuids.push(rats_launched_info[i].rat_uuid)
      temp_rats_escape_time.push((40 + Math.floor(Math.random() * 30)) * 1000)
    }

    rats_state_manager.rats_positiions = temp_position_arr;
    rats_state_manager.rats_orientations = temp_orientation;
    rats_state_manager.rats_state = temp_rats_state;
    rats_state_manager.rats_health = temp_health_rats;
    rats_state_manager.rats_last_health = temp_last_health_rats;
    rats_state_manager.track_movement = temp_rats_movement;
    rats_state_manager.rats_uuid = temp_uuids;
    rats_state_manager.rats_prize = temp_prizes;
    rats_state_manager.rats_escape_time = temp_rats_escape_time;

    // rats_state_manager.rats_launch_time = new Date().getTime();
    rats_state_manager.rats_lauched = true;

    setTimeout(() => {
      rats_state_manager.rats_launch_start = false;
      rats_state_manager.rats_lauched = false;
    }, 1000 * 120)
    // rats_state_manager.rats_launch_start = false;

    let msgObj = {
      event: "mouse_update",
      ...rats_state_manager,
    };
    // console.log(msgObj);
    MessageQueueHandler.FillGameMessageQueue(msgObj);
  }
}

function UpdateRats() {
  // ManageLaunchedRats();
  if (rats_state_manager.rats_uuid.length > 0) {
    let msgObj = {
      event: "mouse_update",
      ...rats_state_manager,
    };
    MessageQueueHandler.FillGameMessageQueue(msgObj);
  }

  let arr = []
  for (const [key, value] of ItemManager.itemsMap.entries()) {
    arr.push({
      item_name: value.name,
      item_id: value.item_id,
      x: value.posX,
      y: value.posY,
      index: value.index
    })
  }
  if (arr.length > 0) {
    let msgObj1 = {
      event: "items_update",
      arr,
    };
    MessageQueueHandler.FillGameMessageQueue(msgObj1);
  }


}

function clearRats() {
  rats_state_manager = {
    rats_prize: [],
    rats_uuid: [],
    rats_launch_start: false,
    rats_lauched: false,
    rats_count: 0,
    rats_positiions: [],
    rats_orientations: [],
    rats_launch_time: 0,
    rats_state: [],
    rats_health: [],
    rats_last_health: [],
    rats_coins: [],
    track_movement: [],
    rats_escape_time: []
  };
}

// function findNextPosForRats(pos: IPosition) {
//   let condition = true;
//   let temp = {
//     x: 0,
//     y: 0,
//   };
//   let ddx = 0;
//   while (condition) {
//     let allowed = true;
//     let dx = Math.sign(Math.random() - 0.5) * (MIN_RATS_MOVEMENT + Math.sign(Math.random() - 0.5) * MAX_RATS_MOVEMENT * Math.random());
//     let dy = Math.sign(Math.random() - 0.5) * (MIN_RATS_MOVEMENT + Math.sign(Math.random() - 0.5) * MAX_RATS_MOVEMENT * Math.random());
//     temp = {
//       x: pos.x + dx,
//       y: pos.y + dy,
//     };
//     for (let c = 0; c < OUTER_COLISION_BOUNDARY.length; c++) {
//       if (rectangularCollision(OUTER_COLISION_BOUNDARY[c], temp)) {
//         allowed = false;
//         break;
//       }
//     }
//     if (allowed) {
//       condition = false;
//       ddx = dx;
//     }
//   }
//   return {
//     dx: ddx,
//     temp: temp,
//   };
// }

function ChooseNewPositionForRat(originalPos: IPosition, power: number, rats_on_which_side: string): IPosition {
  var drift = rats_on_which_side === "left" ? -RATS_SHIFT_MULTIPLIER_AFTER_ATTACK * power : RATS_SHIFT_MULTIPLIER_AFTER_ATTACK * power;
  var newPos = {
    x: originalPos.x + drift,
    y: originalPos.y,
  };
  let allowed = true;
  for (let c = 0; c < totalBoundaries.length; c++) {
    if (rectangularCollision(totalBoundaries[c], newPos)) {
      allowed = false;
      break;
    }
  }
  // console.debug("ChooseNewPositionForRat", allowed, originalPos, newPos)
  if (allowed) {
    return newPos;
  }
  return newPos;
}

async function manageLaunchedRats() {
  ManageLaunchedRats();
  setTimeout(() => {
    manageLaunchedRats();
  }, 1000);
}

async function updateRats() {
  UpdateRats()
  setTimeout(() => {
    updateRats()
  }, 100);
}

async function init() {
  broadCastQueueStatus();
  checkFightStatus();

  updateStaminaOfAll();
  updateHealthOfAll();

  updateFightStatus();
  sendPingPongToAll();
  messageBroadcaster();

  handleQueuePoolLoop();

  fetchConstantsValue();
  // handlePlayersMovementLoop();

  // launch rats logic
  // ratsLaunchLogic();

  ratsLaunchLogicV2();
  updateRats();
  manageLaunchedRats();
}

init();
