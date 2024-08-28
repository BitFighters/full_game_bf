import { FetchGameServerConnectionURL, FetchSystemWalletsInfo, ListGameServersApiCall } from "../hooks/ApiCaller";
import store from "../stores";
import { SetGameServersData, SetSelectedGameServerURL, SetSystemWalletsInfo } from "../stores/WebsiteStateStore";

export async function ListGameServers(region: string, create = "create") {
  // console.log("ListGameServersApiCall")
  const serverList = await ListGameServersApiCall(store.getState().web3store.userAddress, region, create)
  // console.log("server list -- ", serverList.data)
  store.dispatch(SetGameServersData(serverList.data));
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function FetchGameServerConnection(room_id: string) {
  console.log("FetchGameServerConnection")
  let serverConnection = await FetchGameServerConnectionURL(store.getState().web3store.userAddress, room_id)
  if (serverConnection === "false") {
    // return
    while (serverConnection === "false") {
      serverConnection = await FetchGameServerConnectionURL(store.getState().web3store.userAddress, room_id)
      await delay(2000)
    }
  }
  console.log("debug____server info FetchGameServerConnection -- ", serverConnection.data)
  store.dispatch(SetSelectedGameServerURL(serverConnection.data));
}

export async function fetchSystemWalletsInfo() {
  const data = await FetchSystemWalletsInfo();
  store.dispatch(SetSystemWalletsInfo(data))
}