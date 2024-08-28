// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IBetSelectedPlayer } from './UserWebsiteStore';

export interface IAttributes {
    // health: number;
    user_wallet_address: string;
    nick_name: string;
    minted_id: number;
    profile_image: string;
    attributes: {
        health: number;
    };
}
export interface IfightersInfo {
    player1: INFTDataOfConnections;
    player2: INFTDataOfConnections;
    fightStarted: boolean;
    preFightStarted: boolean;
    fightStartedAt: number;
}

export interface INFTDataOfConnections {
    walletAddress: string,
    status: number,
    status_timer: number,
    sprite_url: string,
    all_nft_data: any,
    last_position_x: number,
    last_position_y: number,
    orientation: string,
    fighting: boolean,
    minted_id: number,
    nick_name: string,
    defense: number,
    speed: number,
    kickpower: number,
    punchpower: number,
    health: number,
    stamina: number,
    max_stamina: number;
    max_health: number,
    profile_image: string;
}

interface UserActionData {
    friendButtonClickedInInfoMenu: boolean,
    hitFightMachine: boolean,
    selectedFightButton: boolean,
    fightPreStart: boolean,
    fightStart: boolean,
    fightContinue: boolean,
    fightEnd: boolean,
    fightPlayerSide: string,
    touchingOtherPlayer: boolean,
    touchingOtherPlayerInfo: string,
    lastKickedTime: number,
    lastPunchedTime: number,
    fightersInfo: IfightersInfo,
    fightStartTime: number,
    showFightConfirmationBox: boolean,
    showFightConfirmationTime: number,
    showFightConfirmationStartTime: number,

    showGotHitSprite: boolean,
    showGotBackHitSprite: boolean,
    showDownSprite: boolean,
    showStunnedSprite: boolean,

    // chat
    focussedOnChat: boolean,
    showChatWindow: boolean,

    fightMachineButtonPressed: boolean,

    // dead sprite
    showDeadSprite: boolean,

    // switch off mouse
    turnMouseClickOff: boolean,
    gameTurnOffMouse: boolean,

    // give all UI a different mouse control
    mouseClickControlHeader: boolean,
    mouseClickControlATM: boolean,
    mouseClickControlFightMachine: boolean,
    mouseClickControlChat: boolean,
    mouseClickControlProfileWindow: boolean,
    mouseClickControlInventory: boolean,

    // curent player is fighting
    currentPlayerFighting: boolean,
    currentOtherPlayerFighting: string,

    openAtmView: boolean,
    showBrewEjectAnimation: boolean,

    showBrewEjectAnimationFromServer: {
        state: boolean,
        brew_id: string,
    },
    magnet_move_brew: {
        state: boolean,
        x: number,
        y: number,
    },

    brewMachinePunched: boolean,

    openBetWindowView: boolean,
    bettingOnPlayerData: IBetSelectedPlayer,
}

