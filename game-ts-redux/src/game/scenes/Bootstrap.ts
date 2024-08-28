// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import Phaser from "phaser";
import store from "../../stores";

import { SetGameStarted } from "../../stores/PlayerData";
import { ShowWinnerCardAtFightEnd } from "../../stores/UserWebsiteStore";
import { SetShowingJackpotWheel } from "../../stores/WebsiteStateStore";

enum BackgroundMode {
  DAY,
  NIGHT,
}

export default class Bootstrap extends Phaser.Scene {
  select_music!: Phaser.Sound.BaseSound;
  err_music!: Phaser.Sound.BaseSound;
  snap_sound!: Phaser.Sound.BaseSound;
  button_press_sound!: Phaser.Sound.BaseSound;
  dr_bits_success_sound!: Phaser.Sound.BaseSound;
  button_hover_sound!: Phaser.Sound.BaseSound;
  button_down_sound!: Phaser.Sound.BaseSound;
  can_open_sound!: Phaser.Sound.BaseSound;
  dr_bits_tooBad_sound!: Phaser.Sound.BaseSound;
  uhOh_sound!: Phaser.Sound.BaseSound;
  ratDie1_sound!: Phaser.Sound.BaseSound;
  ratDie2_sound!: Phaser.Sound.BaseSound;
  ratDie3_sound!: Phaser.Sound.BaseSound;
  ratDie4_sound!: Phaser.Sound.BaseSound;

  constructor() {
    super("bootstrap");
    console.log("running constructor bootstrap.. ");
  }

