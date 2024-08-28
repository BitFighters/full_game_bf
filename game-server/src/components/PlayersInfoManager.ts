import { AssetsInterface, IGeoLocationInfo } from "interfaces"


export class PlayersInfoManager {
  static playersInfo = {}

  static setGeoInfo(data: IGeoLocationInfo, user_uid: string) {
    PlayersInfoManager.playersInfo[user_uid] = data
  }
}