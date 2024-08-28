// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import store from "../../stores";
import { ChangeWebSocketConnectedTime } from "../../stores/UserWebsiteStore";
import { ActionManager } from "../ActionManager";
import {
  basicCollisionAndMovementPlayerV3,
  basicCollisionWithBoundaryAndPlayer,
} from "../controls/movement";
import { BasePlayer } from "./BasePlayer";
import { IKeysInfo, INFTDataOfConnections, IPlayerData } from "./IPlayer";
import { v4 as uuidv4 } from "uuid";

export interface IOtherPlayer {
  sprite?: Phaser.Physics.Arcade.Sprite;
  wallet_address: string;
  moving?: boolean;
  kicking?: boolean;
  punching?: boolean;
  kickStart?: boolean;
  punchStart?: boolean;
  kickStartTime?: number;
  punchStartTime?: number;

  selfKicking?: boolean;
  selfPunching?: boolean;

  lastKickTime: number;
  lastPunchTime: number;

  runStart?: boolean;
  running?: boolean;
  runEnd?: boolean;

  hasBrewInHand?: boolean;
  showEquipAnimationStarted?: boolean;
  // showEquipAnimationRunning?: boolean,

  movedLastFrame?: boolean;
  runLastFrame?: boolean;

  sprite_url?: string;
  profile_image: string;
  gameObject?: OtherPlayer;
  nick_name: string;
  setupDone: boolean;
  // all_data: any,
  x: number;
  y: number;
  gotHit?: boolean;
  gotBackHit?: boolean;
  minted_id: string;
  stunned?: boolean;
  stunnedStarted?: boolean;
  max_stamina?: number;
  max_health?: number;

  winningStarted?: boolean;
  winning?: boolean;

  losingStarted?: boolean;
  loosing?: boolean;
  movementAbility?: string;

  drinkStarted?: boolean;
  drinking?: boolean;

  showBrewDropFrame?: boolean;

  dead?: boolean;
  deadStarted?: boolean;

  orientation?: string;
  extra_data?: INFTDataOfConnections;

  defense?: number;
  punchpower?: number;
  kickpower?: number;
  speed?: number;
  stamina?: number;
  health?: number;
  all_aps?: any;

  user_type?: string;

  // // new animations
  // // gassed + lift-off + fall
  // gassed_lift_off_fall?: boolean,
}

