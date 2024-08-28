import { INFTDataOfConnections } from "interfaces";

export const TotalStamina = 100;
export const TotalHealth = 100;
export const DEFAULT_SPRITE_DISPLAY_HEIGHT = 64;
export const DEFAULT_SPRITE_DISPLAY_WIDTH = 64 - 34;
export const DEFAULT_SPRITE_DISPLAY_WIDTH_COLLISION_FIGHT = 60;
export const DEFAULT_SPRITE_DISPLAY_WIDTH_1 = DEFAULT_SPRITE_DISPLAY_WIDTH - 40;

export const RATS_COUNT = 12;
export const MIN_RATS_COUNT = 3;
export const RATS_MOVEMENT_TIME = 1 * 60 * 1000; // 2 min 
export const RATS_TOTAL_HEALTH = 20;
export const MIN_RATS_MOVEMENT = 10;
export const MAX_RATS_MOVEMENT = 20;
export const RATS_SHIFT_MULTIPLIER_AFTER_ATTACK = 2;
export const RATS_COIN_AMOUNT = 1;

export const SERVER_REFRESH_RATE = 20;
export const DIFF_REACH_BETWEEN_KICK_AND_POWER = 0;
export const SPEED_TO_ACTUAL_STAMINA_REDUCTION_MULTIPLIER = 1;
export const FIXED_GET_UP_TIME = 3000;

export const KICK_SPEED = 400;
export const PUNCH_SPEED = 200;

export const PLAYERS_LIMIT_COUNT = 50;

export const ITEM_PICK_UP_DISTANCE = 30;
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

export const HealthAndStaminaMap = {
  1: 0,
  2: 0.05,
  3: 0.1,
  4: 0.15,
  5: 0.2,
}


export const HealthRegenarationMap = {
  1: 0.3,
  2: 0.4,
  3: 0.5,
  4: 0.6,
  5: 0.7
}

export const MaxHealthRegenarationMap = {
  1: 0.3,
  2: 0.35,
  3: 0.40,
  4: 0.45,
  5: 0.55
}

export const StaminaRegenarationMap = {
  1: 4,
  2: 5,
  3: 6,
  4: 7,
  5: 8
}

export const ExhaustedTimeMap = {
  1: 3,
  2: 2.5,
  3: 2,
  4: 1.5,
  5: 1,
}


export const RunSpeedMap = {
  1: 2,
  2: 2.4,
  3: 2.8,
  4: 3.2,
  5: 3.6
}

export const WalkSpeedMap = {
  1: 1,
  2: 1.2,
  3: 1.4,
  4: 1.6,
  5: 1.8
}

export const KickPowerMap = {
  1: 6,
  2: 8,
  3: 10,
  4: 12,
  5: 14
}

export const AutoAttackReductionBonus = {
  1: 0,
  2: 0.1,
  3: 0.2,
  4: 0.3,
  5: 0.4,
}

export const AttackNullifyChance = {
  1: 0.05,
  2: 0.1,
  3: 0.15,
  4: 0.20,
  5: 0.25
}

export const StaminaLossOfDefender = {
  1: 0.05,
  2: 0.05,
  3: 0.1,
  4: 0.1,
  5: 0.15,
}

export function createEmptyPlayer(): INFTDataOfConnections {
  return (
    {
      walletAddress: "",
      // status: 1,
      status_timer: 0,
      sprite_url: "",
      // all_nft_data: {},
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
      stunned: false,
    }
  )
}