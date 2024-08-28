import { HATHORA_CONFIG } from "@config/hathora";
import { createRoomHathora, fetchInfoOfProcess, fetchInfoOfRoom, listRoomsInRegionHathora } from "@services/hathora";
import { ANAKIN_LOGGER } from "@services/logger";
import { AxiosResponse } from "axios";
import * as Hapi from "hapi";
import { isNullOrUndefined } from "util";
import { v4 as uuidv4 } from "uuid";
import { ServersInfoDao } from "./dao";

// let SERVER_UPDATE_TIME = {}
// let SERVER_LIST = {}
// let SERVER_CREATING = false;

// export async function CreateGameServer(request: Hapi.Request, h: Hapi.ResponseToolkit) {
//   const payload = request.payload || {};
//   const room_id = payload["room_id"];
//   const region = payload["region"];
//   try {
//     let response: AxiosResponse = await createRoomHathora(room_id, region);
//     console.log(response.data, response.status);
//     let created_room_id = response.data.roomId;
//   } catch (err) {
//     ANAKIN_LOGGER.error({
//       event: "FAILED_IN_CREATING_SERVERS",
//       error: err,
//     })
//     return h.response({ success: 0, message: err.message }).code(400);
//   }
// }

function acceptableRegion(region: string) {
  if (region === "Washington_DC" || region === "Mumbai") {
    return true;
  }
  return false;
}

export async function ListGameServers(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { region } = request.params;
  // console.log("-----", request.auth.credentials.user)
  const user_type = request.auth.credentials.user["user_type"]
  let createBool = false;
  const { create } = request.params;
  if (create === "create") {
    createBool = true;
  }

  if (!acceptableRegion(region)) {
    ANAKIN_LOGGER.error({
      event: "FAILED_IN_FETCHING_SERVERS",
      error: "UNACCEPTABLE_REGION",
    });
    return h.response({ message: "FAILURE", error: "UNACCEPTABLE_REGION" }).code(400);
  }
  console.log("---createBool---", createBool, user_type);

  console.log("----------- ", new Date().getTime() - ServersInfoDao.SERVER_UPDATE_TIME[region], !isNullOrUndefined(ServersInfoDao.SERVER_LIST[region]), new Date().getTime() - ServersInfoDao.SERVER_UPDATE_TIME[region] < 60 * 1000)
  if (
    !isNullOrUndefined(ServersInfoDao.SERVER_LIST[region])
    && ServersInfoDao.SERVER_LIST[region].length > 0
    && new Date().getTime() - ServersInfoDao.SERVER_UPDATE_TIME[region] < 30 * 1000
    && user_type == 'web2'
  ) {
    console.log("----------- fetching server list from local mem")
    return h.response({ data: ServersInfoDao.SERVER_LIST_WEB2[region] }).code(200);
  }
  if (
    !isNullOrUndefined(ServersInfoDao.SERVER_LIST[region])
    && ServersInfoDao.SERVER_LIST[region].length > 0
    && new Date().getTime() - ServersInfoDao.SERVER_UPDATE_TIME[region] < 30 * 1000
    && user_type == 'web3'
  ) {
    console.log("----------- fetching server list from local mem")
    return h.response({ data: ServersInfoDao.SERVER_LIST[region] }).code(200);
  }
  if (ServersInfoDao.SERVER_CREATING && user_type == 'web3') {
    return h.response({ message: "FAILURE", error: "ALREADY_CREATING_SERVER" }).code(400);
  }
  if (ServersInfoDao.SERVER_CREATING_WEB2 && user_type == 'web3') {
    return h.response({ message: "FAILURE", error: "ALREADY_CREATING_SERVER" }).code(400);
  }
  ServersInfoDao.SERVER_CREATING = true;

  let resMap = []
  try {
    let processInfo = await listRoomsInRegionHathora(region, user_type);
    console.log("process info --", processInfo)
    let roomAvailable = false;
    let half_max_capacity_check_all = false;
    let half_max_capacity_count = 0
    for (let i = 0; i < processInfo.length; i++) {
      if (processInfo[i].totalRooms > 0) {
        roomAvailable = true
      }
      // if (processInfo[i].activeConnections > 0) {
      //   half_max_capacity_count += 1
      // }
    }

    if (processInfo.length === 0 || !roomAvailable) {
      ANAKIN_LOGGER.info({
        event: "NO_ROOM_CREATED"
      });
      if (half_max_capacity_count === processInfo.length) {
        ANAKIN_LOGGER.info({
          event: "HALF_MAX_CAPACITY_REACHED_FOR_ALL",
          half_max_capacity_count,
          servers: processInfo.length
        });
        createBool = true;
      }
      if (createBool) {
        await createRoomHathora(uuidv4(), region, user_type);
        processInfo = await listRoomsInRegionHathora(region, user_type);
      }
    }
    if (processInfo.length === 0) {
      ServersInfoDao.SERVER_CREATING = false;
      return h.response({ message: "FAILURE", error: "Some error happened" }).code(400);
    }

    console.log("processInfo 1 ", processInfo)
    for (let i = 0; i < HATHORA_CONFIG.VALID_REGIONS.length; i++) {
      if (HATHORA_CONFIG.VALID_REGIONS[i].name === region) {
        continue
      }
      let otherRegionProcesses = await listRoomsInRegionHathora(HATHORA_CONFIG.VALID_REGIONS[i].name, user_type);

      processInfo = processInfo.concat(otherRegionProcesses)
    }

    for (let i = 0; i < processInfo.length; i++) {
      let process = processInfo[i];
      resMap.push({
        region: process.region,
        room_id: process.processId,
        active_users: process.activeConnections
      })
    }
    if (user_type == 'web3') {
      ServersInfoDao.SERVER_LIST[region] = resMap;
      ServersInfoDao.SERVER_UPDATE_TIME[region] = new Date().getTime()
      ServersInfoDao.SERVER_CREATING = false;
    } else if (user_type == 'web3') {
      ServersInfoDao.SERVER_LIST_WEB2[region] = resMap;
      ServersInfoDao.SERVER_UPDATE_TIME[region] = new Date().getTime()
      ServersInfoDao.SERVER_CREATING_WEB2 = false;
    }

    return h.response({ data: resMap }).code(200);
  } catch (err) {
    ANAKIN_LOGGER.error({
      event: "FAILED_IN_FETCHING_SERVERS",
      error: err,
    });
    ServersInfoDao.SERVER_CREATING = false;
    return h.response({ message: "FAILURE", error: err.message }).code(400);
  }
}

export async function FetchInfoOfRoom(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { room_id } = request.params;
  const user_type = request.auth.credentials.user["user_type"]
  try {
    let roomInfo = await fetchInfoOfProcess(room_id, user_type);
    console.log("FetchInfoOfRoom", roomInfo);
    if (roomInfo.exposedPort.port === "" || isNullOrUndefined(roomInfo.exposedPort.port) || isNullOrUndefined(roomInfo.exposedPort.host)) {
      throw new Error("server not initialised")
    }
    let url = "wss://" + roomInfo.exposedPort.host + ":" + roomInfo.exposedPort.port
    return h.response({ data: url }).code(200);
  } catch (err) {
    ANAKIN_LOGGER.error({
      event: "FAILED_IN_FETCHING_ROOM_INFO",
      error: err,
      room_id
    });
    return h.response({ message: "FAILURE", error: err.message }).code(400);
  }
}
