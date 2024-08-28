import { BasePlayer } from "./BasePlayer";

export class MyPlayer extends BasePlayer {
  // private playContainerBody: Phaser.Physics.Arcade.Body
  // movedLastFrame!: boolean
  // webSocketConnection: WebSocket
  // game: Game
  // movementAbility = true;
  // infoIcon: MyInfoIcon
  // constructor(
  //   scene: Phaser.Scene,
  //   x: number,
  //   y: number,
  //   texture: string,
  //   id: string,
  //   nick_name: string,
  //   all_data_fighter: any,
  //   socketConnection: WebSocket
  // ) {
  //   // console.log("in createOtherCharacterAnims myplayer ", texture, id)
  //   super(scene, x, y, texture, id, all_data_fighter, false, socketConnection)
  //   this.playContainerBody = this.playerContainer.body as Phaser.Physics.Arcade.Body
  //   this.webSocketConnection = socketConnection
  //   this.game = phaserGame.scene.keys.game as Game
  // }

  // setPlayerName(name: string) {
  //   this.playerName.setText(name)
  // }

  // update(
  //   pressedKeys: any, 
  //   CurrentKeysPressed: any, 
  //   boundaries: any, 
  //   delta: any, 
  //   newSystemKeys: IKeysInfo,
  // ) {
  //   if (!this.game.lobbySocketConnected) {
  //     console.log("not connected. with game server.")
  //     if (store.getState().userPathStore.websocketConnectedTime === 0 ) {
  //       store.dispatch(ChangeWebSocketConnectedTime(new Date().getTime()))
  //     } else if (
  //       new Date().getTime() - store.getState().userPathStore.websocketConnectedTime > 5000
  //     ) {
  //       if (window.confirm("You have been disconnected from server. Please refresh to connect.")) {
  //         window.location.reload()
  //         store.dispatch(ChangeWebSocketConnectedTime(0))
  //       } else {
  //         store.dispatch(ChangeWebSocketConnectedTime(0))
  //       }
  //       // window.location.reload()
  //     }
  //     return;
  //   }
  //   if (!this.movementAbility) return;
  //   store.dispatch(ChangeWebSocketConnectedTime(0))

  //   if (
  //     newSystemKeys.keyA.pressed
  //   ) {
  //     this.value.orientation = 'left';
  //     // console.log("orientation a pressed", this.value.orientation)
  //   }
  //   if (
  //     newSystemKeys.keyD.pressed
  //   ) {
  //     this.value.orientation = 'right';
  //     // console.log("orientation d pressed", this.value.orientation)
  //   }
  //   // console.log("orientation**********", this.value.orientation);

  //   // console.log("new system keys info ", newSystemKeys.keyD)
  //   // this.actions = animateMovement(pressedKeys, this.sprite, CurrentKeysPressed, this.actions, this.game.lobbySocketConnection, "player-"+this.playerAllData.minted_id);
  //   this.actions = animateMovementv2(newSystemKeys, this.sprite, this.actions, this.game.lobbySocketConnection, "player-"+this.playerAllData.minted_id, this.value);
  //   if (!this.actions.kicking && !this.actions.punching && !this.actions.showStunnedAnim && !this.actions.showDeadSprite) {
  //     var speed = 1;
  //     if (newSystemKeys.keyD.double_pressed || newSystemKeys.keyA.double_pressed) {
  //       speed = 2;
  //     }
  //     else speed = 1;
  //     // console.log("--old pos --", this.sprite.x)
  //     // var old_pos = {x: this.sprite.x, y: this.sprite.y};
  //     this.value = movePlayerv3(newSystemKeys, this.sprite, this.value, boundaries, delta, speed );
  //     // console.log("difference -- ", this.sprite.x - old_pos.x, this.sprite.y - old_pos.y)
  //     // console.log("orientation****move******", this.value.orientation);
  //   }

