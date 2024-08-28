// @ts-nocheck
// import { isNullOrUndefined } from "util";
import phaserGame from "../../PhaserGame";
import store from "../../stores";
import { SetFocussedOnChat, ShowChatWindow } from "../../stores/UserActions";
import { IKeysInfo } from "../characters/IPlayer";
import Game from "../scenes/Game";

export default class KeyControls {
  game: Game;
  keys: IKeysInfo;
  onKeysChange = false;

  constructor() {
    this.game = phaserGame.scene.keys.game as Game;
    this.addControls();
    this.keys = {
      keyA: {
        pressed: false,
        double_pressed: false,
      },
      keyD: {
        pressed: false,
        double_pressed: false,
      },
      keyS: {
        pressed: false,
      },
      keyW: {
        pressed: false,
      },
      keyP: {
        pressed: false,
      },
      keyK: {
        pressed: false,
      },
      leftShift: {
        pressed: false,
      },
      keyBlock: {
        pressed: false,
      },
      keyQ: {
        pressed: false,
        time_last_pressed: 1,
        time_last_lifted: 1,
      },
      lastKey: "",
    };
  }

  keyQCodeDownHandler() {
    if (store.getState().assetStore.in_hand_brew && this.keys.keyQ.time_last_lifted && new Date().getTime() - this.keys.keyQ.time_last_lifted > 100) {
      this.keys.keyQ.pressed = true;
    }

    if (store.getState().assetStore.equippedBrewCount > 1) {
      const temp = this.game.otherPlayers.get(store.getState().web3store.player_id);
      if (temp?.gameObject) {
        this.keys.keyQ.time_last_lifted = new Date().getTime();
        this.game.lobbySocketConnection.send(
          JSON.stringify({
            event: "equip_brew",
            walletAddress: store.getState().web3store.userAddress,
            minted_id: temp.minted_id,
          })
        );
      }
      return
    }

    if (store.getState().assetStore.equippedBrewCount > 0 && new Date().getTime() - this.keys.keyQ.time_last_lifte > 1000) {
      const temp = this.game.otherPlayers.get(store.getState().web3store.player_id);
      if (temp?.gameObject) {
        this.keys.keyQ.time_last_lifted = 0;
        this.game.lobbySocketConnection.send(
          JSON.stringify({
            event: "brew_used",
            walletAddress: store.getState().web3store.userAddress,
            minted_id: temp.minted_id,
          })
        );
      }
      return
    }
  }

