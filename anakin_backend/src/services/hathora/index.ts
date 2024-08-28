import { HATHORA_CONFIG } from "@config/hathora";
import axios, { AxiosResponse } from "axios";

export async function makePostRequest(url: string, data: {}, header: {}) {
  return await axios.post(
    url,
    data,
    {
      headers: header
    }
  )
}

export async function makeGetRequest(url: string) {
  return await axios.get(url);
}

export async function createRoomHathora(room_id: string, region: string, user_type = 'web3') {
  let app_id = HATHORA_CONFIG.APPLICATION_ID;
  if (user_type === 'web2') {
    app_id = HATHORA_CONFIG.APPLICATION_WEB2_ID;
  }
  const createRoomURL = `${HATHORA_CONFIG.V2_URL}${app_id}/create?roomId=${room_id}`;
  const headers = {
    "accept": "application/json",
    "Authorization": `Bearer ${HATHORA_CONFIG.DEV_KEY}`,
    "Content-Type": "application/json"
  };
  const data = {
    "region": region
  }
  try {
    let response: AxiosResponse = await axios.post(createRoomURL, data, { headers });
    return response;
  } catch (err) {
    throw err;
  }
}


export async function listRoomsInRegionHathora(region: string, user_type = 'web3') {
  let app_id = HATHORA_CONFIG.APPLICATION_ID;
  if (user_type === 'web2') {
    app_id = HATHORA_CONFIG.APPLICATION_WEB2_ID;
  }
  const createRoomURL = `${HATHORA_CONFIG.BASE_URL}processes/v1/${app_id}/list/running?region=${region}`;
  const headers = {
    "accept": "application/json",
    "Authorization": `Bearer ${HATHORA_CONFIG.DEV_KEY}`,
    "Content-Type": "application/json"
  };
  try {
    let response: AxiosResponse = await axios.get(createRoomURL, { headers });
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function fetchInfoOfRoom(room_id: string, user_type = 'web3') {
  let app_id = HATHORA_CONFIG.APPLICATION_ID;
  if (user_type === 'web2') {
    app_id = HATHORA_CONFIG.APPLICATION_WEB2_ID;
  }
  const fetchRoomInfoUrl = `${HATHORA_CONFIG.V2_URL}${app_id}/connectioninfo/${room_id}`;
  const headers = {
    "accept": "application/json",
    "Authorization": `Bearer ${HATHORA_CONFIG.DEV_KEY}`,
    "Content-Type": "application/json"
  };
  try {
    let response: AxiosResponse = await axios.get(fetchRoomInfoUrl, { headers });
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function fetchInfoOfProcess(process_id: string, user_type = 'web3') {
  let app_id = HATHORA_CONFIG.APPLICATION_ID;
  if (user_type === 'web2') {
    app_id = HATHORA_CONFIG.APPLICATION_WEB2_ID;
  }
  const fetchRoomInfoUrl = `${HATHORA_CONFIG.BASE_URL}processes/v1/${app_id}/info/${process_id}`;
  const headers = {
    "accept": "application/json",
    "Authorization": `Bearer ${HATHORA_CONFIG.DEV_KEY}`,
    "Content-Type": "application/json"
  };
  try {
    let response: AxiosResponse = await axios.get(fetchRoomInfoUrl, { headers });
    return response.data;
  } catch (err) {
    throw err;
  }
}