export class OtherPlayer extends BasePlayer {
  private playContainerBody: Phaser.Physics.Arcade.Body;
  myWalletAddress = "";
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    id: string,
    nick_name: string,
    // all_data_fighter: IPlayerData,
    socketConnection: WebSocket,
    otherPlayer: boolean,
    wallet_address?: string,
    minted_id?: number,
    max_health?: number,
    max_stamina?: number,
    extra_data?: any
  ) {
    console.log("debug stats otherp ", extra_data);
    console.log("otherplayer_create ", otherPlayer, max_health, max_stamina);
    super(
      scene,
      x,
      y,
      texture,
      id,
      otherPlayer,
      socketConnection,
      nick_name,
      wallet_address,
      minted_id,
      max_health,
      max_stamina,
      extra_data
    );
    this.playContainerBody = this.playerContainer
      .body as Phaser.Physics.Arcade.Body;
    if (wallet_address) {
      this.myWalletAddress = wallet_address;
    }
  }

  DestroyGameObject() {
    this.sprite.destroy();
    this.playerContainer.destroy();
  }

  DecreaseHealthValue(amount: number, oldNumber: number, color = "") {
    // if (amount >= 100) return;
    this.healthBar.clear();
    const temp =
      this.totalHealthValue + (amount - this.totalActualHealthValue) / 2;
    this.healthReduced = 2 * (this.lastHealth - temp);

    // const tempActualHealthReduced = this.actualLastHealth - amount;
    const tempActualHealthReduced = oldNumber - amount;
    console.log(
      "health other player ",
      amount,
      this.actualLastHealth,
      tempActualHealthReduced
    );
    this.actualLastHealth -= tempActualHealthReduced;
    // console.log("health other player ", this.healthReduced, this.totalActualHealthValue - amount)
    // if (this.totalActualHealthValue - amount > 0) {
    //   var rounded = Math.round(this.totalActualHealthValue - amount * 10) / 10;
    //   this.PopHealthReduced(rounded);
    // }
    if (tempActualHealthReduced > 0) {
      const rounded = Math.round(tempActualHealthReduced * 10) / 10;
      this.PopHealthReduced(rounded, color);
    }

    // if (this.healthReduced > 0) {
    //   var rounded = Math.round(this.healthReduced * 10) / 10
    //   this.PopHealthReduced(rounded);
    // }
    this.lastHealth = temp;
    if (amount < 70 && amount >= 30) {
      this.healthBar.fillStyle(0xebb925, 1);
      this.healthBar.fillRect(-25, 0, temp, 3);
    } else if (amount < 30) {
      this.healthBar.fillStyle(0xbf392f, 1);
      this.healthBar.fillRect(-25, 0, temp, 3);
    } else {
      this.healthBar.fillStyle(0x32cd32, 1);
      this.healthBar.fillRect(-25, 0, temp, 3);
    }
  }

  update() {
    if (
      !this.game.lobbySocketConnected &&
      store.getState().web3store.userAddress === this.myWalletAddress
    ) {
      console.log("not connected. with game server.");
      if (store.getState().userPathStore.websocketConnectedTime === 0) {
        store.dispatch(ChangeWebSocketConnectedTime(new Date().getTime()));
      } else if (
        new Date().getTime() -
        store.getState().userPathStore.websocketConnectedTime >
        5000
      ) {
        if (
          window.confirm(
            "You have been disconnected from server. Please refresh to connect."
          )
        ) {
          store.dispatch(ChangeWebSocketConnectedTime(0));
          window.location.reload();
          store.dispatch(ChangeWebSocketConnectedTime(0));
        } else {
          store.dispatch(ChangeWebSocketConnectedTime(0));
        }
        // window.location.reload()
      }
      return;
    }

    if (this.deadTweenRunning) {
      return;
    }

    this.BaseUpdate();
    // console.log("action_id --> ", ActionManager.moveActionQueue[ActionManager.moveActionQueue.length - 1],this.last_server_move_action_id )

    if (
      this.server_position_stored.x > 0 &&
      this.server_position_stored.y > 0 &&
      new Date().getTime() - this.last_server_move_updated_at > 500 &&
      (Math.abs(this.sprite.x - this.server_position_stored.x) > 0.1 ||
        Math.abs(this.sprite.y - this.server_position_stored.y) > 0.1) &&
      // && !ActionManager.checkIfActionIdisPerformed(this.last_server_move_action_id)
      ActionManager.moveActionQueue[ActionManager.moveActionQueue.length - 1]
        .action_id === this.last_server_move_action_id
    ) {
      console.log(
        "server correction-- distance -- ",
        Math.abs(this.sprite.x - this.server_position_stored.x),
        Math.abs(this.sprite.y - this.server_position_stored.y)
      );
      this.sprite.x = this.server_position_stored.x;
      this.sprite.y = this.server_position_stored.y;
      // this.SmoothMovementV2(this.server_position_stored, this.last_server_move_action_id)
    }
  }

  update2(boundaries: any, delta: any, newSystemKeys: IKeysInfo) {
    // this.actions = animateMovement(pressedKeys, this.sprite, CurrentKeysPressed, this.actions, this.game.lobbySocketConnection, "player-"+this.playerAllData.minted_id);
    // this.actions = animateMovementv2(newSystemKeys, this.sprite, this.actions, this.game.lobbySocketConnection, "player-"+this.playerAllData.minted_id, this.value);
    // if (!this.actions.kicking && !this.actions.punching && !this.actions.showStunnedAnim && !this.actions.showDeadSprite) {
    //   var speed = this.walk_speed;
    //   if (newSystemKeys.keyD.double_pressed || newSystemKeys.keyA.double_pressed) {
    //     speed = this.run_speed;
    //   }
    //   this.value = movePlayerv3(newSystemKeys, this.sprite, this.value, boundaries, delta, speed );
    // }

    if (
      store.getState().web3store.userAddress !==
      this.playerAllData.user_wallet_address
    ) {
      return;
    }

    this.target_position_stored.x = 0;

    // console.log("moving .. ", this.walk_speed, this.run_speed)

    // check if this player is fighting..

    const otherPlayer = this.game.otherPlayers.get(
      store.getState().web3store.player_id
    );
    // console.log("other player my player ", otherPlayer?.orientation)

    let speed = this.walk_speed;
    let tempMoving = false;
    let action_id = "";
    if (otherPlayer?.gameObject) {
      // console.log("here in kicking.. ", otherPlayer.kickStart, otherPlayer.kicking)
      if (
        newSystemKeys.keyK.pressed &&
        !otherPlayer.kickStart &&
        new Date().getTime() - otherPlayer.lastKickTime > 400
      ) {
        otherPlayer.runStart = false;
        otherPlayer.running = false;
        otherPlayer.kicking = true;
        otherPlayer.kickStart = true;
        otherPlayer.lastKickTime = new Date().getTime();
      } else if (
        newSystemKeys.keyP.pressed &&
        !otherPlayer.punchStart &&
        new Date().getTime() - otherPlayer.lastPunchTime > 200
      ) {
        otherPlayer.runStart = false;
        otherPlayer.running = false;
        otherPlayer.punching = true;
        otherPlayer.punchStart = true;
        otherPlayer.lastPunchTime = new Date().getTime();
      } else if (
        newSystemKeys.keyA.pressed ||
        newSystemKeys.keyD.pressed ||
        newSystemKeys.keyS.pressed ||
        newSystemKeys.keyW.pressed
      ) {
        otherPlayer.moving = true;
        tempMoving = true;
        // action_id = uuidv4();
        // this.game.lobbySocketConnection.send(JSON.stringify({
        //   event: "move",
        //   delta: delta,
        //   walletAddress: store.getState().web3store.userAddress,
        //   keys: newSystemKeys,
        //   action_id,
        // }));
      } else if (
        !newSystemKeys.keyA.pressed ||
        !newSystemKeys.keyD.pressed ||
        !newSystemKeys.keyS.pressed ||
        !newSystemKeys.keyW.pressed
      ) {
        otherPlayer.moving = false;
      }
      if (
        newSystemKeys.keyD.double_pressed ||
        newSystemKeys.keyA.double_pressed
      ) {
        speed = this.run_speed;
        otherPlayer.runStart = true;
      }
      if (otherPlayer.kickStart || otherPlayer.punchStart) {
        tempMoving = false;
      }

      // if (newSystemKeys.keyBlock.pressed) {

      // }

      // otherPlayer.hasBrewInHand = true
      // console.log("player_state --> ", otherPlayer.moving, otherPlayer.running, otherPlayer.kicking, otherPlayer.punching, otherPlayer.hasBrewInHand)
      // console.log("current_stamina ", this.currStamina)
      if (this.currStamina < 3) {
        this.playerStunned = true;
        otherPlayer.stunnedStarted = true;
      } else if (this.playerStunned && this.currStamina > 11) {
        this.playerStunned = false;
      }
      // try {
      //   if (otherPlayer && otherPlayer.setupDone && otherPlayer.gameObject && otherPlayer.gameObject?.sprite.anims && store.getState().web3store.userAddress === otherPlayer.wallet_address) {
      //     // console.log("outside in otherPlayer. stunnedstarted", otherPlayer.moving, otherPlayer.runStart, otherPlayer.kickStart, otherPlayer.punchStart, otherPlayer.runStart && !otherPlayer.stunnedStarted && !otherPlayer.deadStarted)
      //     if (otherPlayer.gotHit) {
      //       otherPlayer.gameObject.sprite.play("gotHit-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id ).once('animationcomplete', () => {
      //         if (otherPlayer?.gameObject) {
      //           otherPlayer.gotHit = false
      //           otherPlayer?.gameObject.sprite.stop()
      //           otherPlayer.gameObject.sprite.play("idle-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id)
      //         }
      //       })
      //     }
      //     else if (otherPlayer.showEquipAnimationStarted) {
      //       otherPlayer.showEquipAnimationStarted = false
      //       otherPlayer.gameObject.sprite.play("equipBrew-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id ).once('animationcomplete', () => {
      //         if (otherPlayer?.gameObject) {
      //           otherPlayer?.gameObject.sprite.stop()
      //           otherPlayer.gameObject.sprite.play("idleBrew-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id)
      //         }
      //       })
      //     }
      //     else if (otherPlayer.gotBackHit) {
      //       otherPlayer.gameObject.sprite.play("gotBackHit-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id ).once('animationcomplete', () => {
      //         if (otherPlayer?.gameObject) {
      //           otherPlayer.gotBackHit = false
      //           otherPlayer.gameObject.sprite.stop()
      //           otherPlayer.gameObject.sprite.play("idle-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id)
      //         }
      //       })
      //     }
      //     else if (otherPlayer.drinkStarted) {
      //       if (!otherPlayer.drinking) {
      //         otherPlayer.drinking = true;
      //         otherPlayer.gameObject.sprite.stop();
      //         otherPlayer.gameObject.sprite.play("drink2-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id ).once('animationcomplete', () => {
      //           if (otherPlayer?.gameObject) {
      //             otherPlayer.drinkStarted = false
      //             otherPlayer.drinking = false
      //             if (otherPlayer.gameObject){
      //               otherPlayer.gameObject.sprite.stop()
      //               otherPlayer.gameObject.sprite.play("idle-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id)
      //             }
      //             // otherPlayer.gameObject.sprite.play("burp-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id ).once('animationcomplete', () => {
      //             //   otherPlayer.drinkStarted = false
      //             //   otherPlayer.drinking = false
      //             //   if (otherPlayer.gameObject){
      //             //     otherPlayer.gameObject.sprite.stop()
      //             //     otherPlayer.gameObject.sprite.play("idle-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id)
      //             //   }
      //             // })
      //           }
      //         })
      //       }
      //     }
      //     else if (otherPlayer.winningStarted) {
      //       otherPlayer.winningStarted = false
      //       otherPlayer.gameObject.sprite.stop();
      //       otherPlayer.gameObject.sprite.play("win-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id )
      //         .once('animationcomplete', () => {
      //           if (otherPlayer?.gameObject) {
      //             otherPlayer.winningStarted = false;
      //             otherPlayer.gameObject.sprite.stop()
      //             otherPlayer.gameObject.sprite.play("idle-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id)
      //           }
      //         })
      //     } else if (otherPlayer.losingStarted) {
      //       otherPlayer.losingStarted = false;
      //       otherPlayer.gameObject.sprite.stop();
      //       otherPlayer.gameObject.sprite.play("lose-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id )
      //         .once('animationcomplete', () => {
      //           if (otherPlayer?.gameObject) {
      //             otherPlayer.losingStarted = false;
      //             otherPlayer.gameObject.sprite.stop()
      //             otherPlayer.gameObject.sprite.play("idle-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id)
      //           }
      //         })
      //     }
      //     else if (otherPlayer.stunnedStarted) {
      //       // console.log("entering in otherPlayer. stunnedstarted", otherPlayer.stunned, otherPlayer.stunnedStarted)
      //       if (!otherPlayer.stunned) {
      //         // console.log("entering in otherPlayer. stunned")
      //         otherPlayer.running = false;
      //         otherPlayer.kickStart = false;
      //         otherPlayer.kicking = false;
      //         otherPlayer.gotBackHit = false;
      //         otherPlayer.gotHit = false;
      //         otherPlayer.stunned = true;
      //         otherPlayer.gameObject.sprite.stop();
      //         otherPlayer.gameObject.sprite.play("stunned-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id )
      //         .once('animationcomplete', () => {
      //           // console.log("other player stunned animatino done.")
      //           if (otherPlayer?.gameObject) {
      //             otherPlayer.stunned = false;
      //             otherPlayer.stunnedStarted = false;
      //             // otherPlayer.gameObject.sprite.stop()
      //             // otherPlayer.gameObject.sprite.play("idle-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id)
      //           }
      //         })
      //       }
      //     }
      //     else if (otherPlayer.deadStarted) {
      //       // console.log("entering in otherPlayer. stunnedstarted", otherPlayer.stunned, otherPlayer.stunnedStarted)
      //       if (!otherPlayer.dead) {
      //         // console.log("entering in otherPlayer. stunned")
      //         otherPlayer.running = false;
      //         otherPlayer.kickStart = false;
      //         otherPlayer.kicking = false;
      //         otherPlayer.gotBackHit = false;
      //         otherPlayer.gotHit = false;
      //         // otherPlayer.moving = false;
      //         otherPlayer.stunned = false;
      //         otherPlayer.dead = true;
      //         otherPlayer.gameObject.sprite.stop();
      //         otherPlayer.gameObject.sprite.play("dead-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id )
      //         .once('animationcomplete', () => {
      //           //
      //         })
      //       }
      //     }
      //     else if ( otherPlayer.kickStart && !otherPlayer.stunnedStarted && !otherPlayer.deadStarted ) {
      //       otherPlayer.running = false
      //       otherPlayer.kickStart = false
      //       if (otherPlayer.kicking) {
      //         otherPlayer.kicking = false;
      //         otherPlayer.gameObject.sprite.play("kick-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id ).once('animationcomplete', () => {
      //           console.log("done kicking . ")
      //           setTimeout(() => {
      //             if (otherPlayer?.gameObject) {
      //               otherPlayer.kicking = false
      //               otherPlayer.kickStart = false
      //               otherPlayer.gameObject.sprite.stop()
      //               otherPlayer.gameObject.sprite.play("idle-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id)
      //             }
      //           }, 200)
      //         })
      //       }

      //     }
      //     else if (otherPlayer.punching && !otherPlayer.stunnedStarted && !otherPlayer.deadStarted) {
      //       // console.log("player_state_punch --> ", otherPlayer.moving, otherPlayer.running, otherPlayer.kicking, otherPlayer.punching, otherPlayer.hasBrewInHand)
      //       otherPlayer.running = false
      //       if (otherPlayer.punching) {
      //         otherPlayer.punching = false
      //         if (otherPlayer.hasBrewInHand) {
      //         otherPlayer.gameObject.sprite.play("punchBrew-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id).once('animationcomplete', () => {
      //           setTimeout(() => {
      //             if (otherPlayer?.gameObject) {
      //               otherPlayer.punching = false
      //               otherPlayer.punchStart = false
      //               otherPlayer.gameObject.sprite.stop()
      //               otherPlayer.gameObject.sprite.play("idleBrew-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id)
      //             }
      //           }, 100)
      //         })
      //       } else {
      //         otherPlayer.gameObject.sprite.play("punch-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id).once('animationcomplete', () => {
      //           setTimeout(() => {
      //             if (otherPlayer?.gameObject) {
      //               otherPlayer.punching = false
      //               otherPlayer.punchStart = false
      //               otherPlayer.gameObject.sprite.stop()
      //               otherPlayer.gameObject.sprite.play("idle-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id)
      //             }
      //           }, 100)
      //         })
      //       }
      //       }

      //     }
      //     else if (otherPlayer.runStart && !otherPlayer.stunnedStarted && !otherPlayer.deadStarted) {
      //       // console.log("outside in here player running --- ", otherPlayer.running, otherPlayer.runStart, otherPlayer.stunnedStarted, otherPlayer.deadStarted)
      //       if (
      //         otherPlayer.gameObject?.sprite.anims.currentAnim.key !== "run-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id
      //         && otherPlayer.gameObject?.sprite.anims.currentAnim.key !== "runBrew-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id
      //       ) {
      //         if (otherPlayer.hasBrewInHand) {
      //           otherPlayer.gameObject.sprite.play("runBrew-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id ).once('animationcomplete', () => {
      //             // console.log("animation complete running .. ")

      //             if (otherPlayer?.gameObject) {
      //               otherPlayer.running = false
      //               otherPlayer.runStart = false
      //               otherPlayer.gameObject.sprite.stop()
      //               otherPlayer.gameObject.sprite.play("idleBrew-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id)
      //             }
      //           })
      //         } else {
      //           otherPlayer.gameObject.sprite.play("run-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id ).once('animationcomplete', () => {
      //             // console.log("animation complete running .. ")

      //             if (otherPlayer?.gameObject) {
      //               otherPlayer.running = false
      //               otherPlayer.runStart = false
      //               otherPlayer.gameObject.sprite.stop()
      //               otherPlayer.gameObject.sprite.play("idle-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id)
      //             }
      //           })
      //         }
      //         otherPlayer.running = true;
      //       }
      //     }
      //     else if ( otherPlayer.moving && !otherPlayer.stunnedStarted && !otherPlayer.deadStarted && !otherPlayer.running ) {
      //       // console.log("otherotherPlayer_moving ", otherPlayer.wallet_address, otherPlayer.gameObject.sprite.anims)
      //       // if (otherPlayer.gameObject?.sprite.anims && otherPlayer.gameObject.sprite.anims.currentAnim) {
      //         // if (isNullOrUndefined(otherPlayer.gameObject.sprite.anims.currentAnim)) {
      //         //   otherPlayer.gameObject.sprite.play("walk-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id)
      //         // }
      //         if (
      //           otherPlayer.gameObject.sprite.anims.currentAnim.key !== "kick-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id
      //           && otherPlayer.gameObject.sprite.anims.currentAnim.key !== "punch-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id
      //           && otherPlayer.gameObject.sprite.anims.currentAnim.key !== "punchBrew-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id
      //           && otherPlayer.gameObject.sprite.anims.currentAnim.key !== "run-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id
      //           && otherPlayer.gameObject.sprite.anims.currentAnim.key !== "runBrew-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id
      //           && otherPlayer.gameObject.sprite.anims.currentAnim.key !== 'walk-'+otherPlayer.wallet_address + "_" + otherPlayer.minted_id
      //           && otherPlayer.gameObject.sprite.anims.currentAnim.key !== 'walkBrew-'+otherPlayer.wallet_address + "_" + otherPlayer.minted_id
      //           && otherPlayer.gameObject.sprite.anims.currentAnim.key !== 'gotHit-'+otherPlayer.wallet_address + "_" + otherPlayer.minted_id
      //           && otherPlayer.gameObject.sprite.anims.currentAnim.key !== 'gotBackHit-'+otherPlayer.wallet_address + "_" + otherPlayer.minted_id
      //           && otherPlayer.gameObject.sprite.anims.currentAnim.key !== 'stunned-'+otherPlayer.wallet_address + "_" + otherPlayer.minted_id
      //         ) {
      //           otherPlayer.running = false
      //           otherPlayer.gameObject.sprite.stop()
      //           if (otherPlayer.hasBrewInHand) {
      //             otherPlayer.gameObject.sprite.play("walkBrew-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id)
      //           } else {
      //             otherPlayer.gameObject.sprite.play("walk-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id)
      //           }
      //           // add smooth movement
      //           // otherPlayer.gameObject.SmoothMovement()
      //         }
      //       // }
      //     }
      //     else {
      //       if (otherPlayer.gameObject?.sprite.anims && otherPlayer.gameObject.sprite.anims.currentAnim) {
      //         if (otherPlayer.gameObject?.sprite.anims.currentAnim.key !== "kick-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id
      //           && otherPlayer.gameObject?.sprite.anims.currentAnim.key !== "punch-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id
      //           && otherPlayer.gameObject?.sprite.anims.currentAnim.key !== "punchBrew-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id
      //           && otherPlayer.gameObject?.sprite.anims.currentAnim.key !== "run-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id
      //           && otherPlayer.gameObject?.sprite.anims.currentAnim.key !== "runBrew-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id
      //           && otherPlayer.gameObject?.sprite.anims.currentAnim.key !== "gotHit-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id
      //           && otherPlayer.gameObject.sprite.anims.currentAnim.key !== 'gotBackHit-'+otherPlayer.wallet_address + "_" + otherPlayer.minted_id
      //           && otherPlayer.gameObject.sprite.anims.currentAnim.key !== 'idle-'+otherPlayer.wallet_address + "_" + otherPlayer.minted_id
      //           && otherPlayer.gameObject.sprite.anims.currentAnim.key !== 'idleBrew-'+otherPlayer.wallet_address + "_" + otherPlayer.minted_id
      //           && otherPlayer.gameObject.sprite.anims.currentAnim.key !== 'win-'+otherPlayer.wallet_address + "_" + otherPlayer.minted_id
      //           && otherPlayer.gameObject.sprite.anims.currentAnim.key !== 'lose-'+otherPlayer.wallet_address + "_" + otherPlayer.minted_id
      //           && otherPlayer.gameObject.sprite.anims.currentAnim.key !== 'drink-'+otherPlayer.wallet_address + "_" + otherPlayer.minted_id
      //           && otherPlayer.gameObject.sprite.anims.currentAnim.key !== 'drink2-'+otherPlayer.wallet_address + "_" + otherPlayer.minted_id
      //           && otherPlayer.gameObject.sprite.anims.currentAnim.key !== 'equipBrew-'+otherPlayer.wallet_address + "_" + otherPlayer.minted_id
      //           // && otherPlayer.gameObject.sprite.anims.currentAnim.key !== 'walk-'+otherPlayer.wallet_address + "_" + otherPlayer.minted_id
      //           // && otherPlayer.gameObject.sprite.anims.currentAnim.key !== 'walkBrew-'+otherPlayer.wallet_address + "_" + otherPlayer.minted_id
      //           && !otherPlayer.stunnedStarted
      //           && !otherPlayer.deadStarted
      //           // && otherPlayer.gameObject.sprite.anims.currentAnim.key !== 'stunned-'+otherPlayer.wallet_address + "_" + otherPlayer.minted_id
      //         ) {
      //           otherPlayer.running = false;
      //           otherPlayer.moving = false;
      //           otherPlayer.kicking = false;
      //           otherPlayer.kickStart = false;
      //           otherPlayer.punching = false;
      //           otherPlayer.punchStart = false;
      //           // console.log(" player_state_2 idle -- ", otherPlayer.hasBrewInHand)
      //           if (otherPlayer.hasBrewInHand) {
      //             otherPlayer.gameObject.sprite.play("idleBrew-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id)
      //           } else {
      //             otherPlayer.gameObject.sprite.play("idle-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id)
      //           }
      //           // otherPlayer.gameObject?.sprite.play("idle-"+otherPlayer.wallet_address + "_" + otherPlayer.minted_id )
      //         }
      //       }
      //     }
      //     // otherPlayer.kicking = false;
      //     // otherPlayer.punching = false;
      //     // otherPlayer.punchStart = false
      //     // otherPlayer.kickStart = false
      //     // otherPlayer.running = false;
      //     otherPlayer.gotHit = false;
      //     otherPlayer.gotBackHit = false;
      //   }
      // } catch (err) {
      //   console.log("error ", err, otherPlayer)
      // }

      if (this.playerStunned) {
        return;
      }

      // resolve orientation
      if (newSystemKeys.keyD.pressed) {
        otherPlayer.orientation = "right";
        otherPlayer.gameObject.sprite.flipX = false;
      }
      if (newSystemKeys.keyA.pressed) {
        otherPlayer.orientation = "left";
        otherPlayer.gameObject.sprite.flipX = true;
      }
    }

    if (this.currStamina < 2) {
      return;
    }
    if (!tempMoving) {
      return;
    }
    // if (otherPlayer?.movementAbility === "stop") {
    //   return
    // }
    action_id = uuidv4();
    this.game.lobbySocketConnection.send(
      JSON.stringify({
        event: "move",
        delta: delta,
        walletAddress: store.getState().web3store.userAddress,
        keys: newSystemKeys,
        action_id,
      })
    );

    let you_are_player = -1;
    if (
      store.getState().userActionsDataStore.fightersInfo.player1
        .walletAddress === this.playerAllData.user_wallet_address
    ) {
      you_are_player = 1;
    } else if (
      store.getState().userActionsDataStore.fightersInfo.player2
        .walletAddress === this.playerAllData.user_wallet_address
    ) {
      you_are_player = 2;
    }
    // let nPos = {
    //   x: this.sprite.x, y: this.sprite.y
    // };
    // console.log(" you are player -----", you_are_player);
    if (
      you_are_player > 0 &&
      store.getState().userActionsDataStore.fightersInfo.fightStarted
    ) {
      const otherPlayer_index = -1;
      this.game.otherPlayers.forEach((_player) => {
        if (
          (you_are_player === 1 &&
            _player.wallet_address ===
            store.getState().userActionsDataStore.fightersInfo.player2
              .walletAddress) ||
          (you_are_player === 2 &&
            _player.wallet_address ===
            store.getState().userActionsDataStore.fightersInfo.player1
              .walletAddress)
        ) {
          // found other player..
          if (_player.gameObject) {
            const { event, pos, calculatedSpeed } =
              basicCollisionWithBoundaryAndPlayer(
                boundaries,
                {
                  x: this.sprite.x,
                  y: this.sprite.y,
                },
                delta,
                newSystemKeys,
                {
                  x: _player.gameObject?.sprite.x,
                  y: _player.gameObject?.sprite.y,
                },
                _player.gameObject?.walk_speed,
                _player.gameObject?.run_speed
              );
            if (this.sprite.x !== pos.x) {
              // console.log("-- pos -- ", pos)
            }
            this.sprite.x = pos.x;
            this.sprite.y = pos.y;
          }
        }
      });
    } else {
      // console.log("moving.. ", this.currStamina)
      // move if
      // this.value = movePlayerv3(newSystemKeys, this.sprite, this.value, boundaries, delta, speed );
      const { event, pos, calculatedSpeed } = basicCollisionAndMovementPlayerV3(
        boundaries,
        {
          x: this.sprite.x,
          y: this.sprite.y,
        },
        delta,
        newSystemKeys,
        this.walk_speed,
        this.run_speed
      );
      // if (this.sprite.x !== pos.x) {
      //   // console.log("-- pos -- ", pos)
      // }
      this.sprite.x = pos.x;
      this.sprite.y = pos.y;
    }

    if (tempMoving) {
      ActionManager.AddTomoveActionQueue({
        action_id,
        task_state: true,
        x: this.sprite.x,
        y: this.sprite.y,
      });
    }
  }
}