const initialState: UserActionData = {
    selectedFightButton: false,
    friendButtonClickedInInfoMenu: false,
    hitFightMachine: false,
    fightPreStart: false,
    fightStart: false,
    fightContinue: false,
    fightEnd: false,
    fightPlayerSide: "",
    touchingOtherPlayer: false,
    touchingOtherPlayerInfo: "",
    lastKickedTime: 0,
    lastPunchedTime: 0,
    fightersInfo: {
        player1: {
            walletAddress: "",
            status: 1,
            status_timer: 0,
            sprite_url: "",
            all_nft_data: {},
            last_position_x: 0,
            last_position_y: 0,
            orientation: "",
            fighting: false,
            minted_id: 0,
            nick_name: "",
            defense: 0,
            speed: 0,
            kickpower: 0,
            punchpower: 0,
            health: 0,
            stamina: 0,
            max_stamina: 0,
            max_health: 0,
            profile_image: "",
        },
        player2: {
            walletAddress: "",
            status: 1,
            status_timer: 0,
            sprite_url: "",
            all_nft_data: {},
            last_position_x: 0,
            last_position_y: 0,
            orientation: "",
            fighting: false,
            minted_id: 0,
            nick_name: "",
            defense: 0,
            speed: 0,
            kickpower: 0,
            punchpower: 0,
            health: 0,
            stamina: 0,
            max_stamina: 0,
            max_health: 0,
            profile_image: "",
        },
        fightStarted: false,
        preFightStarted: false,
        fightStartedAt: 0,
    },
    fightStartTime: 0,
    showFightConfirmationBox: false,
    showFightConfirmationTime: 0,
    showFightConfirmationStartTime: 0,
    showGotHitSprite: false,
    showGotBackHitSprite: false,
    showDownSprite: false,
    showStunnedSprite: false,


    showBrewEjectAnimationFromServer: {
        state: false,
        brew_id: ""
    },
    magnet_move_brew: {
        state: false,
        x: 0,
        y: 0
    },

    // chat
    focussedOnChat: false,
    showChatWindow: false,

    fightMachineButtonPressed: false,

    showDeadSprite: false,
    turnMouseClickOff: false,
    gameTurnOffMouse: false,

    currentPlayerFighting: false,
    currentOtherPlayerFighting: "",

    openAtmView: false,
    showBrewEjectAnimation: false,
    brewMachinePunched: false,

    openBetWindowView: false,
    bettingOnPlayerData: {
        fight_id: "",
        p1_wallet: "",
        p2_wallet: "",
        p1_nick_name: "",
        p2_nick_name: "",
        p1_profile_image: "",
        p2_profile_image: "",
        p1_total_bet: 0,
        p2_total_bet: 0,
        total_bet: 0,
        selected_player: "",
    },


    mouseClickControlHeader: false,
    mouseClickControlATM: false,
    mouseClickControlFightMachine: false,
    mouseClickControlChat: false,
    mouseClickControlProfileWindow: false,
    mouseClickControlInventory: false
}

