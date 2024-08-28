// @ts-nocheck
/* eslint @typescript-eslint/no-explicit-any: off */
/* eslint @typescript-eslint/no-unused-vars: off */

import Phaser from "phaser";
import Background from "./game/scenes/Background";
import BigWinScreen from "./game/scenes/BigWinScreen";
import Bootstrap from "./game/scenes/Bootstrap";
import Game from "./game/scenes/Game";
import JackPotGame from "./game/scenes/JackPotGame";
import MintingGame from "./game/scenes/MintingGame";
import Rat from "./game/scenes/Rat";

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    backgroundColor: "#111b28",
    seed: [ (Date.now() * Math.random()).toString() ],
    scale: {
        parent: "phaser-container",
        mode: Phaser.Scale.RESIZE,
        width: window.innerWidth,
        height: window.innerHeight,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: "arcade",
        arcade: {
            // @ts-ignore: Ignore more errors as needed
            gravity: { y: 0 },
            debug: false,
            // fps: 30,
        },
    },
    render:{
        pixelArt: true,
        roundPixels: true
    },
    fps: {
        target: 60,
        forceSetTimeOut: true,
    },
    disableContextMenu: true,
    autoFocus: true,
    scene: [
        Bootstrap, 
        Background,
        MintingGame, 
        Game, 
        JackPotGame, 
        BigWinScreen
    ],
    input: {
        activePointers: 3
    }
};

const phaserGame = new Phaser.Game(config);
(window as any).game = phaserGame;

export default phaserGame;
