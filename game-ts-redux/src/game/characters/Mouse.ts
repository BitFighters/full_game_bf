import { DEFAULT_RATS_DISPLAY_HEIGHT, DEFAULT_RATS_DISPLAY_WIDTH, DEFAULT_SPRITE_DISPLAY_HEIGHT } from "../configs";

import { isNullOrUndefined } from "util";
import phaserGame from "../../PhaserGame";
import Bootstrap from "../scenes/Bootstrap";
import CreateRatsAnims from "../anims/createRatsAnims";
export interface IPosition {
  x: number;
  y: number;
}

export enum RatState {
  ALIVE = 10,
  DEAD = 20,
  TURN_TO_COINS = 30,
  COIN_PICKED = 40,
  COIN_END = 50,
  COINS_FELL = 60,
  HIT = 70,
  RUN_AWAY = 80
}

export interface IRatsStateManager {
  rats_launch_start: boolean;
  rats_lauched: boolean;
  rats_count: number;
  rats_launch_time: number;
  rats_positiions: Array<IPosition>;
  rats_orientations: Array<string>;
  rats_state: Array<RatState>;
  rats_health: Array<number>;
  rats_coins: Array<number>;
  rats_last_health: Array<number>;
  track_movement: Array<number>;
}

export interface IMouse {
  key: string;
  gameObject: Mouse;
  moving: boolean,
}

export class Mouse {
  scene: Phaser.Scene;
  //public sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public sprite: Phaser.GameObjects.Sprite
  public silver_coin_sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public gold_coin_sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public playerContainer!: Phaser.GameObjects.Container
  public dead = false;
  public show_coins = false;
  public hideMouse = false;
  public destroy_coin = false;
  healthBar!: Phaser.GameObjects.Graphics;
  actualLastHealth!: number;
  healthReduced!: number;
  healthBarBackground!: Phaser.GameObjects.Graphics;
  staminaBarBackGround!: Phaser.GameObjects.Graphics;
  staminaBar!: Phaser.GameObjects.Graphics;
  bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;




  // health related
  totalHealthValue: number
  gotHit = false

  //
  currentHealth!: number;

  // 
  totalActualHealthValue!: number;
  totalActualStaminaValue!: number;

  public last_position_stored!: {
    x: number;
    y: number
  }

  public target_position_stored!: {
    x: number;
    y: number
  }

  public target_position_stored_after_hit!: {
    x: number;
    y: number
  }