export const userActionData = createSlice({
    name: 'userActionData',
    initialState,
    reducers: {
        FriendButtonClickedInInfoMenu: (state: { friendButtonClickedInInfoMenu: boolean; }, action: PayloadAction<boolean>) => {
            state.friendButtonClickedInInfoMenu = action.payload;
        },
        HitFightMachine: (state: { hitFightMachine: boolean; }, action: PayloadAction<boolean>) => {
            state.hitFightMachine = action.payload;
        },

        SelectFightInFightMachineMenu: (state: { selectedFightButton: boolean; }, action: PayloadAction<boolean>) => {
            if (document.querySelector('[id^="joystick-container-"]')){
                document.querySelector('[id^="joystick-container-"]').style.visibility = action.payload ? "hidden" : "visible";
            }
            state.selectedFightButton = action.payload;
        },

        FightStart: (state: { fightStart: boolean; }, action: PayloadAction<boolean>) => {
            state.fightStart = action.payload;
        },
        FightContinue: (state: { fightContinue: boolean; }, action: PayloadAction<boolean>) => {
            state.fightContinue = action.payload;
        },
        FightPreStart: (state: { fightPreStart: boolean; }, action: PayloadAction<boolean>) => {
            state.fightPreStart = action.payload;
        },
        FightEnd: (state: { fightEnd: boolean; }, action: PayloadAction<boolean>) => {
            state.fightEnd = action.payload;
        },
        ChangeFightStartTime: (state: { fightStartTime: number; }, action: PayloadAction<number>) => {
            state.fightStartTime = action.payload;
        },
        FightPlayerSide: (state: { fightPlayerSide: string; }, action: PayloadAction<string>) => {
            state.fightPlayerSide = action.payload;
        },
        ChangeTouchStateWithOtherPlayer: (state: { touchingOtherPlayer: boolean; }, action: PayloadAction<boolean>) => {
            state.touchingOtherPlayer = action.payload;
        },
        ChangeTouchOtherPlayerInfo: (state: { touchingOtherPlayerInfo: string; }, action: PayloadAction<string>) => {
            state.touchingOtherPlayerInfo = action.payload;
        },
        ChangeLastKickedTime: (state: { lastKickedTime: number; }, action: PayloadAction<number>) => {
            state.lastKickedTime = action.payload;
        },
        ChangeLastPunchedTime: (state: { lastPunchedTime: number; }, action: PayloadAction<number>) => {
            state.lastPunchedTime = action.payload;
        },

        // Fight
        SetFightersInfo: (state: { fightersInfo: IfightersInfo; }, action: PayloadAction<IfightersInfo>) => {
            state.fightersInfo = action.payload;
        },



        ClearFighterInfo: (state: { fightersInfo: IfightersInfo; }) => {
            state.fightersInfo = {
                player1: {
                    walletAddress: "",
                    status: 1,
                    status_timer: 0,
                    sprite_url: "",
                    all_nft_data: {},
                    last_position_x: 0,
                    last_position_y: 0,
                    orientation: "",
                    fighting: false,
                    minted_id: 0,
                    nick_name: "",
                    defense: 0,
                    speed: 0,
                    kickpower: 0,
                    punchpower: 0,
                    health: 0,
                    stamina: 0,
                    max_stamina: 0,
                    max_health: 0,
                    profile_image: "",
                },
                player2: {
                    walletAddress: "",
                    status: 1,
                    status_timer: 0,
                    sprite_url: "",
                    all_nft_data: {},
                    last_position_x: 0,
                    last_position_y: 0,
                    orientation: "",
                    fighting: false,
                    minted_id: 0,
                    nick_name: "",
                    defense: 0,
                    speed: 0,
                    kickpower: 0,
                    punchpower: 0,
                    health: 0,
                    stamina: 0,
                    max_stamina: 0,
                    max_health: 0,
                    profile_image: "",
                },
                fightStarted: false,
                preFightStarted: false,
                fightStartedAt: 0,
            }
        },

        // Fight
        // SetFightInfo: (state: { fightersInfo: IfightersInfo; }, action: PayloadAction<IfightersInfo>) => {
        //   state.fightersInfo = action.payload;
        // },

        ShowFightConfirmationBox: (state: { showFightConfirmationBox: boolean; }, action: PayloadAction<boolean>) => {
            state.showFightConfirmationBox = action.payload;
        },

        ShowFightConfirmationTime: (state: { showFightConfirmationTime: number; }, action: PayloadAction<number>) => {
            state.showFightConfirmationTime = action.payload;
        },

        ShowFightConfirmationStartTime: (state: { showFightConfirmationStartTime: number; }, action: PayloadAction<number>) => {
            state.showFightConfirmationStartTime = action.payload;
        },

        ShowGotHitSprite: (state: { showGotHitSprite: boolean; }, action: PayloadAction<boolean>) => {
            state.showGotHitSprite = action.payload;
        },

        ShowGotBacktHitSprite: (state: { showGotBackHitSprite: boolean; }, action: PayloadAction<boolean>) => {
            state.showGotBackHitSprite = action.payload;
        },

        ShowDownSprite: (state: { showDownSprite: boolean; }, action: PayloadAction<boolean>) => {
            state.showDownSprite = action.payload;
        },

        ShowStunnedSprite: (state: { showStunnedSprite: boolean; }, action: PayloadAction<boolean>) => {
            state.showStunnedSprite = action.payload;
        },

        ShowChatWindow: (state: { showChatWindow: boolean; }, action: PayloadAction<boolean>) => {
            if (document.querySelector('[id^="joystick-container-"]')){
                document.querySelector('[id^="joystick-container-"]').style.visibility = action.payload ? "hidden" : "visible";
            }
            state.showChatWindow = action.payload;
        },

        SetFocussedOnChat: (state: { focussedOnChat: boolean; }, action: PayloadAction<boolean>) => {
            state.focussedOnChat = action.payload;
        },

        ShowFightMachineButtonPressed: (state: { fightMachineButtonPressed: boolean; }, action: PayloadAction<boolean>) => {
            state.fightMachineButtonPressed = action.payload;
        },


        ShowDeadSprite: (state: { showDeadSprite: boolean; }, action: PayloadAction<boolean>) => {
            state.showDeadSprite = action.payload;
        },

        TurnMouseClickOff: (state: { turnMouseClickOff: boolean; }, action: PayloadAction<boolean>) => {
            state.turnMouseClickOff = action.payload;
        },

        GameTurnMouseClickOff: (state: { gameTurnOffMouse: boolean; }, action: PayloadAction<boolean>) => {
            state.gameTurnOffMouse = action.payload;
        },

        SetCurrentPlayerFighting: (state: { currentPlayerFighting: boolean; }, action: PayloadAction<boolean>) => {
            state.currentPlayerFighting = action.payload;
        },

        SetCurrentOtherPlayerFighting: (state: { currentOtherPlayerFighting: string; }, action: PayloadAction<string>) => {
            state.currentOtherPlayerFighting = action.payload;
        },

        OpenAtmView: (state: { openAtmView: boolean; }, action: PayloadAction<boolean>) => {
            state.openAtmView = action.payload;
        },

        ShowBrewEjectAnimation: (state: { showBrewEjectAnimation: boolean; }, action: PayloadAction<boolean>) => {
            state.showBrewEjectAnimation = action.payload;
        },

        ShowBrewEjectAnimationFromServer: (state: { showBrewEjectAnimationFromServer: any; }, action: PayloadAction<any>) => {
            state.showBrewEjectAnimationFromServer = action.payload;
        },

        ShowMagnetMoveBrew: (state: { magnet_move_brew: any; }, action: PayloadAction<any>) => {
            state.magnet_move_brew = action.payload;
        },

        ShowBrew: (state: { showBrewEjectAnimation: boolean; }, action: PayloadAction<boolean>) => {
            state.showBrewEjectAnimation = action.payload;
        },

        BrewMachinePunched: (state: { brewMachinePunched: boolean; }, action: PayloadAction<boolean>) => {
            // console.log("overlap brew and kick ---111--", action.payload)
            state.brewMachinePunched = action.payload;
        },

        ChangeBetWindowViewState: (state: { openBetWindowView: boolean; }, action: PayloadAction<boolean>) => {
            state.openBetWindowView = action.payload;
        },

        ChangeBetingOnPlayerData: (state: { bettingOnPlayerData: IBetSelectedPlayer; }, action: PayloadAction<IBetSelectedPlayer>) => {
            state.bettingOnPlayerData = action.payload;
        },




        //   mouseClickControlHeader: false,
        // mouseClickControlATM: false,
        // mouseClickControlFightMachine: false,
        // mouseClickControlChat: false,
        // mouseClickControlProfileWindow: false

        SetMouseClickControlHeader: (state: { mouseClickControlHeader: boolean; }, action: PayloadAction<boolean>) => {
            state.mouseClickControlHeader = action.payload;
        },

        SetMouseClickControlATM: (state: { mouseClickControlATM: boolean; }, action: PayloadAction<boolean>) => {
            state.mouseClickControlATM = action.payload;
        },

        SetMouseClickControlFightMachine: (state: { mouseClickControlFightMachine: boolean; }, action: PayloadAction<boolean>) => {
            state.mouseClickControlFightMachine = action.payload;
        },

        SetMouseClickControlChat: (state: { mouseClickControlChat: boolean; }, action: PayloadAction<boolean>) => {
            state.mouseClickControlChat = action.payload;
        },

        SetMouseClickControlProfileWindow: (state: { mouseClickControlProfileWindow: boolean; }, action: PayloadAction<boolean>) => {
            state.mouseClickControlProfileWindow = action.payload;
        },

        SetMouseClickControlInventory: (state: { mouseClickControlInventory: boolean; }, action: PayloadAction<boolean>) => {
            state.mouseClickControlInventory = action.payload;
        },

    },
})

