// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { ICoin } from './../items/Coin';
import { RatState } from './../characters/Mouse';
import { createOtherCharacterAnimsV2 } from "../anims/CharacterAnims";
import Boundary, { Rect } from "../Components/Boundary";
import REACT_APP_LOBBY_WEBSOCKET_SERVER from "../configs";
import { AddInitialToChatArray, addToChatArray, MessageType } from "../../stores/ChatStore";
import store from "../../stores";
import { IOtherPlayer } from "../characters/OtherPlayer";
import { IRat, IRatsStateManager } from "../scenes/Rat";
import Rat from "../scenes/Rat";
import {
    ChangeCombinedQueueData,
    ChangeFightAnnouncementMessageFromServer,
    ChangeFightAnnouncementStateFromServer,
    ChangeNotificationMessageFromServer,
    ChangeNotificationStateFromServer,
    ChangePath,
    ChangeShowControls,
    ChangeShowMenuBox,
    ChangeShowQueueBox,
    IQueueCombined,
    ShowWinnerCardAtFightEnd,
} from "../../stores/UserWebsiteStore";
// import { MyPlayer } from "../characters/MyPlayer";
// import { OtherPlayer } from "../characters/OtherPlayer";
import {
    ClearFighterInfo,
    FightContinue,
    FightEnd,
    FightPreStart,
    FightStart,
    IfightersInfo,
    SetCurrentOtherPlayerFighting,
    SetCurrentPlayerFighting,
    SetFightersInfo,
    SetFocussedOnChat,
    ShowBrewEjectAnimationFromServer,
    ShowChatWindow,
    ShowFightConfirmationBox,
    ShowFightConfirmationStartTime,
    ShowFightConfirmationTime,
    ShowMagnetMoveBrew,
} from "../../stores/UserActions";
import { IKeysInfo, INFTDataOfConnections, IPlayerData } from "../characters/IPlayer";
import { SetCurrentGamePlayer, setNickName } from "../../stores/PlayerData";
import { FightInfoText } from "../Components/FightInfoText";
import { isNullOrUndefined } from "util";
import phaserGame from "../../PhaserGame";
import Bootstrap from "./Bootstrap";
import { getRandomInt } from "../../utils";
//import { IMouse, IRatsStateManager, Mouse } from "../characters/Mouse";
//import { createRatsAnims } from "../anims/createRatsAnims";
import { createSilverCoinAnim } from "../anims/createSilverCoinsAnim";

import { SetPlayerIdForGame } from "../../stores/Web3Store";
import { HQ } from "./views/Hq";
import { getBalances } from "../../utils/web3_utils";
// import { SetAssetsInfo } from "../../stores/Web3StoreBalances";
import { fetchPlayerAssets, fetchPlayerWalletInfo } from "../../hooks/ApiCaller";
// import { updateBetInfOfPlayer } from "../../utils/fight_utils";
// import  { SetServerLatency } from "../../stores/MetaInfoStore";
// import { SetCurrentFightId, SetFightWinner } from "../../stores/FightsStore";
// import { ActionManager } from "../ActionManager";
import { v4 as uuidv4 } from "uuid";
import { SetGameLoadingState, SetShowGameServersList } from "../../stores/WebsiteStateStore";
import { IBrew } from "../characters/BrewMananger";
import KeyControls from "../services/KeyControls";
import Network from "../services/Networks";
import { random_spawn_points } from "../controls/randomSpawnPoints";
import { checkIpad, getSystemInfo } from '../../utils/systemInfo';
import Joystick from '../controls/joystick';

const textAreaVisible = false;

export default class Game extends Phaser.Scene {
    background: any;
    public map!: Phaser.Tilemaps.Tilemap;
    player: {
        movedLastFrame: any;
        sprite: any;
        gameObject: any;
    };
    public fighterOtherPlayer!: string;
    collidingWithOtherPlayers!: Set<string>;
    public otherPlayers = new Map<string, IOtherPlayer>();

    public rats: Array<IRat> = [];
    public brews: Array<IBrew> = [];
    public items: Array<ICoin> = [];

    otherPlayersGroup!: Phaser.Physics.Arcade.Group;
    pressedKeys: Array<any>;
    CurrentKeysPressed: any;
    // keys: IKeysInfo;
    hq!: HQ;

    mousePressed = false;
    radiatorClicked = true;
    // lastKey: string;
    // myPlayer!: MyPlayer;
    fightMachineOverLapArea!: Phaser.Tilemaps.TilemapLayer;
    fightMachineOverlapText!: Phaser.GameObjects.Text;
    radiatorRect!: Rect;

    fightInfoTextClass!: FightInfoText;
    nftData: any;
    basicCollisionCoordinatesX: Array<number> = [];
    basicCollisionCoordinatesY: Array<number> = [];
    boundaries: Array<Boundary> = [];
    public lobbySocketConnection!: WebSocket;
    public lobbySocketConnected!: boolean;
    clubFrontLayer!: Phaser.Tilemaps.TilemapLayer;

    rootContainer!: Phaser.GameObjects.Container;
    stageArea!: Phaser.Tilemaps.TilemapLayer;
    radiatorLayer!: Phaser.Tilemaps.TilemapLayer;
    centerCoordinatesStage!: { x: number; y: number };
    displayScreenCenter!: { x: number; y: number };

    mapKey!: string;
    err_music!: Phaser.Sound.BaseSound;
    bootstrap: Bootstrap;

    fight_music: Array<Phaser.Sound.BaseSound> = [];
    punch_music_1!: Phaser.Sound.BaseSound;
    punch_music_2!: Phaser.Sound.BaseSound;
    boop_music!: Phaser.Sound.BaseSound;
    fight_start_music!: Phaser.Sound.BaseSound;

    swing_sound_1!: Phaser.Sound.BaseSound;
    swing_sound_2!: Phaser.Sound.BaseSound;
    swing_sound_3!: Phaser.Sound.BaseSound;
    swing_sound_4!: Phaser.Sound.BaseSound;

    // coins_drop_sound!: Phaser.Sound.BaseSound;
    // coins_collect_sound!: Phaser.Sound.BaseSound;

    punchArea!: Phaser.Tilemaps.TilemapLayer;
    random_pos_selected!: number;

    enter_pressed = false;
    fightMachineOverlapRectReverse!: Rect;
    controls!: Phaser.Cameras.Controls.SmoothedKeyControl;

    frameTime = 0;

    keyControls!: KeyControls;
    network!: Network;

    constructor() {
        super("game");
        // this.lastKey = ""
        this.player = {
            sprite: null,
            movedLastFrame: null,
            gameObject: null,
        };
        // this.keys = {
        //   keyA: {
        //     pressed: false,
        //     double_pressed: false,
        //   },
        //   keyD: {
        //     pressed: false,
        //     double_pressed: false,
        //   },
        //   keyS: {
        //     pressed: false,
        //   },
        //   keyW: {
        //     pressed: false,
        //   },
        //   keyP: {
        //     pressed: false,
        //   },
        //   keyK: {
        //     pressed: false,
        //   },
        //   leftShift: {
        //     pressed: false,
        //   },
        //   keyBlock: {
        //     pressed: false,
        //   },
        //   lastKey:"",
        // };
        this.lobbySocketConnected = false;
        this.collidingWithOtherPlayers = new Set();
        this.pressedKeys = [];
        this.CurrentKeysPressed = {};
        this.bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;
        console.log("running constructor game.. ");
    }

