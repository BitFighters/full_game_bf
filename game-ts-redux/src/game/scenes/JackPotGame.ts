// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import phaserGame from "../../PhaserGame";
import store from "../../stores";
import Bootstrap from "./Bootstrap";
import Game from "./Game";

export default class JackPotGame extends Phaser.Scene {
  wheel_anim!: Phaser.Tweens.Tween;
  bootstrap: Bootstrap;
  hq_game: Game;

  constructor() {
    super("jackpot");
    this.bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;
    this.hq_game = phaserGame.scene.keys.game as Game;
  }

  create() {
    // const div = document.getElementById('phaser-container');
    // if (div) {
    //   div.style.backgroundColor = "#4488AA";
    // }
    const jackpotMusic = this.sound.add("jackpotMusic", { volume: 0.5 });
    const jackpotSpin = this.sound.add("jackpotSpin", { volume: 0.5 });
    const jackpotWheelSpinSFX = this.sound.add("jackpotWheelSpinSFX", { volume: 0.3 });
    jackpotSpin.play({ loop: false });

    jackpotSpin.once('complete', () => {
      jackpotMusic.play({ loop: true });
    });
    const gameWidth = window.innerWidth;
    const gameHeight = window.innerHeight;
    const centerX = gameWidth / 2;
    const centerY = gameHeight / 2;

    const container = this.add.container(centerX, centerY - 50);

    const outerCircle = this.add.circle(0, 0, 330, 0x111b28);
    container.add(outerCircle);

    const wheel = this.add.graphics();
    container.add(wheel);

    container.y = centerY;

    const numberOfSegments = 100;
    const segmentAngle = (Math.PI * 2) / numberOfSegments;

    const radius = 300; // Increased segment radius for better visibility

    const numbers = [];
    // const lines = [];
    const pegs = [];

    const segmentTypes = [];
    for (let i = 1; i <= numberOfSegments; i++) {
      segmentTypes.push(i);
    }
    let currentTypeIndex = 0;

    // const cumulativeRotation = 0;

    // const colors = [
    //     0xff0000, // Red
    //     0x00ff00, // Green
    //     0xffff00, // Yellow
    //     0xff00ff, // Magenta
    //     0x00ffff, // Cyan
    //     0xffffff, // White
    // ];
    // const luckyNum = 100;
    const luckyNum = store.getState().playerDataStore.current_game_player_info.lucky_number;
    const luckyNumberText = this.add.text(gameWidth / 2 + 240, 60, "Your Lucky Number: " + luckyNum, {
      fontSize: "40px",
      color: "#FFFFFF",
      align: "center",
      stroke: "#000000",
      strokeThickness: 8,
    });
    luckyNumberText.setOrigin(1, 0);
    const goodLuckText = this.add.text(gameWidth / 2 - 120, 110, "Good Luck!", {
      fontSize: "40px",
      color: "#FFFFFF",
      align: "center",
      stroke: "#000000",
      strokeThickness: 8,
    });
    goodLuckText.setOrigin(0, 0);

    for (let i = 0; i < numberOfSegments; i++) {
      const startAngle = i * segmentAngle;
      const endAngle = (i + 1) * segmentAngle;

      const segmentType = segmentTypes[currentTypeIndex];

      const hue = (i / numberOfSegments) * 360;

      //Orange
      const shadePercentage = i / numberOfSegments;
      const segmentColor = getOrangeShade(shadePercentage);

      wheel.fillStyle(segmentColor, 1);
      wheel.beginPath();
      wheel.moveTo(0, 0);
      wheel.arc(0, 0, radius, startAngle, endAngle);
      wheel.closePath();
      wheel.fill();

      const line = this.add.line(0, 0, 0, -radius, 0, 0, 0x000000);
      line.setOrigin(0, 0);
      line.setRotation(startAngle - 4.02);
      container.add(line);

      const textRadius = radius * 0.88; // Adjust the distance from the center
      const textAngle = startAngle + segmentAngle / 2; // Middle of the segment

      const textX = Math.cos(textAngle) * textRadius;
      const textY = Math.sin(textAngle) * textRadius;

      const numberText = this.add.text(textX, textY, segmentType.toString(), {
        fontSize: "18px",
        color: "#000000",
        align: "center",
        fontStyle: "bold",
      });

      numberText.setOrigin(0.5);

      // Rotate the number to align with the middle of the segment
      numberText.setRotation(textAngle);

      numbers.push(numberText);
      container.add(numberText);

      const pegRadius = radius;
      const pegX = Math.cos(startAngle) * pegRadius;
      const pegY = Math.sin(startAngle) * pegRadius;
      const peg = this.add.circle(pegX, pegY, 4, 0xffffff);
      peg.setOrigin(0.5);
      pegs.push(peg);
      container.add(peg);
      currentTypeIndex = (currentTypeIndex + 1) % segmentTypes.length;
    }


    const innerCircle = this.add.circle(0, 0, 200, 0x111b28);
    container.add(innerCircle);

    const triangle = this.add.image(
      centerX,
      centerY - radius - 20,
      "jackpot_triangle"
    );
    triangle.setScale(1);
    triangle.setAngle(180);

    const bf = this.add.image(centerX, centerY, "jackpot_bf");
    bf.setScale(0.5);

    const winZone = this.add.circle(
      triangle.x,
      triangle.y + triangle.height / 2,
      4,
      0x00ff00
    );



    const spinButtonContainer = this.add.container(centerX, gameHeight - 100);

    // Create a graphics object for the beveled edge
    const bevelEdge = this.add.graphics();
    bevelEdge.fillStyle(0x111b28, 1);
    bevelEdge.fillRoundedRect(-100, -30, 200, 60, 20);
    bevelEdge.lineStyle(2, 0x111b28, 1);
    bevelEdge.strokeRoundedRect(-100, -30, 200, 60, 20);

    // Create the text for the spin button
    const spinButton = this.add.text(0, 0, "SPIN!", {
      fontSize: "40px",
      color: "#FFFFFF",
      fontStyle: 'bold',
      padding: {
        x: 20,
        y: 10,
      },
    });
    spinButton.setOrigin(0.5);


    // Add the beveled edge and the text to the container
    spinButtonContainer.add([bevelEdge, spinButton]);

    // Set the container interactive
    spinButtonContainer.setSize(200, 60); // Match this size to the bevelEdge size

    spinButtonContainer.on('pointerdown', () => {
      // Down state effect
    });
    spinButtonContainer.on('pointerup', () => {
      // Up state effect and startSpin function
    });
    spinButtonContainer.setInteractive({ useHandCursor: true });
    this.tweens.add({ targets: spinButtonContainer, scale: 1.2, duration: 800, yoyo: true, repeat: -1 });

    const winningNumberText = this.add.text(gameWidth - 50, 100, "", {
      fontSize: "24px",
      color: "#FFFFFF",
      align: "right",
    });
    winningNumberText.setOrigin(1, 0);

    let isSpinning = false;
    const desiredEndPosition = 270;
    const startSpin = () => {
      jackpotWheelSpinSFX.play({ loop: false });
      spinButtonContainer.destroy();


      if (!isSpinning) {
        // spinButton.setInteractive(false);
        // let winningSegment = Phaser.Math.Between(0, numberOfSegments - 1); // This is our predetermined segment
        const target =
          store.getState().websiteStateStore.jackpot_wheel_target_value;
        const winningSegment = target - 1; // This is our predetermined segment
        // winningNumberText.setText(`Target: ${target}`);
        // winningSegment+=1;
        // console.log("Winner will be: ", winningSegment+1);
        const segmentAngle = 360 / numberOfSegments;

        const offset = segmentAngle / 2; // to position the segment in the middle of the triangle (winZone)

        const winningAngle = segmentAngle * winningSegment + offset;

        // Determine the rotation needed to get the winning segment to end at the 12 o'clock position (270 degrees)
        // Also add rotations for any full spins
        // Determine the desired end position (12 o'clock = 270 degrees)

        // Calculate the rotation angle needed from the current position to align the winning segment with the desired end position
        const rotationDifference = desiredEndPosition - (winningAngle % 360);
        const fullSpins = 360 * 5;
        const rotationAngleNeeded = rotationDifference + fullSpins;

        // winningSegment += 1;

        isSpinning = true;
        this.wheel_anim = this.tweens.add({
          targets: container,
          angle: "+=" + rotationAngleNeeded,
          duration: 7000,
          ease: "Cubic.easeOut",
          onStart: () => {
            setInterval(() => (this.wheel_anim.timeScale -= 1 / 50), 1 * 1000);
          },
          onComplete: () => {
            isSpinning = false;
            setInterval(() => (jackpotMusic.stop()), 3000);

            this.hq_game.lobbySocketConnection.send(
              JSON.stringify({
                event: "jackpot_spin_hit",
                walletAddress: store.getState().web3store.userAddress,
              })
            );

            ///Please add to win and no win event

            //If player does not win then play dr bitz too bad
            /// jackpotMusic.stop();



            //If player does win
            ///   const congratulations = this.sound.add("congratulations", { volume: 0.5 });
            ///congratulations.play({ loop: false });


            // store.dispatch(ChangeFightAnnouncementMessageFromServer("You Win"))
            // store.dispatch(ChangeFightAnnouncementStateFromServer(true))
            // setTimeout(() => {
            //   store.dispatch(ChangeFightAnnouncementStateFromServer(false))
            // }, 5000)

            setTimeout(() => {
              this.bootstrap.pauseJackPot();
            }, 5000);
          },
        });
      }
    };
    function getOrangeShade(percentage: number) {
      const red = 255;
      const green = Math.round(165 * percentage); // Orange has a base green value of about 165
      const blue = 0;
      return (red << 16) + (green << 8) + blue;
    }

    spinButtonContainer.on("pointerup", startSpin);
  }
}
