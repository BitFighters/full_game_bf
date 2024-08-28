import { DEFAULT_SPRITE_DISPLAY_HEIGHT, DEFAULT_SPRITE_DISPLAY_WIDTH } from '../../constants/constants';
import Boundary, { Point, rectangularCollisionWithRectange } from '../../utils';
import { v4 as uuidv4 } from 'uuid';
import { MessageQueueHandler } from '../messageQueueHandler';
import { isNullOrUndefined } from 'util';
import { RatKillReceiveReward, ReceiveAdminItemReward } from '../../services/ApiCaller';

export interface IItem {
  item_id: string,
  posX: number,
  posY: number,
  eject_animating: boolean,
  magnet_animating: boolean,
  target?: string,
  picked_by?: string,
  created_time: number,
  eject_animation_started?: number,
  create_by?: string,
  index?: number,
  name?: string,
}

export class ItemManager {
  static itemsMap: Map<string, IItem> = new Map();

  public static addItem(posX: number, posY: number, user_wallet_address: string, _uuid: string, index = 0, _name = "") {
    let random_id = _uuid;
    ItemManager.itemsMap.set(random_id, {
      item_id: random_id,
      posX,
      posY,
      eject_animating: false,
      magnet_animating: false,
      picked_by: "",
      created_time: new Date().getTime(),
      create_by: "",
      index: index,
      name: _name
    })
    return random_id;
  }

  public static clearItemFromData(item_id: string) {
    ItemManager.itemsMap.delete(item_id);
  }

  public static checkPlayerNearItem(player_pos: Point, player_wallet_address: string) {
    for (const [key, value] of ItemManager.itemsMap.entries()) {
      if (new Date().getTime() - 1000 < value.created_time) {
        continue
      }
      if (value.picked_by !== "") {
        continue
      }
      let playerRequiredBox = new Boundary(
        {
          x: player_pos.x - DEFAULT_SPRITE_DISPLAY_WIDTH / 2,
          y: player_pos.y + DEFAULT_SPRITE_DISPLAY_HEIGHT / 2
        },
        50,
        50
      )
      let bound_brew = new Boundary({ x: value.posX, y: value.posY }, 30, 30)
      // console.log("checkPlayerNearItem item Manger ", rectangularCollisionWithRectange(bound_brew, playerRequiredBox), player_pos, value.posX, value.posY,)
      // console.log("checkPlayerNearItem item Manger ", bound_brew, playerRequiredBox)
      if (rectangularCollisionWithRectange(bound_brew, playerRequiredBox)) {
        // console.log("colliding_checkPlayerNearItem ", value.name)
        value.picked_by = player_wallet_address;
        MessageQueueHandler.FillGameMessageQueue({
          event: "magnet_move_item",
          item_id: value.item_id,
          toX: player_pos.x,
          toY: player_pos.y,
          index: value.index,
          walletAddress: player_wallet_address
        });
        // console.log("colliding_checkPlayerNearItem 2 ", value.name)
        setTimeout(() => {
          let obj1 = {
            event: "fetch_balance",
            user_wallet_address: player_wallet_address,
          }
          MessageQueueHandler.FillGameMessageQueue(obj1)
        }, 1000);
        // console.log("colliding_checkPlayerNearItem 3 ", value.name, value.name === "admin_coins")
        if (value.name === "rats") {
          RatKillReceiveReward(player_wallet_address, value.item_id)
        }
        if (value.name === "admin_coin") {
          // new api
          ReceiveAdminItemReward(player_wallet_address, value.name)
        }
        ItemManager.clearItemFromData(value.item_id);
        return { colided: true, index: value.index, uuid: value.item_id, name: value.name };
      }
    }
    return { colided: false, index: 0, uuid: "", name: "" };
  }
}