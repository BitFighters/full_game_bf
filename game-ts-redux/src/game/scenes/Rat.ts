// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import phaserGame from "../../PhaserGame";
import store from "../../stores";
import { SetMintGameQuantity } from "../../stores/PlayerData";
import { ChangePath } from "../../stores/UserWebsiteStore";
import { createMomAnimations } from "../anims/createMomAnimations";
import KeyControls from "../services/KeyControls";
import Bootstrap from "./Bootstrap";
import { DEFAULT_RATS_DISPLAY_HEIGHT, DEFAULT_RATS_DISPLAY_WIDTH, DEFAULT_SPRITE_DISPLAY_HEIGHT } from "../configs";
import { DEFAULT_SMOKESCREEN_DISPLAY_HEIGHT, DEFAULT_SMOKESCREEN_DISPLAY_WIDTH } from "../configs";
import Phaser from 'phaser';
import { isNullOrUndefined } from "util";
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
    rats_uuid: Array<string>;
    rats_prize: Array<number>;
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

export interface IRat {
    key: string;
    gameObject: Rat;
    moving: boolean;
    uuid: string
}
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
export default class Rat {
    bootstrap!: Bootstrap;
    scene!: Phaser.Scene;
    sprite!: Phaser.GameObjects.Sprite;
    smokeScreen!: Phaser.GameObjects.Sprite;
    ratGibs!: Phaser.GameObjects.Sprite;
    anims!: Phaser.Animations.AnimationManager;
    silver_coin_sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    gold_coin_sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    ratContainer!: Phaser.GameObjects.Container;
    dead = false;
    deadAnim = false;
    show_coins = false;
    hideMouse = false;
    destroy_coin = false;
    gotHit = false;
    escaped = false;
    healthBar!: Phaser.GameObjects.Graphics;
    actualLastHealth!: number;
    healthReduced!: number;
    healthBarBackground!: Phaser.GameObjects.Graphics;
    staminaBarBackGround!: Phaser.GameObjects.Graphics;
    staminaBar!: Phaser.GameObjects.Graphics;

