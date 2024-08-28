import { DEFAULT_SPRITE_DISPLAY_HEIGHT, DEFAULT_SPRITE_DISPLAY_WIDTH } from '../constants/constants';
import Boundary, { Point, rectangularCollisionWithRectange } from '../utils';
import { v4 as uuidv4 } from 'uuid';
import { MessageQueueHandler } from './messageQueueHandler';
import { isNullOrUndefined } from 'util';

export interface IBrew {
  brew_id: string,
  posX: number,
  posY: number,
  eject_animating: boolean,
  magnet_animating: boolean,
  target?: string,
  picked_by: string,
  created_time: number,
  eject_animation_started?: number,
  create_by: string,
}

export class BrewManager {
  static brewMap: Map<string, IBrew> = new Map();

  static brewOfUsers: Map<string, boolean> = new Map();
  static semiEquippedBrewOfUsers: Map<string, boolean> = new Map();

  static SetBrewState(user_uid: string, minted_id: string, brew_state: boolean) {
    console.log("equpiing brew for ", user_uid, minted_id, brew_state)
    BrewManager.brewOfUsers.set(user_uid, brew_state)
  }

  static GetBrewState(user_uid: string, minted_id: string): boolean {
    try {
      let res = BrewManager.brewOfUsers.get(user_uid);
      if (isNullOrUndefined(res)) {
        return false;
      }
      return res;
    } catch (err) {
      console.log("error in GetBrewState -- ", err)
      return false;
    }
  }

  static SetSemiBrewState(user_uid: string, minted_id: string, brew_state: boolean) {
    console.log("equpiing brew for ", user_uid, minted_id, brew_state)
    BrewManager.semiEquippedBrewOfUsers.set(user_uid, brew_state)
  }

  static GetSemiBrewState(user_uid: string, minted_id: string): boolean {
    try {
      let res = BrewManager.semiEquippedBrewOfUsers.get(user_uid);
      if (isNullOrUndefined(res)) {
        return false;
      }
      return res;
    } catch (err) {
      console.log("error in GetBrewState -- ", err)
      return false;
    }
  }

  public static addBrews(posX: number, posY: number, user_wallet_address: string) {
    let random_id = uuidv4();
    BrewManager.brewMap.set(random_id, {
      brew_id: random_id,
      posX,
      posY,
      eject_animating: false,
      magnet_animating: false,
      picked_by: "",
      created_time: new Date().getTime(),
      create_by: user_wallet_address,
    })
    return random_id;
  }

  public static moveNextPosToAnimate(brew_id: string) {
    let brew = BrewManager.brewMap.get(brew_id);
    let startX = brew.posX;
    let startY = brew.posY;
    let endX = startX + 30 + 30 * Math.random();
    let endY = startY + 10 + 10 * Math.random();

    brew.eject_animation_started = new Date().getTime()
    brew.posX = endX;
    brew.posY = endY;

    BrewManager.brewMap.set(brew_id, brew);

    MessageQueueHandler.FillGameMessageQueue({
      event: "eject_brew_server",
      brew_id,
      toX: endX,
      toY: endY,
      fromX: startX,
      fromY: startY,
    });
  }

  public static moveBrew(brew_id: string, posX: number, posY: number) {
    let brew = BrewManager.brewMap.get(brew_id);
    brew.posX = posX;
    brew.posY = posY;

    BrewManager.brewMap.set(brew_id, brew);
  }

  public static clearBrew(brew_id: string) {
    BrewManager.brewMap.delete(brew_id);
  }

  public static checkPlayerNearAnyBrew(player_pos: Point, player_wallet_address: string) {
    for (const [key, value] of BrewManager.brewMap.entries()) {
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
        (DEFAULT_SPRITE_DISPLAY_WIDTH + 30),
        30
      )
      let bound_brew = new Boundary({ x: value.posX, y: value.posY }, 30, 30)
      // console.log("going here2 ", player_pos, value.posX, value.posY)
      if (rectangularCollisionWithRectange(bound_brew, playerRequiredBox)) {
        // console.log("colliding brew..", player_pos, value.posX, value.posY)
        value.picked_by = player_wallet_address;
        MessageQueueHandler.FillGameMessageQueue({
          event: "magnet_move_brew",
          brew_id: value.brew_id,
          toX: player_pos.x,
          toY: player_pos.y,
          walletAddress: player_wallet_address
        });
        BrewManager.clearBrew(value.brew_id)
        // add to the other player assets
      }
    }
  }
}