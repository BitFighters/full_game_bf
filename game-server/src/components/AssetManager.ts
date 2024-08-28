import { AssetsInterface } from "interfaces"


export class AssetManager {
  static brewForUsers = {}
  static assetsForUsers = {}

  static addBrew(user_uid: string, count: number) {
    if (Object.keys(AssetManager.brewForUsers).includes(user_uid)) {
      AssetManager.brewForUsers[user_uid] += count
    } else {
      AssetManager.brewForUsers[user_uid] = count
    }
  }

  static setAssets(user_uid: string, assetInfo: Array<AssetsInterface>) {
    AssetManager.brewForUsers[user_uid] = assetInfo
  }
}