export const {
    FriendButtonClickedInInfoMenu, HitFightMachine,
    FightStart, FightContinue, FightPlayerSide, FightEnd,
    ChangeTouchStateWithOtherPlayer, ChangeTouchOtherPlayerInfo,
    ChangeLastKickedTime,
    ChangeLastPunchedTime,
    SetFightersInfo,
    ChangeFightStartTime,
    ShowFightConfirmationBox, ShowFightConfirmationTime, ShowFightConfirmationStartTime,
    ShowGotHitSprite,
    FightPreStart, ClearFighterInfo, ShowBrewEjectAnimationFromServer,
    ShowGotBacktHitSprite, ShowDownSprite, ShowStunnedSprite, ShowChatWindow, SetFocussedOnChat,
    ShowFightMachineButtonPressed, ShowDeadSprite, TurnMouseClickOff, GameTurnMouseClickOff, SetCurrentPlayerFighting, SetCurrentOtherPlayerFighting,
    OpenAtmView, ShowBrewEjectAnimation, BrewMachinePunched, ChangeBetWindowViewState, ChangeBetingOnPlayerData, ShowMagnetMoveBrew, SelectFightInFightMachineMenu,

    SetMouseClickControlHeader, SetMouseClickControlATM, SetMouseClickControlFightMachine, SetMouseClickControlChat, SetMouseClickControlProfileWindow, SetMouseClickControlInventory
    // SetFightInfo 
} = userActionData.actions

export default userActionData.reducer
