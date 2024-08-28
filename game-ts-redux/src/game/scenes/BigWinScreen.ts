// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import phaserGame from "../../PhaserGame";
import store from "../../stores";
import PlayerData from "../../stores/PlayerData";
import Bootstrap from "./Bootstrap";
import Game from "./Game";

// const winAmount = 10000;
const gameWidth = window.innerWidth;
const gameHeight = window.innerHeight;
const centerX = gameWidth / 2;
const centerY = gameHeight / 2;

export default class BigWinScreen extends Phaser.Scene {
  wheel_anim!: Phaser.Tweens.Tween;
  bootstrap: Bootstrap;
  hq_game: Game;
  button: any;

  constructor() {
    console.log("--------win_screen_constructor----------");
    super("big_win_screen");
    this.bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;
    this.hq_game = phaserGame.scene.keys.game as Game;
  }

  preload() {
    this.load.image("bitz", "bitfgihter_assets/jackpot_assets/bitz.png");
  }

  create() {
    console.log("--------win_screen_create----------", store.getState().websiteStateStore.money_win_screen_target_value);
    const jackpotMusic = this.sound.add("jackpotMusic", { volume: 0.5 });
    const congratulations = this.sound.add("congratulations", { volume: 0.5 });
    congratulations.play({ loop: false });
    jackpotMusic.play({ loop: true });
    const getRandomColor = () => {
      const red = Phaser.Math.Between(0, 255);
      const green = Phaser.Math.Between(0, 255);
      const blue = Phaser.Math.Between(0, 255);
      return (red << 16) + (green << 8) + blue;
    };

    const scoreObj = { value: 0 };

    const SHOT_COUNT = 100;
    const SHOT_DELAY = 200;

    const graphics = this.add.graphics();
    graphics.fillStyle(0xffffff);

    const buttonWidth = 50;
    const buttonHeight = 50;
    const buttonX = (window.innerWidth - buttonWidth) / 2; // Centering the X position
    const buttonY = 800; // Centering the Y position
    const luckyNumber = store.getState().playerDataStore.current_game_player_info.lucky_number;
    // graphics.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

    this.button = this.add.zone(buttonX, buttonY, buttonWidth, buttonHeight).setOrigin(0, 0).setInteractive();

    //console.log("width ", gameWidth, " height ", gameHeight, " centerX ", centerX);

    const trigger = () => {
      const image = this.add.image(centerX, gameHeight / 2, "bitz").setScale(0.01); // Start from 1% of the real size
      this.tweens.add({
        targets: image,
        scale: 1.6,
        angle: 1080,
        duration: 3000,
        ease: "Power2",
        callbackScope: this, // St the callbackScope to this (the Phaser scene) before defining onComplete
      });

      let shotCount = 0;
      const timer = this.time.addEvent({
        delay: SHOT_DELAY, // time in ms before the next shot
        callback: () => {
          for (let i = 0; i < 200; i++) {
            shootSquare.call(this);
          }
          shotCount++; // Increase the shot count

          if (shotCount >= SHOT_COUNT) {
            timer.remove(); // If we've reached the desired shot count, stop shooting
          }
        },
        repeat: SHOT_COUNT - 1, // Number of times to repeat. Set to SHOT_COUNT - 1 since the first shot is immediate
      });

      const text = this.add
        .text(centerX, gameHeight / 2, "You Win!", {
          font: '240px "Cooper Black"',
          stroke: "#FF0000", // Red stroke/border color
          strokeThickness: 15,
        })
        .setOrigin(0.5, 0.5) // Center the text's origin
        .setScale(0.01); // Start from 1% of the real size

      // Tween to enlarge the text
      this.tweens.add({
        targets: text,
        scale: 1,
        duration: 6000,
        ease: "Power2",
        callbackScope: this,

      });

      scoreObj.value = 0;
      const scoreText = this.add
        .text(centerX, gameHeight / 2 + 200, "", {
          font: '140px "Cooper Black"',
          // fill: "#FFFF00",
          stroke: "#FF0000",
          strokeThickness: 5,
        })
        .setOrigin(0.5, 0.5);

      // Just to be sure, bring the scoreText to the top
      scoreText.setDepth(1);

      // Use a tween to change the scoreObj.value from 0 to targetValue over the duration
      this.tweens.add({
        targets: scoreObj,
        value: store.getState().websiteStateStore.money_win_screen_target_value,
        duration: 5000, // 5 seconds
        ease: "Linear",
        onUpdate: function () {
          console.log(scoreObj.value);
          const formattedValue = formatNumberWithCommas(Math.round(scoreObj.value));
          scoreText.setText(formattedValue + " Bits!");
        },
        callbackScope: this,
        onComplete: () => {
          this.time.delayedCall(3000, () => {
            image.destroy();
            text.destroy();
            scoreText.destroy();
            setInterval(() => (jackpotMusic.stop()), 14000);
          });
        },
      });
    };

    function formatNumberWithCommas(x: any) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const shootSquare = () => {
      const xEndPosition = Phaser.Math.Between(0, gameWidth);
      const xPosition = this.button.x + this.button.width;
      const yPosition = this.button.y;
      const squareGraphics = this.add.graphics({ x: xPosition, y: yPosition });

      // Set a random fill color for the square
      squareGraphics.fillStyle(getRandomColor());
      squareGraphics.fillRect(0, 0, 4, 4);

      // Determine the random apex point
      const apexY = Phaser.Math.Between(10, 300);
      this.tweens.add({
        targets: squareGraphics,
        x: xEndPosition,
        y: apexY,
        ease: "Power2",
        duration: 500,
        onComplete: (tween, targets) => {
          const square = targets[0];
          const fallDuration = Phaser.Math.Between(1000, 3000); // Randomizing fall duration
          // Start descending after reaching apex with a natural falling effect
          this.tweens.add({
            targets: square,
            y: gameHeight,
            ease: "Quadratic.Out",
            duration: fallDuration, // Using the randomized duration
            onComplete: function () {
              square.destroy();
            },
          });
        },
        callbackScope: this,
      });
    };

    // this.button.on("pointerdown", trigger);

    setTimeout(() => {
      trigger();
    }, 1000);
  }
}
