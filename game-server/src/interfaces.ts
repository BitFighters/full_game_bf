import { RatState } from "./constants/constants";

export interface IQueueInfo {
  user_wallet_address: string;
  minted_id: number;
  nick_name: number;
  current_position: number;
}

export interface INFTDataOfConnections {
  walletAddress: string;
  // status: number,
  status_timer: number;
  sprite_url: string;
  // all_nft_data: any,
  last_position_x: number;
  last_position_y: number;
  moved_last_frame?: boolean;
  orientation: string;
  fighting: boolean;
  minted_id: number;
  nick_name: string;
  defense: number;
  // attributes?: any,
  speed: number;
  walk_speed?: number;
  run_speed?: number;
  kickpower: number;
  punchpower: number;
  health: number;

  brew_started_drinking_time?: number;
  brew_started_drinking?: boolean;
  brew_equipped?: boolean;

  stamina: number;
  stamina_regeneration?: number;
  stamina_ap?: number;
  max_stamina: number;
  max_health: number;
  profile_image: string;
  stunned: boolean;

  movementAbility?: string;

  kickStart?: boolean;
  lastKickTime?: number;
  punchStart?: boolean;
  lastPunchTime?: number;
  loginTime?: number;
  logoutTime?: number;
  loggedInDuration?: number; // in seconds

  got_hit_lift_off_fall?: boolean;
  got_hit_lift_off_fall_lastTime?: number;

  died?: boolean;
  died_lastTime?: number;

  max_upto_regen_health?: number;
  health_regenarate?: number;
  health_ap?: number;
  all_aps?: any;

  user_type?: string;
}

export interface ICompressedNFTDataOfConnections {
  walletAddress: string;
  last_position_x?: number;
  last_position_y?: number;
  // nick_name: string,
  defense: number;
  speed: number;
  kickpower: number;
  punchpower: number;
  health: number;
  stamina: number;
  // max_stamina: number;
  // max_health: number,
  profile_image?: string;
}

export interface IFightUpdateSmallData {
  walletAddress: string;
  // status: number,
  // status_timer: number,
  // sprite_url: string,
  last_position_x: number;
  last_position_y: number;
  orientation: string;
  // fighting: boolean,
  // minted_id: number,
  nick_name: string;
  defense: number;
  speed: number;
  kickpower: number;
  punchpower: number;
  health: number;
  stamina: number;
  max_stamina: number;
  max_health: number;
  profile_image: string;
  stunned: boolean;
}

export interface QueueDB {
  user_wallet_address: string;
  minted_id: number;
  nick_name: string;
  current_position: number;
  profile_image: string;
  assigned_fight_id?: string;

  p1_total_bet?: number;
  p2_total_bet?: number;

  total_bet?: number;
  player_count: number;
}

export interface NewQueueDB {
  user_wallet_address: string;
  minted_id: number;
  nick_name: string;
  profile_image: string;
  betAmount: number;
  ante: number;
  entered_on?: number;
}

export interface IQueueCombined {
  fight_id: string;

  p1_wallet: string;
  p2_wallet: string;

  p1_nick_name: string;
  p2_nick_name: string;

  p1_profile_image: string;
  p2_profile_image: string;

  p1_total_bet: number;
  p2_total_bet: number;

  p1_minted_id: number;
  p2_minted_id: number;

  p1_self_bet: number;
  p2_self_bet: number;

  total_bet: number;
  player_count: number;

  state?: string;
}

export interface IFightEntry {
  fight_id: string;
  player1: string;
  player2: string;
  total_bet: number;
  total_bet_p1: number;
  total_bet_p2: number;
  player_count: number;
  self_bet_p2: number;
  self_bet_p1: number;
}

export interface PlayerOrientation {
  player1Orientation: string;
  player2Orientation: string;
}

export interface IFightersInfo {
  player1: QueueDB;
  player2: QueueDB;
  player1_full_data: any;
  player2_full_data: any;
  player1_confirmation: boolean;
  player2_confirmation: boolean;
  player1_confirmation_sent: boolean;
  player2_conformation_sent: boolean;
  fightStarted: boolean;
  confirmation_started_at: number;
  fight_pre_started: boolean;
  orientation: PlayerOrientation;
}

export interface IFightInfo {
  player1: string;
  player2: string;
  player1_nickname?: string;
  player2_nickname?: string;
  requestSentPlayer1: boolean;
  requestSentPlayer2: boolean;
  requestSentTime: number;
  acceptSentPlayer1: boolean;
  acceptSentPlayer2: boolean;
  preFightStageStarted: boolean;
  preFightAnnouncementStarted: boolean;
  preFightAnnouncementEnded: boolean;
  prefightStageStartedAt: number;
  fightStageStarted: boolean;
  fightStageStartedAt: number;
  fightEndedAt: number;
  fightEnds: boolean;
  postFightStageStarted: boolean;
  postFightStageStartedAt: number;

  fight_id: string;
}

export interface IPosition {
  x: number;
  y: number;
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
  rats_escape_time: Array<number>;
}

export interface IKeyAttributes {
  pressed: boolean;
  time_last_pressed?: number;
  double_pressed?: boolean;
  time_last_lifted?: number;
}

export interface IKeysInfo {
  keyA: IKeyAttributes;
  keyD: IKeyAttributes;
  keyS: IKeyAttributes;
  keyW: IKeyAttributes;
  keyP: IKeyAttributes;
  keyK: IKeyAttributes;
  lastKey: string;
}

export interface AssetsInterface {
  user_wallet_address: string;
  asset_name: string;
  active_assets: number;
  used_assets: number;
}

export interface IGeoLocationInfo {
  country_name: string;
  country_code: string;
  continent_code: string;
  city: string;
}

export interface IFightInfoData {
  fight_id: string;
  player1: string;
  player2: string;
  total_bet: number;
  total_bet_p1: number;
  total_bet_p2: number;
}
