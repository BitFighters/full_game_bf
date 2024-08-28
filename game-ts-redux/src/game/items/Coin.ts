// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */


//Coin.ts
import phaserGame from '../../PhaserGame'
import Phaser from 'phaser';
import Bootstrap from "../scenes/Bootstrap";
import Game from "../scenes/Game";
import { DEFAULT_SPRITE_DISPLAY_HEIGHT } from '../configs';


export interface ICoin {
    gameObject: Coin
    item_id: string
    x: number;
    y: number
}

export default class Coin {
    scene: Phaser.Scene;
    game: Game;
    bootstrap: Bootstrap;
    coinDrop: Phaser.Sound.BaseSound | null = null;
    coinGet: Phaser.Sound.BaseSound | null = null;

    // silver_coin_sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    public silver_coin_sprite: Phaser.GameObjects.Sprite


    constructor(scene: Phaser.Scene, x: any, y: any) {
        console.log("items_update_creating rat")
        this.scene = scene;
        this.game = phaserGame.scene.keys.game as Game;
        this.bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;
        this.coinDrop = this.scene.sound.add("coinDrop", { volume: 0.5 });
        this.coinGet = this.scene.sound.add("coinGet", { volume: 0.5 });


        this.silver_coin_sprite = this.scene.physics.add.sprite(x, y, "silver_coin");
        this.silver_coin_sprite.displayHeight = 16;
        this.silver_coin_sprite.displayWidth = 16;
        this.silver_coin_sprite.play("rotate")

        this.silver_coin_sprite.x = x
        this.silver_coin_sprite.y = y
        this.silver_coin_sprite.setDepth(1000)
        console.log("items_update_creating rat", this.silver_coin_sprite, this.silver_coin_sprite.x, this.silver_coin_sprite.y)

        this.playCoinDrop()
    }


    create() {

        console.log("create coin")

    }
    playCoinDrop() {
        if (this.coinDrop && !this.coinDrop.isPlaying) {
            this.coinDrop.play({ loop: false });
        }
    }

    playCoinGet() {
        if (this.coinGet) {
            this.coinGet.play({ loop: false });
        }
    }

    coinDestroy() {
        this.silver_coin_sprite.destroy()
    }

    MagnetMoveItem(x: number, y: number) {
        this.scene.tweens.add({
            targets: this.silver_coin_sprite,
            x: { from: this.silver_coin_sprite.x, to: x, duration: 500, ease: 'Power1' },
            y: { from: this.silver_coin_sprite.y, to: y + DEFAULT_SPRITE_DISPLAY_HEIGHT / 4, duration: 500, ease: 'Power1' }
        }).once("complete", () => {
            this.silver_coin_sprite.setDepth(-1000)
            this.playCoinGet();
            this.silver_coin_sprite.destroy()
        })
    }



}
