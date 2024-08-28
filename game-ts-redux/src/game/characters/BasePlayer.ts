// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { IAction } from "../Components/utils";
import { DEFAULT_SPRITE_DISPLAY_HEIGHT } from "../configs";
// import { TextBox } from "phaser3-rex-plugins/templates/ui/ui-components.js";

import { v4 as uuidv4 } from "uuid";
import store from "../../stores";
import { setInfoButtonClicked, SetPlayerSelected } from "../../stores/PlayerData";
import { FriendButtonClickedInInfoMenu } from "../../stores/UserActions";
import { IPlayerData } from "./IPlayer";
import { isNullOrUndefined } from "util";
import messageSender from "../../utils/websocket_helper";
import Game from "../scenes/Game";
import phaserGame from "../../PhaserGame";
import { ChangeShowMenuBox, ChangeShowStatsView, SelectOtherPlayerForStats } from "../../stores/UserWebsiteStore";

export const HealthAndStaminaMap = {
  1: 0.05,
  2: 0.1,
  3: 0.15,
  4: 0.2,
  5: 0.3,
};

export const StaminaRegenarationMap = {
  1: 2.1,
  2: 2.2,
  3: 2.3,
  4: 2.4,
  5: 2.6,
};

export const RunSpeedMap = {
  1: 1.89,
  2: 1.98,
  3: 2.05,
  4: 2.09,
  5: 2.11,
};

export const WalkSpeedMap = {
  1: 1.05,
  2: 1.11,
  3: 1.14,
  4: 1.16,
  5: 1.17,
};

export const KickPowerMap = {
  1: 6,
  2: 8,
  3: 10,
  4: 12,
  5: 10,
};

export const AttackReductionMap = {
  1: 0.05,
  2: 0.1,
  3: 0.15,
  4: 0.2,
  5: 0.25,
};

function convertAttrToKick(val: number) {
  switch (val) {
    case 1:
      return KickPowerMap[1];
    case 2:
      return KickPowerMap[2];
    case 3:
      return KickPowerMap[3];
    case 4:
      return KickPowerMap[4];
    case 5:
      return KickPowerMap[5];
    default:
      return 0;
  }
}

export class BasePlayer {
  scene: Phaser.Scene;
  public sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public playerContainer!: Phaser.GameObjects.Container;
  playerName: Phaser.GameObjects.Text;
  actions: IAction;
  value: {
    playerMoved: boolean;
    orientation: string;
  };
  healthBar!: Phaser.GameObjects.Graphics;
  lastHealth!: number;
  actualLastHealth!: number;
  healthReduced!: number;
  healthBarBackground!: Phaser.GameObjects.Graphics;
  staminaBarBackGround!: Phaser.GameObjects.Graphics;
  staminaBar!: Phaser.GameObjects.Graphics;
  // textBox!: TextBox;
  // playerMessageText!: Phaser.GameObjects.Text
  // playerDialogBubble!: Phaser.GameObjects.Container
  // moveUpAnimation!: Phaser.Tweens.Tween
  // realMoveUpAnimation!: Phaser.Tweens.Tween

  chatBubbleActive = false;
  // dialogBubbleText!: string;

  currentBubbleID!: string;
  bubbleIds: Array<string> = [];

  public playerInfoIcon!: Phaser.GameObjects.Image;
  public playerWeb2Icon!: Phaser.GameObjects.Image;
  playerAllData!: IPlayerData;
  // playerNFTDATA!: INFTDataOfConnections;

  buttonStats!: Phaser.GameObjects.Text;
  buttonFriend!: Phaser.GameObjects.Text;
  AllInfoButtonCOntainer!: Phaser.GameObjects.Container;

  allInfoButtonStateHandler = "";

  // health related
  totalHealthValue: number;
  totalStaminaValue: number;

  currStamina!: number;
  currHealth!: number;
  playerStunned!: boolean;

  //
  totalActualHealthValue!: number;
  totalActualStaminaValue!: number;

  playerPopHealthText: Array<{
    text: Phaser.GameObjects.Text;
    animationStarted: boolean;
    startedTime: number;
    index: number;
  }>;
  lastStamina: number;
  healthAndStaminaBarsEnabled: boolean;
  // playerPopHealthText: Array<{text: Phaser.GameObjects.Text, animationStarted: boolean}>;

  walk_speed!: number;
  run_speed!: number;

  webSocketConnection: WebSocket;
  public last_position_stored!: {
    x: number;
    y: number;
  };

  public target_position_stored: {
    x: number;
    y: number;
  };

  public server_position_stored = {
    x: 0,
    y: 0,
  };

  public last_server_move_action_id = "";
  public last_server_move_updated_at = 0;

  public teleport_coordinates!: {
    x: number;
    y: number;
  };

  public tween_animation_running = false;
  public tween_anim_running_down = false;
  public moving!: boolean;
  public need_to_move_player = false;
  public teleport = false;

  // new animations
  // gassed + lift-off + fall
  gassed_lift_off_fall = false;
  gassed_lift_off_fallen = false;
  dead = false;
  dead_last_time = 0;
  game: Game;

  max_stamina: number;
  max_health: number;
  speed!: number;
  defense!: number;
  punchPower!: number;
  kickPower!: number;
  wallet_address: string | undefined;
  minted_id: number | undefined;
  deadTweenRunning = false;
  nick_name = "";
  extra_data: any = {};
  playerThoughtBubbles: Array<Phaser.GameObjects.Container> = [];

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    nameOfKey: string,
    // all_data_fighter: IPlayerData,
    otherPlayer: boolean,
    socketConnection: WebSocket,
    nick_name: string,
    wallet_address?: string,
    minted_id?: number,
    max_health?: number,
    max_stamina?: number,
    extra_data?: any