  addControls() {
    this.game.input.keyboard.on("keydown", (event: { code: string }) => {
      // console.log("keydown--",event.code)
      switch (event.code) {
        case "KeyB":
          this.keys.keyBlock.pressed = true;
          break;
        case "ShiftLeft":
          this.keys.leftShift.pressed = true;
          break;
        case "KeyD":
          this.keys.keyD.pressed = true;
          this.onKeysChange = true;
          if (this.keys.keyD.time_last_pressed && this.keys.keyD.time_last_lifted && !this.keys.keyD.double_pressed) {
            if (new Date().getTime() - this.keys.keyD.time_last_pressed < 300 && new Date().getTime() - this.keys.keyD.time_last_lifted < 300) {
              // console.log("double pressed..d")
              this.keys.keyD.double_pressed = true;
            }
          }
          if (this.keys.leftShift.pressed) {
            this.keys.keyD.double_pressed = true;
          }
          this.keys.keyD.time_last_pressed = new Date().getTime();
          this.keys.lastKey = "KeyD";
          this.keys.keyA.double_pressed = false;
          break;
        case "KeyA":
          this.keys.keyA.pressed = true;
          this.onKeysChange = true;
          if (this.keys.keyA.time_last_pressed && this.keys.keyA.time_last_lifted && !this.keys.keyA.double_pressed) {
            if (new Date().getTime() - this.keys.keyA.time_last_pressed < 300 && new Date().getTime() - this.keys.keyA.time_last_lifted < 300) {
              // console.log("double pressed..a")
              this.keys.keyA.double_pressed = true;
            }
          }
          if (this.keys.leftShift.pressed) {
            this.keys.keyA.double_pressed = true;
          }
          this.keys.lastKey = "KeyA";
          this.keys.keyA.time_last_pressed = new Date().getTime();
          this.keys.keyD.double_pressed = false;
          break;
        case "KeyW":
          this.onKeysChange = true;
          if (this.keys.keyD.double_pressed || this.keys.keyA.double_pressed) {
            break;
          }
          this.keys.keyW.pressed = true;
          this.keys.lastKey = "KeyA";
          this.keys.keyD.double_pressed = false;
          this.keys.keyA.double_pressed = false;
          break;
        case "KeyS":
          this.onKeysChange = true;
          if (this.keys.keyD.double_pressed || this.keys.keyA.double_pressed) {
            break;
          }
          this.keys.keyS.pressed = true;
          this.keys.lastKey = "KeyS";
          this.keys.keyD.double_pressed = false;
          this.keys.keyA.double_pressed = false;
          break;
        case "KeyP":
          if (this.keys.lastKey === "KeyP") {
            return;
          }
          this.keys.keyP.pressed = true;
          this.keys.lastKey = "KeyP";
          this.keys.keyD.double_pressed = false;
          this.keys.keyA.double_pressed = false;
          // if (this.game.fightMachineOverlapText.depth > 0) {
          //   this.game.lobbySocketConnection.send(JSON.stringify({
          //     event: "fight_machine_button_press",
          //     walletAddress: store.getState().web3store.userAddress,
          //   }))
          //   this.game.punchArea.setDepth(-1)
          //   setTimeout(() => {
          //     this.game.punchArea.setDepth(1)
          //     store.dispatch(HitFightMachine(true))
          //     this.game.bootstrap.play_button_press_sound()
          //   }, 500)
          // }
          break;
        case "KeyK":
          if (this.keys.lastKey === "KeyK") {
            return;
          }
          // console.log("pressed_key_kicking... down", this.keys.lastKey)
          this.keys.keyK.pressed = true;
          this.keys.lastKey = "KeyK";
          this.keys.keyD.double_pressed = false;
          this.keys.keyA.double_pressed = false;
          // if (this.game.fightMachineOverlapText.depth > 0) {
          //   this.game.lobbySocketConnection.send(JSON.stringify({
          //     event: "fight_machine_button_press",
          //     walletAddress: store.getState().web3store.userAddress,
          //   }))
          //   this.game.punchArea.setDepth(-1)
          //   setTimeout(() => {
          //     this.game.punchArea.setDepth(1)
          //     store.dispatch(HitFightMachine(true))
          //     this.game.bootstrap.play_button_press_sound()
          //   }, 500)
          // }
          break;
        case "KeyT":
          console.log("T_pressed.. testing");
          // this.game.otherPlayers.forEach(_player => {
          //   if (_player.gameObject) {
          //     if (_player.wallet_address === store.getState().web3store.userAddress) {
          //       _player.gameObject.dead = true;
          //       _player.gameObject.dead_last_time = new Date().getTime();
          //     }
          //   }
          // })
          // this.game.otherPlayers.forEach((_otherplayer) => {
          //   if (_otherplayer.wallet_address === store.getState().web3store.userAddress && _otherplayer.gameObject) {
          //     if (_otherplayer.gameObject.gassed_lift_off_fallen) {
          //       _otherplayer.gameObject.gassed_lift_off_fallen = false
          //     } else {
          //       _otherplayer.gameObject.gassed_lift_off_fall = true
          //       _otherplayer.gameObject.gassed_lift_off_fallen = true
          //     }
          //   }
          // })
          // store.dispatch(ShowDeadSprite(true))
          break;
        // case 'KeyR': {
        //   this.game.otherPlayers.forEach((_otherplayer) => {
        //     if (_otherplayer.wallet_address === store.getState().web3store.userAddress && _otherplayer.gameObject) {
        //       _otherplayer.gameObject.target_position_stored = {
        //         x: _otherplayer.gameObject.sprite.x + 20,
        //         y: _otherplayer.gameObject.sprite.y,
        //       }
        //     }
        //   })
        //   break
        // }
        case "KeyQ":

          this.keyQCodeDownHandler()

          break;

        //   console.log("debugQ pressed..", store.getState().assetStore.equippedBrewCount, this.keys.keyQ.time_last_lifted);

        //   // if (this.keys.keyQ.time_last_lifted && this.keys.keyQ.time_last_lifted > 10 ) {
        //   //   if (new Date().getTime() - this.keys.keyQ.time_last_lifted > 100) {
        //   //     this.keys.keyQ.pressed = true
        //   //   }
        //   // }
        //   if (store.getState().assetStore.in_hand_brew && this.keys.keyQ.time_last_lifted && new Date().getTime() - this.keys.keyQ.time_last_lifted > 100) {
        //     this.keys.keyQ.pressed = true;
        //   }

        //   if (store.getState().assetStore.equippedBrewCount > 0) {
        //     const temp = this.game.otherPlayers.get(store.getState().web3store.player_id);
        //     if (temp?.gameObject) {
        //       this.keys.keyQ.time_last_lifted = 0;
        //       this.game.lobbySocketConnection.send(
        //         JSON.stringify({
        //           event: "equip_brew",
        //           walletAddress: store.getState().web3store.userAddress,
        //           minted_id: temp.minted_id,
        //         })
        //       );
        //     }
        //   }
        //   break;
        // }
        case "Enter":
          if (this.game.enter_pressed) {
            store.dispatch(SetFocussedOnChat(false));
            store.dispatch(ShowChatWindow(false));
            this.game.enter_pressed = false;
          } else {
            store.dispatch(SetFocussedOnChat(true));
            store.dispatch(ShowChatWindow(true));
            this.game.enter_pressed = true;
          }
          console.log("pressed enter focussed ");
          break;
      }
    });

    this.game.input.keyboard.on("keyup", (event: { code: string }) => {
      switch (event.code) {
        case "KeyB":
          this.keys.keyBlock.pressed = false;
          break;
        case "ShiftLeft":
          this.keys.leftShift.pressed = false;
          break;
        case "KeyQ":
          this.keys.keyQ.pressed = false;
          console.log("debugQ released", store.getState().assetStore.equippedBrewCount, this.keys.keyQ.time_last_lifted);
          // this.keys.keyQ.time_last_lifted = 0
          if (store.getState().assetStore.in_hand_brew) {
            this.keys.keyQ.time_last_lifted = new Date().getTime();
          }
          // this.keys.keyQ.time_last_lifted = new Date().getTime()
          break;
        case "KeyD":
          this.onKeysChange = true;
          this.keys.keyD.pressed = false;
          this.keys.keyD.time_last_lifted = new Date().getTime();
          this.keys.keyD.double_pressed = false;
          this.keys.keyA.double_pressed = false;
          this.keys.lastKey = "";
          break;
        case "KeyA":
          this.onKeysChange = true;
          this.keys.keyA.pressed = false;
          this.keys.keyD.double_pressed = false;
          this.keys.keyA.double_pressed = false;
          this.keys.keyA.time_last_lifted = new Date().getTime();
          this.keys.lastKey = "";
          break;
        case "KeyW":
          this.onKeysChange = true;
          this.keys.keyW.pressed = false;
          // this.keys.keyD.double_pressed = false
          // this.keys.keyA.double_pressed = false
          this.keys.lastKey = "";
          break;
        case "KeyS":
          this.onKeysChange = true;
          this.keys.keyS.pressed = false;
          // this.keys.keyD.double_pressed = false
          // this.keys.keyA.double_pressed = false
          this.keys.lastKey = "";
          break;
        case "KeyP":
          this.keys.keyP.pressed = false;
          this.keys.lastKey = "";
          break;
        case "KeyK":
          // console.log("pressed_key_kicking... down", this.keys.lastKey)
          this.keys.keyK.pressed = false;
          this.keys.lastKey = "";
          break;
      }
    });
  }
}