  preload() {

    console.log("running preload of bootstrap.. ");
    // this.load.atlas(
    //   'cloud_day',
    //   'assets/background/cloud_day.png',
    //   'assets/background/cloud_day.json'
    // )
    // this.load.image('backdrop_day', 'assets/background/backdrop_day.png')
    // this.load.atlas(
    //   'cloud_night',
    //   'assets/background/cloud_night.png',
    //   'assets/background/cloud_night.json'
    // )
    // this.load.image('backdrop_night', 'assets/background/backdrop_night.png')
    // this.load.image('sun_moon', 'assets/background/sun_moon.png')

    // load town map
    // this.load.tilemapTiledJSON("map", 'bitfgihter_assets/new2.json')
    // this.load.image("tiles", 'bitfgihter_assets/LobbyTown.png')
    // this.load.image("club1", 'bitfgihter_assets/LobbyTown/Buildings/CLUB.png')
    // this.load.image("wall", 'bitfgihter_assets/LobbyTown/wall.png')
    this.load.image("chat_bubble", "bitfgihter_assets/chat_bubble.png");
    this.load.image(
      "cloud_chat_bubble",
      "bitfgihter_assets/cloud_chat_bubble.png"
    );
    this.load.image("info_icon", "bitfgihter_assets/info_icon.png");
    this.load.image("beginner_icon", "bitfgihter_assets/player/beginner.png");

    this.load.image("joyA", "bitfgihter_assets/joystick/joyA.png");
    this.load.image("joyB", "bitfgihter_assets/joystick/joyB.png");
    
    this.load.image("brew-can", "bitfgihter_assets/brew/BREW.png");
    // load Rat Sounds
    this.load.audio("uhOh_sound", "bitfgihter_assets/sounds/rats/uhOh.mp3");
    this.load.audio("ratDie1_sound", "bitfgihter_assets/sounds/rats/ratDie1.mp3");
    this.load.audio("ratDie2_sound", "bitfgihter_assets/sounds/rats/ratDie2.mp3");
    this.load.audio("ratDie3_sound", "bitfgihter_assets/sounds/rats/ratDie3.mp3");
    this.load.audio("ratDie4_sound", "bitfgihter_assets/sounds/rats/ratDie4.mp3");
    // load Rat Sprites
    //this.load.spritesheet("rat_sheet", "bitfgihter_assets/rat-sprite.png");

    // load Dr. Bitz Voices
    this.load.audio("jackpotSpin", "bitfgihter_assets/sounds/drBitz/jackpotSpin.mp3");
    this.load.audio("dr_bits_tooBad_sound", "bitfgihter_assets/sounds/drBitz/tooBad.mp3");
    this.load.audio("congratulations", "bitfgihter_assets/sounds/drBitz/congratulations.mp3");
    // load music
    this.load.audio("jackpotMusic", "bitfgihter_assets/sounds/gameMusic/jackpotMusic.mp3");
    // load sound FX
    this.load.audio("jackpotWheelSpinSFX", "bitfgihter_assets/sounds/soundFX/jackpotWheelSpinSFX.mp3");
    this.load.audio(
      "select_music",
      "bitfgihter_assets/sounds/select_sound.mp3"
    );
    // load Sound FX
    this.load.audio("err_music", "bitfgihter_assets/sounds/err_sound.mp3");
    this.load.audio("punch1-music", "bitfgihter_assets/sounds/punch01.mp3");
    this.load.audio("punch2-music", "bitfgihter_assets/sounds/punch02.mp3");
    this.load.audio("coinGet", "bitfgihter_assets/sounds/soundFX/coinGet.mp3");
    this.load.audio("coinDrop", "bitfgihter_assets/sounds/soundFX/coinDrop.mp3");
    // this.load.audio("fight-music", "bitfgihter_assets/sounds/fight-track.mp3")
    // fight musics
    this.load.audio(
      "fight-music-1",
      "bitfgihter_assets/sounds/new_fight_tracks/Ayumi.mp3"
    );
    this.load.audio(
      "fight-music-2",
      "bitfgihter_assets/sounds/new_fight_tracks/BullDancer.mp3"
    );
    this.load.audio(
      "fight-music-3",
      "bitfgihter_assets/sounds/new_fight_tracks/Deeper.mp3"
    );
    this.load.audio(
      "fight-music-4",
      "bitfgihter_assets/sounds/new_fight_tracks/Destined.mp3"
    );
    this.load.audio(
      "fight-music-5",
      "bitfgihter_assets/sounds/new_fight_tracks/Detroit.mp3"
    );
    this.load.audio(
      "fight-music-6",
      "bitfgihter_assets/sounds/new_fight_tracks/Haiba.mp3"
    );
    this.load.audio(
      "fight-music-7",
      "bitfgihter_assets/sounds/new_fight_tracks/Maji_Break.mp3"
    );
    this.load.audio(
      "fight-music-8",
      "bitfgihter_assets/sounds/new_fight_tracks/penguins_on_ice.mp3"
    );
    this.load.audio(
      "fight-music-9",
      "bitfgihter_assets/sounds/new_fight_tracks/run_with_me.mp3"
    );
    this.load.audio(
      "fight-music-10",
      "bitfgihter_assets/sounds/new_fight_tracks/Wolfpack.mp3"
    );

    this.load.audio("boop-music", "bitfgihter_assets/sounds/boop01.mp3");
    this.load.audio(
      "fight-start-music",
      "bitfgihter_assets/sounds/fight_start_sound.mp3"
    );
    this.load.audio("snap-sound", "bitfgihter_assets/sounds/snap01.mp3");
    this.load.audio(
      "button-press-sound",
      "bitfgihter_assets/sounds/button01.mp3"
    );

    this.load.audio(
      "can-open-sound",
      "bitfgihter_assets/sounds/brewCanOpen.mp3"
    );

    this.load.audio(
      "dr_bits_success_sound",
      "bitfgihter_assets/sounds/Success.mp3"
    );

    this.load.audio("swing-sound-1", "bitfgihter_assets/sounds/swing01.mp3");
    this.load.audio("swing-sound-2", "bitfgihter_assets/sounds/swing02.mp3");
    this.load.audio("swing-sound-3", "bitfgihter_assets/sounds/swing03.mp3");
    this.load.audio("swing-sound-4", "bitfgihter_assets/sounds/swing04.mp3");

    // this.load.audio("coins_drop", "bitfgihter_assets/sounds/coins_drop.mp3");
    // this.load.audio(
    //   "coins_collect",
    //   "bitfgihter_assets/sounds/coins_collect.mp3"
    // );

    this.load.audio("button_hover", "bitfgihter_assets/sounds/buttonHover.wav");
    this.load.audio("button_down", "bitfgihter_assets/sounds/buttonDown.mp3");

    // load css
    // this.load.css('80s', 'bitfgihter_assets/80stypography.css');


    ///////////////////////////////////////////////////////////////////////////////
    //HQ Map Stuff
    ///////////////////////////////////////////////////////////////////////////////
    this.load.tilemapTiledJSON("hq.json", "new_assets/map/HQ.json");
    //this.load.tilemapTiledJSON("hqXmas.json", "new_assets/map/xMasHQ.json");
    this.load.image("hq_sprite_sheet", "new_assets/map/HQ_Sprite_Sheet_Extruded.png");
    this.load.image("xmas_sprite_sheet", "new_assets/map/xMas_Sprite_Sheet_Extruded.png");
    ///////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////

    // this.load.atlas(
    //   "rat",
    //   "bitfgihter_assets/rats-spritesheet.png",
    //   "bitfgihter_assets/rats-spritesheet.json"
    // );
    this.load.spritesheet("rat", "bitfgihter_assets/rats-spritesheet.png", { frameWidth: 52, frameHeight: 40 });
    this.load.spritesheet("smokeScreen", "bitfgihter_assets/FX/smokeScreen.png", { frameWidth: 150, frameHeight: 200 });
    this.load.spritesheet("ratGibs", "bitfgihter_assets/FX/ratGibs.png", { frameWidth: 150, frameHeight: 200 });

    // coins
    this.load.atlas(
      "silver_coin",
      "bitfgihter_assets/silver_coin.png",
      "bitfgihter_assets/silver_coin.json"
    );

    // jackpot assets load..
    this.load.image(
      "jackpot_triangle",
      "bitfgihter_assets/jackpot_assets/triangle.png"
    );
    this.load.image("jackpot_bf", "bitfgihter_assets/jackpot_assets/bf.png");

    //Joystick
    this.load.image('joyA','bitfgihter_assets/joystick/joyA.png');
    this.load.image('joyB','bitfgihter_assets/joystick/joyB.png');
  }