    currentHealth!: number;
    totalActualHealthValue!: number;
    totalHealthValue!: number;
    totalActualStaminaValue!: number;
    x!: number;
    y!: number;
    last_position_stored!: {
        x: number;
        y: number;
    };
    target_position_stored!: {
        x: number;
        y: number;
    };
    target_position_stored_after_hit!: {
        x: number;
        y: number;
    };
    tween_animation_running = false;
    gotHit_tween_animation_running = false;
    moving!: boolean;
    gotHitMoving = false;
    startingHealth!: number;
    // coin!: Coin;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string,
        nameOfAnimationKey: string,
        _health: number,
    ) {
        this.bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.currentHealth = _health;
        this.startingHealth = _health;
        this.anims = this.scene.anims;
        this.makeRat();
        // this.coin = new Coin(scene);

    }
    makeRat() {
        // console.log('COIN!!!!!!!!!!', this.coin);
        this.smokeScreen = this.scene.physics.add.sprite(this.x, this.y - DEFAULT_SMOKESCREEN_DISPLAY_HEIGHT / 2 + DEFAULT_RATS_DISPLAY_HEIGHT / 2, "smokeScreen");
        this.smokeScreen.displayHeight = DEFAULT_SMOKESCREEN_DISPLAY_HEIGHT;
        this.smokeScreen.displayWidth = DEFAULT_SMOKESCREEN_DISPLAY_WIDTH;

        this.ratGibs = this.scene.physics.add.sprite(this.x, this.y - DEFAULT_SMOKESCREEN_DISPLAY_HEIGHT / 2 + DEFAULT_RATS_DISPLAY_HEIGHT / 2, "smokeScreen");
        this.ratGibs.displayHeight = DEFAULT_SMOKESCREEN_DISPLAY_HEIGHT;
        this.ratGibs.displayWidth = DEFAULT_SMOKESCREEN_DISPLAY_WIDTH;
        this.ratGibs.visible = false;
        this.totalHealthValue = 10;
        this.sprite = this.scene.physics.add.sprite(this.x, this.y, "rat");
        // this.silver_coin_sprite = this.scene.physics.add.sprite(0, 0, "silver_coin");
        // this.silver_coin_sprite.displayHeight = 16;
        // this.silver_coin_sprite.displayWidth = 16;
        // this.silver_coin_sprite.play("rotate")
        this.sprite.displayHeight = DEFAULT_RATS_DISPLAY_HEIGHT;
        this.sprite.displayWidth = DEFAULT_RATS_DISPLAY_WIDTH;
        this.sprite.visible = false;
        this.ratContainer = this.scene.add.container(this.x, this.y - 10).setDepth(900000)
        this.healthBar = this.scene.add.graphics();
        this.healthBarBackground = this.scene.add.graphics()
        this.staminaBarBackGround = this.scene.add.graphics()
        this.staminaBar = this.scene.add.graphics();
        this.scene.physics.world.enable(this.ratContainer)
        this.makeAnims();
        this.smokeScreen.play("smokeScreen")
        this.sprite.play("idle")
        this.smokeScreen.on('animationupdate', (animation: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) => {
            if (animation.key === 'smokeScreen') {
                if (frame.index === 10) {
                    this.sprite.visible = true;
                }
            }
        }, this);
        this.smokeScreen.on('animationcomplete', (animation: Phaser.Animations.Animation) => {
            if (animation.key === 'smokeScreen') {
                this.smokeScreen.visible = false;

            }
        }, this);
        this.ratGibs.on('animationcomplete', (animation: Phaser.Animations.Animation) => {
            if (animation.key === 'ratGibs') {
                this.ratGibs.visible = false;

            }
        }, this);
        this.EnableHealthBars();

    }
    makeAnims() {

        this.scene.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNames("rat", { start: 3, end: 4 }),
            frameRate: 3,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'runStart',
            frames: this.anims.generateFrameNumbers('rat', { frames: [4, 5] }),
            frameRate: 6,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('rat', { frames: [6, 7] }),
            frameRate: 6,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'getHit',
            frames: this.anims.generateFrameNumbers('rat', { frames: [9, 1, 2, 3] }),
            frameRate: 12,
            repeat: 0
        });


        this.scene.anims.create({
            key: 'die',
            frames: this.anims.generateFrameNumbers('rat', { frames: [11, 8, 0] }),
            frameRate: 6,
            repeat: 0
        });
        //Smoke Screen
        this.scene.anims.create({
            key: 'smokeScreen',
            frames: this.scene.anims.generateFrameNames("smokeScreen", { start: 0, end: 13 }),
            frameRate: 12,
            repeat: 0
        });
        //Smoke Screen
        this.scene.anims.create({
            key: 'ratGibs',
            frames: this.scene.anims.generateFrameNames("ratGibs", { start: 0, end: 13 }),
            frameRate: 12,
            repeat: 0
        });

    }

    BaseUpdate() {
        this.ratContainer.x = this.sprite.x;
        this.ratContainer.y = this.sprite.y - 15;
        // this.silver_coin_sprite.x = this.sprite.x;
        // this.silver_coin_sprite.y = this.sprite.y;
        // this.silver_coin_sprite.setDepth(-1000)
        if (this.show_coins) {
            // this.DisableHealthBars()
            this.sprite.setDepth(-1000)
            // this.silver_coin_sprite.setDepth(this.sprite.y)
        }
        if (this.hideMouse) {
            // this.DisableHealthBars()
            this.sprite.setDepth(-1000)
            // this.silver_coin_sprite.setDepth(-1000)
        }
        if (this.destroy_coin) {
            this.sprite.setDepth(-1000)
            // this.silver_coin_sprite.setDepth(-1000)
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
        // this.sprite.play('idle');
        if (this.healthBar && healthVal <= 0) {
            this.healthBar.visible = false;
            return;
        }
        const outputLength = 20;
        const inputMaxLength = 40;
        const resultLength = healthVal * (outputLength / inputMaxLength)

        this.healthBar.clear()
        this.ratContainer.remove([this.healthBar, this.healthBarBackground]);
        this.healthBar.fillStyle(0x32CD32, 1);
        this.healthBar.fillRect(-10, 0, resultLength, 3);
        this.healthBarBackground.fillStyle(0xffffff, 1);
        this.healthBarBackground.fillRect(-10, 0, 20, 3);
        this.healthBar.y = -10;
        this.healthBarBackground.y = -10;
        if (this.ratContainer) {
            this.ratContainer.add([this.healthBarBackground, this.healthBar]);
        }

    }

    EnableHealthBars() {
        console.log(' RATS EnableHealthBars()')
        const outputLength = 20;
        const inputMaxLength = 40;
        // const resultLength = this.startingHealth

        this.healthBar.fillStyle(0x32CD32, 1);
        this.healthBar.fillRect(-10, 0, 20, 3);
        this.healthBarBackground.fillStyle(0xffffff, 1);
        this.healthBarBackground.fillRect(-10, 0, 20, 3);

        this.ratContainer.add([this.healthBarBackground]);
        this.ratContainer.add(this.healthBar);
        //    this.ratContainer.setInteractive();
    }

    DestroyGameObject() {
        //this is destroying the rat and coin because they are in the same container
        console.log(' RATS DestroyGameObject()')
        this.ratContainer.remove([this.healthBar, this.healthBarBackground]);
        this.smokeScreen.destroy();
        this.sprite.destroy();
        // this.silver_coin_sprite.destroy();
        this.ratContainer.destroy();

    }
    //Smoke screen on exit
    playSmokeScreen() {
        console.log(' RATS playSmokeScreen()')
        this.smokeScreen.x = this.sprite.x;
        this.smokeScreen.y = this.sprite.y - DEFAULT_SMOKESCREEN_DISPLAY_HEIGHT / 2 + DEFAULT_RATS_DISPLAY_HEIGHT / 2;
        this.smokeScreen.visible = true;
        this.smokeScreen.setDepth(9999);
        this.smokeScreen.play("smokeScreen");
        this.smokeScreen.on('animationupdate', (animation: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) => {
            if (animation.key === 'smokeScreen') {
                if (frame.index === 10) {
                    this.sprite.visible = false;
                }
            }
        }, this);
    }
    playRatGibs() {
        console.log(' RATS playRatGibs()')
        this.ratGibs.x = this.sprite.x;
        this.ratGibs.y = this.sprite.y - DEFAULT_SMOKESCREEN_DISPLAY_HEIGHT / 2 + DEFAULT_RATS_DISPLAY_HEIGHT / 2;
        this.ratGibs.visible = true;
        this.ratGibs.setDepth(9999);
        this.ratGibs.play("ratGibs");
    }
    DisableHealthBars() {
        console.log(' RATS DisableHealthBars()')
        this.ratContainer.remove([this.healthBarBackground, this.staminaBarBackGround]);
        this.ratContainer.remove(this.healthBar);
        this.ratContainer.remove(this.staminaBar);
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
            // if (isNullOrUndefined(this.target_position_stored.x)) {
            //     this.gotHitMoving = false;
            //     this.gotHit_tween_animation_running = false;
            //     return
            // }
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
        // this.scene.tweens.add({
        //     targets: this.sprite,
        //     x: { from: this.sprite.x, to: x, duration: 500, ease: 'Power1' },
        //     y: { from: this.sprite.y, to: y + DEFAULT_SPRITE_DISPLAY_HEIGHT / 4, duration: 500, ease: 'Power1' }
        // }).once("complete", () => {
        //     // this.silver_coin_sprite.setDepth(-1000)
        //     this.coin.playCoinGet();
        //     // this.sprite.destroy()
        // })
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