  //   if (this.webSocketConnection && store.getState().web3store.userAddress !== "") {
  //     if (this.actions.kickStart) {
  //       messageSender(this.webSocketConnection, this.sprite, "kick", store.getState().web3store.userAddress, this.value.orientation)
  //     } else if (this.actions.punchStart) {
  //       messageSender(this.webSocketConnection, this.sprite, "punch", store.getState().web3store.userAddress, this.value.orientation)
  //     } else if (this.value.playerMoved) {
  //       messageSender(this.webSocketConnection, this.sprite, "move", store.getState().web3store.userAddress, this.value.orientation)
  //       this.movedLastFrame = true
  //     } else {
  //       if (this.movedLastFrame) {
  //         messageSender(this.webSocketConnection, this.sprite, "moveEnd", store.getState().web3store.userAddress, this.value.orientation)
  //       }
  //       this.movedLastFrame = false;
  //     }
  //   }
  // }

  // // Teleport(x: number, y: number, orientation: string) {
  // //   // do some animation 
  // //   this.sprite.setX(x);
  // //   this.sprite.setY(y);
  // //   this.BaseUpdate()
  // //   messageSender(this.webSocketConnection, this.sprite, "move", store.getState().web3store.userAddress, orientation)
  // //   setTimeout(() => {
  // //     messageSender(this.webSocketConnection, this.sprite, "moveEnd", store.getState().web3store.userAddress, orientation)
  // //   }, 200)
  // // }

  // // TeleportBack(x: number, y: number) {
  // //   // do some animation 
  // //   this.sprite.setX(x);
  // //   this.sprite.setY(y);
  // //   this.BaseUpdate()
  // //   messageSender(this.webSocketConnection, this.sprite, "move", store.getState().web3store.userAddress, this.value.orientation)
  // //   setTimeout(() => {
  // //     messageSender(this.webSocketConnection, this.sprite, "moveEnd", store.getState().web3store.userAddress, this.value.orientation)
  // //   }, 200)
  // //   // messageSender(this.webSocketConnection, this.sprite, "moveEnd", store.getState().web3store.userAddress, this.value.orientation)
  // // }

  // DecreaseHealthValue(amount: number) {
  //   // if (amount >= 100) return;
    
  //   this.healthBar.clear()
  //   var temp = this.totalHealthValue + (amount - this.totalActualHealthValue)/2;
  //   this.healthReduced = 2 * (this.lastHealth - temp);
  //   // console.log("health my player ", amount, this.healthReduced, this.totalActualHealthValue - amount)
  //   // if (this.totalActualHealthValue - amount > 0) {
  //   //   var rounded = Math.round(this.totalActualHealthValue - amount * 10) / 10;
  //   //   this.PopHealthReduced(rounded);
  //   // }
  //   // var tempActualHealthReduced = this.actualLastHealth - amount;
  //   // this.actualLastHealth -= amount;

  //   var tempActualHealthReduced = this.actualLastHealth - amount;
  //   // console.log("health my player ", amount, this.actualLastHealth, tempActualHealthReduced)
  //   this.actualLastHealth -= tempActualHealthReduced;
  //   if (tempActualHealthReduced > 0) {
  //     var rounded = Math.round(tempActualHealthReduced * 10) / 10
  //     this.PopHealthReduced(rounded, "red");
  //   }
  //   // if (this.healthReduced > 0) {
  //   //   var rounded = Math.round(this.healthReduced * 10) / 10
  //   //   this.PopHealthReduced(rounded, 'red');
  //   // }
  //   this.lastHealth = temp;
  //   if (amount < 70 && amount >= 30) {
  //     this.healthBar.fillStyle(0xebb925, 1);
  //     this.healthBar.fillRect(-25, 0 , temp , 3); 
  //   } else if( amount < 30) {
  //     this.healthBar.fillStyle(0xbf392f, 1);
  //     this.healthBar.fillRect(-25, 0 , temp , 3); 
  //   } else {
  //     this.healthBar.fillStyle(0x32CD32, 1);
  //     this.healthBar.fillRect(-25, 0 , temp , 3); 
  //   }
  // }
}