  public tween_animation_running = false;
  public gotHit_tween_animation_running = false;
  public moving!: boolean;
  public gotHitMoving = false;
  startingHealth: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    nameOfAnimationKey: string,
    _health: number,
  ) {
    this.totalHealthValue = 10;
    this.currentHealth = _health;
    this.startingHealth = _health;
    this.scene = scene;
    this.sprite = this.scene.physics.add.sprite(x, y, "rat");
    this.sprite.play("idle")
    this.silver_coin_sprite = this.scene.physics.add.sprite(0, 0, "silver_coin");
    this.silver_coin_sprite.displayHeight = 16;
    this.silver_coin_sprite.displayWidth = 16;

    this.silver_coin_sprite = this.scene.physics.add.sprite(0, 0, "silver_coin");
    this.silver_coin_sprite.displayHeight = 10;
    this.silver_coin_sprite.displayWidth = 10;
    this.sprite.play(nameOfAnimationKey)
    this.silver_coin_sprite.play("rotate")

    // setTimeout(() => {
    //   this.sprite.play(nameOfAnimationKey)
    //   this.silver_coin_sprite.play("rotate")
    // }, 100)

    this.sprite.displayHeight = DEFAULT_RATS_DISPLAY_HEIGHT;
    this.sprite.displayWidth = DEFAULT_RATS_DISPLAY_WIDTH;
    this.playerContainer = this.scene.add.container(x, y - 10).setDepth(900000)
    this.healthBar = this.scene.add.graphics();
    this.healthBarBackground = this.scene.add.graphics()
    this.staminaBarBackGround = this.scene.add.graphics()
    this.staminaBar = this.scene.add.graphics();
    this.scene.physics.world.enable(this.playerContainer)
  }

  BaseUpdate() {
    this.playerContainer.x = this.sprite.x;
    this.playerContainer.y = this.sprite.y - 15;
    this.silver_coin_sprite.x = this.sprite.x;
    this.silver_coin_sprite.y = this.sprite.y;
    this.silver_coin_sprite.setDepth(-1000)
    if (this.show_coins) {
      this.DisableHealthBars()
      this.sprite.setDepth(-1000)
      this.silver_coin_sprite.setDepth(this.sprite.y)
    }
    if (this.hideMouse) {
      this.DisableHealthBars()
      this.sprite.setDepth(-1000)
      this.silver_coin_sprite.setDepth(-1000)
    }
    if (this.destroy_coin) {
      this.sprite.setDepth(-1000)
      this.silver_coin_sprite.setDepth(-1000)
    }
    if (!isNullOrUndefined(this.target_position_stored)) {
      if (this.gotHit) {
        this.SmoothMovement(200)
      } else {
        this.SmoothMovement()
      }
    }
    this.UpdateHealthBar(this.currentHealth)
  }

  UpdateHealthBar(healthVal: number, reduceHealth = false) {

    this.sprite.play('idle');
    if (healthVal <= 0) {
      this.healthBar.destroy();
      this.healthBarBackground.destroy();
      if (!this.dead) {
        const randomNumber = Math.floor(Math.random() * 4) + 1;
        console.log('RatState.DEAD randomNumber ', randomNumber);
        switch (randomNumber) {
          case 1:
            this.bootstrap.play_ratDie1_sound();

            break;
          case 2:
            this.bootstrap.play_ratDie2_sound();
            break;
          case 3:
            this.bootstrap.play_ratDie3_sound();
            break;
          case 4:
            this.bootstrap.play_ratDie4_sound();
            break;
          default:
            break;
        }
      }
      return;
    }
    const outputLength = 20;
    const inputMaxLength = 40;
    const resultLength = healthVal * (outputLength / inputMaxLength)

    this.healthBar.clear()
    this.playerContainer.remove([this.healthBar, this.healthBarBackground]);
    this.healthBar.fillStyle(0x32CD32, 1);
    this.healthBar.fillRect(-10, 0, resultLength, 3);
    this.healthBarBackground.fillStyle(0xffffff, 1);
    this.healthBarBackground.fillRect(-10, 0, 20, 3);
    this.healthBar.y = -10;
    this.healthBarBackground.y = -10;
    this.playerContainer.add([this.healthBarBackground, this.healthBar]);
  }

  EnableHealthBars() {
    const outputLength = 20;
    const inputMaxLength = 40;
    // const resultLength = this.startingHealth

    this.healthBar.fillStyle(0x32CD32, 1);
    this.healthBar.fillRect(-10, 0, 20, 3);
    this.healthBarBackground.fillStyle(0xffffff, 1);
    this.healthBarBackground.fillRect(-10, 0, 20, 3);

    this.playerContainer.add([this.healthBarBackground]);
    this.playerContainer.add(this.healthBar);
    this.playerContainer.setInteractive();
  }

  DestroyGameObject() {
    this.playerContainer.remove([this.healthBar, this.healthBarBackground]);
    this.sprite.destroy()
    this.silver_coin_sprite.destroy()
    this.playerContainer.destroy()
    this.DisableHealthBars()
  }

  DisableHealthBars() {
    // console.log('  DisableHealthBars()')
    this.playerContainer.remove([this.healthBarBackground, this.staminaBarBackGround]);
    this.playerContainer.remove(this.healthBar);
    this.playerContainer.remove(this.staminaBar);
  }

  PopHealthReduced(amount: number, color = "") {
    const randomSign = Math.random();
    const randomX = Math.sign(randomSign - 0.5) * Math.random() * 30;
    const randomY = 5 + Math.random() * 2;
    let healthsprite: Phaser.GameObjects.Text;
    try {
      healthsprite = this.scene.add
        .text(this.sprite.x, this.sprite.y - 15, amount.toString())
        .setFontFamily('monospace')
        .setFontSize(54 + amount * 4)
        .setScale(0.2)
        .setColor('#fefefe')
        .setOrigin(0.5)
        .setStroke('#6a6565', 10)

      const randomSign = Math.random();
      const randomX = Math.sign(randomSign - 0.5) * Math.random() * 30;
      const randomY = 5 + Math.random() * 25;

      // let temp = healthsprite;

      this.scene.tweens.add({
        targets: healthsprite,
        y: this.sprite.y - 30,
        x: this.sprite.x + Math.sign(randomSign - 0.5) * Math.random() * 30,
        duration: 500,
      }).on("complete", () => {
        healthsprite.destroy()
      })
    } catch (err) {
      console.log("error in PopHealthReduced -->", err)
    }
  }

  SmoothMovement(forceAnimTime = 0) {
    if (this.gotHitMoving) return;
    if (
      (Math.abs(this.target_position_stored.x - this.sprite.x) < 2)
      && (Math.abs(this.target_position_stored.y - this.sprite.y) < 2)
    ) {
      this.tween_animation_running = false;
      this.moving = false;
      return
    }
    let animationTime = Math.abs(this.target_position_stored.x - this.sprite.x) * (Math.random() * 40 + 10)
    // console.log("SmoothMovement ", this.target_position_stored.x, this.sprite.x )
    if (forceAnimTime > 0) {
      animationTime = forceAnimTime;
    }
    this.moving = false;
    if (this.tween_animation_running) {
      this.moving = true;
      return
    }
    try {
      if (isNullOrUndefined(this.target_position_stored.x)) {
        this.moving = false;
        this.tween_animation_running = false;
        return
      }
      this.scene.tweens.add({
        targets: this.sprite,
        y: this.target_position_stored.y,
        x: this.target_position_stored.x,
        duration: animationTime,
      }).on("start", () => {
        this.tween_animation_running = true;
        this.moving = true;
      }).on("complete", () => {
        this.tween_animation_running = false;
        this.moving = false;
        this.sprite.setTint(0xffffff)
      })
    } catch (err) {
      console.log("error_in_line 790 in baseplayer ", err, this.sprite, this.target_position_stored)
    }

  }

  SmoothGotHitMovement() {
    if (this.moving) return;
    if (
      (Math.abs(this.target_position_stored.x - this.sprite.x) < 2)
      && (Math.abs(this.target_position_stored.y - this.sprite.y) < 2)
    ) {
      this.gotHit_tween_animation_running = false;
      this.gotHitMoving = false;
      return
    }
    const animationTime = Math.abs(this.target_position_stored.x - this.sprite.x) * 30
    // console.log("SmoothMovement ", this.target_position_stored.x, this.sprite.x )
    this.gotHitMoving = false;
    if (this.gotHit_tween_animation_running) {
      this.gotHitMoving = true;
      return
    }
    try {
      if (isNullOrUndefined(this.target_position_stored.x)) {
        this.gotHitMoving = false;
        this.gotHit_tween_animation_running = false;
        return
      }
      this.scene.tweens.add({
        targets: this.sprite,
        y: this.target_position_stored.y,
        x: this.target_position_stored.x,
        duration: animationTime,
      }).on("start", () => {

        this.gotHit_tween_animation_running = true;
        this.gotHitMoving = true;
      }).on("complete", () => {
        this.gotHit_tween_animation_running = false;
        this.gotHitMoving = false;
        this.sprite.setTint(0xffffff)
        console.log("RAT HIT!");
        this.bootstrap.play_uhOh_sound()
        this.sprite.play("run")
      })
    } catch (err) {
      console.log("error_in_line 790 in baseplayer ", err, this.sprite, this.target_position_stored)
    }

  }

  MagnetMoveItem(x: number, y: number) {
    this.scene.tweens.add({
      targets: this.sprite,
      x: { from: this.sprite.x, to: x, duration: 500, ease: 'Power1' },
      y: { from: this.sprite.y, to: y + DEFAULT_SPRITE_DISPLAY_HEIGHT / 4, duration: 500, ease: 'Power1' }
    }).once("complete", () => {
      this.silver_coin_sprite.setDepth(-1000)
      // this.sprite.destroy()
    })
  }

  // GotHitMovement(targetPos: {x: number; y: number;}, animationTime = 400) {
  //   if (this.moving) return;
  //   this.gotHitMoving = false;
  //   if (this.gotHit_tween_animation_running) {
  //     this.gotHitMoving = true;
  //     return
  //   }
  //   this.target_position_stored = targetPos;
  //   try {
  //     if (isNullOrUndefined(targetPos.x)) {
  //       this.gotHitMoving = false;
  //       return
  //     }
  //     this.scene.tweens.add({
  //       targets: this.sprite,
  //       x: targetPos.x,
  //       duration: animationTime,
  //     }).on("start", () => {
  //       this.gotHit_tween_animation_running = true;
  //       this.gotHitMoving = true;
  //     }).on("complete", () => {
  //       console.log("got hit moving mouse ")
  //       this.sprite.x = targetPos.x;
  //       this.sprite.y = targetPos.y;
  //       this.gotHit_tween_animation_running = false;
  //       this.gotHitMoving = false;
  //     })
  //   } catch (err) {
  //     console.log("error_in_line 280 in mouse ", err, this.sprite, targetPos)
  //   }
  // }
}