    // extra_data: INFTDataOfConnections,
  ) {
    this.wallet_address = wallet_address;
    this.minted_id = minted_id;
    console.log("debug_stats --- ", extra_data);
    this.extra_data = extra_data;

    this.nick_name = nick_name;
    // health
    this.totalHealthValue = 50;
    this.totalStaminaValue = 50;
    this.lastHealth = 50;
    this.lastStamina = 50;
    this.playerPopHealthText = [];
    this.webSocketConnection = socketConnection;
    this.game = phaserGame.scene.keys.game as Game;
    // this.playerNFTDATA = extra_data
    this.target_position_stored = { x: 0, y: 0 };

    this.scene = scene;
    this.healthAndStaminaBarsEnabled = true;
    // console.log("in createOtherCharacterAnims baseplayer ", texture, nameOfKey)
    this.sprite = this.scene.physics.add.sprite(x, y, texture);
    // console.log("in createOtherCharacterAnims baseplayer 1", texture, nameOfKey, this.sprite.anims)
    // console.log("in baseplayer... ", all_data_fighter.data.attributes)
    // all_data_fighter.data.attributes.map((_val: {trait_type: string, value: number}) => {
    //   // console.log("in baseplayer...", _val)
    //   if (_val.trait_type === "health") {
    //     this.totalActualHealthValue = convertHealthApToTotalHealth(_val.value)* 100 + 100
    //     this.actualLastHealth = convertHealthApToTotalHealth(_val.value)* 100 + 100
    //   }
    //   if (_val.trait_type === 'speed'){
    //     this.walk_speed = convertWalkSpeedMapToSPeed(_val.value);
    //     this.run_speed = convertRunSpeedMapToSPeed(_val.value);
    //   }
    // })
    const tempDict = {
      defense: 0,
      kickpower: 0,
      health: 0,
      stamina: 0,
      speed: 0,
      punchpower: 0,
    };
    // all_data_fighter.data.attributes.map((dd: {trait_type: string, value: number})=> {
    //   if (dd.trait_type === 'defense') tempDict.defense = dd['value']
    //   if (dd.trait_type === 'kick') tempDict['kickpower'] = dd['value']
    //   if (dd.trait_type === 'punch') tempDict['punchpower'] = dd['value']
    //   if (dd.trait_type === 'health') tempDict['health'] = dd['value']
    //   if (dd.trait_type === 'stamina') tempDict['stamina'] = dd['value']
    //   if (dd.trait_type === 'speed') tempDict['speed'] = dd['value']
    // })
    // this.max_stamina = convertStaminaMapTo(tempDict.stamina) *100 + 100;
    // this.max_health = convertStaminaMapTo(tempDict.health) *100 + 100;

    this.max_stamina = max_stamina ? max_stamina : 0;
    this.max_health = max_health ? max_health : 0;

    this.defense = tempDict["defense"];
    this.speed = tempDict["speed"];

    this.kickPower = convertAttrToKick(tempDict["kickpower"]);
    this.punchPower = convertAttrToKick(tempDict["punchpower"]) / 2;

    // console.log("in baseplayer... ", this.totalActualHealthValue, this.totalHealthValue)
    this.sprite.play(nameOfKey);
    // console.log("in createOtherCharacterAnims baseplayer 2", texture, nameOfKey, this.sprite.anims)
    // console.log("in createOtherCharacterAnims baseplayer 2", texture, nameOfKey)
    // this.sprite.displayHeight = DEFAULT_SPRITE_DISPLAY_HEIGHT;
    // this.sprite.displayWidth = DEFAULT_SPRITE_DISPLAY_WIDTH;
    this.playerContainer = this.scene.add.container(x, y - DEFAULT_SPRITE_DISPLAY_HEIGHT / 2 - 20).setDepth(900000);
    this.healthBar = this.scene.add.graphics();
    this.healthBarBackground = this.scene.add.graphics();
    this.staminaBarBackGround = this.scene.add.graphics();
    this.staminaBar = this.scene.add.graphics();
    this.scene.physics.world.enable(this.playerContainer);
    // console.log("fighter all data ", all_data_fighter)
    // this.playerAllData = all_data_fighter;
    console.log("playerAllData ", this.playerAllData);
    // this.AllInfoButtonCOntainer = this.scene.add.container(x ,y - DEFAULT_SPRITE_DISPLAY_HEIGHT/2 - 20).setDepth(900000)
    // this.EnableHealthBars()
    this.actions = {
      walking: false,
      running: false,
      kicking: false,
      punching: false,
      idle: false,
      kickStart: false,
      kickEnd: false,
      punchStart: false,
      runStart: false,
      gotHit: false,
      gotHitStart: false,
      gotBackHit: false,
      downAnimPlaying: false,
      showStunnedAnim: false,
      showDeadSprite: false,
    };

    this.value = {
      playerMoved: false,
      orientation: "right",
    };

    const fontSize = Math.floor(56 * 0.17);
    this.playerName = this.scene.add.text(0, 15, this.nick_name).setFontFamily("monospace").setFontSize(fontSize).setColor("#fefefe").setOrigin(0.5)
    this.playerName.setStroke("#6a6565", Math.floor(fontSize * 0.25));

    const boundsOfTextName: Phaser.Geom.Rectangle = this.playerName.getBounds();
    this.playerInfoIcon = this.scene.add
      .image(boundsOfTextName.right + 5, 15, "info_icon")
      .setScale(0.02)
      .setInteractive()
      .setInteractive(new Phaser.Geom.Circle(40, 5, 15), Phaser.Geom.Circle.Contains)
      .on("pointerdown", (pointer: Phaser.Input.Pointer, objectsClicked: Phaser.GameObjects.GameObject[]) => {
        this.allInfoButtonStateHandler = "info_clicked";
        // this.AllInfoButtonCOntainer.setVisible(true)
        // this.playerContainer.add([this.buttonStats, this.buttonFriend])
        // this.playerContainer.add(this.buttonContainer)
        // store.dispatch(setInfoButtonClicked(true));
        // store.dispatch(setPlayerSelected(this.playerAllData))
        store.dispatch(SelectOtherPlayerForStats(`${this.wallet_address}_${this.minted_id}`));
        store.dispatch(ChangeShowStatsView(true));
        store.dispatch(ChangeShowMenuBox(true));
        console.log("all container info button clicked... --- ", this.allInfoButtonStateHandler);
      });

    this.playerWeb2Icon = this.scene.add
      .image(boundsOfTextName.left - 5, 15, "beginner_icon")
      // .setSize(10, 10);
      .setScale(0.2);

    this.buttonStats = this.scene.add
      .text(-5, -5, "Stats")
      .setStyle({ backgroundColor: "#f5eddc", borderRadius: 5 })
      .setColor("#000")
      .setPadding(2)
      .setInteractive()
      .setFontFamily("monospace")
      .setFontSize(10)
      .on("pointerdown", (pointer: Phaser.Input.Pointer, objectsClicked: Phaser.GameObjects.GameObject[]) => {
        this.allInfoButtonStateHandler = "stats_clicked";
        this.buttonStats.setTint(0xff0000);
        store.dispatch(setInfoButtonClicked(true));
        store.dispatch(SetPlayerSelected(this.playerAllData));
        window.setTimeout(() => {
          this.buttonStats.clearTint();
        }, 100);
        console.log("stats button clicked --- ", this.allInfoButtonStateHandler);
      })
      .on("pointerout", (pointer: Phaser.Input.Pointer, objectsClicked: Phaser.GameObjects.GameObject[]) => {
        // if (this.allInfoButtonStateHandler === 'friend_clicked') {

        // } else {
        //   this.AllInfoButtonCOntainer.setVisible(false)
        // }
        this.allInfoButtonStateHandler = "";
        console.log("outside stats button clicked --- ", this.allInfoButtonStateHandler);
      })
      .on("pointerover", (pointer: Phaser.Input.Pointer, objectsClicked: Phaser.GameObjects.GameObject[]) => {
        this.allInfoButtonStateHandler = "stats_clicked";
        console.log("pointer over stats button --- ", this.allInfoButtonStateHandler);
      });

    this.buttonFriend = this.scene.add
      .text(0, this.buttonStats.height + 4, "Friend")
      .setStyle({ backgroundColor: "#f5eddc", borderRadius: 5 })
      .setColor("#000")
      .setPadding(2)
      .setInteractive()
      .setFontFamily("monospace")
      .setFontSize(10)
      .on("pointerdown", (pointer: Phaser.Input.Pointer, objectsClicked: Phaser.GameObjects.GameObject[]) => {
        this.allInfoButtonStateHandler = "friend_clicked";
        this.buttonFriend.setTint(0xff0000);
        store.dispatch(FriendButtonClickedInInfoMenu(true));
        store.dispatch(SetPlayerSelected(this.playerAllData));
        window.setTimeout(() => {
          this.buttonFriend.clearTint();
        }, 100);
        console.log("friend button clicked --- ");
      })
      .on("pointerout", (pointer: Phaser.Input.Pointer, objectsClicked: Phaser.GameObjects.GameObject[]) => {
        // if (this.allInfoButtonStateHandler === 'stats_clicked') {

        // } else {
        //   this.AllInfoButtonCOntainer.setVisible(false)
        // }
        this.allInfoButtonStateHandler = "";
        console.log("outside friend button clicked --- ", this.allInfoButtonStateHandler);
      })
      .on("pointerover", (pointer: Phaser.Input.Pointer, objectsClicked: Phaser.GameObjects.GameObject[]) => {
        this.allInfoButtonStateHandler = "friend_clicked";
        console.log("pointer over friend button --- ", this.allInfoButtonStateHandler);
      });

    // var buttonFight = this.scene.add.dom(0, 0, 'h2', null, "FIGHT")
    // buttonFight.setClassName('test').setDepth(1000000000);

    const buttonStatsDimensions: Phaser.Geom.Rectangle = this.buttonStats.getBounds();
    const buttonGroupHeight = this.buttonStats.height;
    const buttonGroupWidth = Math.max(this.buttonStats.width, this.buttonFriend.width);

    this.buttonStats.setY(buttonStatsDimensions.height + this.buttonStats.y + 10);
    this.buttonStats.setX(this.buttonStats.x + buttonStatsDimensions.width);

    // this.buttonFriend.setY(buttonStatsDimensions.height/2 + this.buttonStats.y + 10)
    // this.buttonFriend.setX(this.buttonStats.x)

    this.AllInfoButtonCOntainer = this.scene.add.container(this.buttonStats.x - 20, this.buttonStats.y - 20).setDepth(900000);
    const dialogBoxWidth = buttonGroupWidth + 20;
    const dialogBoxHeight = 2 * buttonGroupHeight + 20;

    this.buttonStats.setY(10);
    this.buttonStats.setX(10);

    this.buttonFriend.setY(buttonStatsDimensions.height / 2 + this.buttonStats.y + 10);
    this.buttonFriend.setX(this.buttonStats.x);

    // buttonFight.setY(buttonStatsDimensions.height/2 + this.buttonFriend.y + 10)
    // buttonFight.setX(this.buttonStats.x)

    this.AllInfoButtonCOntainer.add(this.scene.add.graphics().fillStyle(0xffffff, 0.5).fillRoundedRect(0, 0, dialogBoxWidth, dialogBoxHeight, 3).lineStyle(3, 0x000000, 1).strokeRoundedRect(0, 0, dialogBoxWidth, dialogBoxHeight, 6));

    this.AllInfoButtonCOntainer.add([this.buttonStats, this.buttonFriend]);
    // console.log("nounds ..", this.AllInfoButtonCOntainer.getBounds(), this.buttonStats.width)

    this.AllInfoButtonCOntainer
      // .setInteractive(new Phaser.Geom.Circle(this.AllInfoButtonCOntainer.getBounds().centerX, this.AllInfoButtonCOntainer.getBounds().centerY ,40), Phaser.Geom.Circle.Contains)
      .setInteractive(new Phaser.Geom.Rectangle(0, 0, dialogBoxWidth, dialogBoxHeight), Phaser.Geom.Rectangle.Contains)
      // .setInteractive(this.AllInfoButtonCOntainer.getBounds(), Phaser.Geom.Rectangle.Contains)
      .on("pointerdown", (pointer: Phaser.Input.Pointer, objectsClicked: Phaser.GameObjects.GameObject[]) => {
        this.allInfoButtonStateHandler = "container_clicked";
        console.log("all container clicked --- ", this.allInfoButtonStateHandler);
      })
      .on("pointerover", (pointer: Phaser.Input.Pointer, objectsClicked: Phaser.GameObjects.GameObject[]) => {
        this.allInfoButtonStateHandler = "container_clicked";
        console.log("pointer over all container --- ", this.allInfoButtonStateHandler);
      })
      .on("pointerout", (pointer: Phaser.Input.Pointer, objectsClicked: Phaser.GameObjects.GameObject[]) => {
        // if (this.allInfoButtonStateHandler === 'stats_clicked' || this.allInfoButtonStateHandler === 'friend_clicked') {

        // } else {
        //   this.AllInfoButtonCOntainer.setVisible(false)
        // }
        this.AllInfoButtonCOntainer.setVisible(false);
        console.log("outside all container clicked --- ", this.allInfoButtonStateHandler);
      });

    this.AllInfoButtonCOntainer.setVisible(false);
    // this.playerDialogBubble = this.scene.add.container(0, 0).setDepth(90000)

    // this.moveUpAnimation = this.scene.tweens.add({
    //   targets: this.playerDialogBubble,
    //   y: -80,
    //   scale: 0.8,
    //   duration: 3000,
    //   paused: true
    // })

    // this.realMoveUpAnimation = this.scene.tweens.add({
    //   targets: this.playerDialogBubble,
    //   y: -50,
    //   // scale: 0.8,
    //   duration: 2000,
    //   paused: true
    // })

    // this.moveUpAnimation.on('complete', () => {
    //   this.playerDialogBubble
    //     .setPosition(0,0)
    //     .setScale(1);
    //   this.chatBubbleActive = false
    //   this.clearDialogBubble(this.currentBubbleID)
    //   this.dialogBubbleText = ""
    // });

    // this.playerContainer.add(this.playerDialogBubble)
    this.playerContainer.add(this.playerName);
    if (otherPlayer) {
      this.playerContainer.add(this.playerInfoIcon);
      this.playerContainer.add(this.AllInfoButtonCOntainer);
    }
    if (this.extra_data.user_type === "web2") {
      this.playerContainer.add(this.playerWeb2Icon);
    }
    // else if (!store.getState().web3store.web3Connected) {
    //   this.playerContainer.add(this.playerWeb2Icon);
    // }

    // this.PopHealthReduced(1)
    this.EnableHealthBars();

    this.sprite.on("animationstart", (a: Phaser.Animations.Animation, b: any, c: any, d: any) => {
      // console.log(a.key, a.key.includes("fly_as_angel") )
      if (a.key.includes("fly_as_angel")) {
        console.log("fly_as_angel start tween");
        const start_pos_x = this.sprite.x;
        const start_pos_y = this.sprite.y;
        this.deadTweenRunning = true;
        this.scene.tweens
          .add({
            targets: this.sprite,
            y: this.sprite.y - 800,
            x: this.sprite.x,
            duration: 6000,
          })
          .on("complete", () => {
            console.log("fly_as_angel end tween");
            this.sprite.x = 500;
            this.sprite.y = 500;
            this.deadTweenRunning = false;
            this.BaseUpdate();
            this.sprite.stop();
            this.sprite.play("idle-" + this.wallet_address + "_" + this.minted_id?.toString());
          });
      }
    });
  }

  infoButtonClicked = (value: any) => {
    console.log(" info button clicked.. ", value);
  };

  private clearDialogBubble(id: string) {
    if (id != this.currentBubbleID) return;
    // this.playerDialogBubble.removeAll(true);
    this.chatBubbleActive = false;
    // this.dialogBubbleText = "";
  }

  removeElementFromArray(element: any) {
    let req_index = -1;
    for (let i = 0; i < this.bubbleIds.length; i++) {
      if (this.bubbleIds[i] === element) {
        req_index = i;
      }
    }
    if (req_index > -1) {
      this.bubbleIds.splice(req_index, 1);
    }
  }

  createNewDialogBox(text: string) {
    const randomID = uuidv4();
    this.currentBubbleID = randomID;
    this.bubbleIds.push(randomID);
    setTimeout(() => {
      this.removeElementFromArray(randomID);
    }, 4000);
    console.log("createNewDialogBox_handlesubmit__debug_chat--", text);
    console.log("----------- in createNewDialogBox-----------", text, this.chatBubbleActive);
    const ntext = text;
    // if (text.length > 30) {
    //   for (let i =0; i< text.length; i = i + 30) {
    //     ntext += text.slice(i,i+30) + "\n"
    //   }
    // } else {
    //   ntext = text;
    // }

    if (ntext === "..." && !this.chatBubbleActive) {
      this.chatBubbleActive = true;

      const playerThoughtBubble = this.scene.add.container(0, 0).setDepth(90000);
      playerThoughtBubble.add(this.scene.add.image(0, -10, "cloud_chat_bubble").setScale(0.1).setAlpha(0.5));
      const innerText = this.scene.add
        .text(0, 0, text, { wordWrap: { width: 165, useAdvancedWrap: true } })
        .setFontFamily("monospace")
        .setFontSize(28)
        .setColor("#000000")
        .setOrigin(0.5)
        .setScale(0.3);

      const innerTextHeight = innerText.height;
      const innerTextWidth = innerText.width;

      // innerText.setY(-innerTextHeight / 2 - this.playerName.height / 2 - 10)
      innerText.setY(-innerTextHeight / 2);
      this.playerContainer.add(playerThoughtBubble);
      playerThoughtBubble.add(innerText);

      this.playerThoughtBubbles.push(playerThoughtBubble);
      setTimeout(() => {
        playerThoughtBubble.removeAll(true);
        this.chatBubbleActive = false;
      }, 2000);
      return;
    }
    if (ntext === "..." && this.chatBubbleActive) {
      // this.playerThoughtBubble.removeAll(true);
      // this.chatBubbleActive = false;
      return;
    }

    for (let i = 0; i < this.playerThoughtBubbles.length; i++) {
      this.playerThoughtBubbles[i].removeAll(true);
    }
    // this.playerThoughtBubble.removeAll(true);
    this.chatBubbleActive = false;

    // if (ntext === "..." && this.chatBubbleActive) {
    //   // console.log("hero.. 1")
    //   return;
    // } else if (ntext === "..." && !this.chatBubbleActive) {
    //   this.createThoughtBubbleCloud("...")
    //   // setTimeout(()=> {
    //   //   this.clearDialogBubble(randomID)
    //   // }, 2000)
    //   // console.log("hero.. 2")
    //   return
    // }
    // console.log("-=------------------------- here ... -----------", ntext, this.chatBubbleActive)
    // this.clearDialogBubble(randomID)

    // if (this.moveUpAnimation.isPlaying()) {
    //   console.log("createNewDialogBox yes is playing.. ")
    //   this.moveUpAnimation.seek(0);
    //   this.moveUpAnimation.pause();
    //   this.playerDialogBubble
    //     .setPosition(0,0)
    //     .setScale(1);
    // }
    // this.chatBubbleActive = true;
    // this.dialogBubbleText = ntext;
    const innerText = this.scene.add
      .text(0, 0, ntext, { wordWrap: { width: 250, useAdvancedWrap: true } })
      .setFontFamily("monospace")
      .setFontSize(28)
      .setColor("#000000")
      .setOrigin(0.5)
      .setScale(0.3);

    // set dialogBox slightly larger than the text in it
    const innerTextHeight = innerText.height - (innerText.height * 2) / 5;
    const innerTextWidth = innerText.width - innerText.width / 2;

    innerText.setY(-innerTextHeight / 2);
    const dialogBoxWidth = innerTextWidth + 10;
    const dialogBoxHeight = innerTextHeight + 3;
    const dialogBoxX = innerText.x - innerTextWidth / 2 - 5;
    const dialogBoxY = innerText.y - innerTextHeight / 2 - 2;

    const playerDialogBubble = this.scene.add.container(0, 0).setDepth(90000);



    const moveUpAnimation = this.scene.tweens.add({
      targets: playerDialogBubble,
      y: -450,
      opacity: 0,
      scale: 0.5,
      duration: 8000,
      paused: true,
    });

    moveUpAnimation.on("complete", () => {
      playerDialogBubble.setPosition(0, 0).setScale(1);
      this.chatBubbleActive = false;
      this.clearDialogBubble(this.currentBubbleID);
      // this.dialogBubbleText = ""
    });

    this.playerContainer.add(playerDialogBubble);

    playerDialogBubble.add(
      this.scene.add.graphics().fillStyle(0xffffff, 0.5).fillRoundedRect(dialogBoxX, dialogBoxY, dialogBoxWidth, dialogBoxHeight, 3).lineStyle(1, 0x000000, 1).strokeRoundedRect(dialogBoxX, dialogBoxY, dialogBoxWidth, dialogBoxHeight, 3)
    );
    playerDialogBubble.add(innerText);

    setTimeout(() => {
      moveUpAnimation.play();
    }, 1500);

    setTimeout(() => {
      playerDialogBubble.removeAll(true);
      // this.clearDialogBubble(randomID)
    }, 4000);
  }

  createThoughtBubbleCloud(text: string) {
    const randomID = uuidv4();
    this.currentBubbleID = randomID;
    // console.log("-in createThoughtBubbleCloud ... -----------", text)
    this.clearDialogBubble(randomID);
    const innerText = this.scene.add
      .text(0, 0, text, { wordWrap: { width: 165, useAdvancedWrap: true } })
      .setFontFamily("monospace")
      .setFontSize(28)
      .setColor("#000000")
      .setOrigin(0.5)
      .setScale(0.3);

    const innerTextHeight = innerText.height;
    const innerTextWidth = innerText.width;

    // innerText.setY(-innerTextHeight / 2 - this.playerName.height / 2 - 10)
    innerText.setY(-innerTextHeight / 2);
    // this.playerDialogBubble.add(
    //   this.scene.add.image(0, -10, 'cloud_chat_bubble')
    //   .setScale(0.1)
    //   .setAlpha(0.5)
    // )
    // this.playerDialogBubble.add(innerText);

    setTimeout(() => {
      this.clearDialogBubble(randomID);
    }, 500);
  }

  createCloudThoughtBubble() {
    const image = this.scene.add.image(40, 0, "cloud_chat_bubble");
    image.setScale(0.1);
    return image;
  }

  createNewChatBubble() {
    const image = this.scene.add.image(40, 0, "chat_bubble");
    image.setScale(0.1);
    return image;
  }

  createChatBubble() {
    const bubbleWidth = 100;
    const bubbleHeight = 10;
    const bubblePadding = 4;
    const arrowHeight = bubbleHeight / 4;

    const bubble = this.scene.add.graphics({ x: -20, y: 0 });
    bubble.fillStyle(0x222222, 0.5);
    bubble.fillRoundedRect(2, 2, bubbleWidth, bubbleHeight, 2);

    //  Bubble color
    bubble.fillStyle(0xffffff, 1);

    //  Bubble outline line style
    bubble.lineStyle(4, 0x565656, 1);

    //  Bubble shape and outline
    bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
    bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
    //  Calculate arrow coordinates
    const point1X = Math.floor(bubbleWidth / 7);
    const point1Y = bubbleHeight;
    const point2X = Math.floor((bubbleWidth / 7) * 2);
    const point2Y = bubbleHeight;
    const point3X = Math.floor(bubbleWidth / 7);
    const point3Y = Math.floor(bubbleHeight + arrowHeight);

    //  Bubble arrow shadow
    bubble.lineStyle(4, 0x222222, 0.5);
    bubble.lineBetween(point2X - 1, point2Y + 6, point3X + 2, point3Y);

    //  Bubble arrow fill
    bubble.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
    bubble.lineStyle(2, 0x565656, 1);
    bubble.lineBetween(point2X, point2Y, point3X, point3Y);
    bubble.lineBetween(point1X, point1Y, point3X, point3Y);

    const content = this.scene.add.text(0, 0, "Hello Sir how are you", {
      fontFamily: "Arial",
      fontSize: "22",
      color: "#000000",
      align: "center",
      wordWrap: { width: bubbleWidth - bubblePadding * 2 },
    });
    content.setStyle({ fontWeight: 'bold' });
    const b = content.getBounds();
    content.setPosition(bubble.x + bubbleWidth / 2 - b.width / 2, bubble.y + bubbleHeight / 2 - b.height / 2);
    return bubble;
  }
  update() {
    this.playerContainer.x = this.sprite.x;
    this.playerContainer.y = this.sprite.y - DEFAULT_SPRITE_DISPLAY_HEIGHT / 2 - 20;
  }
  BaseUpdate() {
    // if (this.wal)

    this.playerContainer.x = this.sprite.x;
    this.playerContainer.y = this.sprite.y - DEFAULT_SPRITE_DISPLAY_HEIGHT / 2 - 20;
    if (this.teleport) {
      console.log("in base update .. teleporting ");
      this.sprite.x = this.teleport_coordinates.x;
      this.sprite.y = this.teleport_coordinates.y;
      this.teleport = false;
    }
    this.UpdateStaminaV2();
    this.UpdateHealthV2();
    if (this.target_position_stored.x === 0) {
      return;
    }

    // if (this.gassed_lift_off_fall) {
    //   setTimeout(() => {
    //     this.scene.tweens.add({
    //       targets: this.sprite,
    //       y: this.target_position_stored.y,
    //       x: this.target_position_stored.x,
    //       duration: 2000,
    //     }).on("complete", () => {
    //       this.gassed_lift_off_fall = false
    //     })
    //   }, 2000)

    //   return
    // }
    if (!isNullOrUndefined(this.target_position_stored)) {
      // console.log("debug----------", this.gassed_lift_off_fall, this.target_position_stored)
      if (this.gassed_lift_off_fallen) {
        // lying down..
        this.SmoothMovementWhileDown();
      } else {
        this.SmoothMovement();
      }
    }
  }

  EnableHealthBars() {
    if (this.wallet_address != store.getState().web3store.userAddress) {
      return;
    }
    // return;
    // if (!this.healthAndStaminaBarsEnabled) return;

    // this.healthBar.fillStyle(0x000000);
    // this.healthBar.fillRect(-26, -1, this.totalStaminaValue + 2, 5);

    this.healthBar.fillStyle(0x32cd32, 1);
    this.healthBar.fillRect(-25, 0, this.totalHealthValue, 3);
    this.healthBarBackground.fillStyle(0xffffff, 1);
    this.healthBarBackground.fillRect(-25, 0, this.totalStaminaValue, 3);

    // this.staminaBar.fillStyle(0x000000);
    // this.staminaBar.fillRect(-27, 2, this.totalStaminaValue + 2, 5);
    this.staminaBar.fillStyle(0x778afd, 1);
    this.staminaBar.fillRect(-25, 4, this.totalStaminaValue, 3);

    this.staminaBarBackGround.fillStyle(0xffffff, 1);
    this.staminaBarBackGround.fillRect(-25, 4, this.totalStaminaValue, 3);
    this.playerContainer.setInteractive();
    this.playerContainer.add([this.healthBarBackground, this.staminaBarBackGround]);
    this.playerContainer.add(this.healthBar);
    this.playerContainer.add(this.staminaBar);

    this.healthAndStaminaBarsEnabled = true;
  }

  DisableHealthBars() {
    if (this.healthAndStaminaBarsEnabled) return;
    this.playerContainer.remove([this.healthBarBackground, this.staminaBarBackGround]);
    this.playerContainer.remove(this.healthBar);
    this.playerContainer.remove(this.staminaBar);
    this.healthAndStaminaBarsEnabled = false;
  }

  // PopHealthReduced(amount: number, color = "") {
  //   var randomSign = Math.random();
  //   var randomX = Math.sign(randomSign - 0.5) * Math.random() * 30;
  //   var randomY =  5 + Math.random() * 2;
  //   try {
  //     if (color === "red") {
  //       this.playerPopHealthText.push(
  //         {
  //           text: this.scene.add
  //             .text(randomX, randomY, amount.toString())
  //             .setFontFamily('monospace')
  //             .setFontSize(54 + amount * 4)
  //             .setScale(0.2)
  //             .setColor('#ff1a00')
  //             .setOrigin(0.5)
  //             .setStroke('#6a6565', 10),
  //           animationStarted: false,
  //           startedTime: new Date().getTime(),
  //           index: this.playerPopHealthText.length
  //         }
  //       )
  //     } else {
  //       this.playerPopHealthText.push(
  //         {
  //           text: this.scene.add
  //             .text(randomX, randomY, amount.toString())
  //             .setFontFamily('monospace')
  //             .setFontSize(54 + amount * 4)
  //             .setScale(0.2)
  //             .setColor('#fefefe')
  //             .setOrigin(0.5)
  //             .setStroke('#6a6565', 10),
  //           animationStarted: false,
  //           startedTime: new Date().getTime(),
  //           index: this.playerPopHealthText.length
  //         }
  //       )
  //     }

  //     console.log("popping health .. ", this.playerPopHealthText.length, amount)
  //     if (this.playerPopHealthText.length === 2) {
  //       this.playerPopHealthText.map((tempHealthPop, i) => {
  //         console.log(" health poper ", tempHealthPop)
  //       })
  //     }

  //     this.playerPopHealthText.map((tempHealthPop, i) => {
  //       if (new Date().getTime() - this.playerPopHealthText[i].startedTime > 1 * 1000) {
  //         this.playerPopHealthText[i].text.destroy()
  //         this.playerPopHealthText.splice(this.playerPopHealthText[i].index,1)
  //         return
  //       }
  //       // if (this.playerPopHealthText[i].animationStarted) return;
  //       var randomSign = Math.random();
  //       var randomX = Math.sign(randomSign - 0.5) * Math.random() * 30;
  //       var randomY =  5 + Math.random() * 25;
  //       this.playerPopHealthText[i].text.x = this.sprite.x
  //       this.playerPopHealthText[i].text.y = this.sprite.y - DEFAULT_SPRITE_DISPLAY_HEIGHT/2 - 20 + randomY;
  //       this.playerPopHealthText[i].text.setDepth(this.sprite.depth)

  //       var temp = this.playerPopHealthText[i];

  //       this.scene.tweens.add({
  //         targets: temp.text,
  //         y: this.sprite.y - DEFAULT_SPRITE_DISPLAY_HEIGHT/2 - 30,
  //         x: this.sprite.x + Math.sign(randomSign - 0.5) * Math.random() * 30,
  //         duration: 500,
  //         // paused: false
  //       }).on("start", () => {
  //         try {
  //           temp.animationStarted = true
  //         } catch (err ) {
  //           console.log("error in PopHealthReduced start -->", err)
  //         }
  //       }).on('complete', () => {
  //         try {
  //           if (!isNullOrUndefined(temp)) {
  //             temp.text.destroy()
  //             this.playerPopHealthText.splice(temp.index,1)
  //           }
  //         } catch (err) {
  //           console.log("error in Pop Health Reduced complete -->", err)
  //         }
  //       });
  //     })
  //   } catch (err) {
  //     console.log("error in PopHealthReduced -->", err)
  //   }
  // }

  UpdateStamina(amount: number) {
    // if (amount >= 100) return;
    // console.log("stamina---> amount --", amount)
    this.staminaBar.clear();
    const temp = this.totalStaminaValue + (amount - 100) / 2;
    // console.log("stamina---> temp --", temp)
    const temp2 = 2 * (this.lastStamina - temp);
    // console.log("stamina---> temp2 --", temp2)
    this.staminaBar.fillStyle(0x778afd, 1);
    this.staminaBar.fillRect(-25, 4, temp, 3);
    this.lastStamina = temp;
  }

  UpdateStaminaV2() {
    // decrease statmina

    this.staminaBar.clear();
    // this.staminaBar.fillStyle(0x000000);
    // this.staminaBar.fillRect(-27, 2, this.totalStaminaValue + 2, 5);
    const temp = (this.currStamina / this.max_stamina) * 50;
    this.staminaBar.fillStyle(0x778afd, 1);
    this.staminaBar.fillRect(-25, 4, temp, 3);
  }

  UpdateHealthV2() {
    // decrease statmina
    // console.log("health -- ", this.currHealth, this.max_health)
    if (this.currHealth <= 0) {
      this.currHealth = 0;
    }
    this.healthBar.clear();
    const temp = (this.currHealth / this.max_health) * 50;
    this.healthBar.fillStyle(0x32cd32, 1);
    this.healthBar.fillRect(-25, 0, temp, 3);
  }

  // UpdateHealthV2() {
  //   // decrease statmina

  //   this.staminaBar.clear();
  //   var temp = (this.currStamina/this.max_stamina) * (50)
  //   this.staminaBar.fillStyle(0x778AFD, 1);
  //   this.staminaBar.fillRect(-25, 4 , temp , 3);
  // }

  Teleport(x: number, y: number, orientation: string) {
    // do some animation
    this.sprite.setX(x);
    this.sprite.setY(y);
    this.BaseUpdate();
    messageSender(this.webSocketConnection, this.sprite, "move", store.getState().web3store.userAddress, orientation);
    setTimeout(() => {
      messageSender(this.webSocketConnection, this.sprite, "moveEnd", store.getState().web3store.userAddress, orientation);
    }, 200);
  }

  TeleportBack(x: number, y: number) {
    // do some animation
    this.sprite.setX(x);
    this.sprite.setY(y);
    this.BaseUpdate();
    messageSender(this.webSocketConnection, this.sprite, "move", store.getState().web3store.userAddress, this.value.orientation);
    setTimeout(() => {
      messageSender(this.webSocketConnection, this.sprite, "moveEnd", store.getState().web3store.userAddress, this.value.orientation);
    }, 200);
    // messageSender(this.webSocketConnection, this.sprite, "moveEnd", store.getState().web3store.userAddress, this.value.orientation)
  }

  PopHealthReduced(amount: number, color = "") {
    const randomSign = Math.random();
    // var randomX = Math.sign(randomSign - 0.5) * Math.random() * 30;
    let randomY = 5 + Math.random() * 2;
    let healthsprite: Phaser.GameObjects.Text;
    // let randomDirection = Math.random() > 0.5 ? "right": "left";
    const initY = this.sprite.y - DEFAULT_SPRITE_DISPLAY_HEIGHT / 2 - 20 + randomY;
    try {
      if (color === "red") {
        healthsprite = this.scene.add
          .text(this.sprite.x, initY, amount.toString())
          .setFontFamily("monospace")
          .setFontSize(54 + amount * 4)
          .setScale(0.2)
          .setColor("#ff1a00")
          .setOrigin(0.5)
          .setStroke("#6a6565", 10);
      } else {
        healthsprite = this.scene.add
          .text(this.sprite.x, initY, amount.toString())
          .setFontFamily("monospace")
          .setFontSize(54 + amount * 4)
          .setScale(0.2)
          .setColor("#fefefe")
          .setOrigin(0.5)
          .setStroke("#6a6565", 10);
      }

      const randomSign = Math.random();
      const randomX = Math.sign(randomSign - 0.5) * Math.random() * 50;
      randomY = 5 + Math.random() * 25;

      // var temp = healthsprite;

      // this.scene.tweens.add({
      //   targets: healthsprite,
      //   y: this.sprite.y - DEFAULT_SPRITE_DISPLAY_HEIGHT/2 - 30,
      //   x: this.sprite.x + Math.sign(randomSign - 0.5) * Math.random() * 30,
      //   duration: 500,
      // }).on("complete", () => {
      //   healthsprite.destroy()
      // })

      this.scene.tweens
        .add({
          targets: healthsprite,
          x: {
            from: this.sprite.x,
            to: this.sprite.x + randomX,
            duration: 500,
            ease: "Linear",
          },
          y: {
            from: initY,
            to: initY - randomY,
            duration: 250,
            ease: "Power1",
            yoyo: true,
          },
        })
        .once("complete", () => {
          healthsprite.destroy();
        });

      // if (randomDirection === "right" ) {
      //   this.scene.tweens.add({
      //     targets: healthsprite,
      //     x: { from: this.sprite.x, to: this.sprite.x + , duration: 500, ease: 'Linear' },
      //     y: { from: initY, to: initY + randomY
      //       , duration: 250, ease: 'Power1', yoyo: true }
      //   }).on("complete", () => {
      //     healthsprite.destroy()
      //   })
      // }
    } catch (err) {
      console.log("error in PopHealthReduced -->", err);
    }
  }

  SmoothMovement(pos = this.target_position_stored) {
    // console.log(" here in smooth movement ", this.playerName)
    // if (
    //   (Math.abs(this.target_position_stored.x - this.sprite.x) < 0.01)
    //   || (Math.abs(this.target_position_stored.y - this.sprite.y) < 0.01)
    // ) {
    //   this.tween_animation_running = false;
    //   this.moving = false;
    //   return
    // }
    // if (this.tween_animation_running) return;
    if (isNullOrUndefined(pos.x)) return;
    if (Math.abs(pos.x - this.sprite.x) >= 0.1 || Math.abs(pos.y - this.sprite.y) >= 0.1) {
      // this.need_to_move_player = true;
      this.tween_animation_running = true;
      this.moving = true;
    } else {
      // this.need_to_move_player = false;
      this.moving = false;
    }

    // var dest_y = 0;
    // var dest_x = 0;
    // if ( Math.abs(pos.y - this.sprite.y) > 2 ) {
    //   dest_y = this.sprite.y + Math.sign(pos.y) *  2;
    // } else {
    //   dest_y = pos.y;
    // }

    // if ( Math.abs(pos.x - this.sprite.x) > 2 ) {
    //   dest_x = this.sprite.x + Math.sign(pos.x) *  2;
    // } else {
    //   dest_x = pos.x;
    // }
    // console.log(Math.round(dest_x), Math.round(dest_y) , this.sprite.x, this.sprite.y);
    try {
      if (isNullOrUndefined(pos.x)) return;
      // console.log("distance--",Math.sqrt(Math.pow(Math.abs(pos.x - this.sprite.x), 2) +
      //   Math.pow(Math.abs(pos.y - this.sprite.y), 2)))
      if (this.need_to_move_player) return;
      let animTime = 400;
      if (Math.sqrt(Math.pow(Math.abs(pos.x - this.sprite.x), 2) + Math.pow(Math.abs(pos.y - this.sprite.y), 2)) < 2) {
        animTime = 20;
      }
      if (Math.sqrt(Math.pow(Math.abs(pos.x - this.sprite.x), 2) + Math.pow(Math.abs(pos.y - this.sprite.y), 2)) < 20) {
        animTime = 100;
      }
      this.scene.tweens
        .add({
          targets: this.sprite,
          y: pos.y,
          x: pos.x,
          duration: animTime,
        })
        .on("start", () => {
          this.tween_animation_running = true;
          this.moving = true;
        })
        .on("complete", () => {
          this.tween_animation_running = false;
        });
    } catch (err) {
      console.log("error_in_line 796 in baseplayer ", err, this.sprite, pos);
    }
  }

  SmoothMovementWhileDown(pos = this.target_position_stored) {
    if (isNullOrUndefined(pos.x) || pos.x === 0) return;
    if (Math.abs(pos.x - this.sprite.x) >= 0.1 || Math.abs(pos.y - this.sprite.y) >= 0.1) {
      this.tween_anim_running_down = true;
    } else {
      this.moving = false;
    }
    try {
      let animTime = 400;
      if (Math.sqrt(Math.pow(Math.abs(pos.x - this.sprite.x), 2) + Math.pow(Math.abs(pos.y - this.sprite.y), 2)) < 2) {
        animTime = 20;
      }
      if (Math.sqrt(Math.pow(Math.abs(pos.x - this.sprite.x), 2) + Math.pow(Math.abs(pos.y - this.sprite.y), 2)) < 20) {
        animTime = 100;
      }
      this.scene.tweens
        .add({
          targets: this.sprite,
          y: pos.y,
          x: pos.x,
          duration: animTime,
        })
        .on("start", () => {
          this.tween_anim_running_down = true;
          // this.moving = true;
        })
        .on("complete", () => {
          this.tween_anim_running_down = false;
        });
    } catch (err) {
      console.log("error_in_line 796 in baseplayer ", err, this.sprite, pos);
    }
  }

  // SmoothMovementV2(pos = this.target_position_stored, moving_id = "") {
  //   if (isNullOrUndefined(pos.x)) return;
  //   if (
  //     (Math.abs(pos.x - this.sprite.x) >= 0.1)
  //     || (Math.abs(pos.y - this.sprite.y) >= 0.1)
  //   ) {
  //     // this.need_to_move_player = true;
  //     this.tween_animation_running = true;
  //     this.moving = true;
  //   } else {
  //     // this.need_to_move_player = false;
  //     this.moving = false;
  //   }
  //   try {
  //     if (isNullOrUndefined(pos.x)) return;
  //     if (this.need_to_move_player) return;
  //     let animTime = 400;
  //     if (Math.sqrt(Math.pow(Math.abs(pos.x - this.sprite.x), 2) +
  //       Math.pow(Math.abs(pos.y - this.sprite.y), 2)) < 2
  //     ) {
  //       animTime = 20
  //     }
  //     if (
  //       Math.sqrt(
  //         Math.pow(Math.abs(pos.x - this.sprite.x), 2) +
  //         Math.pow(Math.abs(pos.y - this.sprite.y), 2)
  //       ) < 20) {
  //         animTime = 100;
  //       }
  //     this.scene.tweens.add({
  //       targets: this.sprite,
  //       y: pos.y,
  //       x: pos.x,
  //       duration: animTime,
  //     }).on("start", () => {
  //       this.tween_animation_running = true;
  //       this.moving = true;
  //     }).on("complete", () => {
  //       this.tween_animation_running = false;
  //     })
  //   } catch (err) {
  //     console.log("error_in_line 796 in baseplayer ", err, this.sprite, pos)
  //   }

  // }
}