    init(data: { data: any; key: string }) {
        console.log("running init in game .. ", data);
        this.nftData = data.data;
        store.dispatch(SetCurrentGamePlayer(this.nftData));
        store.dispatch(setNickName(this.nftData.nick_name));
        fetchPlayerWalletInfo(true);
        fetchPlayerAssets();
        //Scene listener
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            Joystick.destroy();
        });
    }

    preload(data: { data: IPlayerData; key: string }) {
        console.log("running preload in game .. ", this.nftData);
        // this.load.atlas(
        //   'player-'+this.nftData.minted_id.toString(),
        //   this.nftData.data.sprite_image,
        //   'bitfgihter_assets/player/texture-v2.json'
        // )

        // for (let i = 0 ; i < 10 ; i++) {
        //   // load rats
        //   this.load.atlas(
        //     'rats-'+ i.toString(),
        //     'bitfgihter_assets/rat-sprite.png',
        //     'bitfgihter_assets/rat-sprite-json.json'
        //   )
        // }

        // this.load.atlas("rats", "bitfgihter_assets/rat-sprite.png", "bitfgihter_assets/rat-sprite-json.json");
    }

    enableKeyBoard() {
        this.input.keyboard.enabled = true;
        this.input.mouse.enabled = true;
    }

    playFightMusic() {
        let isplaying = false;
        let isplayingIndex = -1;
        for (let i = 0; i < this.fight_music.length; i++) {
            // this.fight_music[i].stop()
            if (this.fight_music[i].isPlaying) {
                isplaying = true;
                isplayingIndex = i;
                break;
            }
        }
        if (!isplaying) {
            const random = Math.floor(Math.random() * this.fight_music.length);
            this.fight_music[random].play({ loop: true });
        }
        // else {
        //   // this.fight_music[isplayingIndex].play({loop: true})
        // }

        // if (!this.fight_music.isPlaying) this.fight_music.play({loop: true})
    }

    playPunchMusic() {
        const random = getRandomInt(2);

        if (random === 1) this.punch_music_1.play({ loop: false });
        else this.punch_music_2.play({ loop: false });
    }

    playSwingSOund() {
        const random = getRandomInt(4);

        if (random === 3) this.swing_sound_4.play({ loop: false });
        if (random === 2) this.swing_sound_3.play({ loop: false });
        if (random === 1) this.swing_sound_2.play({ loop: false });
        else this.swing_sound_1.play({ loop: false });
    }

    stopFightMusic() {
        for (let i = 0; i < this.fight_music.length; i++) {
            this.fight_music[i].stop();
        }
        // this.fight_music.stop()
    }

    playBoopMusic() {
        this.boop_music.play({ loop: false });
    }

    playFightStartMusic() {
        this.fight_start_music.play({ loop: false });
    }

    disableKeyBOard() {
        this.input.keyboard.enabled = false;
        this.input.keyboard.enabled = false;
        this.input.mouse.enabled = false;
        this.input.keyboard.enableGlobalCapture();
    }

    async create(data: { data: any; key: string }) {
        // this.input.setPollAlways();
        this.err_music = this.sound.add("err_music");
        for (let i = 0; i < 10; i++) {
            this.fight_music[i] = this.sound.add(`fight-music-${i + 1}`, {
                volume: 0.4,
            });
        }
        // this.fight_music = this.sound.add('fight-music', {volume: 0.4});
        this.punch_music_1 = this.sound.add("punch1-music", { volume: 0.4 });
        this.punch_music_2 = this.sound.add("punch2-music", { volume: 0.4 });
        this.fight_start_music = this.sound.add("fight-start-music");
        this.boop_music = this.sound.add("boop-music");

        this.swing_sound_1 = this.sound.add("swing-sound-1", { volume: 0.4 });
        this.swing_sound_2 = this.sound.add("swing-sound-2", { volume: 0.4 });
        this.swing_sound_3 = this.sound.add("swing-sound-3", { volume: 0.4 });
        this.swing_sound_4 = this.sound.add("swing-sound-4", { volume: 0.4 });

        // this.coins_collect_sound = this.sound.add("coins_collect", { volume: 0.5 });
        // this.coins_drop_sound = this.sound.add("coins_drop", { volume: 0.5 });

        this.random_pos_selected = Math.floor(Math.random() * random_spawn_points.length);
        console.log("this.random pos ", this.random_pos_selected);

        store.dispatch(ChangePath("gamePlay"));

        this.input.mouse.disableContextMenu();
        // this.game.canvas.oncontextmenu = (e) => e.preventDefault();

        this.game.canvas.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            return false;
        }, true); // `true` here signifies that the event listener is in the capture phase


        // updateBetInfOfPlayer()
        // FetchWalletLog()

        // console.log(" game created .. ", data, data.key, this.nftData);
        // createCharacterAnims(this.anims)
        createOtherCharacterAnimsV2(this.anims, "player-" + this.nftData.minted_id.toString());
        createSilverCoinAnim(this.anims, "silver_coin");

        this.mapKey = data.key;

        // const mapCreator = new MapCreator(this);
        // this.map = mapCreator.createMap(this.mapKey)
        console.log("websocket server--", process.env.REACT_APP_DEV_ENV, REACT_APP_LOBBY_WEBSOCKET_SERVER, store.getState().playerDataStore.nick_name, store.getState().websiteStateStore.selected_server_url);

        store.dispatch(SetShowGameServersList(false));
        // this.lobbySocketConnection = new WebSocket(REACT_APP_LOBBY_WEBSOCKET_SERVER+ "/roomid")

        //Local Server
        // this.lobbySocketConnection = new WebSocket("ws://localhost:9001/");

        // console.log("-game_server_url--", store.getState().websiteStateStore.selected_server_url)
        //Hosted Server
        this.lobbySocketConnection = new WebSocket(`${store.getState().websiteStateStore.selected_server_url}/${store.getState().websiteStateStore.selected_roomId}`);

        this.lobbySocketConnection.addEventListener("open", (event) => {
            this.lobbySocketConnected = true;
            // console.log("connected ... ", event)
            console.log("debug__nft__data ", this.nftData);
            // let joining_data = {

            // }
            this.lobbySocketConnection.send(
                JSON.stringify({
                    event: "joined",
                    walletAddress: store.getState().web3store.userAddress,
                    // room_id:"lobby",
                    sprite_url: this.nftData.data.sprite_image,
                    minted_id: this.nftData.minted_id,
                    nick_name: this.nftData.nick_name,
                    attributes: this.nftData.data.attributes,
                    profile_image: this.nftData.data.profile_image,
                    // all_nft_data: this.nftData,
                    last_position_x: random_spawn_points[this.random_pos_selected].x,
                    last_position_y: random_spawn_points[this.random_pos_selected].y,
                    orientation: "right",
                    user_type: store.getState().web3store.web3Connected ? "web3" : "web2",
                })
            );
            // console.log("important_message--", {
            //   event: "joined",
            //   walletAddress: store.getState().web3store.userAddress,
            //   room_id:"lobby",
            //   sprite_url: this.nftData.data.sprite_image,
            //   minted_id: this.nftData.minted_id,
            //   all_nft_data: this.nftData,
            //   last_position_x: random_spawn_points[this.random_pos_selected].x,
            //   last_position_y: random_spawn_points[this.random_pos_selected].y,
            //   orientation: "right",
            // })
            store.dispatch(SetGameLoadingState(false));
            // this.lobbySocketConnection.send(JSON.stringify({
            //   event: "geoInfo",
            //   data: store.getState().geoStore.geoInfo,
            //   walletAddress: store.getState().web3store.userAddress,
            // }))
            console.log("sending koined  ", this.nftData);
        });

        this.lobbySocketConnection.addEventListener("close", (event) => {
            this.lobbySocketConnected = false;
            console.log("debug_server disconnected ... ", event);
        });
        // console.log()
        store.dispatch(SetPlayerIdForGame(store.getState().web3store.userAddress + "_" + this.nftData.minted_id));

        // this.myPlayer = new MyPlayer(this,random_spawn_points[this.random_pos_selected].x, random_spawn_points[this.random_pos_selected].y, "player-"+this.nftData.minted_id.toString(), "idle-player-"+this.nftData.minted_id.toString(), this.nftData.nick_name, this.nftData, this.lobbySocketConnection );
        // this.player.sprite = this.myPlayer.sprite;
        // this.player.gameObject = this.myPlayer;
        // console.log("@$#%$ player %$--", this.player.sprite);

        // this.fightInfoTextClass = new FightInfoText(this);

        if (this.mapKey === "lobby") {
            this.map = this.make.tilemap({
                key: "map",
                tileHeight: 16,
                tileWidth: 16,
            });
            const tileset: Phaser.Tilemaps.Tileset = this.map.addTilesetImage("LobbyTown", "tiles", 16, 16, 0, 0);
            const club: Phaser.Tilemaps.Tileset = this.map.addTilesetImage("CLUB", "club1", 16, 16, 0, 0);
            const wall: Phaser.Tilemaps.Tileset = this.map.addTilesetImage("wall", "wall", 16, 16, 0, 0);

            const mapLayer = this.map.createLayer(0, [tileset, club, wall], 0, 0);
            const clubLayer = this.map.createLayer(1, [tileset, club, wall], 0, 0);
            const collisionLayer: Phaser.Tilemaps.TilemapLayer = this.map.createLayer(2, [tileset, club, wall], 0, 0);
            const clubFrontLayer: Phaser.Tilemaps.TilemapLayer = this.map.createLayer(3, [tileset, club, wall], 0, 0);
            this.clubFrontLayer = clubFrontLayer;

            collisionLayer.forEachTile((_tile) => {
                // console.log(_tile);
                if (_tile.index !== -1) {
                    for (let i = 0; i < 16; i++) {
                        for (let j = 0; j < 16; j++) {
                            this.basicCollisionCoordinatesX.push(_tile.x * 16 + i);
                            this.basicCollisionCoordinatesY.push(_tile.y * 16 + j);
                        }
                    }

                    this.boundaries.push(new Boundary({ x: _tile.x * 16, y: _tile.y * 16 }, 16, 16));
                }
            });
            collisionLayer.setDepth(-100000);

            this.cameras.main.setZoom(1.8, 1.8);
            this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
            // this.cameras.main.startFollow(this.player.sprite);
        } else if (this.mapKey === "hq_map") {
            this.hq = new HQ(this);
            this.hq.init();
        }

        this.keyControls = new KeyControls();
        this.network = new Network();

        this.cameras.main.setZoom(1.8, 1.8);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.otherPlayersGroup = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Sprite,
        });

        if (getSystemInfo())
            this.cameras.main.zoomTo(0.85, 500)

        this.onorientationchange(this.scale.orientation)
        this.scale.on('orientationchange', (orientation) => {
            this.onorientationchange(orientation)
        });
    }

    onorientationchange(orientation: string) {
        orientation = (orientation == Phaser.Scale.PORTRAIT) ? "portrait" : "landscape";
        this.clearjoystick();
        this.time.addEvent(({
            delay: 500,
            callback: () => {
                this.createjoystick(orientation);
            },
            callbackScope: this
        }));
    }

    clearjoystick() {
        Joystick.destroy();
    }

    createjoystick(orientation: string) {
        const ismobile = getSystemInfo();
        const isIpad = checkIpad();
        if (ismobile || isIpad) {
            Joystick.MoveController(orientation, (data: any) => {
                this.joystickmovelistener(data);
            });
            Joystick.ShootController(this, orientation, (data: any) => {
                this.joystickshootlistener(data);
            });
        }
    }

    resetRats(newRats: IRatsStateManager, create = false) {
        // console.log("-------in_mouse_reset ", newRats.rats_count, this.rats.length, create);
        if (create) {
            this.rats.map((data: IRat, i) => {
                console.log("RATS this.rats.map((data: IRat, i) => {")
                data.gameObject.DestroyGameObject();
            });
            this.rats = [];
            for (let i = 0; i < newRats.rats_count; i++) {
                const mouseObject = new Rat(this, newRats.rats_positiions[i].x, newRats.rats_positiions[i].y, "rats", "idle", newRats.rats_health[i]);
                //  mouseObject.EnableHealthBars();
                this.rats.push({
                    key: `rats`,
                    moving: false,
                    gameObject: mouseObject,
                    uuid: newRats.rats_uuid[i],
                });
            }
        } else {
            // check if which uuid does not match and delete that.
            let toDelete = -1;
            this.rats.map((data: IRat, i) => {
                if (!newRats.rats_uuid.includes(data.uuid)) {
                    // when coin has been picked up
                    data.gameObject.DestroyGameObject();
                    toDelete = i;
                }
            });

            console.log("-------in_debug_rats_mouse_reset ", newRats.rats_count, this.rats.length, toDelete);

            if (toDelete >= 0) {
                this.rats.splice(toDelete, 1);
            }

            if (this.rats.length > newRats.rats_count) {
                this.resetRats(newRats, true);
            }
            // first check if the rat is dead.
            // let deleted = -1
            // for (let i = 0; i < newRats.rats_count; i++) {
            //   if (newRats.rats_state[i] === RatState.COIN_END || newRats.rats_state[i] === RatState.COIN_PICKED) {
            //     console.log("-------in_mouse_reset kill this ", i, newRats.rats_count, this.rats.length);
            //     if (newRats.rats_uuid[i] === this.rats[i].uuid) {
            //       this.rats[i].gameObject.DestroyGameObject();
            //       deleted = i;
            //     }
            //   }
            // }
            // if (deleted >= 0) {
            //   this.rats.splice(deleted, 1);
            // }
        }
        // let all_destroyed = false;
        // this.rats.map((data: IRat, i) => {
        //   // if (newRats.rats_uuid.includes(data.uuid) && ) {
        //   //   data.gameObject.DestroyGameObject();
        //   // }
        //   if (newRats.rats_state ) {
        //     data.gameObject.DestroyGameObject();
        //   }
        // });
        // this.rats = [];

        // let temp_rat_arr = [];
        // for (let i = 0; i < newRats.rats_count; i++) {
        //   //createRatsAnims(this.anims, `rats`);
        //   const mouseObject = new Rat(this, newRats.rats_positiions[i].x, newRats.rats_positiions[i].y, "rats", "idle", newRats.rats_health[i]);
        //   //  const mouseObject = new Mouse(this, newRats.rats_positiions[i].x, newRats.rats_positiions[i].y, "rats", "idle", newRats.rats_health[i]);
        //   mouseObject.EnableHealthBars();
        //   temp_rat_arr.push({
        //     key: `rats`,
        //     moving: false,
        //     gameObject: mouseObject,
        //     uuid: newRats.rats_uuid[i],
        //   });
        // }
    }

    closeLobbySocketConnection() {
        this.lobbySocketConnection.close();
    }

    private joystickmovelistener(data: any) { //Used Keyboard events for now
        if (this.keyControls && this.keyControls.keys) {
            if (data.leveledX != 0) {
                if (data.leveledX < 0) {
                    this.keyControls.keys.keyD.pressed = false;
                    this.keyControls.keys.keyA.pressed = true;
                } else if (data.leveledX > 0) {
                    this.keyControls.keys.keyA.pressed = false;
                    this.keyControls.keys.keyD.pressed = true;
                }
            } else {
                this.keyControls.keys.keyA.pressed = false;
                this.keyControls.keys.keyD.pressed = false;
            }
            if (data.leveledY != 0) {
                if (data.leveledY > 0) {
                    this.keyControls.keys.keyS.pressed = false;
                    this.keyControls.keys.keyW.pressed = true;
                } else if (data.leveledY < 0) {
                    this.keyControls.keys.keyW.pressed = false;
                    this.keyControls.keys.keyS.pressed = true;
                }
            } else {
                this.keyControls.keys.keyW.pressed = false;
                this.keyControls.keys.keyS.pressed = false;
            }
            //Run
            if (data.distance > Math.floor(Joystick.outerRadius * 1.3)) {
                this.keyControls.keys.keyD.double_pressed = this.keyControls.keys.keyD.pressed;
                this.keyControls.keys.keyA.double_pressed = this.keyControls.keys.keyA.pressed;
            } else {
                this.keyControls.keys.keyA.double_pressed = false;
                this.keyControls.keys.keyD.double_pressed = false;
            }
        }
    }

    private joystickshootlistener(data: any) {
        if (data.punch) {
            this.keyControls.keys.keyK.pressed = false
            this.keyControls.keys.keyP.pressed = true
        } else if (data.kick) {
            this.keyControls.keys.keyK.pressed = true
            this.keyControls.keys.keyP.pressed = false
        }
    }

    update(time: any, delta: any) {
        this.input.mouse.disableContextMenu();
        if (store.getState().websiteStateStore.showing_jackpot_wheel) {
            this.cameras.main.setAlpha(0.7);
            // this.cameras.main.setTintFill(0x242424);
            return;
        } else {
            this.cameras.main.setAlpha(1);
            // this.cameras.main.setTintFill(0xffff)
        }

        this.frameTime += delta;
        if (this.frameTime > 30) {
            this.frameTime = 0;
        } else {
            // console.log("not updating ", this.frameTime)
            return;
        }

        const pointer: Phaser.Input.Pointer = this.input.activePointer;
        const worldPoint: Phaser.Math.Vector2 = this.input.activePointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
        // console.log(worldPoint, this.radiatorRect)
        // console.log("debug_mouse-------",store.getState().userActionsDataStore.turnMouseClickOff, this.mousePressed, pointer.leftButtonDown())

        // console.log("debug_mouse-------",
        //   store.getState().userActionsDataStore.turnMouseClickOff,
        //   store.getState().userActionsDataStore.mouseClickControlHeader,
        //   store.getState().userActionsDataStore.mouseClickControlATM,
        //   store.getState().userActionsDataStore.mouseClickControlFightMachine,
        //   store.getState().userActionsDataStore.mouseClickControlProfileWindow,
        //   store.getState().userActionsDataStore.mouseClickControlChat,
        //   store.getState().userActionsDataStore.mouseClickControlInventory,
        // )

        if (
            // this.input.keyboard.enabled
            // // && this.input.keyboard.isActive()
            // && this.input.mouse.enabled
            // &&
            !store.getState().userActionsDataStore.turnMouseClickOff &&
            !store.getState().userActionsDataStore.mouseClickControlHeader &&
            !store.getState().userActionsDataStore.mouseClickControlATM &&
            !store.getState().userActionsDataStore.mouseClickControlFightMachine &&
            !store.getState().userActionsDataStore.mouseClickControlProfileWindow &&
            !store.getState().userActionsDataStore.mouseClickControlChat &&
            !store.getState().userActionsDataStore.mouseClickControlInventory
        ) {
            if (pointer.rightButtonDown() && !this.mousePressed && !Joystick.isTouched) {
                this.mousePressed = true;
                // console.log("right button down")
                this.keyControls.keys.keyK.pressed = true;
                this.keyControls.keys.lastKey = "KeyK";
                this.keyControls.keys.keyD.double_pressed = false;
                this.keyControls.keys.keyA.double_pressed = false;
                if (this.fightMachineOverlapText.depth > 0) {
                    // this.lobbySocketConnection.send(JSON.stringify({
                    //   event: "fight_machine_button_press",
                    //   walletAddress: store.getState().web3store.userAddress,
                    // }))
                    // this.punchArea.setDepth(-1)
                    // setTimeout(() => {
                    //   this.punchArea.setDepth(1)
                    //   store.dispatch(HitFightMachine(true))
                    //   this.bootstrap.play_button_press_sound()
                    // }, 500)
                }
            } else if (pointer.leftButtonDown() && !this.mousePressed && !Joystick.isTouched) {
                console.log("left button down ", this.mousePressed, this.fightMachineOverlapText.depth);
                this.mousePressed = true;
                this.keyControls.keys.keyP.pressed = true;
                this.keyControls.keys.lastKey = "KeyP";
                this.keyControls.keys.keyD.double_pressed = false;
                this.keyControls.keys.keyA.double_pressed = false;
                if (this.fightMachineOverlapText.depth > 0) {
                    // this.lobbySocketConnection.send(JSON.stringify({
                    //   event: "fight_machine_button_press",
                    //   walletAddress: store.getState().web3store.userAddress,
                    // }))
                    // this.punchArea.setDepth(-1)
                    // setTimeout(() => {
                    //   this.punchArea.setDepth(1)
                    //   store.dispatch(HitFightMachine(true))
                    //   this.bootstrap.play_button_press_sound()
                    // }, 500)
                }
            } else if (pointer.leftButtonReleased() && this.mousePressed) {
                // console.log("left button up")
                this.keyControls.keys.keyP.pressed = false;
                this.mousePressed = false;
            } else if (pointer.rightButtonReleased() && this.mousePressed) {
                // console.log("right button up")
                this.keyControls.keys.keyK.pressed = false;
                this.mousePressed = false;
            }
        }

        if (this.lobbySocketConnected && store.getState().web3store.userAddress !== "" && store.getState().userPathStore.movementAbilityPlayer) {
            // console.log("timeframe latency_check-- ", this.frameTime)
            // if (this.frameTime % 100 === 0) {
            //   console.log("timeframe latency_check-- ", this.frameTime)
            //   this.lobbySocketConnection.send(JSON.stringify({
            //     event: "latency_check",
            //     walletAddress: store.getState().web3store.userAddress,
            //     client_time: new Date().getTime()
            //   }))
            // }

            if (
                // this.keyControls.onKeysChange
                this.keyControls.keys.keyA.pressed ||
                this.keyControls.keys.keyD.pressed ||
                this.keyControls.keys.keyS.pressed ||
                this.keyControls.keys.keyW.pressed
            ) {
                const action_id = uuidv4();
                // this.otherPlayers.forEach((_otherplayer) => {
                //   if (!_otherplayer.kickStart && _otherplayer.wallet_address === store.getState().web3store.userAddress) {
                //     // let action_id = uuidv4();
                //     // ActionManager.AddToActionQueue({ event: "kick", walletAddress: store.getState().web3store.userAddress }, action_id );
                //     // console.log("checking unequip_brew ", )
                //     const tempPlayer = _otherplayer.gameObject;
                //     if (tempPlayer?.sprite) {
                //       ActionManager.AddTomoveActionQueue({ action_id, task_state: true, x: tempPlayer?.sprite.x, y: tempPlayer.sprite.y} );
                //     }
                //   }
                // })
                this.otherPlayers.forEach((_otherplayer) => {
                    if (_otherplayer.wallet_address === store.getState().web3store.userAddress) {
                        if (_otherplayer.gameObject) {
                            if (_otherplayer.gameObject?.sprite.anims && _otherplayer.gameObject.sprite.anims.currentAnim) {
                                if (
                                    _otherplayer.gameObject.sprite.anims.currentAnim.key !== "win-" + _otherplayer.wallet_address + "_" + _otherplayer.minted_id &&
                                    _otherplayer.gameObject.sprite.anims.currentAnim.key !== "lose-" + _otherplayer.wallet_address + "_" + _otherplayer.minted_id &&
                                    _otherplayer.gameObject.sprite.anims.currentAnim.key !== "drink-" + _otherplayer.wallet_address + "_" + _otherplayer.minted_id &&
                                    _otherplayer.gameObject.sprite.anims.currentAnim.key !== "burp-" + _otherplayer.wallet_address + "_" + _otherplayer.minted_id &&
                                    _otherplayer.gameObject.sprite.anims.currentAnim.key !== "stunned-" + _otherplayer.wallet_address + "_" + _otherplayer.minted_id &&
                                    _otherplayer.gameObject.sprite.anims.currentAnim.key !== "dying_total_sequqnce-" + _otherplayer.wallet_address + "_" + _otherplayer.minted_id &&
                                    _otherplayer.gameObject.sprite.anims.currentAnim.key !== "fly_as_angel-" + _otherplayer.wallet_address + "_" + _otherplayer.minted_id
                                    // && _otherplayer.gameObject.sprite.anims.currentAnim.key !== 'brew-dropped-'+_otherplayer.wallet_address + "_" + _otherplayer.minted_id
                                ) {
                                    // console.log("sending move signal")
                                    const direction = [];
                                    let running = false;
                                    if (this.keyControls.keys.keyA.pressed) {
                                        direction.push("left");
                                    }
                                    if (this.keyControls.keys.keyW.pressed) {
                                        direction.push("up");
                                    }
                                    if (this.keyControls.keys.keyS.pressed) {
                                        direction.push("down");
                                    }
                                    if (this.keyControls.keys.keyD.pressed) {
                                        direction.push("right");
                                    }
                                    if (this.keyControls.keys.keyA.double_pressed || this.keyControls.keys.keyD.double_pressed) {
                                        running = true;
                                    }
                                    if (this.network.movementUpdateCounter % 2 === 0) {
                                        // console.log("debug_movement ----- ", this.network.movementUpdateCounter)
                                        this.network.movementUpdateCounter = 1;
                                        this.lobbySocketConnection.send(
                                            JSON.stringify({
                                                event: "move",
                                                delta: delta,
                                                walletAddress: store.getState().web3store.userAddress,
                                                direction: direction,
                                                running,
                                                // keys: this.keyControls.keys,
                                                action_id,
                                                orientation_switch: true,
                                            })
                                        );
                                    } else {
                                        this.network.movementUpdateCounter += 1;
                                        // this.network.movementUpdateCounter = 0;
                                    }

                                    // console.log("important--- move--", {
                                    //   event: "move",
                                    //   delta: delta,
                                    //   walletAddress: store.getState().web3store.userAddress,
                                    //   keys: this.keys,
                                    //   action_id,
                                    //   orientation_switch: true,
                                    // })
                                }
                            }
                        }
                        // ActionManager.AddTomoveActionQueue({ event: "move", action_id,  } );
                    }
                });
            }
            if (this.keyControls.keys.keyK.pressed) {
                this.otherPlayers.forEach((_otherplayer) => {
                    if (
                        _otherplayer.wallet_address === store.getState().web3store.userAddress &&
                        _otherplayer.gameObject &&
                        _otherplayer.gameObject?.sprite.anims &&
                        _otherplayer.gameObject?.sprite.anims.currentAnim &&
                        _otherplayer.gameObject.sprite.anims.currentAnim.key !== "win-" + _otherplayer.wallet_address + "_" + _otherplayer.minted_id &&
                        _otherplayer.gameObject.sprite.anims.currentAnim.key !== "lose-" + _otherplayer.wallet_address + "_" + _otherplayer.minted_id &&
                        _otherplayer.gameObject.sprite.anims.currentAnim.key !== "drink-" + _otherplayer.wallet_address + "_" + _otherplayer.minted_id &&
                        _otherplayer.gameObject.sprite.anims.currentAnim.key !== "burp-" + _otherplayer.wallet_address + "_" + _otherplayer.minted_id &&
                        _otherplayer.gameObject.sprite.anims.currentAnim.key !== "stunned-" + _otherplayer.wallet_address + "_" + _otherplayer.minted_id &&
                        _otherplayer.gameObject.sprite.anims.currentAnim.key !== "dying_total_sequqnce-" + _otherplayer.wallet_address + "_" + _otherplayer.minted_id &&
                        _otherplayer.gameObject.sprite.anims.currentAnim.key !== "fly_as_angel-" + _otherplayer.wallet_address + "_" + _otherplayer.minted_id
                        // && _otherplayer.gameObject.sprite.anims.currentAnim.key !== 'brew-dropped-'+_otherplayer.wallet_address + "_" + _otherplayer.minted_id
                    ) {
                        // let action_id = uuidv4();
                        // ActionManager.AddToActionQueue({ event: "kick", walletAddress: store.getState().web3store.userAddress }, action_id );
                        // console.log("checking unequip_brew ", )
                        // if (_otherplayer.hasBrewInHand && store.getState().assetStore.in_hand_brew){
                        //   if (!_otherplayer.kickStartTime) {
                        //     this.lobbySocketConnection.send(JSON.stringify({
                        //       event: "unequip_brew",
                        //       walletAddress: store.getState().web3store.userAddress,
                        //       minted_id: _otherplayer.minted_id,
                        //     }))
                        //     this.lobbySocketConnection.send(JSON.stringify({
                        //       event: "brew_used",
                        //       walletAddress: store.getState().web3store.userAddress,
                        //       minted_id: _otherplayer.minted_id,
                        //     }));
                        //   }
                        //   if (_otherplayer.kickStartTime) {
                        //     if (!_otherplayer.kickStart || _otherplayer.kickStartTime + 400 < new Date().getTime() ) {
                        //       this.lobbySocketConnection.send(JSON.stringify({
                        //         event: "unequip_brew",
                        //         walletAddress: store.getState().web3store.userAddress,
                        //         minted_id: store.getState().web3store.minted_id,
                        //       }))
                        //       this.lobbySocketConnection.send(JSON.stringify({
                        //         event: "brew_used",
                        //         walletAddress: store.getState().web3store.userAddress,
                        //         minted_id: store.getState().web3store.minted_id,
                        //       }));
                        //     }
                        //   }

                        // } else {
                        if (!_otherplayer.kickStartTime) {
                            this.lobbySocketConnection.send(
                                JSON.stringify({
                                    event: "kick",
                                    walletAddress: store.getState().web3store.userAddress,
                                })
                            );
                        }
                        if (_otherplayer.kickStartTime) {
                            if (!_otherplayer.kickStart || _otherplayer.kickStartTime + 400 < new Date().getTime()) {
                                this.lobbySocketConnection.send(
                                    JSON.stringify({
                                        event: "kick",
                                        walletAddress: store.getState().web3store.userAddress,
                                    })
                                );
                            }
                        }
                        // }
                        // _otherplayer.kickStart = true
                    }
                });
            }
            if (this.keyControls.keys.keyP.pressed) {
                this.otherPlayers.forEach((_otherplayer) => {
                    if (
                        _otherplayer.wallet_address === store.getState().web3store.userAddress &&
                        _otherplayer.gameObject &&
                        _otherplayer.gameObject?.sprite.anims &&
                        _otherplayer.gameObject?.sprite.anims.currentAnim &&
                        _otherplayer.gameObject.sprite.anims.currentAnim.key !== "win-" + _otherplayer.wallet_address + "_" + _otherplayer.minted_id &&
                        _otherplayer.gameObject.sprite.anims.currentAnim.key !== "lose-" + _otherplayer.wallet_address + "_" + _otherplayer.minted_id &&
                        _otherplayer.gameObject.sprite.anims.currentAnim.key !== "drink-" + _otherplayer.wallet_address + "_" + _otherplayer.minted_id &&
                        _otherplayer.gameObject.sprite.anims.currentAnim.key !== "burp-" + _otherplayer.wallet_address + "_" + _otherplayer.minted_id &&
                        _otherplayer.gameObject.sprite.anims.currentAnim.key !== "stunned-" + _otherplayer.wallet_address + "_" + _otherplayer.minted_id &&
                        _otherplayer.gameObject.sprite.anims.currentAnim.key !== "dying_total_sequqnce-" + _otherplayer.wallet_address + "_" + _otherplayer.minted_id &&
                        _otherplayer.gameObject.sprite.anims.currentAnim.key !== "fly_as_angel-" + _otherplayer.wallet_address + "_" + _otherplayer.minted_id
                        // && _otherplayer.gameObject.sprite.anims.currentAnim.key !== 'brew-dropped-'+_otherplayer.wallet_address + "_" + _otherplayer.minted_id
                    ) {
                        if (!_otherplayer.punchStartTime) {
                            this.lobbySocketConnection.send(
                                JSON.stringify({
                                    event: "punch",
                                    walletAddress: store.getState().web3store.userAddress,
                                })
                            );
                        }
                        if (_otherplayer.punchStartTime) {
                            if (!_otherplayer.punchStart || _otherplayer.punchStartTime + 200 < new Date().getTime()) {
                                this.lobbySocketConnection.send(
                                    JSON.stringify({
                                        event: "punch",
                                        walletAddress: store.getState().web3store.userAddress,
                                    })
                                );
                            }
                        }

                        // _otherplayer.punchStart = true
                    }
                });
            }

            if (this.keyControls.keys.keyQ.pressed) {
                this.otherPlayers.forEach((_otherplayer) => {
                    if (
                        _otherplayer.wallet_address === store.getState().web3store.userAddress &&
                        _otherplayer.gameObject &&
                        _otherplayer.gameObject?.sprite.anims &&
                        _otherplayer.gameObject.sprite.anims.currentAnim &&
                        _otherplayer.gameObject.sprite.anims.currentAnim.key !== "win-" + _otherplayer.wallet_address + "_" + _otherplayer.minted_id &&
                        _otherplayer.gameObject.sprite.anims.currentAnim.key !== "lose-" + _otherplayer.wallet_address + "_" + _otherplayer.minted_id &&
                        _otherplayer.gameObject.sprite.anims.currentAnim.key !== "drink-" + _otherplayer.wallet_address + "_" + _otherplayer.minted_id &&
                        _otherplayer.gameObject.sprite.anims.currentAnim.key !== "burp-" + _otherplayer.wallet_address + "_" + _otherplayer.minted_id &&
                        _otherplayer.gameObject.sprite.anims.currentAnim.key !== "stunned-" + _otherplayer.wallet_address + "_" + _otherplayer.minted_id &&
                        _otherplayer.gameObject.sprite.anims.currentAnim.key !== "dying_total_sequqnce-" + _otherplayer.wallet_address + "_" + _otherplayer.minted_id &&
                        _otherplayer.gameObject.sprite.anims.currentAnim.key !== "fly_as_angel-" + _otherplayer.wallet_address + "_" + _otherplayer.minted_id
                        // && _otherplayer.gameObject.sprite.anims.currentAnim.key !== 'brew-dropped-'+_otherplayer.wallet_address + "_" + _otherplayer.minted_id
                    ) {
                        if (_otherplayer.hasBrewInHand && store.getState().assetStore.in_hand_brew) {
                            if (!_otherplayer.kickStartTime) {
                                this.lobbySocketConnection.send(
                                    JSON.stringify({
                                        event: "unequip_brew",
                                        walletAddress: store.getState().web3store.userAddress,
                                        minted_id: _otherplayer.minted_id,
                                    })
                                );
                                this.lobbySocketConnection.send(
                                    JSON.stringify({
                                        event: "brew_used",
                                        walletAddress: store.getState().web3store.userAddress,
                                        minted_id: _otherplayer.minted_id,
                                    })
                                );
                            }
                            if (_otherplayer.kickStartTime) {
                                if (!_otherplayer.kickStart || _otherplayer.kickStartTime + 400 < new Date().getTime()) {
                                    this.lobbySocketConnection.send(
                                        JSON.stringify({
                                            event: "unequip_brew",
                                            walletAddress: store.getState().web3store.userAddress,
                                            minted_id: store.getState().web3store.minted_id,
                                        })
                                    );
                                    this.lobbySocketConnection.send(
                                        JSON.stringify({
                                            event: "brew_used",
                                            walletAddress: store.getState().web3store.userAddress,
                                            minted_id: store.getState().web3store.minted_id,
                                        })
                                    );
                                }
                            }
                        }
                    }
                });
            }
        }

        if (isNullOrUndefined(localStorage.getItem("saw_controls"))) {
            store.dispatch(ChangeShowControls(true));
        }

        // setting depths in map
        if (this.mapKey === "lobby") {
            this.clubFrontLayer.setDepth(this.player.sprite.y + 1000);
        } else if (this.mapKey === "hq_map") {
            this.hq.update(this.keyControls.keys);
        }

        if (store.getState().userActionsDataStore.fightContinue) {
            // this.myPlayer.movementAbility = true;
            store.dispatch(ChangeNotificationStateFromServer(true));
            if (60 - Math.floor(((new Date().getTime() - store.getState().userActionsDataStore.fightersInfo.fightStartedAt) / 1000) * 1.0) >= 0) {
                store.dispatch(ChangeNotificationMessageFromServer((60 - Math.floor(((new Date().getTime() - store.getState().userActionsDataStore.fightersInfo.fightStartedAt) / 1000) * 1.0)).toString()));
            }
        }

        if (store.getState().userActionsDataStore.showFightConfirmationBox) {
            store.dispatch(ShowFightConfirmationTime(20 - Math.floor((1.0 * new Date().getTime() - 1.0 * store.getState().userActionsDataStore.showFightConfirmationStartTime) / 1000)));
        }

        // fight music .
        if (store.getState().userActionsDataStore.fightersInfo.fightStarted && store.getState().userActionsDataStore.fightersInfo.player1.walletAddress !== "" && store.getState().userActionsDataStore.fightersInfo.player2.walletAddress !== "") {
            // console.log(" starting music ..")
            this.playFightMusic();
            store.dispatch(FightContinue(true));
        } else {
            this.stopFightMusic();
            store.dispatch(FightContinue(false));
        }
        // console.log(" current palyer fighting .. " , store.getState().userActionsDataStore.currentPlayerFighting)
        if (store.getState().userActionsDataStore.currentPlayerFighting) {
            store.dispatch(ChangeShowMenuBox(false));
            // store.dispatch(ShowChatWindow(false))
        }

        this.otherPlayers.forEach((_player) => {
            // console.log("move ing or not --", _player.moving, _player.gameObject?.tween_animation_running )
            if (_player.setupDone && _player.gameObject) {
                if (!_player.gameObject.tween_anim_running_down && (_player.gameObject.moving || _player.gameObject.tween_animation_running)) {
                    _player.gameObject.moving = true;
                } else {
                    _player.gameObject.moving = false;
                }
                _player.gameObject.sprite.setDepth(_player.gameObject.sprite.y + 5);
                // _player.gameObject.update2(this.boundaries, delta, this.keys)
                _player.gameObject.update();
                // _player.gameObject?.BaseUpdate();
            }
        });

        // move other players
        this.otherPlayers.forEach((_player) => {
            try {
                if (
                    _player.setupDone &&
                    _player.gameObject &&
                    _player.gameObject?.sprite.anims
                    // && store.getState().web3store.userAddress !== _player.wallet_address
                ) {
                    // if (_player.wallet_address === store.getState().web3store.userAddress) {
                    //   console.log("other_players_loop ", _player.showBrewDropFrame, _player.kicking, _player.punching, _player.stunnedStarted, _player.deadStarted)
                    // }
                    // console.log("debug_pos-----", _player.gameObject.sprite.x, _player.gameObject.sprite.y)

                    if (_player.gameObject.gassed_lift_off_fall) {
                        _player.gameObject.gassed_lift_off_fall = false;
                        // _player.gameObject.sprite.stop()
                        _player.gameObject.sprite.play("front_gassed_lift_off_fall-" + _player.wallet_address + "_" + _player.minted_id).once("animationcomplete", () => {
                            if (_player.gameObject) {
                                _player.gameObject.gassed_lift_off_fallen = false;
                                _player.gameObject.sprite.stop();
                                _player.gameObject.sprite.play("idle-" + _player.wallet_address + "_" + _player.minted_id);
                            }
                        });
                    } else if (_player.gotHit) {
                        _player.gameObject.sprite.play("gotHit-rats" + _player.wallet_address + "_" + _player.minted_id).once("animationcomplete", () => {
                            _player.gotHit = false;
                            if (_player.gameObject) {
                                _player.gameObject.sprite.stop();
                                _player.gameObject.sprite.play("idle-" + _player.wallet_address + "_" + _player.minted_id);
                            }
                        });
                    } else if (_player.gotBackHit) {
                        _player.gameObject.sprite.play("gotBackHit-" + _player.wallet_address + "_" + _player.minted_id).once("animationcomplete", () => {
                            // console.log("animation complete got back hit .. ")
                            _player.gotBackHit = false;
                            if (_player.gameObject) {
                                _player.gameObject.sprite.stop();
                                _player.gameObject.sprite.play("idle-" + _player.wallet_address + "_" + _player.minted_id);
                            }
                        });
                    } else if (_player.showBrewDropFrame) {
                        _player.showBrewDropFrame = false;
                        _player.gameObject.sprite.play("brew-dropped-" + _player.wallet_address + "_" + _player.minted_id).once("animationcomplete", () => {
                            _player.showBrewDropFrame = false;
                            _player.drinkStarted = false;
                            if (_player.gameObject) {
                                _player.gameObject.sprite.stop();
                                _player.gameObject.sprite.play("idle-" + _player.wallet_address + "_" + _player.minted_id);
                            }
                        });
                    } else if (_player.gameObject.dead) {
                        _player.gameObject.dead = false;
                        _player.gameObject.sprite.play("dying_total_sequqnce-" + _player.wallet_address + "_" + _player.minted_id).once("animationcomplete", (a: any, b: any, c: any, d: any) => {
                            console.log("fly_as_angel dying finish ", a.key);
                            if (_player.gameObject) {
                                _player.gameObject.sprite.stop();
                                _player.gameObject.sprite.play("fly_as_angel-" + _player.wallet_address + "_" + _player.minted_id);
                            }
                        });
                    } else if (_player.showEquipAnimationStarted) {
                        _player.showEquipAnimationStarted = false;
                        _player.gameObject.sprite.play("equipBrew-" + _player.wallet_address + "_" + _player.minted_id).once("animationcomplete", () => {
                            if (_player?.gameObject) {
                                _player?.gameObject.sprite.stop();
                                _player.gameObject.sprite.play("idleBrew-" + _player.wallet_address + "_" + _player.minted_id);
                            }
                        });
                    } else if (_player.winningStarted) {
                        _player.winningStarted = false;
                        _player.gameObject.sprite.play("win-" + _player.wallet_address + "_" + _player.minted_id).once("animationcomplete", () => {
                            _player.winningStarted = false;
                            if (_player.gameObject) {
                                _player.gameObject.sprite.stop();
                                _player.gameObject.sprite.play("idle-" + _player.wallet_address + "_" + _player.minted_id);
                            }
                        });
                    } else if (_player.losingStarted) {
                        _player.losingStarted = false;
                        _player.gameObject.sprite.play("lose-" + _player.wallet_address + "_" + _player.minted_id).once("animationcomplete", () => {
                            _player.losingStarted = false;
                            if (_player.gameObject) {
                                _player.gameObject.sprite.stop();
                                _player.gameObject.sprite.play("idle-" + _player.wallet_address + "_" + _player.minted_id);
                            }
                        });
                    } else if (_player.drinkStarted) {
                        if (!_player.drinking) {
                            _player.drinking = true;
                            _player.gameObject.sprite.play("drink-" + _player.wallet_address + "_" + _player.minted_id).once("animationcomplete", () => {
                                if (_player.gameObject) {
                                    _player.gameObject.sprite.play("burp-" + _player.wallet_address + "_" + _player.minted_id).once("animationcomplete", () => {
                                        _player.drinkStarted = false;
                                        _player.drinking = false;
                                        if (_player.gameObject) {
                                            _player.gameObject.sprite.stop();
                                            _player.gameObject.sprite.play("idle-" + _player.wallet_address + "_" + _player.minted_id);
                                        }
                                    });
                                }
                            });
                        }
                    } else if (_player.stunnedStarted) {
                        // console.log("entering in _player. stunnedstarted", _player.stunned, _player.stunnedStarted)
                        if (!_player.stunned) {
                            // console.log("entering in _player. stunned")
                            _player.running = false;
                            _player.kickStart = false;
                            _player.kicking = false;
                            _player.gotBackHit = false;
                            _player.gotHit = false;
                            _player.stunned = true;
                            _player.gameObject.sprite.stop();
                            _player.gameObject.sprite.play("stunned-" + _player.wallet_address + "_" + _player.minted_id).once("animationcomplete", () => {
                                // console.log("other player stunned animatino done.")
                                if (_player.gameObject) {
                                    _player.stunned = false;
                                    // _player.gameObject.sprite.stop()
                                    // _player.gameObject.sprite.play("idle-"+_player.wallet_address + "_" + _player.minted_id)
                                }
                            });
                        }
                    } else if (_player.deadStarted) {
                        // console.log("entering in _player. stunnedstarted", _player.stunned, _player.stunnedStarted)
                        if (!_player.dead) {
                            // console.log("entering in _player. stunned")
                            _player.running = false;
                            _player.kickStart = false;
                            _player.kicking = false;
                            _player.gotBackHit = false;
                            _player.gotHit = false;
                            _player.stunned = false;
                            _player.dead = true;
                            _player.gameObject.sprite.stop();
                            _player.gameObject.sprite.play("dead-" + _player.wallet_address + "_" + _player.minted_id).once("animationcomplete", () => {
                                //
                            });
                        }
                    } else if (_player.kicking && !_player.stunnedStarted && !_player.deadStarted) {
                        _player.running = false;
                        // _player.gameObject.sprite.play("kick-"+_player.wallet_address + "_" + _player.minted_id ).once('animationcomplete', () => {
                        //   // console.log("done kicking . ")
                        //   _player.kicking = false
                        //   _player.kickStart = false
                        //   if (_player.gameObject) {
                        //     _player.gameObject.sprite.stop()
                        //     _player.gameObject.sprite.play("idle-"+_player.wallet_address + "_" + _player.minted_id)
                        //   }
                        // })
                        if (_player.hasBrewInHand) {
                            _player.gameObject.sprite.play("kick-" + _player.wallet_address + "_" + _player.minted_id).once("animationcomplete", () => {
                                _player.punching = false;
                                _player.punchStart = false;
                                if (_player.gameObject) {
                                    _player.gameObject.sprite.stop();
                                    _player.gameObject.sprite.play("idleBrew-" + _player.wallet_address + "_" + _player.minted_id);
                                }
                            });
                        } else {
                            _player.gameObject.sprite.play("kick-" + _player.wallet_address + "_" + _player.minted_id).once("animationcomplete", () => {
                                _player.punching = false;
                                _player.punchStart = false;
                                if (_player.gameObject) {
                                    _player.gameObject.sprite.stop();
                                    _player.gameObject.sprite.play("idle-" + _player.wallet_address + "_" + _player.minted_id);
                                }
                            });
                        }
                    } else if (_player.punching && !_player.stunnedStarted && !_player.deadStarted) {
                        _player.running = false;
                        if (_player.hasBrewInHand) {
                            _player.gameObject.sprite.play("punchBrew-" + _player.wallet_address + "_" + _player.minted_id).once("animationcomplete", () => {
                                _player.punching = false;
                                _player.punchStart = false;
                                if (_player.gameObject) {
                                    _player.gameObject.sprite.stop();
                                    _player.gameObject.sprite.play("idleBrew-" + _player.wallet_address + "_" + _player.minted_id);
                                }
                            });
                        } else {
                            _player.gameObject.sprite.play("punch-" + _player.wallet_address + "_" + _player.minted_id).once("animationcomplete", () => {
                                _player.punching = false;
                                _player.punchStart = false;
                                if (_player.gameObject) {
                                    _player.gameObject.sprite.stop();
                                    _player.gameObject.sprite.play("idle-" + _player.wallet_address + "_" + _player.minted_id);
                                }
                            });
                        }
                    } else if (_player.runStart && !_player.stunnedStarted && !_player.deadStarted) {
                        // console.log(" in here player running --- ", _player.running, _player.runStart, _player.stunnedStarted, _player.deadStarted)
                        if (!_player.running) {
                            if (_player.hasBrewInHand) {
                                _player.gameObject.sprite.play("runBrew-" + _player.wallet_address + "_" + _player.minted_id).once("animationcomplete", () => {
                                    _player.running = false;
                                    _player.runStart = false;
                                    if (_player.gameObject) {
                                        _player.gameObject.sprite.stop();
                                        _player.gameObject.sprite.play("idleBrew-" + _player.wallet_address + "_" + _player.minted_id);
                                    }
                                });
                            } else {
                                _player.gameObject.sprite.play("run-" + _player.wallet_address + "_" + _player.minted_id).once("animationcomplete", () => {
                                    _player.running = false;
                                    _player.runStart = false;
                                    if (_player.gameObject) {
                                        _player.gameObject.sprite.stop();
                                        _player.gameObject.sprite.play("idle-" + _player.wallet_address + "_" + _player.minted_id);
                                    }
                                });
                            }

                            _player.running = true;
                        }
                    } else if (_player.gameObject.moving && !_player.stunnedStarted && !_player.deadStarted && !_player.running) {
                        // console.log("other_player_moving ", _player.wallet_address, _player.gameObject.sprite.anims)
                        // if (_player.gameObject?.sprite.anims && _player.gameObject.sprite.anims.currentAnim) {
                        // if (isNullOrUndefined(_player.gameObject.sprite.anims.currentAnim)) {
                        //   _player.gameObject.sprite.play("walk-"+_player.wallet_address + "_" + _player.minted_id)
                        // }
                        if (
                            _player.gameObject.sprite.anims.currentAnim.key !== "kick-" + _player.wallet_address + "_" + _player.minted_id &&
                            _player.gameObject.sprite.anims.currentAnim.key !== "punch-" + _player.wallet_address + "_" + _player.minted_id &&
                            _player.gameObject.sprite.anims.currentAnim.key !== "punchBrew-" + _player.wallet_address + "_" + _player.minted_id &&
                            _player.gameObject.sprite.anims.currentAnim.key !== "run-" + _player.wallet_address + "_" + _player.minted_id &&
                            _player.gameObject.sprite.anims.currentAnim.key !== "walk-" + _player.wallet_address + "_" + _player.minted_id &&
                            _player.gameObject.sprite.anims.currentAnim.key !== "walkBrew-" + _player.wallet_address + "_" + _player.minted_id &&
                            _player.gameObject.sprite.anims.currentAnim.key !== "gotHit-" + _player.wallet_address + "_" + _player.minted_id &&
                            _player.gameObject.sprite.anims.currentAnim.key !== "gotBackHit-" + _player.wallet_address + "_" + _player.minted_id &&
                            _player.gameObject.sprite.anims.currentAnim.key !== "stunned-" + _player.wallet_address + "_" + _player.minted_id &&
                            _player.gameObject.sprite.anims.currentAnim.key !== "dying_total_sequqnce-" + _player.wallet_address + "_" + _player.minted_id &&
                            _player.gameObject.sprite.anims.currentAnim.key !== "fly_as_angel-" + _player.wallet_address + "_" + _player.minted_id
                            // && _player.gameObject.sprite.anims.currentAnim.key !== 'brew-dropped-'+_player.wallet_address + "_" + _player.minted_id
                        ) {
                            _player.running = false;
                            _player.gameObject.sprite.stop();
                            if (_player.hasBrewInHand) {
                                _player.gameObject.sprite.play("walkBrew-" + _player.wallet_address + "_" + _player.minted_id);
                            } else {
                                _player.gameObject.sprite.play("walk-" + _player.wallet_address + "_" + _player.minted_id);
                            }
                        }
                        // }
                    } else {
                        if (_player.gameObject?.sprite.anims && _player.gameObject.sprite.anims.currentAnim) {
                            if (
                                _player.gameObject?.sprite.anims.currentAnim.key !== "kick-" + _player.wallet_address + "_" + _player.minted_id &&
                                _player.gameObject?.sprite.anims.currentAnim.key !== "punch-" + _player.wallet_address + "_" + _player.minted_id &&
                                _player.gameObject?.sprite.anims.currentAnim.key !== "punchBrew-" + _player.wallet_address + "_" + _player.minted_id &&
                                _player.gameObject?.sprite.anims.currentAnim.key !== "run-" + _player.wallet_address + "_" + _player.minted_id &&
                                _player.gameObject?.sprite.anims.currentAnim.key !== "runBrew-" + _player.wallet_address + "_" + _player.minted_id &&
                                _player.gameObject?.sprite.anims.currentAnim.key !== "gotHit-" + _player.wallet_address + "_" + _player.minted_id &&
                                _player.gameObject.sprite.anims.currentAnim.key !== "gotBackHit-" + _player.wallet_address + "_" + _player.minted_id &&
                                _player.gameObject.sprite.anims.currentAnim.key !== "idle-" + _player.wallet_address + "_" + _player.minted_id &&
                                _player.gameObject?.sprite.anims.currentAnim.key !== "idleBrew-" + _player.wallet_address + "_" + _player.minted_id &&
                                _player.gameObject.sprite.anims.currentAnim.key !== "win-" + _player.wallet_address + "_" + _player.minted_id &&
                                _player.gameObject.sprite.anims.currentAnim.key !== "lose-" + _player.wallet_address + "_" + _player.minted_id &&
                                _player.gameObject.sprite.anims.currentAnim.key !== "drink-" + _player.wallet_address + "_" + _player.minted_id &&
                                _player.gameObject.sprite.anims.currentAnim.key !== "burp-" + _player.wallet_address + "_" + _player.minted_id &&
                                _player.gameObject.sprite.anims.currentAnim.key !== "front_gassed_lift_off_fall-" + _player.wallet_address + "_" + _player.minted_id &&
                                _player.gameObject.sprite.anims.currentAnim.key !== "dying_total_sequqnce-" + _player.wallet_address + "_" + _player.minted_id &&
                                _player.gameObject.sprite.anims.currentAnim.key !== "fly_as_angel-" + _player.wallet_address + "_" + _player.minted_id &&
                                _player.gameObject.sprite.anims.currentAnim.key !== "brew-dropped-" + _player.wallet_address + "_" + _player.minted_id &&
                                !_player.stunnedStarted &&
                                !_player.deadStarted
                                // && _player.gameObject.sprite.anims.currentAnim.key !== 'stunned-'+_player.wallet_address + "_" + _player.minted_id
                            ) {
                                _player.running = false;
                                if (_player.hasBrewInHand) {
                                    _player.gameObject?.sprite.play("idleBrew-" + _player.wallet_address + "_" + _player.minted_id);
                                } else {
                                    _player.gameObject?.sprite.play("idle-" + _player.wallet_address + "_" + _player.minted_id);
                                }
                            }
                        }
                    }
                    _player.kicking = false;
                    _player.punching = false;
                    // _player.punchStart = false
                    // _player.kickStart = false
                    // _player.running = false;
                    _player.gotHit = false;
                    _player.gotBackHit = false;
                }
            } catch (err) {
                console.log("error ", err, _player);
            }
        });

        // mouse
        this.rats.forEach((_mouse) => {
            _mouse.gameObject.BaseUpdate();

            // 
            if (_mouse.gameObject.moving) {
                if (_mouse.gameObject.sprite.anims && _mouse.gameObject.sprite.anims.currentAnim) {
                    // _mouse.gameObject.sprite.play("run-rats")
                    if (_mouse.gameObject.sprite.anims.currentAnim.key === "idle") {
                        _mouse.gameObject.sprite.play("runStart").once("animationcomplete", () => {
                            _mouse.gameObject.sprite.play("run")
                        })
                    }
                }
            } else if (_mouse.gameObject.gotHit) {
                if (_mouse.gameObject.sprite.anims && _mouse.gameObject.sprite.anims.currentAnim) {
                    if (_mouse.gameObject.sprite.anims.currentAnim.key !== "getHit") {
                        // _mouse.gameObject.sprite.stop();
                        _mouse.gameObject.sprite.play("getHit").once("animationcomplete", () => {
                            _mouse.gameObject.gotHit = false
                            _mouse.gameObject.sprite.play("idle")
                        })
                    }
                }
            } else if (_mouse.gameObject.dead) {
                // console.log("created dead RAT!!");
                if (!_mouse.gameObject.deadAnim) {
                    _mouse.gameObject.deadAnim = true;
                    _mouse.gameObject.sprite.play("die").once("animationcomplete", () => {
                        setTimeout(() => {
                            _mouse.gameObject.playRatGibs();
                        }, 1000);
                    })
                }
                // if (_mouse.gameObject.sprite.anims) {
                //   _mouse.gameObject.sprite.play("dead-rats")
                // }
            } else {
                // since they are not moving.. they will look here and there.
                // _mouse.gameObject.sprite.stop();
                if (_mouse.gameObject.sprite.anims && _mouse.gameObject.sprite.anims.currentAnim) {
                    if (_mouse.gameObject.sprite.anims.currentAnim.key !== "idle") {
                        _mouse.gameObject.sprite.stop();
                        _mouse.gameObject.sprite.play("idle")
                    }
                }
            }
        });
        this.keyControls.keys.keyP.pressed = false;
        this.keyControls.keys.keyK.pressed = false;
        this.keyControls.onKeysChange = false;
    }
}