  async readFileAsync(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new window.FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = reject;

      reader.readAsDataURL(file);
    });
  }

  init() {
    // const dispatch = useAppDispatch();
    // this.network = new Network()
  }
  get_Rat_Sheet() {
    return "rat_sheet";
  }
  //Rat Sounds
  play_uhOh_sound() {
    this.uhOh_sound.play({ loop: false });
  }
  play_ratDie1_sound() {
    this.ratDie1_sound.play({ loop: false });
  }
  play_ratDie2_sound() {
    this.ratDie2_sound.play({ loop: false });
  }
  play_ratDie3_sound() {
    this.ratDie3_sound.play({ loop: false });
  }
  play_ratDie4_sound() {
    this.ratDie4_sound.play({ loop: false });
  }
  //Menu Sounds
  play_select_sound() {
    try {
      this.select_music.play({ loop: false });
    } catch (err) {
      console.log("error ", err);
    }
  }

  play_err_sound() {
    this.err_music.play({ loop: false });
  }

  play_snap_sound() {
    this.snap_sound.play({ loop: false });
  }

  play_button_press_sound() {
    console.log("pressed play_button_press_sound");
    if (this.button_press_sound.isPlaying) return;
    this.button_press_sound.play({ loop: false });
  }

  play_can_open_sound() {
    this.can_open_sound.play({ loop: false });
  }

  create() {
    console.log("running create of bootstrap.. ");
    this.launchBackground(BackgroundMode.NIGHT);
    this.select_music = this.sound.add("select_music");
    this.err_music = this.sound.add("button_hover");
    this.snap_sound = this.sound.add("snap-sound");
    this.can_open_sound = this.sound.add("can-open-sound", { volume: 0.05 });
    //Rats
    this.uhOh_sound = this.sound.add("uhOh_sound", { volume: 0.25 });
    this.ratDie1_sound = this.sound.add("ratDie1_sound", { volume: 0.25 });
    this.ratDie2_sound = this.sound.add("ratDie2_sound", { volume: 0.25 });
    this.ratDie3_sound = this.sound.add("ratDie3_sound", { volume: 0.25 });
    this.ratDie4_sound = this.sound.add("ratDie4_sound", { volume: 0.25 });
    //Dr Bitz
    this.dr_bits_tooBad_sound = this.sound.add("dr_bits_tooBad_sound", { volume: 0.5 });
    this.dr_bits_success_sound = this.sound.add("dr_bits_success_sound");
    // this.button_hover_sound = this.sound.add('button_hover', {volume: 0.4})
    this.button_press_sound = this.sound.add("button-press-sound");
    this.button_hover_sound = this.sound.add("select_music", { volume: 0.2 });
    this.button_down_sound = this.sound.add("button_down", { volume: 0.5 });
  }

  play_dr_bits_success_sound() {
    if (this.dr_bits_success_sound.isPlaying) return;
    this.dr_bits_success_sound.play({ loop: false });
  }
  play_dr_bits_too_bad_sound() {
    if (this.dr_bits_tooBad_sound.isPlaying) return;
    this.dr_bits_tooBad_sound.play({ loop: false });
  }
  play_button_hover_sound() {
    if (this.button_hover_sound.isPlaying) return;
    this.button_hover_sound.play({ loop: false });
  }

  play_button_down_sound() {
    console.log("in play button down sound ");
    if (this.button_down_sound.isPlaying) return;
    this.button_down_sound.play({ loop: false });
  }

  private launchBackground(backgroundMode: BackgroundMode) {
    this.scene.launch("background", { backgroundMode: BackgroundMode.NIGHT });
  }

  async launchGame(data: any) {
    console.log("in here...");
    setTimeout(() => {
      this.pauseBackground();
      this.pauseJackPot();
      this.scene.launch("game", {
        data,
        key: "hq_map",
      });
    }, 100);

    // setTimeout(() => {
    //   this.launchJackPotGame();
    //   //  this.launchBigWinScreenGame();
    // }, 1000);
  }

  async launchMintingGame(data: any) {
    console.log("minting launchMintingGame --- ", data);
    setTimeout(() => {
      this.pauseBackground();
      this.pauseGame();
      this.scene.launch("minting"), data;
    }, 100);
  }

  async launchJackPotGame() {
    setTimeout(() => {
      this.pauseBackground();
      // this.pauseGame()
      store.dispatch(ShowWinnerCardAtFightEnd(false))
      store.dispatch(SetShowingJackpotWheel(true));
      this.scene.launch("jackpot");
    }, 100);
  }

  async launchBigWinScreenGame() {
    setTimeout(() => {
      this.pauseBackground();
      // this.pauseGame();
      this.scene.launch("big_win_screen");
    }, 100);
  }

  async pauseMintingGame() {
    this.scene.stop("minting");
  }

  pauseBackground() {
    console.log("in pause...");
    this.scene.stop("background");
  }

  pauseGame() {
    console.log("in pause...");
    this.scene.stop("game");
  }

  pauseJackPot() {
    console.log("in pause...");
    store.dispatch(SetShowingJackpotWheel(false));
    this.scene.stop("jackpot");
  }

  launchBackGroundNight() {
    this.launchBackground(BackgroundMode.NIGHT);
  }

  changeBackgroundMode(backgroundMode: BackgroundMode) {
    this.scene.stop("background");
    this.launchBackground(backgroundMode);
  }
}
