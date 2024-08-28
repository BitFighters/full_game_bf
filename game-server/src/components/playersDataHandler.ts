import { INFTDataOfConnections } from "../interfaces";


export class PlayersDataHandler {
  static nftDataofLiveConnections: Array<INFTDataOfConnections> =[];
  static nftDataofLiveConnectionsMap: Map<string, INFTDataOfConnections> = new Map();

  // static playersMovementData: Map<string, any> = new Map();
}